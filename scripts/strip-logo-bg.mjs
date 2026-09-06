import sharp from "sharp";

const SRC = "public/logo-ast-media.jpg";
const OUT = "public/logo-ast-media.png";

const LOW = 26;   // below this max-channel value -> fully transparent
const HIGH = 70;  // above this -> fully opaque

const img = sharp(SRC).ensureAlpha();
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

for (let i = 0; i < data.length; i += channels) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const maxC = Math.max(r, g, b);

  let alpha;
  if (maxC <= LOW) alpha = 0;
  else if (maxC >= HIGH) alpha = 255;
  else alpha = Math.round(((maxC - LOW) / (HIGH - LOW)) * 255);

  data[i + 3] = alpha;
}

const cutout = sharp(data, { raw: { width, height, channels } });
const trimmed = await cutout.png().trim({ threshold: 5 }).toBuffer();
await sharp(trimmed).toFile(OUT);

const meta = await sharp(trimmed).metadata();
console.log("done ->", OUT, meta.width, "x", meta.height);
