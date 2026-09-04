export type Creator = {
  id: string;
  name: string;
  genre: string;
  subscribers: string;
  avatarClass: string;
  posts: { id: string; text: string; time: string; likes: number; comments: number }[];
};

export const creators: Creator[] = [
  { id: 'mavj', name: 'Mavj', genre: 'Indie', subscribers: '12,4 ming', avatarClass: 'bg-primary', posts: [
    { id: 'm1', text: 'Yangi ohang ustida ishlayapman. Bu safar biroz sokinroq.', time: '2 soat oldin', likes: 248, comments: 31 },
    { id: 'm2', text: '“Tongdan oldin” uchun kichik yangilik: yangi namuna tez orada.', time: 'Kecha', likes: 391, comments: 44 },
  ] },
  { id: 'nafas', name: 'Nafas', genre: 'Elektronika', subscribers: '8,7 ming', avatarClass: 'bg-secondary', posts: [
    { id: 'n1', text: 'Yomg‘irli kecha uchun yangi ritm. Qanday tuyuldi?', time: '5 soat oldin', likes: 184, comments: 19 },
  ] },
  { id: 'dilnavoz', name: 'Dilnavoz', genre: 'Akustik', subscribers: '6,2 ming', avatarClass: 'bg-primary/80', posts: [
    { id: 'd1', text: 'Bugun gitara bilan oddiy bir fikrni yozib oldim. Ba’zan kamroq — ko‘proq.', time: '1 kun oldin', likes: 327, comments: 27 },
  ] },
];
