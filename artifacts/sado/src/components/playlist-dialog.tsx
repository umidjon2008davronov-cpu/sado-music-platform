import { type FormEvent, useMemo, useState } from 'react';
import { ListMusic, Plus, X } from 'lucide-react';
import { tracks } from '@/data/mockMusic';
import { useSado } from '@/components/sado-shell';

export default function PlaylistDialog() {
  const {
    t,
    playlists,
    playlistDialogOpen,
    playlistDialogTrackId,
    closePlaylistDialog,
    createPlaylist,
    addToPlaylist,
  } = useSado();
  const [name, setName] = useState('');
  const selectedTrack = useMemo(() => tracks.find((track) => track.id === playlistDialogTrackId), [playlistDialogTrackId]);

  if (!playlistDialogOpen) return null;

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const playlist = createPlaylist(name, selectedTrack?.id);
    if (!playlist) return;
    setName('');
    closePlaylistDialog();
  };

  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/75 p-0 backdrop-blur-xl sm:items-center sm:p-6" onMouseDown={(event) => { if (event.currentTarget === event.target) closePlaylistDialog(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="playlist-dialog-title" className="w-full max-w-md rounded-t-[28px] border border-border bg-card p-6 shadow-2xl sm:rounded-[28px]">
      <div className="flex items-start justify-between gap-4">
        <div><p className="mb-2 font-mono-ui text-[10px] uppercase tracking-[.2em] text-primary">{t.playlists}</p><h2 id="playlist-dialog-title" className="text-xl font-extrabold">{selectedTrack ? t.choosePlaylist : t.newPlaylistTitle}</h2>{selectedTrack && <p className="mt-1 text-xs text-muted-foreground">{selectedTrack.title} · {selectedTrack.artist}</p>}</div>
        <button type="button" onClick={closePlaylistDialog} aria-label={t.close} data-testid="button-close-playlist-dialog" className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"><X size={18} /></button>
      </div>
      {playlists.length > 0 && <div className="mt-6 space-y-2">{playlists.map((playlist) => {
        const alreadyAdded = selectedTrack ? playlist.trackIds.includes(selectedTrack.id) : false;
        return <button key={playlist.id} type="button" disabled={alreadyAdded} onClick={() => { if (selectedTrack) addToPlaylist(playlist.id, selectedTrack.id); closePlaylistDialog(); }} data-testid={`button-select-playlist-${playlist.id}`} className="flex w-full items-center gap-3 rounded-xl border border-border bg-secondary/40 px-3 py-3 text-left transition hover:border-primary/40 hover:bg-secondary disabled:cursor-default disabled:opacity-60"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary"><ListMusic size={17} /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{playlist.name}</span><span className="mt-1 block text-[10px] text-muted-foreground">{playlist.trackIds.length} {t.playlistSongCount}</span></span>{alreadyAdded && <span className="text-[10px] font-bold text-primary">{t.savedAction}</span>}</button>;
      })}</div>}
      <form onSubmit={handleCreate} className="mt-5 border-t border-border pt-5">
        <label htmlFor="playlist-name" className="mb-2 block text-xs font-bold text-muted-foreground">{t.playlistName}</label>
        <div className="flex gap-2"><input id="playlist-name" value={name} onChange={(event) => setName(event.target.value)} placeholder={t.playlistNamePlaceholder} data-testid="input-playlist-name" className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-secondary/50 px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/60" /><button type="submit" disabled={!name.trim()} data-testid="button-create-playlist" className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-primary px-3 text-xs font-extrabold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"><Plus size={15} />{t.createPlaylist}</button></div>
        <button type="button" onClick={closePlaylistDialog} data-testid="button-cancel-playlist" className="mt-3 w-full rounded-xl py-2 text-xs font-bold text-muted-foreground hover:bg-secondary">{t.cancel}</button>
      </form>
    </section>
  </div>;
}