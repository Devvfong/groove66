const { withMainApplication, withDangerousMod } = require('expo/config-plugins');
const fs = require('node:fs/promises');
const path = require('node:path');
const registration = 'add(com.devqii.groove66.equalizer.GrooveEqualizerPackage())';
function register(contents) {
  if (contents.includes(registration)) return contents;
  const anchor = 'PackageList(this).packages.apply {';
  if (!contents.includes(anchor)) throw new Error('GrooveEqualizer: unsupported MainApplication template; review registration.');
  return contents.replace(anchor, `${anchor}\n          ${registration}`);
}
module.exports = config => {
  if (config.android?.package !== 'com.devqii.groove66') throw new Error('GrooveEqualizer Kotlin package requires com.devqii.groove66');
  config = withMainApplication(config, config => {
    if (config.modResults.language !== 'kt') throw new Error('GrooveEqualizer requires Kotlin MainApplication');
    config.modResults.contents = register(config.modResults.contents);
    return config;
  });
  return withDangerousMod(config, ['android', async config => {
    const target = path.join(config.modRequest.platformProjectRoot, 'app/src/main/java/com/devqii/groove66/equalizer');
    await fs.mkdir(target, { recursive: true });
    for (const file of ['GrooveEqualizerModule.kt', 'GrooveEqualizerPackage.kt']) {
      await fs.copyFile(path.join(__dirname, '../native/equalizer', file), path.join(target, file));
    }
    return config;
  }]);
};
module.exports.register = register;
