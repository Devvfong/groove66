const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const calls = [], players = [];
const equalizerService = { syncAudioSession: async id => { calls.push(id); } };
const source = ts.transpileModule(fs.readFileSync('src/services/audio/AudioPlayer.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const moduleObject = {exports:{}};
vm.runInNewContext(`(function(require,module,exports){${source}})`,{console})(name => {
  if(name==='expo-audio') return { setAudioModeAsync:async()=>{},createAudioPlayer:()=>{
    const p={addListener:(event,fn)=>{p.emit=fn;return {remove:()=>{p.unsubscribed=true;}};},play:()=>{},pause:()=>{},remove:()=>{p.removed=true;},seekTo:async()=>{}};
    players.push(p);return p;
  }};
  if(name==='expo-constants') return {executionEnvironment:'standalone',ExecutionEnvironment:{StoreClient:'expo'}};
  if(name.includes('EqualizerService')) return {equalizerService};
  throw new Error(name);
},moduleObject,moduleObject.exports);
(async()=>{
  const player = new moduleObject.exports.AudioPlayer();
  const track = {id:'a',title:'Authorized fixture',audioUri:'file:///fixture.wav',duration:8};
  const status = {duration:8,currentTime:1,playing:true,isBuffering:false,isLoaded:true,error:null,audioSessionId:11};
  await player.loadTrack(track);players[0].emit(status);assert.equal(calls.at(-1),11);
  player.pause();assert.equal(calls.at(-1),11,'pause retains the same effect session');
  await player.loadTrack({...track,id:'b'});assert.equal(calls.at(-1),0,'track disposal detaches');
  assert.ok(players[0].removed && players[0].unsubscribed);
  players[1].emit({...status,audioSessionId:22});assert.equal(calls.at(-1),22);
  players[0].emit({...status,audioSessionId:99});assert.equal(calls.at(-1),22,'late events from removed player ignored');
  players[1].emit({...status,audioSessionId:0});assert.equal(calls.at(-1),0,'lost session detaches');
  player.release();assert.equal(calls.at(-1),0);
  players[1].emit({...status,audioSessionId:22});assert.equal(calls.at(-1),0);
  console.log('PASS: production player initialization, pause, track recreation, stale events, session loss and cleanup');
})().catch(e=>{console.error(e);process.exitCode=1;});
