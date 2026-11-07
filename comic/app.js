(function () {
  const deck = document.getElementById("deck");
  const slides = Array.from(document.querySelectorAll(".slide"));
  const audio = document.getElementById("narration");
  const fill = document.getElementById("fill");
  const progress = document.getElementById("progress");
  const ticks = document.getElementById("ticks");
  const count = document.getElementById("count");
  const playBtn = document.getElementById("play");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const fullBtn = document.getElementById("full");

  // Narration cue points (seconds), extracted from the voice-over's word
  // timestamps. Each value is when a scene's slide should switch in, set ~0.5s
  // before that line is spoken so the dissolve leads the narration.
  const cues = slides.map(slide => Number(slide.dataset.cue) || 0);
  const FALLBACK_TOTAL = 65.3;
  let total = FALLBACK_TOTAL;

  // Per-scene drift length, so the pan finishes as the scene ends.
  const sceneDurations = cues.map((cue, i) => {
    const end = i < cues.length - 1 ? cues[i + 1] : total;
    return Math.max(1.2, end - cue);
  });
  slides.forEach((slide, i) => slide.style.setProperty("--dur", `${(sceneDurations[i] * 1000).toFixed(0)}ms`));

  cues.slice(1).forEach(cue => {
    const tick = document.createElement("span");
    tick.className = "tick";
    tick.style.left = `${(cue / total) * 100}%`;
    ticks.appendChild(tick);
  });

  let index = 0;
  let playing = true;
  let ended = false;
  let mode = "virtual";       // "audio" once narration actually drives the clock
  let audioFailed = false;    // narration could not be used at all
  let virtualElapsed = 0;
  let lastTs = 0;
  let raf = 0;
  let leavingTimer = 0;
  let idleTimer = 0;

  function masterTime() {
    return mode === "audio" ? audio.currentTime : virtualElapsed;
  }

  function sceneAt(t) {
    let i = 0;
    for (let k = 0; k < cues.length; k++) {
      if (t >= cues[k] - 1e-4) i = k;
    }
    return i;
  }

  function updateLabel() {
    playBtn.textContent = ended ? "重播" : playing ? "暂停" : "播放";
    playBtn.setAttribute("aria-label", ended ? "重播" : playing ? "暂停" : "播放");
    deck.classList.toggle("is-paused", !playing);
    deck.classList.toggle("is-ended", ended);
  }

  function updateCount() {
    count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    slides.forEach((slide, i) => slide.setAttribute("aria-hidden", i === index ? "false" : "true"));
  }

  function updateProgress() {
    const ratio = Math.min(1, Math.max(0, masterTime() / total));
    fill.style.width = `${(ratio * 100).toFixed(2)}%`;
    progress.setAttribute("aria-valuenow", String(Math.round(ratio * 100)));
  }

  function activate(nextIndex) {
    const next = slides[(nextIndex + slides.length) % slides.length];
    const previous = slides.find(slide => slide.classList.contains("is-active"));

    const nextImage = next.querySelector("img");
    nextImage.style.transform = "";
    nextImage.style.animation = "";

    if (previous && previous !== next) {
      const previousImage = previous.querySelector("img");
      previousImage.style.transform = getComputedStyle(previousImage).transform;
      previousImage.style.animation = "none";
    }

    clearTimeout(leavingTimer);
    slides.forEach(slide => {
      if (slide !== next) slide.classList.remove("is-active");
      if (slide !== next) slide.classList.remove("is-leaving");
    });
    next.classList.add("is-active");

    if (previous && previous !== next) {
      previous.classList.add("is-leaving");
      leavingTimer = window.setTimeout(() => previous.classList.remove("is-leaving"), 1200);
    }

    index = slides.indexOf(next);
    updateCount();
    updateProgress();
  }

  function stopTimer() {
    cancelAnimationFrame(raf);
    raf = 0;
  }

  function startTimer() {
    stopTimer();
    if (!playing || ended) return;
    lastTs = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function frame(now) {
    if (!playing || ended) return;

    if (mode === "audio") {
      if (audio.ended) { finish(); return; }
      const target = sceneAt(audio.currentTime);
      if (target !== index) activate(target);
      updateProgress();
      raf = requestAnimationFrame(frame);
      return;
    }

    virtualElapsed += Math.min(250, now - lastTs) / 1000;
    lastTs = now;

    if (virtualElapsed >= total) { finish(); return; }
    const target = sceneAt(virtualElapsed);
    if (target !== index) activate(target);
    updateProgress();
    raf = requestAnimationFrame(frame);
  }

  function finish() {
    playing = false;
    ended = true;
    stopTimer();
    if (mode === "audio") audio.pause();
    updateLabel();
    updateProgress();
    wake();
  }

  // Promote the silent virtual clock to the real narration. Called on the first
  // user gesture, since browsers block autoplay-with-sound.
  function ensureAudio() {
    if (mode === "audio" || audioFailed) return;
    const t = ended ? 0 : Math.min(virtualElapsed, Math.max(0, total - 0.15));
    try { audio.currentTime = t; } catch (_) {}
    const p = audio.play();
    if (p && typeof p.then === "function") {
      p.then(() => {
        mode = "audio";
        ended = false;
        playing = true;
        activate(sceneAt(audio.currentTime));
        updateLabel();
        startTimer();
      }).catch(() => { /* stay silent-virtual */ });
    }
  }

  function play() {
    if (ended) { restart(); return; }
    ensureAudio();
    if (mode === "audio") {
      if (audio.paused) { audio.play(); playing = true; }
      else { audio.pause(); playing = false; }
    } else {
      playing = !playing;
    }
    updateLabel();
    if (playing) startTimer(); else stopTimer();
    wake();
  }

  function seekTo(target) {
    const i = (target + slides.length) % slides.length;
    ended = false;
    ensureAudio();
    if (mode === "audio") {
      audio.currentTime = cues[i];
      activate(i);
      if (playing) audio.play();
    } else {
      virtualElapsed = cues[i];
      activate(i);
    }
    updateLabel();
    if (playing) startTimer(); else stopTimer();
    wake();
  }

  function go(direction) { seekTo(index + direction); }
  function jumpTo(target) { seekTo(target); }

  function restart() {
    ended = false;
    playing = true;
    ensureAudio();
    if (mode === "audio") {
      audio.currentTime = 0;
      const p = audio.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } else {
      virtualElapsed = 0;
    }
    activate(0);
    updateLabel();
    startTimer();
    wake();
  }

  function wake() {
    deck.classList.remove("is-idle");
    clearTimeout(idleTimer);
    if (playing && !ended) {
      idleTimer = window.setTimeout(() => deck.classList.add("is-idle"), 2600);
    }
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen?.();
    }
  }

  playBtn.addEventListener("click", play);
  prevBtn.addEventListener("click", () => go(-1));
  nextBtn.addEventListener("click", () => go(1));
  fullBtn.addEventListener("click", toggleFullscreen);

  // A press anywhere on the deck is the gesture that unlocks narration.
  deck.addEventListener("pointerdown", () => { if (mode === "virtual" && !audioFailed) ensureAudio(); }, true);

  audio.addEventListener("ended", () => { if (mode === "audio") finish(); });
  audio.addEventListener("error", () => { audioFailed = true; });

  document.addEventListener("fullscreenchange", () => {
    fullBtn.textContent = document.fullscreenElement ? "退出" : "全屏";
    fullBtn.setAttribute("aria-label", document.fullscreenElement ? "退出全屏" : "全屏");
  });

  document.addEventListener("keydown", event => {
    const onControl = event.target.closest("button, a");
    if (event.code === "Space") {
      if (onControl) return;
      event.preventDefault();
      play();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      jumpTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      jumpTo(slides.length - 1);
    } else if (event.key.toLowerCase() === "f") {
      toggleFullscreen();
    }
  });

  document.addEventListener("pointermove", wake, { passive: true });
  document.addEventListener("pointerdown", wake, { passive: true });
  document.addEventListener("focusin", wake);

  let swipeX = null;
  let swipeY = null;

  deck.addEventListener("pointerdown", event => {
    if (event.target.closest("button, a")) return;
    swipeX = event.clientX;
    swipeY = event.clientY;
  });

  deck.addEventListener("pointerup", event => {
    if (swipeX === null) return;
    const dx = event.clientX - swipeX;
    const dy = event.clientY - swipeY;
    swipeX = null;
    swipeY = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
  });

  function boot() {
    document.body.classList.add("is-ready");
    if (!Number.isNaN(audio.duration) && audio.duration > 0) total = audio.duration;
    activate(0);
    updateLabel();
    updateProgress();

    // Attempt narration autoplay; fall back to a silent virtual clock in the
    // same rhythm until the first gesture unlocks sound.
    const p = audio.play();
    if (p && typeof p.then === "function") {
      p.then(() => {
        mode = "audio";
        startTimer();
        wake();
      }).catch(() => {
        mode = "virtual";
        startTimer();
        wake();
      });
    } else {
      mode = "virtual";
      startTimer();
      wake();
    }
  }

  const firstImage = slides[0].querySelector("img");
  if (firstImage.complete && firstImage.naturalWidth) {
    boot();
  } else {
    firstImage.addEventListener("load", boot, { once: true });
    firstImage.addEventListener("error", boot, { once: true });
  }
})();
