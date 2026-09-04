import { ArrowLeft, Heart, MessageCircle, Play, Share2, UserPlus } from 'lucide-react';
import { Link, useRoute } from 'wouter';
import { creators } from '@/data/creators';
import { tracks } from '@/data/mockMusic';
import { TrackRow, useSado } from '@/components/sado-shell';

export default function CreatorPage() {
  const [, params] = useRoute('/creator/:id');
  const { t, playTrack } = useSado();
  const creator = creators.find((item) => item.id === params?.id) || creators[0];
  const creatorTracks = tracks.filter((track) => track.artist === creator.name);
  const [first] = creatorTracks;
  return <div className="mx-auto max-w-[1100px] px-5 pb-8 sm:px-8 lg:px-12">
    <Link href="/" className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground"><ArrowLeft size={15} /> {t.nav.home}</Link>
    <section className="rounded-[28px] border border-border bg-card/60 p-6 sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center"><div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-3xl font-extrabold text-primary-foreground">{creator.name.slice(0,1)}</div><div className="min-w-0 flex-1"><p className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-primary">SADO / IJODKOR</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight">{creator.name}</h1><p className="mt-1 text-sm text-muted-foreground">{creator.genre} · {creator.subscribers} {t.subscribers}</p></div><button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-extrabold text-primary-foreground"><UserPlus size={15} /> {t.follow}</button></div>
      <div className="mt-7 grid grid-cols-3 gap-3 border-t border-border pt-5 text-center"><div><p className="text-lg font-extrabold">{creatorTracks.length}</p><p className="text-[10px] text-muted-foreground">{t.songs}</p></div><div><p className="text-lg font-extrabold">{creator.subscribers}</p><p className="text-[10px] text-muted-foreground">{t.subscribers}</p></div><div><p className="text-lg font-extrabold">{creator.posts.length}</p><p className="text-[10px] text-muted-foreground">{t.newPost}</p></div></div>
    </section>
    <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
      <section><h2 className="mb-4 text-xl font-bold">{t.creatorFeed}</h2><div className="space-y-4">{creator.posts.map((post) => <article key={post.id} className="rounded-2xl border border-border bg-card/50 p-5"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground">{creator.name.slice(0,1)}</span><div><p className="text-sm font-bold">{creator.name}</p><p className="text-[10px] text-muted-foreground">{post.time}</p></div></div><p className="mt-4 text-sm leading-6">{post.text}</p><div className="mt-4 flex gap-5 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1"><Heart size={14}/> {post.likes}</span><span className="inline-flex items-center gap-1"><MessageCircle size={14}/> {post.comments}</span><span className="inline-flex items-center gap-1"><Share2 size={14}/> {t.share}</span></div></article>)}</div></section>
      <section><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">{t.songs}</h2>{first && <button type="button" onClick={() => playTrack(first)} className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-2 text-[10px] font-extrabold text-primary-foreground"><Play size={13} fill="currentColor"/> {t.play}</button>}</div><div className="rounded-2xl border border-border bg-card/50 p-2">{creatorTracks.map((track, i) => <TrackRow key={track.id} track={track} index={i} />)}</div></section>
    </div>
  </div>;
}
