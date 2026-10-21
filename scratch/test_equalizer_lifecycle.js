const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const path = require('node:path');
function loadService(native, storage = {}) {
  const cache = {};
  function load(file) {
    file = path.resolve(file);
    if (cache[file]) return cache[file].exports;
    const module = { exports: {} }; cache[file] = module;
    const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
    vm.runInNewContext(`(function(require,module,exports){${js}\n})`, { console, setTimeout, clearTimeout })(name => {
      if (name === 'react-native') return { NativeModules: { GrooveEqualizer: native }, Platform: { OS: 'android' } };
      if (name.includes('async-storage')) return { getItem: async () => null, setItem: async () => {}, ...storage };
      return load(path.join(path.dirname(file), name + '.ts'));
    }, module, module.exports);
    return module.exports;
  }
  return load('src/services/equalizer/EqualizerService.ts').equalizerService;
}
const parameters = id => ({ attached: true, sessionId: id, numberOfBands: 3, minLevel: -600, maxLevel: 600, bands: [100, 1000, 10000].map((centerFreq,index)=>({index,centerFreq,level:0})) });
(async () => {
  const missing = loadService(null); await missing.init(); await missing.syncAudioSession(12);
  assert.equal(missing.getState().isAttached, false, 'missing module cannot claim attachment');
  assert.equal(missing.getState().isSupported, false);
  const calls = []; let unblock;
  const native = { isSupported: async()=>true, attachToSession: async id => { calls.push(id); if(id===10) await new Promise(r=>unblock=r); return parameters(id); }, setEnabled: async()=>({success:true}), setAllBandLevels: async()=>({success:true}), setBandLevel: async()=>({success:true}), release: async()=>{calls.push('release');} };
  const service = loadService(native); await service.init();
  const first = service.syncAudioSession(10); await new Promise(r=>setTimeout(r,0));
  const second = service.syncAudioSession(20); unblock(); await Promise.all([first,second]);
  assert.equal(service.getState().currentSessionId,20);
  assert.equal(service.getState().isAttached,true);
  assert.equal(service.getState().bands.length,3);
  assert.equal(service.getState().bands[0].centerFreqHz,100);
  assert.equal(service.getState().bands[0].maxMilliBels,600);
  await service.setBandLevel(0,15); assert.equal(service.getState().bands[0].levelDb,6);
  await service.syncAudioSession(0); assert.equal(service.getState().isAttached,false);
  assert.equal(calls.at(-1),'release');
  native.attachToSession = async()=>({success:false,error:'unsupported'});
  await service.syncAudioSession(30); assert.equal(service.getState().isAttached,false);
  assert.equal(service.getState().error,'unsupported');
  let resume;
  native.attachToSession = async id => { await new Promise(r => resume = r); return parameters(id); };
  const pending = service.syncAudioSession(40); await new Promise(r=>setTimeout(r,0));
  const detached = service.syncAudioSession(0); resume(); await Promise.all([pending,detached]);
  assert.equal(service.getState().isAttached,false); assert.equal(service.getState().currentSessionId,0);
  assert.equal(calls.at(-1),'release');
  native.attachToSession = async id => parameters(id);
  const restored = loadService(native,{getItem:async()=>JSON.stringify({isEnabled:false,activePresetId:'custom',bandLevelsDb:[1,2,3],frequencies:[100,1000,10000]})});
  await restored.init();
  await restored.setEnabled(false);
  await restored.syncAudioSession(50);
  assert.equal(restored.getState().isEnabled,false);assert.equal(restored.getState().bands[2].levelDb,3);
  native.setBandLevel = async()=>({success:false,error:'control lost'});
  await restored.setBandLevel(0,4);assert.equal(restored.getState().isAttached,false);assert.equal(restored.getState().error,'control lost');
  console.log('PASS: production equalizer service missing-module, latest-session, dynamic bands/ranges, clamp, release and failed attach');
})().catch(e=>{console.error(e);process.exitCode=1;});
