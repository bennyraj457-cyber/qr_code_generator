import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const svgBuffer = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="128" fill="#4F46E5"/>
  <rect x="96" y="96" width="128" height="128" rx="32" fill="#FFFFFF"/>
  <rect x="128" y="128" width="64" height="64" rx="16" fill="#4F46E5"/>
  <rect x="288" y="96" width="128" height="128" rx="32" fill="#FFFFFF"/>
  <rect x="320" y="128" width="64" height="64" rx="16" fill="#4F46E5"/>
  <rect x="96" y="288" width="128" height="128" rx="32" fill="#FFFFFF"/>
  <rect x="128" y="320" width="64" height="64" rx="16" fill="#4F46E5"/>
  <rect x="288" y="288" width="48" height="48" rx="12" fill="#FFFFFF"/>
  <rect x="368" y="288" width="48" height="48" rx="12" fill="#FFFFFF"/>
  <rect x="288" y="368" width="48" height="48" rx="12" fill="#FFFFFF"/>
  <rect x="368" y="368" width="48" height="48" rx="12" fill="#FFFFFF"/>
</svg>`);

const maskableSvgBuffer = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" fill="#4F46E5"/>
  <rect x="116" y="116" width="112" height="112" rx="24" fill="#FFFFFF"/>
  <rect x="144" y="144" width="56" height="56" rx="12" fill="#4F46E5"/>
  <rect x="284" y="116" width="112" height="112" rx="24" fill="#FFFFFF"/>
  <rect x="312" y="144" width="56" height="56" rx="12" fill="#4F46E5"/>
  <rect x="116" y="284" width="112" height="112" rx="24" fill="#FFFFFF"/>
  <rect x="144" y="312" width="56" height="56" rx="12" fill="#4F46E5"/>
  <rect x="284" y="284" width="44" height="44" rx="10" fill="#FFFFFF"/>
  <rect x="352" y="284" width="44" height="44" rx="10" fill="#FFFFFF"/>
  <rect x="284" y="352" width="44" height="44" rx="10" fill="#FFFFFF"/>
  <rect x="352" y="352" width="44" height="44" rx="10" fill="#FFFFFF"/>
</svg>`);

const iconsDir = path.resolve('public/icons');

async function generate() {
  await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(iconsDir, 'icon-192x192.png'));
  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(iconsDir, 'icon-512x512.png'));
  await sharp(maskableSvgBuffer).resize(512, 512).png().toFile(path.join(iconsDir, 'maskable-icon-512x512.png'));
  await sharp(svgBuffer).resize(180, 180).png().toFile(path.join(iconsDir, 'apple-touch-icon.png'));
  await sharp(svgBuffer).resize(32, 32).png().toFile(path.join(iconsDir, 'favicon-32x32.png'));
  await sharp(svgBuffer).resize(16, 16).png().toFile(path.join(iconsDir, 'favicon-16x16.png'));
  console.log('All PNG icons rasterized successfully!');
}

generate().catch(console.error);

