// Run with Node.js and sharp installed. All coordinates are relative to the
// original, uncropped PNG so each frame registers with the map's static art.
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

const assets = path.resolve(__dirname, 'assets');
const columns = 6;
const rows = 4;
const frameCount = columns * rows;
const clamp = (n, min, max) => Math.max(min, Math.min(n, max));
const ease = n => n * n * (3 - 2 * n);
const action = (time, start, end) => {
  const progress = clamp((time - start) / (end - start), 0, 1);
  return Math.sin(Math.PI * progress) ** 2;
};

function joint(cx, cy, rx, ry, dx, dy, angle = 0, pivotX = cx, pivotY = cy) {
  return { cx, cy, rx, ry, dx, dy, sine: Math.sin(angle), cosine: Math.cos(angle), pivotX, pivotY };
}

// Each movement is a feathered region of the original texture. The optional
// book page and teal lights are composited over that deformation.
const rigs = {
  'member-01': t => {
    const bow = action(t, .06, .90);
    return {
      joints: [joint(.51, .30, .46, .27, .004 * bow, .034 * bow, -.045 * bow)],
      page: clamp((t - .32) / .38, 0, 1)
    };
  },
  'member-02': t => {
    const ear = action(t, .09, .51) * Math.sin(21 * t);
    const book = action(t, .24, .94);
    return { joints: [
      joint(.35, .20, .19, .17, .030 * ear, -.012 * ear, .19 * ear, .38, .29),
      joint(.65, .65, .25, .18, .009 * book, -.052 * book, -.08 * book)
    ] };
  },
  'member-03': t => {
    const lift = action(t, .05, .95);
    return {
      joints: [joint(.84, .40, .21, .27, .006 * lift, -.059 * lift, -.025 * lift)],
      light: [.83, .32 - .052 * lift, .135, .12, action(t, .23, .79)]
    };
  },
  'member-04': t => {
    const look = action(t, .08, .92);
    const tail = action(t, .06, .94) * Math.sin(9 * t);
    return { joints: [
      joint(.66, .36, .36, .30, -.018 * look, .005 * look, -.09 * look, .62, .47),
      joint(.15, .68, .23, .29, -.020 * tail, .063 * tail, .18 * tail, .28, .76)
    ] };
  },
  'member-05': t => {
    const ear = action(t, .05, .58) * Math.sin(18 * t);
    const lift = action(t, .24, .88);
    return {
      joints: [
        joint(.72, .17, .23, .19, .024 * ear, -.033 * ear, .18 * ear, .64, .24),
        joint(.73, .63, .22, .18, .007 * lift, -.024 * lift)
      ],
      light: [.75, .61 - .02 * lift, .115, .12, action(t, .28, .88)]
    };
  },
  'member-06': t => {
    const float = action(t, .10, .92);
    const tilt = action(t, .26, .72) * Math.sin(12 * t);
    return { joints: [
      joint(.85, .255 - .07 * float, .145, .18, .024 * float, -.072 * float, .19 * tilt, .85, .255),
      joint(.80, .44, .16, .11, .003 * float, -.014 * float)
    ] };
  },
  'member-07': t => {
    const listen = action(t, .05, .66);
    const quill = action(t, .30, .94);
    return { joints: [
      joint(.52, .32, .41, .34, .007 * listen, .003 * listen, .095 * listen, .50, .50),
      joint(.21, .50, .25, .25, -.010 * quill, -.044 * quill, -.16 * quill, .34, .63)
    ] };
  },
  'member-08': t => {
    const step = action(t, .15, .81);
    const leaf = action(t, .24, .94) * Math.sin(18 * t);
    return { joints: [
      joint(.68, .81, .27, .19, .055 * step, -.052 * step, -.13 * step, .59, .73),
      joint(.54, .52, .42, .36, .014 * step, -.016 * step),
      joint(.31, .18, .16, .14, .008 * leaf, .026 * leaf, .21 * leaf, .35, .23)
    ] };
  },
  'member-09': t => {
    const leap = action(t, .12, .83);
    const land = action(t, .72, .95);
    return { joints: [
      joint(.51, .49, 1.1, 1.2, .047 * leap, -.046 * leap + .012 * land, -.065 * leap, .51, .79),
      joint(.46, .83, .30, .19, .030 * leap, -.030 * leap, -.12 * leap, .45, .70),
      joint(.73, .53, .24, .15, .014 * leap, -.025 * leap)
    ] };
  },
  qian: t => ({
    wave: action(t, .015, .985),
    joints: [
      joint(.12, .60, .22, .38, -.007 * action(t, .34, .94), .06 * action(t, .34, .94)),
      joint(.88, .51, .14, .27, .007 * action(t, .18, .79), -.036 * action(t, .18, .79))
    ]
  }),
  wenyu: t => ({
    joints: [joint(.52, .30, .46, .31, .008 * action(t, .34, .91), 0, .115 * action(t, .34, .91), .52, .47)],
    blink: action(t, .18, .40)
  })
};

function weight(x, y, cx, cy, rx, ry) {
  const distance = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
  return ease(clamp((1 - distance) / .75, 0, 1));
}

function premultiply(data) {
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) data[i + c] = Math.round(data[i + c] * data[i + 3] / 255);
  }
}

function sample(source, target, offset, width, height, x, y) {
  if (x < 0 || x >= width - 1 || y < 0 || y >= height - 1) return;
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const top = (iy * width + ix) * 4;
  const bottom = top + width * 4;
  const channel = c =>
    (source[top + c] * (1 - fx) + source[top + c + 4] * fx) * (1 - fy) +
    (source[bottom + c] * (1 - fx) + source[bottom + c + 4] * fx) * fy;
  const alpha = channel(3);
  if (alpha < .5) return;
  target[offset + 3] = Math.round(alpha);
  for (let c = 0; c < 3; c++) target[offset + c] = Math.round(channel(c) * 255 / alpha);
}

function poseFrame(source, width, height, pose, time) {
  const result = Buffer.alloc(source.length);
  for (let py = 0; py < height; py++) {
    const y = py / height;
    for (let px = 0; px < width; px++) {
      const x = px / width;
      let sx = x;
      let sy = y;
      for (const j of pose.joints) {
        const amount = weight(x, y, j.cx, j.cy, j.rx, j.ry);
        if (!amount) continue;
        const tx = x - j.dx - j.pivotX;
        const ty = y - j.dy - j.pivotY;
        sx += amount * (j.pivotX + tx * j.cosine + ty * j.sine - x);
        sy += amount * (j.pivotY - tx * j.sine + ty * j.cosine - y);
      }
      if (pose.wave) sy -= pose.wave * Math.sin(12 * x - 8 * time) * (.047 - .020 * x);
      if (pose.blink) {
        for (const eye of [.411, .615]) {
          sy += (sy - .34) * pose.blink * 1.65 * weight(sx, sy, eye, .34, .075, .056);
        }
      }
      const offset = (py * width + px) * 4;
      sample(source, result, offset, width, height, sx * width, sy * height);
      if (pose.light && result[offset + 3]) {
        const [cx, cy, rx, ry, intensity] = pose.light;
        const [r, g, b] = [result[offset], result[offset + 1], result[offset + 2]];
        const brightness = weight(x, y, cx, cy, rx, ry) * intensity * clamp((g + b - 2 * r) / 110, 0, 1);
        result[offset] = Math.round(r + (142 - r) * brightness * .48);
        result[offset + 1] = Math.round(g + (255 - g) * brightness * .80);
        result[offset + 2] = Math.round(b + (250 - b) * brightness * .66);
      }
    }
  }
  return result;
}

function turningPage(progress, width, height) {
  const swing = Math.cos(Math.PI * progress);
  const tip = 505 + 156 * swing;
  const rise = 76 * Math.sin(Math.PI * progress);
  const opacity = ease(clamp(Math.min(progress, 1 - progress) * 9, 0, 1));
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 1000 1000" preserveAspectRatio="none">
      <defs><linearGradient id="paper"><stop stop-color="#a98354"/><stop offset="1" stop-color="#f1dcb1"/></linearGradient></defs>
      <path d="M505 555 Q${(tip + 505) / 2} ${499 - rise},${tip} ${517 - rise}
        L${tip} ${547 - rise} Q${(tip + 505) / 2} ${530 - rise / 2},505 574 Z"
        fill="url(#paper)" stroke="#b8925f" stroke-width="4" opacity="${opacity}"/>
    </svg>`
  );
}

async function render(name, rig) {
  const file = name.startsWith('member-') ? `members/${name}-figure.png`
    : name === 'qian' ? 'qian-dragon.png' : 'wenyu-figure.png';
  const resized = sharp(path.join(assets, file)).ensureAlpha()
    .resize(name === 'qian' ? { width: 544 } : { height: name === 'wenyu' ? 320 : 288 });
  const { data: neutral, info: { width, height } } = await resized.raw().toBuffer({ resolveWithObject: true });
  const source = Buffer.from(neutral);
  premultiply(source);
  const atlasWidth = columns * width;
  const atlas = Buffer.alloc(atlasWidth * rows * height * 4);
  const raw = { width, height, channels: 4 };

  for (let index = 0; index < frameCount; index++) {
    const time = index / (frameCount - 1);
    const pose = rig(time);
    let frame = index === 0 || index === frameCount - 1
      ? neutral : poseFrame(source, width, height, pose, time);
    if (pose.page > 0 && pose.page < 1) {
      frame = await sharp(frame, { raw })
        .composite([{ input: turningPage(pose.page, width, height) }]).raw().toBuffer();
    }
    const left = (index % columns) * width;
    const top = Math.floor(index / columns) * height;
    for (let y = 0; y < height; y++) {
      frame.copy(atlas, ((top + y) * atlasWidth + left) * 4, y * width * 4, (y + 1) * width * 4);
    }
  }

  const output = path.join(assets, `motion-${name}.webp`);
  const atlasInput = { raw: { width: atlasWidth, height: rows * height, channels: 4 } };
  // Near-lossless alpha edges and moderate RGB compression fit the map scale.
  for (const quality of [84, 78, 72, 66]) {
    const data = await sharp(atlas, atlasInput).webp({ quality, alphaQuality: 100, effort: 5 }).toBuffer();
    if (data.length > (name === 'qian' ? 500_000 : 350_000) && quality > 66) continue;
    await fs.writeFile(output, data);
    console.log(`${name}: ${width} × ${height} per frame, ${Math.round(data.length / 1024)} KiB`);
    break;
  }
}

async function main() {
  for (const [name, rig] of Object.entries(rigs)) await render(name, rig);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
