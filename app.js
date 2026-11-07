(() => {
  const members = [
    {
      id: '01', name: '张诗敏', animal: '水獭', place: '知识角', role: 'AI 探索者', traits: '好奇 / 阅读 / AI 探索', x: 17, y: 47,
      figure: 'assets/characters/char-stella-full.webp', avatar: 'assets/avatars/avatar-stella.webp',
      intro: '这是一只聪明又好奇的水獭。圆圆的眼镜后，总有一双寻找新鲜事物的眼睛；怀里常抱着一本书，认真收集知识，也悄悄保存那些突然冒出来的灵感。',
      story: [
        '作为团队里的 AI 探索者，她尤其喜欢研究各种好玩、实用的 AI 工具。遇到新技术时，她会先凑近观察，再亲手试一试：有时和 AI 一起解决问题，有时把模糊的想法变成具体作品，也常常从一次小实验里发现新的可能。',
        '不玩 AI 的时候，她喜欢安静地阅读，在文字中认识更大的世界。对她而言，好奇心是前进的动力，书籍是随身携带的地图，而 AI 则是一起探索未知的新伙伴。'
      ]
    },
    {
      id: '02', name: '曹嘉璇', alias: 'Wendy', animal: '兔子', place: '知识角', role: '活动手账规划者', traits: '倾听 / 创造 / 带来快乐', x: 29, y: 46,
      figure: 'assets/characters/char-wendy-full.webp', avatar: 'assets/avatars/avatar-wendy.webp',
      intro: '这是一只随身带着活动手账的小兔子。翻开手账，能找到集合时间、游戏点子，还有为不同伙伴准备的小惊喜。看见伙伴们笑起来，是她最喜欢的时刻。',
      story: [
        '她喜欢听不同的想法，遇见新鲜的观点，耳朵便会竖起来，再凑近一点问：“你为什么会这样想？”休息时，她会聊起喜欢的歌、兜风时的快乐，以及念念不忘的大海。',
        '在来到极岳之前，她曾沿着一条熟悉的路走了很久。后来她发现，自己可以借助魔法亲手创造一些有价值的东西。认真考虑之后，她决定换一条路，继续探索这份可能。',
        { emphasis: '她希望改变世界，让世界变得更好，为大家带来更多快乐与幸福。', text: '这份愿望被她认真记在手账里，也藏在每一次行动中：做出一个能帮上忙的工具，或是想办法让独自出发的旅人找到合拍的伙伴。' },
        '如今，她带着这些愿望加入登峰小队，向极岳出发。沿途遇见的问题、听到的心愿，都可能成为手账里的下一页。如果你也有一个想尝试的念头，可以找她聊聊。她大概会拿起笔，笑着问：“说说看，我们可以从哪里开始？”'
      ]
    },
    {
      id: '03', name: '李子鑫', alias: 'Arnold', animal: '格劳尔大猩猩', place: '灵感工坊', role: '机械创作者', traits: '制造 / 动手 / 家乡梦想', x: 66, y: 46,
      figure: 'assets/characters/char-arnold-full.webp', avatar: 'assets/avatars/avatar-arnold.webp',
      intro: '据工坊里的消息，这是一只来自刚果金东部的格劳尔大猩猩。看起来有力量，笑起来很温柔。戴上护目镜就爱动手琢磨，也愿意停下来，认真听听伙伴的想法。',
      story: [
        '如今在上海交大学机械，心里装着家乡的制造业梦想：把资源变成产品，把点子变成现实。希望通过自己，让更多人认识刚果金，也愿意去那里走一走。',
        '工作台之外，篮球、徒手健身、素描轮番登场，双手和脑袋都闲不住～',
        '如果你也有个想尝试的点子，来拍拍它：“讲讲你的想法，咱们一起试试看！”'
      ]
    },
    {
      id: '04', name: '包庆涵', animal: '小熊猫', place: '灵感工坊', role: '奇思妙想实验者', traits: '观察 / 绘画 / 创造', x: 80, y: 47,
      figure: 'assets/characters/char-ryne-full.webp', avatar: 'assets/avatars/avatar-ryne.webp',
      intro: '据情报显示，包庆涵是一只安静的小熊猫。你可能会在某个不起眼的角落，意外发现它正默默观察着人类。',
      story: [
        '作为一只非典型小熊猫，它对一切有趣的事物都充满好奇。背上常年背着一个「奇思妙想包」，里面放着画笔、速写本，以及——据知情人士透露——无数个还没来得及实现的点子。偶尔，它会掏出纸笔，把眼前的世界和脑海里的奇怪念头画下来。',
        '更多时候，它都在埋头捣鼓一些暂时看不出用途的小东西。听见质疑，耳朵也会耷拉一下，但爪子里的活儿通常不会停。它偷偷期待着，某一天能把终于做好的作品往大家面前一放，让大家都化身青蛙，听取哇声一片。'
      ]
    },
    {
      id: '05', name: '胡智溪', alias: 'ChangYo', animal: '小狗', place: '营火广场', role: 'AI 产品创造者', traits: 'Coding Agent / Dela / 开源', x: 41, y: 64,
      figure: 'assets/characters/char-changyo-full.webp', avatar: 'assets/avatars/avatar-changyo.webp',
      intro: '据情报显示，ChangYo 是一只对 AI 充满好奇的小狗。它有一只总爱翘起的耳朵，像是在向路过的人打招呼：“嘿，要不要来看看我刚做的新东西？”另一只耳朵则自然垂着，随时准备听听大家的想法。',
      story: [
        '自从接触了 coding agent，它便常常抱着终端捣鼓，想看看那些看似天马行空的念头，究竟能变成什么。两个月前，它给自己做了一个叫作 Dela 的小工具，没想到身边的朋友纷纷凑过来：“这个，我也想用！”于是，一只小狗的工作台旁渐渐多了一群伙伴，小工具也在大家的打磨下，长成了面向校园的 Agent 产品。',
        '最近，它把 Dela 开源了，工作台也变得更加热闹：有人来试用，有人提建议，还有老师来聊合作。每当听见一句“要是还能这样就好了”，那只翘起的耳朵似乎就会再抬高一点——新的点子又来了。至于 AI 创造的边界在哪里，它暂时还不急着下结论。它想先招呼更多伙伴，一起往前探索看看。'
      ]
    },
    {
      id: '06', name: '王雨泽', animal: '浣熊', place: '营火广场', role: '点子发明家', traits: '好奇 / 收集 / 动手', x: 59, y: 64,
      figure: 'assets/characters/char-wyz-full.webp', avatar: 'assets/avatars/avatar-wyz.webp',
      intro: '这是一只闲不太住的小浣熊。它对世界上的新鲜事总有一点额外的好奇，遇到没见过的东西，会先凑近看看，再伸出爪子拨弄两下。要是发现了什么有意思的地方，眼睛就会亮起来，转头招呼身边的伙伴：“快来，这个好像很好玩！”',
      story: [
        '它喜欢把一路捡来的小发现收集起来：一颗奇怪的螺丝、一句突然冒出来的话，或者一个暂时不知道能做什么的念头。有空的时候，它就把它们摊开，试着拼拼凑凑。有时折腾半天，只拼出一个会发出奇怪声音的小玩意儿；它也不着急，歪着脑袋想一会儿，又继续捣鼓。',
        '小浣熊相信，好点子要走出脑袋，才有机会遇见需要它的人。所以它总盼着，哪天能把自己的小发明捧到大家面前：或许能解决一个小麻烦，或许能逗人笑一笑。要是还能听见一句“这个真有意思”，它的尾巴大概会偷偷翘起来。'
      ]
    },
    {
      id: '07', name: '咸金桐', animal: '雾蓝色猫头鹰', place: '帐篷区', role: '营地编年史记录者', traits: '倾听 / 记录 / 探索', x: 14, y: 83,
      figure: 'assets/characters/char-jiutian-full.webp', avatar: 'assets/avatars/avatar-jiutian.webp',
      intro: '据情报显示，这是一只雾蓝色的小猫头鹰。你可能会在天黑后的某个角落，意外发现她还睁着圆圆的大眼睛——别误会，她没在熬夜，猫头鹰的白天的确过得比较晚。',
      story: [
        '她对一切没见过的事物都充满好奇：新工具、新玩法、没走过的岔路，都要亲自凑上去试一试。',
        '她背上常年挎着一个游记行囊，里面放着一支用旧的羽毛笔、一本翻到卷边的日记本、几张写满批注的地图，以及据知情人士透露，无数次还没来得及记录下的日出日落，云卷云舒。',
        '她的绝活是听：风里的语气、篝火边没说完的半句话、地图角落的小字，她都读得懂，再原封不动地记进队伍的编年史里。',
        '更多时候，她都在埋头捣鼓一些看起来不务正业的小玩意儿——比如教一座网站学会讲故事，或者琢磨怎么让模型听懂一句话里的心动。',
        '她偷偷期待着，某天把自己写下的文字整理起来出版——从此山那边的世界，每个人都能看见。'
      ]
    },
    {
      id: '08', name: '刘秋凡', animal: '小鸭子', place: '帐篷区', role: '行路的分享者', traits: '行走 / 记录 / 分享', x: 31, y: 82,
      figure: 'assets/characters/char-qiufan-full.webp', avatar: 'assets/avatars/avatar-qiufan.webp',
      intro: '据情报显示，刘秋凡是一只喜欢四处行走的小鸭子。它常戴着一顶缀有秋叶的帽子，背上行囊就出发，对路边不起眼的小事也充满好奇。',
      story: [
        '它似乎总有走不完的路，也不急着抵达哪里。遇到喜欢的风景，或者冒出什么有趣的念头，就悄悄记下来，留待以后慢慢回味。它尤其喜欢秋天——在它看来，每一次告别都藏着新的开始。',
        '作为一只有自己想法的鸭子，它相信分享的力量。在人生的道路上，一点微光或许并不起眼，却能为同行的人照亮脚下的路。它愿意把沿途的发现、积累的经验和心中的想法分享出去，也期待与伙伴们一起，让更多美好的可能发生。'
      ]
    },
    {
      id: '09', name: '张欣', animal: '翼豹（海鸥与豹子）', place: '活动场', role: '乐观的翼豹', traits: '好奇 / 运动 / 助人', x: 79, y: 83,
      figure: 'assets/characters/char-joan-full.webp', avatar: 'assets/avatars/avatar-joan.webp',
      intro: '这是一只海鸥与豹子凑成的奇妙组合——我叫她“翼豹”。海鸥给了她一对爱往远处飞的翅膀，豹子给了她一身不服输的韧劲。',
      story: [
        '她最藏不住的，是一颗满格的好奇心。听见新鲜的想法会兴奋，凑近了问：“你为什么会这么想？”多问一句、多试一次，世界就多开一扇窗。',
        '她喜欢运动，能流一身汗、四处跑一跑，整个人就像重新充了电；摔一跤也不打紧，拍拍土，接着跑。她乐观温和，最喜欢看见身边的人被点亮——托别人一把，是她很开心的事。',
        '心里那个不大的念头一直没变：让身边的世界再好一点，多带来一点快乐。',
        '如今她带着好奇心和小愿望，飞进了新的队伍。如果你有什么困惑或念头，欢迎来找她（她比团队里不少伙伴多走了些年头，也许能给你一点启发）——她多半会眼睛一亮，笑着说：“说说看，我们可以从哪里开始？”'
      ]
    }
  ];
  const app = document.querySelector('#app');
  const home = document.querySelector('#start');
  const camp = document.querySelector('#camp');
  const viewport = document.querySelector('#map-viewport');
  const surface = document.querySelector('#map-surface');
  const layer = document.querySelector('#member-layer');
  const dialog = document.querySelector('#member-dialog');
  const dialogArt = document.querySelector('#dialog-art');
  const scrollDialog = document.querySelector('#scroll-dialog');
  const owlDialog = document.querySelector('#owl-dialog');
  const owlStone = document.querySelector('#wenyu-stone');
  const owlScene = document.querySelector('#wenyu-scene');
  const owlFigure = document.querySelector('#wenyu-owl');
  const qianDialog = document.querySelector('#qian-dialog');
  const logoDialog = document.querySelector('#logo-dialog');
  let firstLayout = true;
  let drag = null;

  // The book uses one image element for all profiles. Warm the small avatar assets
  // before a member is clicked so the first opening does not wait for decoding.
  const avatarPreloads = members.map(member => {
    const image = new Image();
    image.decoding = 'async';
    image.fetchPriority = 'low';
    image.src = member.avatar;
    if (image.decode) image.decode().catch(() => {});
    return image;
  });
  const bookImageValue = getComputedStyle(document.documentElement).getPropertyValue('--book-image');
  const bookImageUrl = bookImageValue.match(/url\(["']?([^"')]+)["']?\)/)?.[1];
  if (bookImageUrl) {
    const bookPreload = new Image();
    bookPreload.decoding = 'async';
    bookPreload.fetchPriority = 'low';
    bookPreload.src = bookImageUrl;
    if (bookPreload.decode) bookPreload.decode().catch(() => {});
  }

  members.forEach(member => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'member-figure';
    button.dataset.memberId = member.id;
    button.style.left = member.x + '%';
    button.style.top = member.y + '%';
    button.setAttribute('aria-label', `打开${member.name}的档案`);
    const figure = document.createElement('img');
    figure.src = member.figure;
    figure.alt = '';
    figure.draggable = false;
    button.append(figure);
    button.addEventListener('click', () => {
      document.querySelector('#member-name').textContent = member.name;
      document.querySelector('#member-role').textContent = `${member.alias ? `${member.alias} · ` : ''}${member.animal} · ${member.role}`;
      document.querySelector('#member-animal').textContent = member.animal;
      document.querySelector('#member-place').textContent = member.place;
      document.querySelector('#member-traits').textContent = member.traits;
      document.querySelector('#member-number').textContent = `${member.id} / 09`;
      document.querySelector('#member-heading').textContent = member.role;
      document.querySelector('#member-intro').textContent = member.intro;
      const story = document.querySelector('#member-story');
      story.replaceChildren();
      member.story.forEach(part => {
        const paragraph = document.createElement('p');
        if (typeof part === 'string') {
          paragraph.textContent = part;
        } else {
          const emphasis = document.createElement('strong');
          emphasis.textContent = part.emphasis;
          paragraph.append(emphasis, document.createTextNode(part.text));
        }
        story.append(paragraph);
      });
      dialogArt.src = avatarPreloads[Number(member.id) - 1].src;
      dialogArt.alt = `${member.name}的虚拟形象头像`;
      dialog.showModal();
    });
    layer.append(button);
    if (member.id === '06') setupRaccoonMotion(button, figure);
  });

  function setupRaccoonMotion(button, figure) {
    if (!('IntersectionObserver' in window)) return;
    const template = document.querySelector('#raccoon-motion-template');
    if (!template) return;
    const art = template.content.firstElementChild.cloneNode(true);
    const source = art.querySelector('image');
    const head = art.querySelector('.raccoon-head');
    const robot = art.querySelector('.raccoon-robot');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const duration = 3200;
    let ready = false;
    let visible = false;
    let frame = 0;

    function ease(time, start, end) {
      const position = Math.max(0, Math.min(1, (time - start) / (end - start)));
      return position * position * (3 - 2 * position);
    }

    function draw(time) {
      const lift = ease(time, 220, 870) - ease(time, 1770, 2590);
      const bob = (ease(time, 840, 1040) - ease(time, 1500, 1850)) * Math.sin((time - 840) / 200);
      const greeting = ease(time, 760, 1160) - ease(time, 1430, 1790);
      const settle = ease(time, 2450, 2630) - ease(time, 2630, 2870);
      const gaze = ease(time, 430, 1030) - ease(time, 1720, 2560);
      robot.setAttribute('transform', `translate(${22 * lift} ${-119 * lift - 11 * bob + 7 * settle}) rotate(${13 * greeting} 700 276)`);
      head.setAttribute('transform', `rotate(${-5.4 * gaze} 400 441)`);
    }

    function canPlay() {
      return ready && visible && app.dataset.view === 'camp' && !document.hidden
        && !reducedMotion.matches && !document.querySelector('dialog[open]');
    }

    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      button.classList.remove('raccoon-motion-playing');
    }

    function play() {
      if (frame || !canPlay()) return;
      const started = performance.now();
      draw(0);
      button.classList.add('raccoon-motion-playing');
      function tick(now) {
        const time = now - started;
        if (time >= duration) {
          stop();
          return;
        }
        draw(time);
        frame = requestAnimationFrame(tick);
      }
      frame = requestAnimationFrame(tick);
    }

    function sync() {
      if (!canPlay()) stop();
    }

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= .5;
      sync();
    }, { root: viewport, threshold: .5 });
    intersection.observe(button);
    const changes = new MutationObserver(sync);
    changes.observe(app, { attributeFilter: ['data-view'] });
    for (const overlay of document.querySelectorAll('dialog')) {
      changes.observe(overlay, { attributeFilter: ['open'] });
    }
    document.addEventListener('visibilitychange', sync);
    reducedMotion.addEventListener('change', sync);
    button.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') play(); });
    button.addEventListener('focus', () => { if (button.matches(':focus-visible')) play(); });
    source.addEventListener('load', () => {
      ready = true;
      sync();
    }, { once: true });
    button.append(art);
    source.setAttribute('href', figure.src);
  }

  document.querySelector('#dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  const owlReducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  function stopOwlMotion() {
    owlFigure.classList.remove('is-animating');
  }
  function playOwlMotion(waitForRise = false) {
    if (!owlScene.classList.contains('is-awake') || owlFigure.classList.contains('is-animating')
      || owlReducedMotion.matches || document.hidden || document.querySelector('dialog[open]')) return;
    owlFigure.style.setProperty('--wenyu-motion-lead', waitForRise ? '.675s' : '0s');
    // Flush a previous removal so a quick hide/reveal also starts a fresh gesture.
    void owlFigure.offsetWidth;
    owlFigure.classList.add('is-animating');
  }
  owlFigure.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'touch') playOwlMotion();
  });
  owlFigure.addEventListener('focus', () => {
    if (owlFigure.matches(':focus-visible')) playOwlMotion();
  });
  owlFigure.addEventListener('animationend', event => {
    if (event.animationName === 'wenyu-tilt') stopOwlMotion();
  });
  owlReducedMotion.addEventListener('change', () => {
    if (owlReducedMotion.matches) stopOwlMotion();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopOwlMotion();
  });
  function hideOwl() {
    stopOwlMotion();
    owlScene.classList.remove('is-awake');
    owlStone.setAttribute('aria-expanded', 'false');
    owlStone.setAttribute('aria-label', '查看山路旁的石头，问羽藏在后面');
    owlFigure.setAttribute('aria-hidden', 'true');
    owlFigure.tabIndex = -1;
  }
  owlStone.addEventListener('click', () => {
    if (!owlScene.classList.contains('is-awake')) {
      owlScene.classList.add('is-awake');
      owlStone.setAttribute('aria-expanded', 'true');
      owlStone.setAttribute('aria-label', '点击石头让问羽缩回去');
      owlFigure.setAttribute('aria-hidden', 'false');
      owlFigure.tabIndex = 0;
      playOwlMotion(true);
      return;
    }
    hideOwl();
  });
  owlFigure.addEventListener('click', () => {
    if (!owlScene.classList.contains('is-awake')) return;
    stopOwlMotion();
    owlDialog.showModal();
  });
  document.querySelector('#owl-close').addEventListener('click', () => owlDialog.close());
  owlDialog.addEventListener('click', event => { if (event.target === owlDialog) owlDialog.close(); });
  document.querySelector('#qian-dragon').addEventListener('click', () => qianDialog.showModal());
  document.querySelector('#qian-close').addEventListener('click', () => qianDialog.close());
  qianDialog.addEventListener('click', event => { if (event.target === qianDialog) qianDialog.close(); });
  const scrollTurn = document.querySelector('#scroll-turn');
  const scrollFront = document.querySelector('#scroll-front');
  const scrollBack = document.querySelector('#scroll-back');
  function setScrollSide(reversed) {
    scrollDialog.classList.toggle('is-reversed', reversed);
    scrollTurn.innerHTML = reversed ? '返回正面 <span aria-hidden="true">↺</span>' : '翻到背面 <span aria-hidden="true">↻</span>';
    scrollTurn.setAttribute('aria-pressed', String(reversed));
    scrollFront.setAttribute('aria-hidden', String(reversed));
    scrollBack.setAttribute('aria-hidden', String(!reversed));
  }
  document.querySelector('#camp-scroll').addEventListener('click', () => { setScrollSide(false); scrollDialog.showModal(); });
  scrollTurn.addEventListener('click', () => setScrollSide(!scrollDialog.classList.contains('is-reversed')));
  document.querySelector('#scroll-close').addEventListener('click', () => scrollDialog.close());
  scrollDialog.addEventListener('click', event => { if (event.target === scrollDialog) scrollDialog.close(); });
  scrollDialog.addEventListener('close', () => setScrollSide(false));

  function fitMap() {
    const oldWidth = surface.getBoundingClientRect().width || 1;
    const oldHeight = surface.getBoundingClientRect().height || 1;
    const centerX = (viewport.scrollLeft + viewport.clientWidth / 2) / oldWidth;
    const centerY = (viewport.scrollTop + viewport.clientHeight / 2) / oldHeight;
    const width = Math.round(Math.max(viewport.clientWidth, viewport.clientHeight * 1672 / 941));
    surface.style.width = width + 'px';
    requestAnimationFrame(() => {
      const height = surface.getBoundingClientRect().height;
      viewport.scrollLeft = Math.max(0, width * (firstLayout ? .5 : centerX) - viewport.clientWidth / 2);
      viewport.scrollTop = Math.max(0, height * (firstLayout ? .5 : centerY) - viewport.clientHeight / 2);
      firstLayout = false;
    });
  }

  function setView(view, changeHistory = false) {
    const next = view === 'camp' ? 'camp' : 'home';
    if (dialog.open) dialog.close();
    if (qianDialog.open) qianDialog.close();
    if (scrollDialog.open) scrollDialog.close();
    if (owlDialog.open) owlDialog.close();
    if (logoDialog.open) logoDialog.close();
    if (next !== 'camp') hideOwl();
    app.dataset.view = next;
    home.setAttribute('aria-hidden', String(next !== 'home'));
    camp.setAttribute('aria-hidden', String(next !== 'camp'));
    if (changeHistory) history.pushState({ view: next }, '', next === 'camp' ? '#camp' : '#start');
    if (next === 'camp') {
      firstLayout = true;
      requestAnimationFrame(fitMap);
    }
  }

  document.querySelector('#enter-camp').addEventListener('click', event => {
    event.preventDefault();
    setView('camp', true);
  });
  document.querySelector('#home-button').addEventListener('click', event => {
    event.preventDefault();
    logoDialog.showModal();
  });
  document.querySelector('#logo-close').addEventListener('click', () => logoDialog.close());
  logoDialog.addEventListener('click', event => { if (event.target === logoDialog) logoDialog.close(); });
  document.querySelector('#camp-gramophone').addEventListener('click', event => {
    const target = event.currentTarget.dataset.targetUrl.trim();
    if (target) window.open(target, '_blank', 'noopener,noreferrer');
  });
  addEventListener('popstate', () => setView(location.hash === '#camp' ? 'camp' : 'home'));
  addEventListener('resize', () => { if (app.dataset.view === 'camp') fitMap(); });

  viewport.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.target.closest('button, a')) return;
    drag = { x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop };
    viewport.classList.add('dragging');
    viewport.setPointerCapture(event.pointerId);
  });
  viewport.addEventListener('pointermove', event => {
    if (!drag) return;
    viewport.scrollLeft = drag.left - (event.clientX - drag.x);
    viewport.scrollTop = drag.top - (event.clientY - drag.y);
  });
  function endDrag() { drag = null; viewport.classList.remove('dragging'); }
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);

  // A shared link always begins at the cover, even if an older link retained #camp.
  if (location.hash === '#camp') history.replaceState({ view: 'home' }, '', '#start');
  setView('home');
})();
