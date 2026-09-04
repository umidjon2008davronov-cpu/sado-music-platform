export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  mood: string;
  duration: string;
  seconds: number;
  colors: [string, string];
  label: string;
  cover: string;
  audio: string;
  keywords: string[];
};

export type Playlist = {
  id: string;
  name: string;
  trackIds: string[];
};

export const tracks: Track[] = [
  { id: 't1', title: 'Sokin shahar', artist: 'Mavj', album: 'Tongdan oldin', genre: 'Indie', mood: 'tinch', duration: '0:18', seconds: 18, colors: ['18 90% 70%', '268 27% 64%'], label: 'Namuna audio', cover: '/covers/t1.svg', audio: '/audio/t1.wav', keywords: ['SADO', 'namuna', 'sokin'] },
  { id: 't2', title: 'Yomg‘ir hidi', artist: 'Nafas', album: 'Oraliq', genre: 'Elektronika', mood: 'yomgirli', duration: '0:20', seconds: 20, colors: ['215 52% 64%', '161 34% 54%'], label: 'Namuna audio', cover: '/covers/t2.svg', audio: '/audio/t2.wav', keywords: ['SADO', 'namuna', 'yomg‘ir'] },
  { id: 't3', title: 'Uyga qaytish', artist: 'Dilnavoz', album: 'Bir kun', genre: 'Akustik', mood: 'yoldagi', duration: '0:16', seconds: 16, colors: ['35 68% 66%', '18 90% 70%'], label: 'Namuna audio', cover: '/covers/t3.svg', audio: '/audio/t3.wav', keywords: ['SADO', 'namuna', 'safar'] },
  { id: 't4', title: 'Tungi yo‘l', artist: 'Qayroq', album: 'Chiroqlar', genre: 'Alternative', mood: 'oqish', duration: '0:22', seconds: 22, colors: ['268 27% 64%', '215 52% 64%'], label: 'Namuna audio', cover: '/covers/t4.svg', audio: '/audio/t4.wav', keywords: ['SADO', 'namuna', 'tun'] },
  { id: 't5', title: 'Oq bulutlar', artist: 'Mavj', album: 'Tongdan oldin', genre: 'Indie', mood: 'yengil', duration: '0:17', seconds: 17, colors: ['161 34% 54%', '35 68% 66%'], label: 'Namuna audio', cover: '/covers/t5.svg', audio: '/audio/t5.wav', keywords: ['SADO', 'namuna', 'bulut'] },
  { id: 't6', title: 'Samarqandda kuz', artist: 'Nafas', album: 'Oraliq', genre: 'Jazz', mood: 'sirli', duration: '0:24', seconds: 24, colors: ['18 90% 70%', '35 68% 66%'], label: 'Namuna audio', cover: '/covers/t6.svg', audio: '/audio/t6.wav', keywords: ['SADO', 'namuna', 'kuz'] },
  { id: 't7', title: 'Ko‘prik ustida', artist: 'Qayroq', album: 'Chiroqlar', genre: 'Alternative', mood: 'tungi', duration: '0:19', seconds: 19, colors: ['215 52% 64%', '268 27% 64%'], label: 'Namuna audio', cover: '/covers/t7.svg', audio: '/audio/t7.wav', keywords: ['SADO', 'namuna', 'shahar'] },
  { id: 't8', title: 'Mayin ovoz', artist: 'Dilnavoz', album: 'Bir kun', genre: 'Akustik', mood: 'diqqat', duration: '0:21', seconds: 21, colors: ['35 68% 66%', '161 34% 54%'], label: 'Namuna audio', cover: '/covers/t8.svg', audio: '/audio/t8.wav', keywords: ['SADO', 'namuna', 'diqqat'] },
];

export const moods = [
  { id: 'tungi', color: '268 27% 64%' },
  { id: 'tinch', color: '18 90% 70%' },
  { id: 'diqqat', color: '161 34% 54%' },
  { id: 'yomgirli', color: '215 52% 64%' },
  { id: 'yoldagi', color: '35 68% 66%' },
  { id: 'oqish', color: '161 34% 54%' },
  { id: 'sirli', color: '268 27% 64%' },
  { id: 'yengil', color: '35 68% 66%' },
] as const;

export const artists = [
  { name: 'Mavj', genre: 'Indie', demoCount: 12 },
  { name: 'Nafas', genre: 'Elektronika', demoCount: 9 },
  { name: 'Dilnavoz', genre: 'Akustik', demoCount: 8 },
  { name: 'Qayroq', genre: 'Alternative', demoCount: 7 },
] as const;