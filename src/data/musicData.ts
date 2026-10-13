// Seed data for Groove '66 - Authentic 1960s catalog matching design references

export type GenreName = 'Soul' | 'Motown' | 'Surf Rock' | 'Jazz' | 'Psychedelic Rock' | 'British Invasion';

export type Album = {
  id: string;
  title: string;
  artist: string;
  year: number;
  genre: GenreName;
  displayGenre?: string;
  coverType: 'rubber_soul' | 'aretha' | 'pet_sounds' | 'miles' | 'supremes' | 'summer_love' | 'united' | 'songs_in_key';
  labelColor: string;
};

export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumId: string;
  year: number;
  genre: GenreName;
  duration: number; // in seconds
  durationFormatted: string;
  coverType: Album['coverType'];
  labelColor: string;
  side?: string;
  trackNumber?: number;
  lyrics?: string[];
  audioUri?: any;
  fileName?: string;
  fileSize?: number;
  isImported?: boolean;
  isPlayable?: boolean;
  isDemo?: boolean;
};

let vintageTestAudioSource: any = 'file:///assets/audio/groove66-test-vintage.wav';
if (typeof require !== 'undefined' && (typeof (require as any).extensions === 'undefined' || (require as any).extensions['.wav'])) {
  try {
    vintageTestAudioSource = require('../../assets/audio/groove66-test-vintage.wav');
  } catch {}
}

export const LICENSED_TEST_TRACK: Track = {
  id: 'trk-licensed-test',
  title: "Groove '66 Vintage Groove",
  artist: 'Sunset Studio Combo',
  album: 'Summer of Love',
  albumId: 'alb-6',
  year: 1966,
  genre: 'Surf Rock',
  duration: 8,
  durationFormatted: '0:08',
  coverType: 'summer_love',
  labelColor: '#D86F3C',
  side: 'A',
  trackNumber: 1,
  audioUri: vintageTestAudioSource,
  isImported: false,
  isPlayable: true,
  isDemo: false,
  lyrics: [
    '[Original 1960s Studio Session — CC0 / Public Domain]',
    'Warm Tremolo Guitar & Organ in E7 / A7 / B7',
    'Analog Vinyl Warmth & 33⅓ RPM Turntable Calibration',
    'Recorded for Groove \'66 Offline Audio Validation',
  ],
};

export type Playlist = {
  id: string;
  title: string;
  subtitle: string;
  type: 'summer' | 'soul' | 'roadtrip';
  trackCount: number;
};

export const PLAYLISTS: Playlist[] = [
  { id: 'summer-66', title: 'Summer of \'66', subtitle: 'Sun, surf & golden vibes', type: 'summer', trackCount: 16 },
  { id: 'classic-soul', title: 'Classic Soul', subtitle: 'Deep grooves & brass', type: 'soul', trackCount: 22 },
  { id: 'road-trip', title: 'Road Trip Radio', subtitle: 'Cruising the Pacific Highway', type: 'roadtrip', trackCount: 18 },
];

export const GENRES: { id: string; name: GenreName; displayName: string; type: 'soul' | 'motown' | 'surf' | 'jazz' | 'psychedelic' | 'british' }[] = [
  { id: 'soul', name: 'Soul', displayName: 'Soul', type: 'soul' },
  { id: 'motown', name: 'Motown', displayName: 'Motown', type: 'motown' },
  { id: 'surf', name: 'Surf Rock', displayName: 'Surf Rock', type: 'surf' },
  { id: 'jazz', name: 'Jazz', displayName: 'Jazz', type: 'jazz' },
  { id: 'psychedelic', name: 'Psychedelic Rock', displayName: 'Psychedelic Rock', type: 'psychedelic' },
  { id: 'british', name: 'British Invasion', displayName: 'British Invasion', type: 'british' },
];

export const ALBUMS: Album[] = [
  { id: 'alb-1', title: 'Rubber Soul', artist: 'The Beatles', year: 1965, genre: 'British Invasion', displayGenre: 'Rock', coverType: 'rubber_soul', labelColor: '#5C8542' },
  { id: 'alb-2', title: 'I Never Loved a Man The Way I Love You', artist: 'Aretha Franklin', year: 1967, genre: 'Soul', displayGenre: 'Soul', coverType: 'aretha', labelColor: '#D56637' },
  { id: 'alb-3', title: 'Pet Sounds', artist: 'The Beach Boys', year: 1966, genre: 'Surf Rock', displayGenre: 'Pop', coverType: 'pet_sounds', labelColor: '#E59E38' },
  { id: 'alb-4', title: 'Kind of Blue', artist: 'Miles Davis', year: 1959, genre: 'Jazz', displayGenre: 'Jazz', coverType: 'miles', labelColor: '#3A878C' },
  { id: 'alb-5', title: 'More Hits by The Supremes', artist: 'The Supremes', year: 1965, genre: 'Motown', displayGenre: 'Motown', coverType: 'supremes', labelColor: '#C43428' },
  { id: 'alb-6', title: 'Summer of Love', artist: 'The Monterey Five', year: 1967, genre: 'Psychedelic Rock', displayGenre: 'Rock', coverType: 'summer_love', labelColor: '#D86F3C' },
  { id: 'alb-7', title: 'Songs in the Key of Life', artist: 'Stevie Wonder', year: 1976, genre: 'Soul', displayGenre: 'Soul', coverType: 'songs_in_key', labelColor: '#E07052' },
  { id: 'alb-8', title: 'United', artist: 'Marvin Gaye & Tammi Terrell', year: 1967, genre: 'Motown', displayGenre: 'Motown', coverType: 'united', labelColor: '#8C3B4E' },
];

export function isAudioAvailable(track?: Track | null): boolean {
  if (!track) return false;
  return Boolean(track.audioUri) && track.isPlayable !== false;
}

export const TRACKS: Track[] = [
  LICENSED_TEST_TRACK,
  {
    id: 'trk-1',
    title: 'God Only Knows',
    artist: 'The Beach Boys',
    album: 'Pet Sounds',
    albumId: 'alb-3',
    year: 1966,
    genre: 'Surf Rock',
    duration: 175,
    durationFormatted: '2:55',
    coverType: 'pet_sounds',
    labelColor: '#EAC47B',
    side: 'A',
    trackNumber: 8,
    isDemo: true,
    isPlayable: false,
    lyrics: [
      'I may not always love you',
      'But long as there are stars above you',
      'You never need to doubt it',
      'I\'ll make you so sure about it',
      '',
      'God only knows what I\'d be without you',
      '',
      'If you should ever leave me',
      'Though life would still go on, believe me',
      'The world could show nothing to me',
      'So what good would living do me',
      '',
      'God only knows what I\'d be without you',
    ],
  },
  {
    id: 'trk-2',
    title: 'Ain\'t No Mountain High Enough',
    artist: 'Marvin Gaye & Tammi Terrell',
    album: 'United',
    albumId: 'alb-8',
    year: 1967,
    genre: 'Motown',
    duration: 148,
    durationFormatted: '2:28',
    coverType: 'united',
    labelColor: '#8C3B4E',
    side: 'A',
    trackNumber: 1,
    isDemo: true,
    isPlayable: false,
    lyrics: [
      'Listen baby, ain\'t no mountain high',
      'Ain\'t no valley low',
      'Ain\'t no river wide enough baby',
      '',
      'If you need me, call me',
      'No matter where you are',
      'No matter how far',
      'Just call my name, I\'ll be there in a hurry',
      'You don\'t have to worry',
      '',
      'Cause baby there ain\'t no mountain high enough',
      'Ain\'t no valley low enough',
      'Ain\'t no river wide enough',
      'To keep me from getting to you baby',
    ],
  },
  {
    id: 'trk-3',
    title: 'Respect',
    artist: 'Aretha Franklin',
    album: 'I Never Loved a Man The Way I Love You',
    albumId: 'alb-2',
    year: 1967,
    genre: 'Soul',
    duration: 147,
    durationFormatted: '2:27',
    coverType: 'aretha',
    labelColor: '#BD5940',
    side: 'A',
    trackNumber: 1,
    isDemo: true,
    isPlayable: false,
    lyrics: [
      'What you want, baby, I got it',
      'What you need, you know I got it',
      'All I\'m askin\' is for a little respect',
      'When you come home',
      '',
      'R-E-S-P-E-C-T',
      'Find out what it means to me',
      'R-E-S-P-E-C-T',
      'Take care, TCB',
    ],
  },
  {
    id: 'trk-4',
    title: 'Here Comes the Sun',
    artist: 'The Beatles',
    album: 'Abbey Road',
    albumId: 'alb-1',
    year: 1969,
    genre: 'British Invasion',
    duration: 186,
    durationFormatted: '3:06',
    coverType: 'rubber_soul',
    labelColor: '#4E8681',
    side: 'B',
    trackNumber: 1,
    isDemo: true,
    isPlayable: false,
    lyrics: [
      'Here comes the sun, doo-doo-doo-doo',
      'Here comes the sun, and I say',
      'It\'s all right',
      '',
      'Little darling, it\'s been a long cold lonely winter',
      'Little darling, it feels like years since it\'s been here',
      '',
      'Here comes the sun, and I say',
      'It\'s all right',
    ],
  },
  {
    id: 'trk-5',
    title: 'My Girl',
    artist: 'The Temptations',
    album: 'The Temptations Sing Smokey',
    albumId: 'alb-5',
    year: 1965,
    genre: 'Motown',
    duration: 177,
    durationFormatted: '2:57',
    coverType: 'supremes',
    labelColor: '#BD5940',
    side: 'A',
    trackNumber: 1,
    isDemo: true,
    isPlayable: false,
    lyrics: [
      'I\'ve got sunshine on a cloudy day',
      'When it\'s cold outside, I\'ve got the month of May',
      '',
      'I guess you\'d say',
      'What can make me feel this way?',
      'My girl (my girl, my girl)',
      'Talkin\' \'bout my girl (my girl)',
    ],
  },
  {
    id: 'trk-6',
    title: 'California Dreamin\'',
    artist: 'The Mamas & The Papas',
    album: 'If You Can Believe Your Eyes and Ears',
    albumId: 'alb-6',
    year: 1966,
    genre: 'Surf Rock',
    duration: 161,
    durationFormatted: '2:41',
    coverType: 'summer_love',
    labelColor: '#D86F3C',
    side: 'A',
    trackNumber: 2,
    isDemo: true,
    isPlayable: false,
    lyrics: [
      'All the leaves are brown',
      'And the sky is grey',
      'I\'ve been for a walk',
      'On a winter\'s day',
      '',
      'I\'d be safe and warm',
      'If I was in L.A.',
      'California dreamin\'',
      'On such a winter\'s day',
    ],
  },
  {
    id: 'trk-7',
    title: 'So What',
    artist: 'Miles Davis',
    album: 'Kind of Blue',
    albumId: 'alb-4',
    year: 1959,
    genre: 'Jazz',
    duration: 562,
    durationFormatted: '9:22',
    coverType: 'miles',
    labelColor: '#3E5C76',
    side: 'A',
    trackNumber: 1,
    isDemo: true,
    isPlayable: false,
    lyrics: [
      '[Instrumental Modal Jazz Masterpiece]',
      'Featuring:',
      'Miles Davis – Trumpet',
      'John Coltrane – Tenor Saxophone',
      'Cannonball Adderley – Alto Saxophone',
      'Bill Evans – Piano',
      'Paul Chambers – Double Bass',
      'Jimmy Cobb – Drums',
    ],
  },
  {
    id: 'trk-8',
    title: 'In My Life',
    artist: 'The Beatles',
    album: 'Rubber Soul',
    albumId: 'alb-1',
    year: 1965,
    genre: 'British Invasion',
    duration: 147,
    durationFormatted: '2:27',
    coverType: 'rubber_soul',
    labelColor: '#4E8681',
    side: 'B',
    trackNumber: 4,
    isDemo: true,
    isPlayable: false,
    lyrics: [
      'There are places I\'ll remember',
      'All my life, though some have changed',
      'Some forever, not for better',
      'Some have gone, and some remain',
      '',
      'All these places had their moments',
      'With lovers and friends I still can recall',
      'Some are dead and some are living',
      'In my life, I\'ve loved them all',
    ],
  },
];

export const FAVORITE_ALBUMS = [
  { id: 'fav-alb-1', albumId: 'alb-3', title: 'Pet Sounds', artist: 'The Beach Boys', coverType: 'pet_sounds' as const },
  { id: 'fav-alb-2', albumId: 'alb-7', title: 'Songs in the Key...', artist: 'Stevie Wonder', coverType: 'songs_in_key' as const },
  { id: 'fav-alb-3', albumId: 'alb-4', title: 'Kind of Blue', artist: 'Miles Davis', coverType: 'miles' as const },
  { id: 'fav-alb-4', albumId: 'alb-1', title: 'Rubber Soul', artist: 'The Beatles', coverType: 'rubber_soul' as const },
];

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export function getPlaylistTracks(playlistId: string): Track[] {
  if (playlistId === 'summer-66') {
    return [TRACKS[0], TRACKS[5], TRACKS[3]];
  }
  if (playlistId === 'classic-soul') {
    return [TRACKS[1], TRACKS[2], TRACKS[4]];
  }
  if (playlistId === 'road-trip') {
    return [TRACKS[0], TRACKS[3], TRACKS[5], TRACKS[1], TRACKS[7]];
  }
  return TRACKS;
}

export function getArtistTracks(artistName: string): Track[] {
  const norm = artistName.trim().toLowerCase();
  return TRACKS.filter((t) => t.artist.toLowerCase().includes(norm) || norm.includes(t.artist.toLowerCase()));
}

export function getArtistAlbums(artistName: string): Album[] {
  const norm = artistName.trim().toLowerCase();
  return ALBUMS.filter((a) => a.artist.toLowerCase().includes(norm) || norm.includes(a.artist.toLowerCase()));
}
