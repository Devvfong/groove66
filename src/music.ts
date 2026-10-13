export type Genre = 'Soul' | 'Rock & Roll' | 'Jazz' | 'Psychedelic';

export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  year: number;
  genre: Genre;
  duration: number;
  base: string;
  ink: string;
  accent: string;
  number: string;
};

// Fictional records used as visual placeholders; no licensed audio is bundled.
export const tracks: Track[] = [
  { id:'golden', title:'Golden Hour', artist:'The Velvet Tones', album:'Sunset Serenade', year:1966, genre:'Soul', duration:216, base:'#D57546', ink:'#392C24', accent:'#F3D78A', number:'01' },
  { id:'satellite', title:'Satellite Heart', artist:'The Skyliners', album:'Cosmic Love', year:1968, genre:'Psychedelic', duration:194, base:'#71836C', ink:'#1D362F', accent:'#EACF9C', number:'02' },
  { id:'blue', title:'Blue Moon Drive', artist:'June & The Echoes', album:'Blue Moon Drive', year:1963, genre:'Jazz', duration:241, base:'#426A75', ink:'#102E38', accent:'#F3D9AF', number:'03' },
  { id:'summer', title:'Summer of Love', artist:'The Monterey Five', album:'Summer Parade', year:1967, genre:'Rock & Roll', duration:202, base:'#C29C55', ink:'#47342A', accent:'#FFE9A3', number:'04' },
  { id:'midnight', title:'Midnight on Main', artist:'Ruby Valentine', album:'After Dark', year:1965, genre:'Soul', duration:225, base:'#874C58', ink:'#3A2738', accent:'#EFC7AB', number:'05' },
  { id:'lucky', title:'Lucky Little Star', artist:'The Satellites', album:'Dance All Night', year:1962, genre:'Rock & Roll', duration:174, base:'#A9AD80', ink:'#37433D', accent:'#F4E6AD', number:'06' },
];

export const moods: { label: Genre; description: string; color: string }[] = [
  { label:'Soul', description:'Deep & golden', color:'#C86F48' },
  { label:'Rock & Roll', description:'Loud & lively', color:'#D6AE69' },
  { label:'Jazz', description:'After hours', color:'#6A8B8C' },
  { label:'Psychedelic', description:'Far out, baby', color:'#849777' },
];

export const formatTime = (seconds: number) => `${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;
