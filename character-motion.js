(() => {
  if (!('IntersectionObserver' in window)) return;

  const app = document.querySelector('#app');
  const viewport = document.querySelector('#map-viewport');
  const owlScene = document.querySelector('#wenyu-scene');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const columns = 6;
  const rows = 4;
  const frameMs = 1000 / 12;
  const staggerMs = 350;
  const minimumVisible = .45;
  const jobs = new Map();
  const characters = new Map([...viewport.querySelectorAll('[data-motion]')].map(button => [
    button, { button, id: button.dataset.motion, visible: false, seen: false, replay: false, failed: false }
  ]));
  let nextStart = 0;
  let owlReady = false;
  let owlTimer;
  let inCamp = false;

  function canAnimate() {
    return inCamp && !document.hidden && !reducedMotion.matches && !document.querySelector('dialog[open]');
  }

  function isAvailable(character) {
    return character.visible && (character.id !== 'wenyu' || owlReady);
  }

  function stop(character) {
    const job = jobs.get(character);
    if (!job) return;
    jobs.delete(character);
    clearTimeout(job.timer);
    cancelAnimationFrame(job.raf);
    character.button.classList.remove('motion-playing');
    job.canvas?.remove();
  }

  function start(character, job, sheet, width, height) {
    if (jobs.get(character) !== job) return;
    if (!canAnimate() || !isAvailable(character)) {
      stop(character);
      pump();
      return;
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      character.failed = true;
      stop(character);
      pump();
      return;
    }
    canvas.width = width;
    canvas.height = height;
    canvas.className = 'character-motion-frame';
    canvas.setAttribute('aria-hidden', 'true');
    job.canvas = canvas;
    let startTime;
    let previousFrame = -1;

    function draw(now) {
      if (!canAnimate() || !isAvailable(character)) {
        stop(character);
        pump();
        return;
      }
      startTime ??= now;
      const frame = Math.floor((now - startTime) / frameMs);
      if (frame >= columns * rows) {
        stop(character);
        pump();
        return;
      }
      if (frame !== previousFrame) {
        context.clearRect(0, 0, width, height);
        context.drawImage(sheet, (frame % columns) * width, Math.floor(frame / columns) * height,
          width, height, 0, 0, width, height);
        previousFrame = frame;
      }
      job.raf = requestAnimationFrame(draw);
    }

    character.seen = true;
    character.replay = false;
    character.button.append(canvas);
    draw(performance.now());
    character.button.classList.add('motion-playing');
  }

  async function load(character) {
    const job = {};
    jobs.set(character, job);
    const sheet = new Image();
    sheet.fetchPriority = 'low';
    sheet.src = `assets/motion-${character.id}.webp`;
    try {
      await sheet.decode();
      if (jobs.get(character) !== job) return;
      const width = sheet.naturalWidth / columns;
      const height = sheet.naturalHeight / rows;
      if (!Number.isInteger(width) || !Number.isInteger(height) || !width || !height) {
        throw new Error('Invalid character frame sheet');
      }
      const now = performance.now();
      const startAt = Math.max(now, nextStart);
      nextStart = startAt + staggerMs;
      job.timer = setTimeout(() => start(character, job, sheet, width, height), startAt - now);
    } catch {
      if (jobs.get(character) !== job) return;
      character.failed = true;
      stop(character);
      pump();
    }
  }

  function pump() {
    if (!canAnimate()) return;
    for (const character of characters.values()) {
      if (jobs.size >= 2) break;
      if (character.failed || jobs.has(character) || !isAvailable(character)) continue;
      if (!character.seen || character.replay) load(character);
    }
  }

  function sync() {
    const nextInCamp = app.dataset.view === 'camp';
    if (inCamp && !nextInCamp) {
      for (const character of characters.values()) {
        character.seen = false;
        character.replay = false;
      }
    }
    inCamp = nextInCamp;
    for (const character of jobs.keys()) {
      if (!canAnimate() || !isAvailable(character)) stop(character);
    }
    if (!canAnimate()) nextStart = 0;
    pump();
  }

  const visibility = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const character = characters.get(entry.target);
      character.visible = entry.isIntersecting && entry.intersectionRatio >= minimumVisible;
      if (!character.visible) character.replay = false;
    }
    sync();
  }, { root: viewport, threshold: minimumVisible });

  for (const character of characters.values()) {
    const { button } = character;
    visibility.observe(button);
    const replay = () => {
      if (!canAnimate() || !isAvailable(character) || jobs.has(character)) return;
      character.replay = true;
      pump();
    };
    button.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'touch') replay();
    });
    button.addEventListener('focus', () => {
      if (button.matches(':focus-visible')) replay();
    });
  }

  new MutationObserver(() => {
    clearTimeout(owlTimer);
    owlReady = false;
    const owl = characters.get(document.querySelector('#wenyu-owl'));
    owl.seen = false;
    owl.replay = false;
    if (owlScene.classList.contains('is-awake')) {
      // Let the existing 580 ms rise finish before starting the head movement.
      owlTimer = setTimeout(() => {
        owlReady = true;
        sync();
      }, 600);
    }
    sync();
  }).observe(owlScene, { attributeFilter: ['class'] });

  const changes = new MutationObserver(sync);
  changes.observe(app, { attributeFilter: ['data-view'] });
  for (const dialog of document.querySelectorAll('dialog')) {
    changes.observe(dialog, { attributeFilter: ['open'] });
  }
  document.addEventListener('visibilitychange', sync);
  reducedMotion.addEventListener('change', sync);
  sync();
})();
