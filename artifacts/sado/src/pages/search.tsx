import { Check, Filter, ListMusic, Search as SearchIcon, SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { tracks } from '@/data/mockMusic';
import { PageHeader, TrackRow, useSado } from '@/components/sado-shell';

const genres = ['Barchasi', 'Indie', 'Elektronika', 'Akustik', 'Alternative', 'Jazz'];
type ContentType = 'all' | 'songs' | 'artists' | 'albums' | 'playlists';

export default function SearchPage() {
  const { t, playlists } = useSado();
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get('query') ?? '');
  const [genre, setGenre] = useState('Barchasi');
  const [contentType, setContentType] = useState<ContentType>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const results = useMemo(() => tracks.filter((track) => {
    const needle = query.toLocaleLowerCase();
    const searchable = contentType === 'songs' ? track.title : contentType === 'artists' ? track.artist : contentType === 'albums' ? track.album : [track.title, track.artist, track.album, track.genre, ...track.keywords].join(' ');
    const matchesQuery = contentType !== 'playlists' && (!needle || searchable.toLocaleLowerCase().includes(needle));
    return matchesQuery && (genre === 'Barchasi' || track.genre === genre);
  }), [query, genre, contentType]);
  const playlistResults = useMemo(() => playlists.filter((playlist) => playlist.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())), [playlists, query]);
  const contentTypes: { id: ContentType; label: string }[] = [
    { id: 'all', label: t.all },
    { id: 'songs', label: t.songs },
    { id: 'artists', label: t.artists },
    { id: 'albums', label: t.albums },
    { id: 'playlists', label: t.playlists },
  ];
  return <div className="mx-auto max-w-[1500px]">
    <PageHeader eyebrow="SADO / 02" title={t.searchTitle} description={t.searchIntro} />
    <div className="px-5 sm:px-8 lg:px-12">
      <div className="relative flex items-center rounded-2xl border border-border bg-card px-4 focus-within:border-primary/60"><SearchIcon size={18} className="text-muted-foreground" /><input autoFocus type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchPlaceholder} data-testid="input-search" className="h-14 w-full bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground" />{query && <button type="button" onClick={() => setQuery('')} aria-label={t.clearSearch} data-testid="button-clear-search" className="rounded-full p-1 text-muted-foreground hover:text-foreground"><X size={16} /></button>}<kbd className="hidden rounded-md border border-border px-2 py-1 font-mono-ui text-[10px] text-muted-foreground sm:block">⌘ K</kbd></div>
      <div className="mt-7 flex flex-wrap gap-2" role="tablist" aria-label={t.filter}>{contentTypes.map((item) => <button type="button" role="tab" aria-selected={contentType === item.id} key={item.id} onClick={() => setContentType(item.id)} data-testid={`button-content-${item.id}`} className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition ${contentType === item.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-secondary/40 text-muted-foreground hover:text-foreground'}`}>{item.label}</button>)}</div>
      <div className="mt-3 flex flex-wrap items-center gap-2"><div className="flex items-center gap-2 text-xs font-bold text-muted-foreground"><Filter size={15} />{t.filter}</div>{genres.map((item) => <button type="button" key={item} onClick={() => setGenre(item)} data-testid={`button-filter-${item.toLowerCase()}`} className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition ${genre === item ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-secondary/40 text-muted-foreground hover:text-foreground'}`}>{t.genreNames[item as keyof typeof t.genreNames]}</button>)}<button type="button" onClick={() => setFilterOpen((open) => !open)} data-testid="button-more-filters" className={`ml-auto flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-xs font-semibold text-muted-foreground ${filterOpen ? 'bg-secondary text-foreground' : ''}`}><SlidersHorizontal size={14} />{t.filter}</button></div>
      {filterOpen && <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-secondary/50 p-3 text-xs text-muted-foreground"><span>{t.demoCatalog}</span><span className="rounded-full bg-primary/15 px-2 py-1 text-primary">{t.openAudio}</span><span className="ml-auto flex items-center gap-1 text-primary"><Check size={13} /> {t.activeNow}</span></div>}
       <div className="mt-10 flex items-end justify-between"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-muted-foreground">{query ? `${contentType === 'playlists' ? playlistResults.length : results.length} ${t.resultsCount}` : t.demoCatalog}</p><h2 className="mt-2 text-xl font-bold">{contentType === 'artists' ? t.artists : contentType === 'albums' ? t.albums : contentType === 'playlists' ? t.playlists : t.songs}</h2></div></div>
       {contentType === 'playlists' ? playlistResults.length > 0 ? <div className="mt-4 space-y-2 rounded-2xl border border-border bg-card/45 p-2">{playlistResults.map((playlist) => <div key={playlist.id} className="flex items-center gap-3 rounded-xl px-2 py-3"><div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary"><ListMusicIcon /></div><div className="min-w-0"><p className="truncate text-sm font-semibold">{playlist.name}</p><p className="text-xs text-muted-foreground">{playlist.trackIds.length} {t.playlistSongCount}</p></div></div>)}</div> : <NoResults t={t} onReset={() => { setQuery(''); setGenre('Barchasi'); setContentType('all'); }} /> : results.length > 0 ? <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card/45 p-2">{results.map((track, index) => <TrackRow key={track.id} track={track} index={index} />)}</div> : <NoResults t={t} onReset={() => { setQuery(''); setGenre('Barchasi'); setContentType('all'); }} />}
    </div>
  </div>;
}

function NoResults({ t, onReset }: { t: ReturnType<typeof useSado>['t']; onReset: () => void }) {
  return <div className="mt-4 flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/30 px-6 text-center"><div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground"><SearchIcon size={22} /></div><h3 className="font-bold">{t.noResults}</h3><p className="mt-2 max-w-sm text-sm text-muted-foreground">{t.noResultsHint}</p><button type="button" onClick={onReset} data-testid="button-reset-search" className="mt-5 text-xs font-bold text-primary">{t.resetFilters}</button></div>;
}

function ListMusicIcon() {
  return <span aria-hidden="true"><ListMusic size={17} /></span>;
}