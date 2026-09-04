import { createContext, type CSSProperties, type ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ChevronDown, ChevronLeft, ChevronRight, Heart, Home, Library, ListPlus, Moon, Pause, Play, Plus, Search, SkipBack, SkipForward, Sparkles, Sun, UserRound, Volume2, VolumeX, X } from 'lucide-react';
import type { Copy, Language } from '@/i18n/translations';
import { copy } from '@/i18n/translations';
import { tracks, type Playlist, type Track } from '@/data/mockMusic';
import PlaylistDialog from '@/components/playlist-dialog';

type SadoContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Copy;
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  playerStatus: 'idle' | 'loading' | 'ready' | 'error';
  savedIds: string[];
  historyIds: string[];
  playlists: Playlist[];
  togglePlay: () => void;
  playTrack: (track: Track) => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleSaved: (id: string) => void;
  createPlaylist: (name: string, trackId?: string) => Playlist | null;
  addToPlaylist: (playlistId: string, trackId: string) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
  playlistDialogOpen: boolean;
  playlistDialogTrackId: string | null;
  openPlaylistDialog: (trackId?: string) => void;
  closePlaylistDialog: () => void;
  notify: (message: string) => void;
  notification: string;
  themeDark: boolean;
  setThemeDark: (value: boolean) => void;
  profileName: string;
  setProfileName: (value: string) => void;
};

const SadoContext = createContext<SadoContextValue | null>(null);

function readStored<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function assetSrc(path: string) {
  return path.startsWith('http') ? path : `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}

export function useSado() {
  const context = useContext(SadoContext);
  if (!context) throw new Error('useSado must be used inside SadoProvider');
  return context;
}

export function SadoProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('sado-language') as Language) || 'uz');
  const [themeDark, setThemeDark] = useState(() => readStored('sado-theme-dark', true));
  const [profileName, setProfileName] = useState(() => localStorage.getItem('sado-profile-name') || 'Umid');
  const [currentTrack, setCurrentTrack] = useState<Track | null>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(.72);
  const [playerStatus, setPlayerStatus] = useState<SadoContextValue['playerStatus']>('idle');
  const [savedIds, setSavedIds] = useState<string[]>(() => readStored('sado-saved-ids', []));
  const [historyIds, setHistoryIds] = useState<string[]>(() => readStored('sado-history-ids', []));
  const [playlists, setPlaylists] = useState<Playlist[]>(() => readStored('sado-playlists', []));
  const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);
  const [playlistDialogTrackId, setPlaylistDialogTrackId] = useState<string | null>(null);
  const [notification, setNotification] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const t = copy[language];

  useEffect(() => {
    localStorage.setItem('sado-language', language);
    document.documentElement.lang = language;
  }, [language]);
  useEffect(() => {
    localStorage.setItem('sado-saved-ids', JSON.stringify(savedIds));
  }, [savedIds]);
  useEffect(() => {
    localStorage.setItem('sado-history-ids', JSON.stringify(historyIds));
  }, [historyIds]);
  useEffect(() => {
    localStorage.setItem('sado-playlists', JSON.stringify(playlists));
  }, [playlists]);
  useEffect(() => { localStorage.setItem('sado-theme-dark', JSON.stringify(themeDark)); }, [themeDark]);
  useEffect(() => { if (profileName.trim()) localStorage.setItem('sado-profile-name', profileName.trim()); }, [profileName]);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', themeDark);
    document.documentElement.classList.toggle('light', !themeDark);
  }, [themeDark]);
  useEffect(() => {
    if (!currentTrack) return;
    const audio = new Audio();
    audioRef.current = audio;
    audio.pause();
    setPlayerStatus('loading');
    audio.src = assetSrc(currentTrack.audio);
    audio.volume = volume;
    audio.currentTime = 0;
    setCurrentTime(0);
    const onTime = () => setCurrentTime(audio.currentTime);
    const onReady = () => setPlayerStatus('ready');
    const onError = () => {
      setPlayerStatus('error');
      setIsPlaying(false);
    };
    const onEnd = () => {
      const index = tracks.findIndex((item) => item.id === currentTrack.id);
      const upcoming = tracks[(index + 1) % tracks.length];
      setHistoryIds((ids) => [currentTrack.id, ...ids.filter((id) => id !== currentTrack.id)].slice(0, 8));
      setCurrentTrack(upcoming);
      setIsPlaying(true);
    };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('canplay', onReady);
    audio.addEventListener('playing', onReady);
    audio.addEventListener('error', onError);
    audio.addEventListener('ended', onEnd);
    audio.load();
    if (isPlaying) void audio.play().catch(() => {
      setPlayerStatus('error');
      setIsPlaying(false);
    });
    return () => {
      audio.pause();
      audio.removeAttribute('src');
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('canplay', onReady);
      audio.removeEventListener('playing', onReady);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('ended', onEnd);
    };
  }, [currentTrack]);
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    if (isPlaying) void audioRef.current.play().catch(() => setIsPlaying(false));
    else audioRef.current.pause();
  }, [isPlaying, volume]);
  useEffect(() => {
    if (!notification) return;
    const timer = window.setTimeout(() => setNotification(''), 2400);
    return () => window.clearTimeout(timer);
  }, [notification]);

  const value = useMemo<SadoContextValue>(() => ({
    language, setLanguage, t, currentTrack, isPlaying, currentTime, volume, playerStatus, savedIds, historyIds, playlists,
    togglePlay: () => setIsPlaying((playing) => !playing),
    playTrack: (track) => {
      setCurrentTrack(track);
      setIsPlaying(true);
      setHistoryIds((ids) => [track.id, ...ids.filter((id) => id !== track.id)].slice(0, 8));
    },
    seek: (time) => {
      setCurrentTime(time);
      if (audioRef.current) audioRef.current.currentTime = time;
    },
    setVolume: (next) => setVolumeState(next),
    toggleSaved: (id) => setSavedIds((ids) => {
      const saving = !ids.includes(id);
      setNotification(saving ? t.savedNotice : t.removedNotice);
      return saving ? [...ids, id] : ids.filter((saved) => saved !== id);
    }),
    createPlaylist: (name, trackId) => {
      const cleanName = name.trim();
      if (!cleanName) return null;
      const playlist: Playlist = { id: `playlist-${Date.now()}`, name: cleanName, trackIds: trackId ? [trackId] : [] };
      setPlaylists((items) => [...items, playlist]);
      setNotification(t.playlistCreated);
      return playlist;
    },
    addToPlaylist: (playlistId, trackId) => {
      const playlist = playlists.find((item) => item.id === playlistId);
      if (!playlist || playlist.trackIds.includes(trackId)) return;
      setPlaylists((items) => items.map((item) => item.id === playlistId ? { ...item, trackIds: [...item.trackIds, trackId] } : item));
      setNotification(t.added);
    },
    removeFromPlaylist: (playlistId, trackId) => {
      if (!playlists.some((item) => item.id === playlistId && item.trackIds.includes(trackId))) return;
      setPlaylists((items) => items.map((item) => item.id === playlistId ? { ...item, trackIds: item.trackIds.filter((id) => id !== trackId) } : item));
      setNotification(t.removedFromPlaylist);
    },
    playlistDialogOpen,
    playlistDialogTrackId,
    openPlaylistDialog: (trackId) => {
      setPlaylistDialogTrackId(trackId ?? null);
      setPlaylistDialogOpen(true);
    },
    closePlaylistDialog: () => setPlaylistDialogOpen(false),
    notify: (message) => setNotification(message),
    notification, themeDark, setThemeDark, profileName, setProfileName,
  }), [language, t, currentTrack, isPlaying, currentTime, volume, playerStatus, savedIds, historyIds, playlists, playlistDialogOpen, playlistDialogTrackId, notification, themeDark, profileName]);

  return <SadoContext.Provider value={value}>{children}</SadoContext.Provider>;
}

const nav = [
  { href: '/', key: 'home' as const, icon: Home },
  { href: '/search', key: 'search' as const, icon: Search },
  { href: '/library', key: 'library' as const, icon: Library },
  { href: '/create', key: 'create' as const, icon: Sparkles },
  { href: '/profile', key: 'profile' as const, icon: UserRound },
];

export function SadoShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { t, notification } = useSado();
  const [playerOpen, setPlayerOpen] = useState(false);
  return (
    <div className="sado-noise min-h-[100dvh] bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-sidebar-border bg-sidebar px-5 py-7 lg:flex">
        <Link href="/" className="mb-14 flex items-center gap-3 px-2" data-testid="link-brand">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><span className="h-3 w-3 rounded-full border-2 border-current" /></span>
          <span className="text-xl font-extrabold tracking-[.18em]">SADO</span>
        </Link>
        <p className="mb-3 px-3 font-mono-ui text-[10px] uppercase tracking-[.2em] text-muted-foreground">{t.menu}</p>
        <nav className="space-y-1" aria-label={t.menu}>
          {nav.map(({ href, key, icon: Icon }) => {
            const active = location === href;
            return <Link key={href} href={href} data-testid={`link-nav-${key}`} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${active ? 'bg-sidebar-accent text-primary' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'}`}>
              <Icon size={18} strokeWidth={active ? 2.5 : 1.8} /><span>{t.nav[key]}</span>{key === 'create' && <span className="ml-auto rounded-full border border-border px-1.5 py-0.5 font-mono-ui text-[8px] uppercase text-muted-foreground">AI</span>}
            </Link>;
          })}
        </nav>
        <div className="mt-auto rounded-2xl border border-border bg-card/60 p-4">
          <div className="mb-3 flex items-center justify-between"><span className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-muted-foreground">SADO</span><span className="h-1.5 w-1.5 rounded-full bg-primary" /></div>
          <p className="text-xs leading-relaxed text-muted-foreground">Tovushlar orasida o‘zingiz uchun joy.</p>
        </div>
      </aside>
      <main className="pb-[102px] lg:ml-[248px] lg:pb-[92px]">{children}</main>
      <PlayerBar onExpand={() => setPlayerOpen(true)} />
      <nav className="fixed inset-x-0 bottom-0 z-30 flex h-[74px] items-center justify-around border-t border-border bg-sidebar/95 px-2 backdrop-blur-xl lg:hidden" aria-label={t.mobileMenu}>
        {nav.map(({ href, key, icon: Icon }) => {
          const active = location === href;
          return <Link key={href} href={href} data-testid={`link-mobile-nav-${key}`} className={`flex min-w-[58px] flex-col items-center gap-1.5 py-2 text-[10px] font-semibold ${active ? 'text-primary' : 'text-muted-foreground'}`}><Icon size={19} strokeWidth={active ? 2.5 : 1.8} /><span>{t.nav[key]}</span></Link>;
        })}
      </nav>
      {notification && <div role="status" data-testid="status-notification" className="fixed bottom-[90px] left-1/2 z-50 -translate-x-1/2 rounded-full border border-primary/30 bg-card px-4 py-2.5 text-xs font-semibold text-primary shadow-lg lg:bottom-[108px]">{notification}</div>}
      {playerOpen && <FullPlayer onClose={() => setPlayerOpen(false)} />}
      <PlaylistDialog />
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description?: string; children?: ReactNode }) {
  const { language, setLanguage, t } = useSado();
  return <header className="flex items-start justify-between gap-5 px-5 pb-7 pt-7 sm:px-8 sm:pt-9 lg:px-12 lg:pt-12">
    <div className="sado-enter"><p className="mb-2 font-mono-ui text-[10px] uppercase tracking-[.22em] text-primary">{eyebrow || 'SADO'}</p><h1 className="text-3xl font-extrabold tracking-[-.04em] sm:text-4xl">{title}</h1>{description && <p className="mt-2 max-w-xl text-sm text-muted-foreground">{description}</p>}</div>
    <div className="flex items-center gap-2">{children}<label className="relative"><span className="sr-only">{t.language}</span><select value={language} onChange={(event) => setLanguage(event.target.value as Language)} aria-label={t.language} data-testid="select-language-header" className="h-9 max-w-[120px] appearance-none rounded-full border border-border bg-secondary px-3 pr-7 text-[11px] font-bold text-muted-foreground"><option value="uz">{t.languageNames.uz}</option><option value="ru">{t.languageNames.ru}</option><option value="en">{t.languageNames.en}</option></select><ChevronDown size={12} className="pointer-events-none absolute right-2 top-3 text-muted-foreground" /></label></div>
  </header>;
}

function CoverArt({ track, size = 'md' }: { track: Track; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'h-11 w-11 rounded-lg', md: 'aspect-square w-full rounded-2xl', lg: 'h-[min(58vw,420px)] w-[min(58vw,420px)] rounded-[28px]' };
  return <div className={`art-cover flex shrink-0 items-end ${sizes[size]} bg-[hsl(225_20%_18%)]`} style={{ '--art-a': track.colors[0], '--art-b': track.colors[1] } as React.CSSProperties}>
    <img src={assetSrc(track.cover)} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
    <div className="absolute inset-0 opacity-50" style={{ background: `linear-gradient(135deg, hsl(${track.colors[0]} / .24), transparent 55%), repeating-linear-gradient(135deg, transparent 0 11px, hsl(${track.colors[1]} / .18) 12px 13px)` }} />
    <span className="relative z-10 p-3 font-display text-2xl italic text-background/75 sm:text-3xl">{track.title.slice(0, 1)}</span>
  </div>;
}

export function TrackRow({ track, index, compact = false }: { track: Track; index?: number; compact?: boolean }) {
  const { t, currentTrack, isPlaying, playTrack, togglePlay, toggleSaved, savedIds, openPlaylistDialog } = useSado();
  const active = currentTrack?.id === track.id;
  return <div data-testid={`row-track-${track.id}`} className={`group flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-secondary/70 ${active ? 'bg-secondary/50' : ''}`}>
    {index !== undefined && <span className="hidden w-5 text-center font-mono-ui text-[11px] text-muted-foreground sm:block">{String(index + 1).padStart(2, '0')}</span>}
    <button type="button" onClick={() => active ? togglePlay() : playTrack(track)} aria-label={active && isPlaying ? t.pause : t.play} data-testid={`button-play-${track.id}`} className="relative shrink-0">
      <CoverArt track={track} size="sm" />{active && <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/45 text-primary">{isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}</span>}
    </button>
    <button type="button" onClick={() => playTrack(track)} className="min-w-0 flex-1 text-left" data-testid={`button-track-${track.id}`}><p className={`truncate text-sm font-semibold ${active ? 'text-primary' : 'text-foreground'}`}>{track.title}</p><p className="truncate text-xs text-muted-foreground">{track.artist} · {track.album}</p></button>
     {!compact && <span className="hidden font-mono-ui text-[10px] text-muted-foreground md:block">{t.genreNames[track.genre as keyof typeof t.genreNames]}</span>}
    <span className="font-mono-ui text-[10px] text-muted-foreground">{track.duration}</span>
     <button type="button" onClick={() => toggleSaved(track.id)} aria-label={savedIds.includes(track.id) ? t.savedAction : t.saveAction} aria-pressed={savedIds.includes(track.id)} title={savedIds.includes(track.id) ? t.savedAction : t.saveAction} data-testid={`button-save-${track.id}`} className={`rounded-full p-2 transition hover:bg-primary/10 ${savedIds.includes(track.id) ? 'text-primary' : 'text-muted-foreground sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100'}`}><Heart size={16} fill={savedIds.includes(track.id) ? 'currentColor' : 'none'} /></button>
     {!compact && <button type="button" onClick={() => openPlaylistDialog(track.id)} aria-label={t.addPlaylist} title={t.addPlaylist} data-testid={`button-add-playlist-${track.id}`} className="rounded-full p-2 text-muted-foreground transition hover:bg-primary/10 hover:text-primary"><ListPlus size={16} /></button>}
  </div>;
}

export function TrackCard({ track }: { track: Track }) {
  const { t, currentTrack, isPlaying, playTrack, togglePlay, toggleSaved, savedIds, openPlaylistDialog } = useSado();
  const active = currentTrack?.id === track.id;
  return <article className="group min-w-0">
    <button type="button" onClick={() => active ? togglePlay() : playTrack(track)} data-testid={`button-card-play-${track.id}`} className="relative mb-3 block w-full text-left">
      <CoverArt track={track} size="md" />
      <span className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-1 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-lg transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">{active && isPlaying ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}</span>
      <span className="absolute left-3 top-3 rounded-full bg-background/60 px-2 py-1 font-mono-ui text-[9px] uppercase tracking-wider text-foreground backdrop-blur">{t.demo}</span>
    </button>
     <div className="flex items-start gap-1"><button type="button" onClick={() => playTrack(track)} className="min-w-0 flex-1 text-left" data-testid={`button-card-title-${track.id}`}><p className="truncate text-sm font-bold">{track.title}</p><p className="truncate text-xs text-muted-foreground">{track.artist}</p></button><button type="button" onClick={() => toggleSaved(track.id)} data-testid={`button-card-save-${track.id}`} aria-label={savedIds.includes(track.id) ? t.savedAction : t.saveAction} aria-pressed={savedIds.includes(track.id)} title={savedIds.includes(track.id) ? t.savedAction : t.saveAction} className={`rounded-full p-1.5 ${savedIds.includes(track.id) ? 'text-primary' : 'text-muted-foreground'}`}><Heart size={15} fill={savedIds.includes(track.id) ? 'currentColor' : 'none'} /></button><button type="button" onClick={() => openPlaylistDialog(track.id)} data-testid={`button-card-playlist-${track.id}`} aria-label={t.addPlaylist} title={t.addPlaylist} className="rounded-full p-1.5 text-muted-foreground hover:text-primary"><ListPlus size={15} /></button></div>
  </article>;
}

function PlayerBar({ onExpand }: { onExpand: () => void }) {
  const { t, currentTrack, isPlaying, currentTime, volume, playerStatus, savedIds, togglePlay, seek, setVolume, playTrack, toggleSaved } = useSado();
  if (!currentTrack) return null;
  const progress = Math.min(100, currentTime / currentTrack.seconds * 100);
  const next = () => {
    const index = tracks.findIndex((item) => item.id === currentTrack.id);
    const upcoming = tracks[(index + 1) % tracks.length];
    playTrack(upcoming);
  };
  const previous = () => {
    const index = tracks.findIndex((item) => item.id === currentTrack.id);
    playTrack(tracks[(index - 1 + tracks.length) % tracks.length]);
  };
  return <div className="fixed bottom-[74px] left-0 right-0 z-20 border-t border-border bg-sidebar/95 px-3 py-2 backdrop-blur-xl lg:bottom-0 lg:left-[248px] lg:px-6">
    <div className="mx-auto flex max-w-[1500px] items-center gap-3">
       <button type="button" onClick={onExpand} className="flex min-w-0 flex-1 items-center gap-3 text-left lg:w-[260px] lg:flex-none" data-testid="button-open-player"><CoverArt track={currentTrack} size="sm" /><span className="min-w-0"><span className="block truncate text-xs font-bold">{currentTrack.title}</span><span className="block truncate text-[10px] text-muted-foreground">{playerStatus === 'loading' ? t.loading : playerStatus === 'error' ? t.audioError : `${currentTrack.artist} · ${t.demo}`}</span></span></button>
      <div className="hidden flex-1 items-center gap-4 lg:flex"><button type="button" onClick={previous} aria-label={t.previous} data-testid="button-previous"><SkipBack size={16} /></button><button type="button" onClick={togglePlay} aria-label={isPlaying ? t.pause : t.play} data-testid="button-player-play" className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">{isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}</button><button type="button" onClick={next} aria-label={t.next} data-testid="button-next"><SkipForward size={16} /></button><span className="font-mono-ui text-[10px] text-muted-foreground">{formatTime(currentTime)}</span><input aria-label={t.progress} data-testid="input-progress" type="range" min="0" max={currentTrack.seconds} value={currentTime} onChange={(event) => seek(Number(event.target.value))} className="player-progress h-1 flex-1 cursor-pointer appearance-none rounded-full" style={{ '--progress': `${progress}%` } as CSSProperties} /><span className="font-mono-ui text-[10px] text-muted-foreground">{currentTrack.duration}</span></div>
       <div className="flex items-center gap-1 lg:w-[220px] lg:flex-none lg:justify-end"><button type="button" onClick={() => toggleSaved(currentTrack.id)} aria-label={savedIds.includes(currentTrack.id) ? t.savedAction : t.saveAction} aria-pressed={savedIds.includes(currentTrack.id)} title={savedIds.includes(currentTrack.id) ? t.savedAction : t.saveAction} data-testid="button-player-save" className={`rounded-full p-2 transition hover:bg-primary/10 ${savedIds.includes(currentTrack.id) ? 'text-primary' : 'text-muted-foreground'}`}><Heart size={17} fill={savedIds.includes(currentTrack.id) ? 'currentColor' : 'none'} /></button><button type="button" onClick={togglePlay} aria-label={isPlaying ? t.pause : t.play} data-testid="button-mobile-play" className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground lg:hidden">{isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}</button><button type="button" onClick={() => setVolume(volume > 0 ? 0 : .72)} aria-label={t.volume} data-testid="button-volume" className="hidden text-muted-foreground lg:block">{volume > 0 ? <Volume2 size={17} /> : <VolumeX size={17} />}</button><input type="range" min="0" max="1" step=".01" value={volume} onChange={(event) => setVolume(Number(event.target.value))} aria-label={t.volume} data-testid="input-volume" className="hidden w-20 accent-primary lg:block" /><button type="button" onClick={onExpand} aria-label={t.openPlayer} data-testid="button-expand-player" className="rounded-full p-2 text-muted-foreground hover:text-foreground"><ChevronDown size={17} className="rotate-180" /></button></div>
    </div>
  </div>;
}

function FullPlayer({ onClose }: { onClose: () => void }) {
  const { t, currentTrack, isPlaying, currentTime, volume, playerStatus, savedIds, togglePlay, seek, setVolume, playTrack, toggleSaved } = useSado();
  if (!currentTrack) return null;
  const progress = currentTime / currentTrack.seconds * 100;
  const previous = () => {
    const index = tracks.findIndex((item) => item.id === currentTrack.id);
    playTrack(tracks[(index - 1 + tracks.length) % tracks.length]);
  };
  const next = () => {
    const index = tracks.findIndex((item) => item.id === currentTrack.id);
    playTrack(tracks[(index + 1) % tracks.length]);
  };
  return <div className="fixed inset-0 z-40 flex items-end justify-center bg-background/75 p-0 backdrop-blur-xl sm:items-center sm:p-6"><section className="relative flex min-h-[88dvh] w-full max-w-[560px] flex-col items-center justify-center rounded-t-[32px] border border-border bg-card px-6 py-8 shadow-2xl sm:min-h-0 sm:rounded-[32px] sm:py-12">
    <button type="button" onClick={onClose} aria-label={t.closePlayer} data-testid="button-close-player" className="absolute right-5 top-5 rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"><X size={19} /></button>
     <p className="mb-8 font-mono-ui text-[10px] uppercase tracking-[.2em] text-muted-foreground">{t.nowPlaying}</p><CoverArt track={currentTrack} size="lg" /><div className="mt-8 flex w-full items-end justify-between"><div><p className="text-2xl font-extrabold">{currentTrack.title}</p><p className="mt-1 text-sm text-muted-foreground">{currentTrack.artist} · {currentTrack.album}</p><p className={`mt-2 text-xs ${playerStatus === 'error' ? 'text-destructive' : 'text-muted-foreground'}`}>{playerStatus === 'loading' ? t.loading : playerStatus === 'error' ? t.audioError : t.demo}</p></div><button type="button" onClick={() => toggleSaved(currentTrack.id)} aria-label={savedIds.includes(currentTrack.id) ? t.savedAction : t.saveAction} aria-pressed={savedIds.includes(currentTrack.id)} title={savedIds.includes(currentTrack.id) ? t.savedAction : t.saveAction} data-testid="button-full-save" className={`rounded-full p-2 transition hover:bg-primary/10 ${savedIds.includes(currentTrack.id) ? 'text-primary' : 'text-muted-foreground'}`}><Heart size={22} fill={savedIds.includes(currentTrack.id) ? 'currentColor' : 'none'} /></button></div><div className="mt-8 w-full"><input type="range" min="0" max={currentTrack.seconds} value={currentTime} onChange={(event) => seek(Number(event.target.value))} aria-label={t.progress} data-testid="input-full-progress" className="player-progress h-1 w-full appearance-none rounded-full accent-primary" style={{ '--progress': `${progress}%` } as CSSProperties} /><div className="mt-2 flex justify-between font-mono-ui text-[10px] text-muted-foreground"><span>{formatTime(currentTime)}</span><span>{currentTrack.duration}</span></div></div><div className="mt-8 flex items-center gap-8"><button type="button" onClick={previous} aria-label={t.previous} data-testid="button-full-previous"><ChevronLeft size={20} /></button><button type="button" onClick={togglePlay} aria-label={isPlaying ? t.pause : t.play} data-testid="button-full-play" className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20">{isPlaying ? <Pause size={23} fill="currentColor" /> : <Play size={23} fill="currentColor" />}</button><button type="button" onClick={next} aria-label={t.next} data-testid="button-full-next"><ChevronRight size={20} /></button></div><div className="mt-9 flex w-full items-center gap-3 text-muted-foreground"><VolumeX size={15} /><input type="range" min="0" max="1" step=".01" value={volume} onChange={(event) => setVolume(Number(event.target.value))} aria-label={t.volume} data-testid="input-full-volume" className="w-full accent-primary" /><Volume2 size={15} /></div>
  </section></div>;
}

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
}

export { CoverArt };
