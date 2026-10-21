// Fail closed on upstream drift; no fuzzy patching or network dependency.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const pkg = path.join(root, 'node_modules/expo-audio');
if (JSON.parse(fs.readFileSync(path.join(pkg, 'package.json'))).version !== '57.0.5') {
  throw new Error('Groove equalizer patch requires expo-audio 57.0.5; review patch before upgrading.');
}
const manifest = require('../patches/expo-audio+57.0.5.json');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(pkg, file))).digest('hex');
const files = Object.keys(manifest);
if (files.every(file => hash(file) === manifest[file].after)) {
  console.log('Expo Audio session patch already verified.');
} else {
  if (!files.every(file => hash(file) === manifest[file].before)) throw new Error('Expo Audio files differ from pristine/patched hashes. Refusing partial or unknown edits.');
  const patch = path.join(__dirname, '../patches/expo-audio+57.0.5.patch');
  execFileSync('git', ['apply', '--check', patch], { cwd: root, stdio: 'inherit' });
  execFileSync('git', ['apply', patch], { cwd: root, stdio: 'inherit' });
  if (!files.every(file => hash(file) === manifest[file].after)) throw new Error('Expo Audio patch verification failed');
  console.log('Expo Audio session patch applied and verified.');
}
