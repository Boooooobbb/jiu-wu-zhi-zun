(() => {
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  function ease(time, start, end) {
    const x = clamp((time - start) / (end - start), 0, 1);
    return x * x * (3 - 2 * x);
  }
  const gesture = (time, start, peak, hold, end) => ease(time, start, peak) - ease(time, hold, end);
  const move = (x, y) => `translate(${x} ${y})`;
  const rotate = (angle, x, y) => `rotate(${angle} ${x} ${y})`;
  const outline = 'M0 0 H1000 V1000 H0 Z';

  function lids(eyes, colors, hideInactive = false) {
    const paths = eyes.map((eye, i) => `
      <clipPath id="eye-clip-${i}"><path d="${eye.outline}"/></clipPath>`).join('');
    const tones = eyes.map((eye, i) => eye.colors ? `<linearGradient id="lid-tone-${i}" x2="0" y2="1">
      <stop stop-color="${eye.colors[0]}"/>${eye.hold ? `<stop offset="${eye.hold}" stop-color="${eye.colors[0]}"/>` : ''}<stop offset="1" stop-color="${eye.colors[1]}"/>
      </linearGradient>` : '').join('');
    const state = (id, shape) => `<g id="${id}" opacity="0"${hideInactive ? ' display="none"' : ''} stroke-linecap="round">${eyes.map((eye, i) => {
      const closed = shape === 'closed';
      if (hideInactive) {
        const fill = `url(#${eye.colors ? `lid-tone-${i}` : 'lid-tone'})`;
        const skin = closed ? `<path d="${eye.outline}" fill="${fill}"/>`
          : `<g clip-path="url(#eye-clip-${i})"><path d="${eye.halfFill}" fill="${fill}"/></g>`;
        return `<g filter="url(#lid-feather)">${skin}</g>
          <g clip-path="url(#eye-clip-${i})"><path d="${closed ? eye.closedLine : eye.halfLine}" fill="none" stroke="${colors[2]}" stroke-width="${eye.strokeWidth ?? 5.5}"/></g>`;
      }
      return `<g clip-path="url(#eye-clip-${i})">
        <path d="${closed ? eye.outline : eye.halfFill}" fill="url(#${eye.colors ? `lid-tone-${i}` : 'lid-tone'})"/>
        <path d="${closed ? eye.closedLine : eye.halfLine}" fill="none" stroke="${colors[2]}" stroke-width="${eye.strokeWidth ?? (closed ? 7.5 : 6)}"/>
      </g>`;
    }).join('')}</g>`;
    return `<defs>${paths}${tones}${hideInactive ? '<filter id="lid-feather" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="4.5"/></filter>' : ''}<linearGradient id="lid-tone" x2="0" y2="1">
      <stop stop-color="${colors[0]}"/><stop offset="1" stop-color="${colors[1]}"/>
      </linearGradient></defs>${state('half-lids', 'half')}${state('closed-lids', 'closed')}`;
  }

  function blink(time, parts, start, timing) {
    const local = time - start;
    const closed = local >= timing[0] && local < timing[1];
    const half = local >= 0 && local < timing[2] && !closed;
    parts['half-lids'].setAttribute('opacity', Number(half));
    parts['closed-lids'].setAttribute('opacity', Number(closed));
    if (parts['half-lids'].hasAttribute('display')) {
      parts['half-lids'].setAttribute('display', half ? 'inline' : 'none');
      parts['closed-lids'].setAttribute('display', closed ? 'inline' : 'none');
    }
  }

  const rigs = {
    stella: {
      parts: [{
        id: 'head',
        cut: 'M137 25 H844 V421 Q778 464 704 470 Q607 486 510 478 Q377 484 281 460 Q181 444 137 403Z',
        clip: 'M137 25 H844 V439 Q778 478 704 489 Q607 501 510 495 Q377 502 281 477 Q181 462 137 421Z'
      }],
      partExtras: {
        head: lids([{
          outline: 'M319 308 C320 279 339 259 365 257 C394 254 423 269 433 294 C444 321 431 343 411 353 C381 363 348 349 330 335 Q320 327 319 308Z',
          halfFill: 'M314 248 H444 V316 Q384 290 314 313Z',
          halfLine: 'M314 313 Q384 290 444 316',
          closedLine: 'M328 313 Q376 351 427 312'
        }, {
          outline: 'M556 312 C555 286 573 262 602 257 C629 252 656 264 671 286 C688 309 683 329 664 341 C646 354 619 360 595 352 Q562 344 556 312Z',
          halfFill: 'M550 248 H689 V309 Q628 292 550 319Z',
          halfLine: 'M550 319 Q628 292 689 309',
          closedLine: 'M564 317 Q617 351 674 307'
        }], ['#ebd5b9', '#c69b75', '#5b382a'])
      },
      draw(time, parts) {
        const nod = gesture(time, 390, 1090, 1320, 2020);
        parts.head.setAttribute('transform', move(0, 11 * nod));
        blink(time, parts, 1030, [70, 165, 235]);
      }
    },
    wendy: {
      parts: [{
        id: 'left-ear', under: true,
        cut: 'M210 75 H488 V230 Q476 253 449 254 Q400 241 357 257 L316 273 L211 250Z',
        clip: 'M197 60 H506 V247 Q477 272 450 271 Q399 259 357 274 L316 291 L197 268Z'
      }, {
        id: 'right-ear', under: true,
        cut: 'M533 125 H826 V330 L707 366 Q670 329 619 304 Q573 281 534 270Z',
        clip: 'M520 113 H845 V345 L703 387 Q662 351 608 323 Q568 298 521 286Z'
      }],
      extras: lids([{
        outline: 'M334 385 Q341 379 349 390 Q351 378 360 369 Q367 365 373 381 Q386 389 396 381 C422 371 455 376 477 392 C496 406 500 433 488 454 C473 477 443 482 413 475 C385 474 359 464 346 445 Q336 431 344 417 Q330 414 329 402 Q327 393 334 385Z',
        halfFill: 'M323 359 H506 V433 Q423 410 323 432Z',
        halfLine: 'M349 432 Q419 409 487 431',
        closedLine: 'M349 431 Q413 453 483 433',
        strokeWidth: 5.5
      }, {
        outline: 'M545 455 C553 430 579 418 607 420 C633 422 646 438 655 439 Q670 445 679 437 Q686 435 688 443 Q684 454 673 458 Q680 460 685 455 Q693 454 692 463 Q687 480 664 480 C656 499 643 508 623 510 C593 516 563 505 550 489 Q540 476 545 455Z',
        halfFill: 'M534 408 H702 V475 Q619 451 534 476Z',
        halfLine: 'M553 476 Q619 450 677 473',
        closedLine: 'M552 473 Q608 494 668 474',
        colors: ['#f5cdb6', '#f2c2ac'], strokeWidth: 5.5
      }], ['#fad7c0', '#fbdac5', '#69432f'], true),
      draw(time, parts) {
        const left = gesture(time, 360, 705, 820, 1560) - .25 * gesture(time, 1440, 1660, 1670, 1950);
        const right = gesture(time, 620, 960, 1070, 1720) - .22 * gesture(time, 1630, 1850, 1860, 2120);
        parts['left-ear'].setAttribute('transform', rotate(-9.5 * left, 384, 285));
        parts['right-ear'].setAttribute('transform', rotate(8.5 * right, 650, 333));
        blink(time, parts, 1080, [55, 140, 205]);
      }
    },
    arnold: {
      parts: [{
        id: 'free-hand', under: true,
        cut: 'M0 423 H253 Q245 464 256 500 Q278 560 272 622 L251 656 H0Z',
        clip: 'M0 412 H275 Q270 464 280 506 Q301 563 297 633 L268 664 H0Z'
      }, {
        id: 'device',
        cut: 'M756 207 H970 V620 H749 Q722 594 713 553 L725 495Z',
        clip: 'M745 201 H983 V628 H725 Q696 598 688 550 L707 492Z'
      }],
      extras: `<defs><radialGradient id="crystal-glow"><stop stop-color="#7bf7ff" stop-opacity=".62"/><stop offset="1" stop-color="#47dde0" stop-opacity="0"/></radialGradient></defs>
        <ellipse id="glow" cx="835" cy="329" rx="142" ry="150" fill="url(#crystal-glow)" opacity="0"/>`,
      draw(time, parts) {
        const offer = gesture(time, 225, 775, 1330, 2380);
        const lift = gesture(time, 390, 1060, 1640, 2510);
        parts['free-hand'].setAttribute('transform', rotate(11.5 * offer, 273, 524));
        parts.device.setAttribute('transform', rotate(-11.5 * lift, 708, 561));
        parts.glow.setAttribute('transform', rotate(-11.5 * lift, 708, 561));
        parts.glow.setAttribute('opacity', .55 * gesture(time, 550, 1160, 1550, 2070));
      }
    },
    ryne: {
      parts: [{
        id: 'tail', under: true,
        cut: 'M0 470 H212 Q233 483 228 553 L215 626 L224 703 Q249 739 301 744 L347 816 L325 884 H0Z',
        clip: 'M0 455 H236 Q252 482 247 552 L238 626 L244 693 Q274 737 323 731 L376 823 L342 891 H0Z'
      }],
      draw(time, parts) {
        const swish = gesture(time, 280, 740, 1470, 2240) * Math.sin((time - 335) / 248);
        const glance = gesture(time, 570, 1100, 1480, 2240);
        parts.tail.setAttribute('transform', rotate(15 * swish, 306, 741));
        parts.whole.setAttribute('transform', rotate(-3.7 * glance, 570, 893));
      }
    },
    changyo: {
      parts: [{
        id: 'ear', under: true,
        cut: 'M588 38 H900 V236 L756 245 Q706 211 667 180 L604 158 L568 121Z',
        clip: 'M565 30 H925 V255 L751 269 Q694 230 650 194 L583 173 L552 124Z'
      }, {
        id: 'pointing-paw',
        cut: 'M492 604 Q522 578 563 583 Q611 585 645 601 Q660 611 649 625 Q633 634 606 628 L594 626 Q601 646 584 663 Q564 680 541 675 Q518 680 491 666Z',
        clip: 'M478 595 Q521 574 563 579 Q613 582 648 599 Q664 612 652 627 Q634 637 606 631 L596 629 Q602 649 587 667 Q564 683 541 678 Q514 682 478 668Z'
      }],
      extras: `<defs><radialGradient id="dela-glow"><stop stop-color="#76fff6" stop-opacity=".8"/><stop offset="1" stop-color="#36eced" stop-opacity="0"/></radialGradient></defs>
        <g id="glow" opacity="0">
          <ellipse cx="742" cy="602" rx="103" ry="116" fill="url(#dela-glow)"/>
          <circle cx="751" cy="576" r="11" fill="#bafff6"/>
          <circle cx="726" cy="619" r="7" fill="#c9fff9"/>
        </g>
        <circle id="tap-light" cx="676" cy="619" r="15" fill="none" stroke="#b4fff2" stroke-width="3" opacity="0"/>
        ${lids([{
          outline: 'M317 312 C314 285 333 263 361 255 C392 245 428 257 452 279 C478 300 482 328 466 349 C451 370 420 375 392 368 C361 368 332 354 321 335Z',
          halfFill: 'M308 240 H490 V316 Q407 290 308 318Z',
          halfLine: 'M329 316 Q400 292 464 319',
          closedLine: 'M328 318 Q390 343 464 320',
          colors: ['#c8793d', '#fbeede'], hold: .65, strokeWidth: 5.5
        }, {
          outline: 'M584 291 C581 263 594 238 617 226 C644 211 672 225 690 248 C708 272 709 301 695 323 C682 345 659 353 635 347 C608 342 587 321 584 291Z',
          halfFill: 'M575 210 H718 V285 Q647 260 575 292Z',
          halfLine: 'M594 292 Q649 261 695 286',
          closedLine: 'M594 289 Q646 312 698 289',
          colors: ['#d58543', '#f9e7d6'], hold: .65, strokeWidth: 5.5
        }], ['#c8793d', '#fbeede', '#684021'], true)}`,
      draw(time, parts) {
        const twitch = gesture(time, 300, 530, 565, 1070) * Math.cos((time - 530) / 104);
        parts.ear.setAttribute('transform', rotate(15 * twitch, 652, 155));
        const tap = gesture(time, 820, 1190, 1230, 1560);
        parts['pointing-paw'].setAttribute('transform', `${move(9 * tap, 0)} ${rotate(4.8 * tap, 493, 618)}`);
        const signal = gesture(time, 1140, 1410, 1720, 2290);
        parts.glow.setAttribute('opacity', .65 * signal);
        parts['tap-light'].setAttribute('opacity', .8 * gesture(time, 1140, 1230, 1250, 1530));
        parts['tap-light'].setAttribute('r', 14 + 15 * ease(time, 1140, 1530));
        blink(time, parts, 1510, [55, 145, 210]);
      }
    },
    jiutian: {
      parts: [{
        id: 'quill',
        cut: 'M52 365 Q144 364 206 410 Q248 451 298 510 L325 535 Q280 548 247 537 Q180 520 130 490 L52 424Z',
        clip: 'M49 357 Q148 356 215 404 Q253 444 309 505 L352 555 Q298 574 244 553 Q171 535 120 492 L49 430Z'
      }],
      extras: lids([{
        outline: 'M362 350 C366 318 391 294 424 293 C470 289 509 316 521 349 C533 381 511 415 479 423 C435 435 379 411 366 382 Q359 368 362 350Z',
        halfFill: 'M351 283 H535 V371 Q451 337 350 365Z',
        halfLine: 'M350 365 Q451 337 535 371',
        closedLine: 'M370 364 Q433 421 513 363'
      }, {
        outline: 'M608 408 C610 375 636 345 664 338 C701 327 732 344 746 369 Q765 401 744 430 C723 454 682 463 654 453 C630 444 608 429 608 408Z',
        halfFill: 'M599 328 H764 V406 Q687 380 599 418Z',
        halfLine: 'M599 418 Q687 380 764 406',
        closedLine: 'M616 413 Q682 460 750 398'
      }], ['#f6d2af', '#d9a275', '#59392e']),
      draw(time, parts) {
        const listening = gesture(time, 240, 890, 1510, 2360);
        const write = gesture(time, 800, 1350, 1490, 2250);
        parts.whole.setAttribute('transform', rotate(4.8 * listening, 515, 862));
        parts.quill.setAttribute('transform', rotate(10 * write, 325, 530));
        blink(time, parts, 1270, [55, 155, 220]);
      }
    },
    qiufan: {
      parts: [{
        id: 'boot',
        cut: 'M551 723 Q591 701 661 724 L831 754 L855 915 H562 L550 847Z',
        clip: 'M523 705 Q574 680 662 703 L841 749 L867 925 H549 L528 836Z'
      }, {
        id: 'leaf', under: true,
        cut: 'M177 44 H431 L408 143 Q376 182 348 196 L236 211 L174 171Z',
        clip: 'M165 38 H445 L422 156 Q391 199 351 211 L235 224 L162 181Z'
      }],
      extras: lids([{
        outline: 'M423 350 C424 326 445 307 473 301 C505 290 537 302 558 322 C578 340 582 362 568 381 C554 401 524 402 497 397 C466 400 438 386 427 369Z',
        halfFill: 'M413 287 H589 V352 Q507 329 413 356Z',
        halfLine: 'M433 355 Q505 329 565 353',
        closedLine: 'M432 355 Q498 377 570 356', strokeWidth: 5.5
      }, {
        outline: 'M675 373 C675 350 691 330 715 325 C740 316 763 330 776 349 C790 371 791 396 775 413 C761 430 737 427 715 420 C693 416 674 397 675 373Z',
        halfFill: 'M664 312 H798 V377 Q730 354 664 381Z',
        halfLine: 'M685 380 Q733 353 777 379',
        closedLine: 'M686 380 Q733 400 780 380',
        colors: ['#f9d9a0', '#fbe6b6'], strokeWidth: 5.5
      }], ['#f9dda5', '#fce7b7', '#684022'], true),
      draw(time, parts) {
        const step = gesture(time, 290, 940, 1060, 1820);
        const leaf = gesture(time, 390, 690, 1360, 2200) * Math.sin((time - 550) / 124);
        parts.boot.setAttribute('transform', rotate(-16 * step, 613, 741));
        parts.leaf.setAttribute('transform', rotate(12 * leaf, 343, 179));
        parts.whole.setAttribute('transform', rotate(-2.8 * step, 355, 895));
        blink(time, parts, 1120, [55, 145, 210]);
      }
    },
    joan: {
      parts: [{
        id: 'shoe',
        cut: 'M418 748 Q445 716 491 710 Q544 706 560 730 Q576 761 582 797 L708 818 V980 H443 L446 853 Q433 819 426 792 Q419 767 418 748Z',
        clip: 'M418 748 Q447 698 490 693 Q548 690 568 721 Q586 756 592 792 L719 814 V985 H439 L446 853 Q433 819 426 792 Q419 767 418 748Z'
      }],
      draw(time, parts) {
        const crouch = gesture(time, 200, 455, 500, 810);
        const leap = gesture(time, 500, 1100, 1160, 1760);
        const landing = gesture(time, 1640, 1800, 1880, 2210);
        const stride = gesture(time, 450, 930, 1180, 1730);
        parts.whole.setAttribute('transform', `${move(80 * leap, 18 * crouch - 104 * leap + 19 * landing)}
          ${rotate(-5.5 * leap + 2.5 * landing, 543, 884)}`);
        parts.shoe.setAttribute('transform', rotate(-10 * stride, 520, 763));
      }
    },
    qian: {
      parts: [{
        id: 'tail', under: true,
        cut: 'M0 270 H184 Q180 393 182 465 L194 561 Q174 623 156 659 H0Z',
        clip: 'M0 260 H219 Q214 392 218 461 L225 571 Q198 636 169 675 H0Z'
      }],
      draw(time, parts) {
        const dip = gesture(time, 200, 460, 480, 860);
        const glide = gesture(time, 460, 1330, 1590, 2980);
        const tail = gesture(time, 315, 910, 1790, 2760) * Math.sin((time - 590) / 355);
        const angle = (-1.8 * glide + .6 * dip) * Math.PI / 180;
        const ratio = 6197 / 2656;
        const cosine = Math.cos(angle);
        const sine = Math.sin(angle);
        const skewX = -sine / ratio;
        const skewY = sine * ratio;
        const offsetX = 548 - cosine * 548 - skewX * 510;
        const offsetY = 510 - skewY * 548 - cosine * 510;
        parts.whole.setAttribute('transform', `${move(24 * glide, 19 * dip - 76 * glide)}
          matrix(${cosine} ${skewY} ${skewX} ${cosine} ${offsetX} ${offsetY})`);
        parts.tail.setAttribute('transform', rotate(9.5 * tail, 204, 522));
      }
    }
  };

  function layeredArt(rig, asset) {
    const image = `<image id="figure-source" href="${asset}" width="1000" height="1000" preserveAspectRatio="none"/>`;
    const layers = rig.parts ?? [];
    const definitions = layers.map(layer => `<clipPath id="clip-${layer.id}"><path d="${layer.clip}"/></clipPath>`);
    const use = layer => `<g id="${layer.id}"><use href="#figure-source" clip-path="url(#clip-${layer.id})"/>${rig.partExtras?.[layer.id] ?? ''}</g>`;
    return `<defs>${image}
      <clipPath id="clip-body"><path clip-rule="evenodd" d="${outline} ${layers.map(layer => layer.cut).join(' ')}"/></clipPath>
      ${definitions.join('')}</defs>
      ${layers.filter(layer => layer.under).map(use).join('')}
      <use href="#figure-source" clip-path="url(#clip-body)"/>
      ${layers.filter(layer => !layer.under).map(use).join('')}${rig.extras ?? ''}`;
  }

  const app = document.querySelector('#app');
  const viewport = document.querySelector('#map-viewport');
  if (!app || !viewport || !('IntersectionObserver' in window)) return;

  const memberRigs = {
    '01': 'stella', '02': 'wendy', '03': 'arnold', '04': 'ryne',
    '05': 'changyo', '07': 'jiutian', '08': 'qiufan', '09': 'joan'
  };
  const buttons = [...viewport.querySelectorAll('[data-member-id]')]
    .filter(button => memberRigs[button.dataset.memberId]);
  buttons.push(document.querySelector('#qian-dragon'));
  const characters = new Map(buttons.filter(Boolean).map(button => [button, {
    button,
    id: memberRigs[button.dataset.memberId] ?? 'qian',
    visible: false,
    replay: false,
    failed: false
  }]));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const jobs = new Map();
  const duration = 3200;

  function canAnimate() {
    return app.dataset.view === 'camp' && !document.hidden && !reducedMotion.matches
      && !document.querySelector('dialog[open]');
  }

  async function prepare(character) {
    if (character.art) return;
    const still = character.button.querySelector('img');
    await still.decode();
    const width = still.naturalWidth;
    const height = still.naturalHeight;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('approved-motion');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.innerHTML = `<g transform="scale(${width / 1000} ${height / 1000})">
      <g id="whole">${layeredArt(rigs[character.id], still.src)}</g>
    </g>`;
    const parts = {};
    const prefix = `camp-motion-${character.id}-`;
    for (const element of svg.querySelectorAll('[id]')) {
      parts[element.id] = element;
      element.id = prefix + element.id;
    }
    // Each SVG has its own art, clips and gradients. Unique fragment IDs keep
    // one character's layers from resolving to another character's definitions.
    for (const element of svg.querySelectorAll('*')) {
      for (const attribute of [...element.attributes]) {
        let value = attribute.value.replace(/url\(#([^)]*)\)/g, `url(#${prefix}$1)`);
        if (attribute.name === 'href' && value.startsWith('#')) value = '#' + prefix + value.slice(1);
        if (value !== attribute.value) element.setAttribute(attribute.name, value);
      }
    }
    const source = parts['figure-source'];
    const loaded = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Character art did not load')), 8000);
      source.addEventListener('load', () => { clearTimeout(timeout); resolve(); }, { once: true });
      source.addEventListener('error', error => { clearTimeout(timeout); reject(error); }, { once: true });
    });
    character.button.append(svg);
    try {
      await loaded;
    } catch (error) {
      svg.remove();
      throw error;
    }
    character.art = svg;
    character.parts = parts;
  }

  function stop(character) {
    const job = jobs.get(character);
    if (!job) return;
    cancelAnimationFrame(job.frame);
    jobs.delete(character);
    character.button.classList.remove('approved-motion-playing');
  }

  function start(character, job) {
    if (jobs.get(character) !== job) return;
    if (!canAnimate() || !character.visible) {
      stop(character);
      pump();
      return;
    }
    character.replay = false;
    const started = performance.now();
    rigs[character.id].draw(0, character.parts);
    character.button.classList.add('approved-motion-playing');
    function tick(now) {
      if (!canAnimate() || !character.visible || now - started >= duration) {
        stop(character);
        pump();
        return;
      }
      rigs[character.id].draw(now - started, character.parts);
      job.frame = requestAnimationFrame(tick);
    }
    job.frame = requestAnimationFrame(tick);
  }

  async function schedule(character) {
    const job = {};
    jobs.set(character, job);
    try {
      character.ready ??= prepare(character);
      await character.ready;
      if (jobs.get(character) !== job) return;
      start(character, job);
    } catch {
      if (jobs.get(character) !== job) return;
      character.failed = true;
      character.replay = false;
      stop(character);
      pump();
    }
  }

  function pump() {
    if (!canAnimate()) return;
    for (const character of characters.values()) {
      if (jobs.size >= 2) break;
      if (!character.visible || character.failed || jobs.has(character)) continue;
      if (character.replay) schedule(character);
    }
  }

  function sync() {
    if (!canAnimate()) {
      for (const character of characters.values()) {
        character.replay = false;
      }
    }
    for (const character of jobs.keys()) {
      if (!canAnimate() || !character.visible) stop(character);
    }
    pump();
  }

  const intersection = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const character = characters.get(entry.target);
      character.visible = entry.isIntersecting && entry.intersectionRatio >= .5;
      if (!character.visible) character.replay = false;
    }
    sync();
  }, { root: viewport, threshold: .5 });
  for (const character of characters.values()) {
    intersection.observe(character.button);
    const replay = () => {
      if (jobs.has(character) || !canAnimate() || !character.visible) return;
      character.replay = true;
      pump();
    };
    character.button.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') replay(); });
    character.button.addEventListener('focus', () => { if (character.button.matches(':focus-visible')) replay(); });
  }
  const changes = new MutationObserver(sync);
  changes.observe(app, { attributeFilter: ['data-view'] });
  for (const dialog of document.querySelectorAll('dialog')) changes.observe(dialog, { attributeFilter: ['open'] });
  document.addEventListener('visibilitychange', sync);
  reducedMotion.addEventListener('change', sync);
  sync();
})();
