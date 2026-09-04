import { Clock3, Heart, ListMusic, Music2, Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import { tracks, type Playlist } from '@/data/mockMusic';
import { CoverArt, PageHeader, TrackRow, useSado } from '@/components/sado-shell';

export default function LibraryPage() {
  const { t, savedIds, historyIds, playlists, openPlaylistDialog } = useSado();
  const saved = tracks.filter((track) => savedIds.includes(track.id));
  const recent = tracks.filter((track) => historyIds.includes(track.id));
  return <div className="mx-auto max-w-[1500px]">
    <PageHeader eyebrow="SADO / 03" title={t.libraryTitle} description={t.libraryIntro} />
    <div className="space-y-11 px-5 sm:px-8 lg:px-12">
       <section><div className="mb-5 flex items-center gap-3"><Heart size={18} className="text-primary" /><h2 className="text-lg font-bold">{t.favorites}</h2><span className="font-mono-ui text-[10px] text-muted-foreground">{saved.length}</span></div>{saved.length ? <div className="rounded-2xl border border-border bg-card/45 p-2">{saved.map((track, index) => <TrackRow key={track.id} track={track} index={index} />)}</div> : <EmptyState icon={<Heart size={22} />} title={t.emptySaved} hint={t.emptyHint} />}</section>
       <section><div className="mb-5 flex items-center justify-between"><div className="flex items-center gap-3"><ListMusic size={18} className="text-primary" /><h2 className="text-lg font-bold">{t.playlists}</h2></div><button type="button" onClick={() => openPlaylistDialog()} data-testid="button-new-playlist" className="flex items-center gap-2 rounded-full border border-primary/40 px-3 py-2 text-xs font-bold text-primary transition hover:bg-primary/10"><Plus size={14} /> {t.newPlaylist}</button></div>{playlists.length ? <div className="grid gap-3 sm:grid-cols-2">{playlists.map((playlist) => <PlaylistCard key={playlist.id} playlist={playlist} />)}</div> : <EmptyState icon={<ListMusic size={22} />} title={t.noPlaylists} hint={t.noPlaylistsHint} />}</section>
      <section><div className="mb-5 flex items-center gap-3"><Clock3 size={18} className="text-primary" /><h2 className="text-lg font-bold">{t.recent}</h2></div>{recent.length ? <div className="rounded-2xl border border-border bg-card/45 p-2">{recent.map((track, index) => <TrackRow key={track.id} track={track} index={index} />)}</div> : <EmptyState icon={<Clock3 size={22} />} title={t.emptyRecent} hint={t.recentHint} />}</section>
    </div>
  </div>;
}

function PlaylistCard({ playlist }: { playlist: Playlist }) {
  const { t } = useSado();
  const playlistTracks = playlist.trackIds.map((id) => tracks.find((track) => track.id === id)).filter((track): track is typeof tracks[number] => Boolean(track));
  const previewTracks = (playlistTracks.length ? playlistTracks : tracks).slice(0, 4);
  return <article className="rounded-2xl border border-border bg-card/45 p-3"><div className="flex items-center gap-4"><div className="grid h-16 w-16 shrink-0 grid-cols-2 gap-0.5 overflow-hidden rounded-xl bg-border">{previewTracks.map((track) => <CoverArt key={track.id} track={track} size="sm" />)}</div><div className="min-w-0"><p className="truncate font-bold">{playlist.name}</p><p className="mt-1 text-xs text-muted-foreground">{playlist.trackIds.length} {t.playlistSongCount}</p></div><Music2 size={16} className="ml-auto shrink-0 text-muted-foreground" /></div>{playlistTracks.length > 0 && <div className="mt-3 border-t border-border pt-2">{playlistTracks.slice(0, 3).map((track, index) => <TrackRow key={track.id} track={track} index={index} compact />)}</div>}</article>;
}

function EmptyState({ icon, title, hint }: { icon: ReactNode; title: string; hint: string }) {
  return <div className="flex min-h-[185px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/25 px-6 text-center"><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">{icon}</div><h3 className="text-sm font-bold">{title}</h3><p className="mt-2 max-w-sm text-xs leading-5 text-muted-foreground">{hint}</p></div>;
}