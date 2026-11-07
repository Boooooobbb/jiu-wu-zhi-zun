(function () {
  const deck = document.getElementById("deck");
  const slides = Array.from(document.querySelectorAll(".slide"));
  const fill = document.getElementById("fill");
  const progress = document.getElementById("progress");
  const count = document.getElementById("count");
  const playBtn = document.getElementById("play");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const fullBtn = document.getElementById("full");

  const mobilePad = window.matchMedia("(max-width: 760px)").matches ? 1500 : 0;
  const durations = slides.map(slide => Number(slide.dataset.duration) + mobilePad);
  const total = durations.reduce((sum, value) => sum + value, 0);

  slides.forEach((slide, i) => slide.style.setProperty("--dur", `${durations[i]}ms`));

  let index = 0;
  let playing = true;
  let ended = false;
  let elapsed = 0;
  let last = 0;
  let raf = 0;
  let leavingTimer = 0;
  let idleTimer = 0;

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

  function progressValue() {
    const before = durations.slice(0, index).reduce((sum, value) => sum + value, 0);
    const current = ended ? durations[index] : elapsed;
    return Math.min(total, before + current) / total;
  }

  function updateProgress() {
    const ratio = progressValue();
    fill.style.width = `${(ratio * 100).toFixed(2)}%`;
    progress.setAttribute("aria-valuenow", String(Math.round(ratio * 100)));
  }

  function activate(nextIndex) {
    const next = slides[(nextIndex + slides.length) % slides.length];
    const previous = slides.find(slide => slide.classList.contains("is-active"));

    clearTimeout(leavingTimer);
    slides.forEach(slide => {
      if (slide !== next) slide.classList.remove("is-active");
      if (slide !== next) slide.classList.remove("is-leaving");
    });
    next.classList.add("is-active");

    if (previous && previous !== next) {
      previous.classList.add("is-leaving");
      leavingTimer = window.setTimeout(() => previous.classList.remove("is-leaving"), 1150);
    }

    index = slides.indexOf(next);
    elapsed = 0;
    last = performance.now();
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
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }

  function tick(now) {
    if (!playing || ended) return;
    elapsed += Math.min(250, now - last);
    last = now;

    if (elapsed >= durations[index]) {
      if (index === slides.length - 1) {
        finish();
        return;
      }
      activate(index + 1);
      raf = requestAnimationFrame(tick);
      return;
    }

    updateProgress();
    raf = requestAnimationFrame(tick);
  }

  function finish() {
    playing = false;
    ended = true;
    elapsed = durations[index];
    stopTimer();
    updateLabel();
    updateProgress();
    wake();
  }

  function play() {
    if (ended) {
      ended = false;
      playing = true;
      activate(0);
      updateLabel();
      startTimer();
      wake();
      return;
    }
    if (playing) {
      playing = false;
      stopTimer();
      updateLabel();
      wake();
      return;
    }
    playing = true;
    updateLabel();
    startTimer();
    wake();
  }

  function go(direction) {
    if (ended) {
      ended = false;
      playing = false;
      updateLabel();
    }
    activate(index + direction);
    if (playing) startTimer();
    else stopTimer();
    wake();
  }

  function jumpTo(target) {
    if (ended) {
      ended = false;
      playing = false;
      updateLabel();
    }
    activate(target);
    if (playing) startTimer();
    else stopTimer();
    wake();
  }

  function restart() {
    ended = false;
    playing = true;
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

  playBtn.addEventListener("click", () => {
    if (ended) restart();
    else play();
  });
  prevBtn.addEventListener("click", () => go(-1));
  nextBtn.addEventListener("click", () => go(1));
  fullBtn.addEventListener("click", toggleFullscreen);

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
    activate(0);
    updateLabel();
    updateProgress();
    if (playing) startTimer();
    wake();
  }

  const firstImage = slides[0].querySelector("img");
  if (firstImage.complete && firstImage.naturalWidth) {
    boot();
  } else {
    firstImage.addEventListener("load", boot, { once: true });
    firstImage.addEventListener("error", boot, { once: true });
  }
})();
