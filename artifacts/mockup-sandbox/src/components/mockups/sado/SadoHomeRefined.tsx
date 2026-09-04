import { useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Clock3,
  Heart,
  Home,
  Library,
  ListMusic,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Search,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Volume2,
  Waves,
} from "lucide-react";
import "./SadoHomeRefined.css";

type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  mood: string;
  colorA: string;
  colorB: string;
  tone: string;
};

const songs: Song[] = [
  {
    id: "sokin",
    title: "Sokin shahar",
    artist: "Mavj",
    album: "Tongdan oldin",
    duration: "3:42",
    mood: "Tinch",
    colorA: "#f39b7a",
    colorB: "#8174a8",
    tone: "amber",
  },
  {
    id: "yomgir",
    title: "Yomg‘ir hidi",
    artist: "Nafas",
    album: "Oraliq",
    duration: "4:18",
    mood: "Yomg‘irli",
    colorA: "#7097be",
    colorB: "#5a9c8e",
    tone: "blue",
  },
  {
    id: "qaytish",
    title: "Uyga qaytish",
    artist: "Dilnavoz",
    album: "Bir kun",
    duration: "3:07",
    mood: "Yo‘ldagi",
    colorA: "#d49a57",
    colorB: "#dd7469",
    tone: "sunset",
  },
  {
    id: "tungi",
    title: "Tungi yo‘l",
    artist: "Qayroq",
    album: "Chiroqlar",
    duration: "4:56",
    mood: "Oqish",
    colorA: "#9c83b8",
    colorB: "#607fa1",
    tone: "violet",
  },
  {
    id: "bulut",
    title: "Oq bulutlar",
    artist: "Mavj",
    album: "Tongdan oldin",
    duration: "2:51",
    mood: "Yengil",
    colorA: "#69a692",
    colorB: "#c8a164",
    tone: "sage",
  },
  {
    id: "samarqand",
    title: "Samarqandda kuz",
    artist: "Nafas",
    album: "Oraliq",
    duration: "5:12",
    mood: "Sirli",
    colorA: "#ef9670",
    colorB: "#c7a05a",
    tone: "rust",
  },
];

const moods = [
  { label: "Tinch", note: "sekin tonglar", color: "#e7a07e" },
  { label: "Yomg‘irli", note: "oyna ortida", color: "#7097be" },
  { label: "Yo‘ldagi", note: "harakat uchun", color: "#d49a57" },
  { label: "Sirli", note: "kechki shahar", color: "#9c83b8" },
];

function Cover({
  song,
  size = "small",
  playing = false,
}: {
  song: Song;
  size?: "small" | "medium" | "large";
  playing?: boolean;
}) {
  return (
    <div
      className={`sr-cover sr-cover-${size} sr-cover-${song.tone}`}
      style={{ "--cover-a": song.colorA, "--cover-b": song.colorB } as React.CSSProperties}
      aria-label={`${song.title} cover`}
      role="img"
    >
      <span className="sr-cover-grid" />
      <span className="sr-cover-orbit sr-orbit-one" />
      <span className="sr-cover-orbit sr-orbit-two" />
      <span className="sr-cover-letter">{song.title.slice(0, 1)}</span>
      {playing && <span className="sr-playing-bars"><i /><i /><i /><i /></span>}
    </div>
  );
}

function PlayButton({
  playing,
  onClick,
  large = false,
  label,
}: {
  playing: boolean;
  onClick: () => void;
  large?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      className={`sr-play-button ${large ? "sr-play-button-large" : ""}`}
      onClick={onClick}
      aria-label={label}
    >
      {playing ? <Pause size={large ? 18 : 14} fill="currentColor" /> : <Play size={large ? 18 : 14} fill="currentColor" />}
    </button>
  );
}

export function SadoHomeRefined() {
  const [activeNav, setActiveNav] = useState("Home");
  const [activeMood, setActiveMood] = useState("Tinch");
  const [currentId, setCurrentId] = useState("sokin");
  const [playing, setPlaying] = useState(false);
  const [search, setSearch] = useState("");
  const [liked, setLiked] = useState<string[]>(["qaytish"]);
  const current = songs.find((song) => song.id === currentId) ?? songs[0];

  const filteredSongs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return songs;
    return songs.filter((song) =>
      `${song.title} ${song.artist} ${song.album}`.toLowerCase().includes(query),
    );
  }, [search]);

  const chooseSong = (song: Song) => {
    setCurrentId(song.id);
    setPlaying(true);
  };

  const toggleLiked = (id: string) => {
    setLiked((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));
  };

  return (
    <div className="sr-app">
      <aside className="sr-sidebar">
        <div className="sr-brand">
          <span className="sr-brand-mark"><span /></span>
          <span>SADO</span>
        </div>

        <div className="sr-sidebar-label">Menyu</div>
        <nav className="sr-nav" aria-label="Asosiy menyu">
          {[
            { label: "Home", icon: Home },
            { label: "Search", icon: Search },
            { label: "Library", icon: Library },
          ].map(({ label, icon: Icon }) => (
            <button
              type="button"
              key={label}
              className={`sr-nav-item ${activeNav === label ? "is-active" : ""}`}
              onClick={() => setActiveNav(label)}
            >
              <Icon size={17} strokeWidth={activeNav === label ? 2.3 : 1.8} />
              <span>{label === "Home" ? "Bosh sahifa" : label === "Search" ? "Qidiruv" : "Kutubxona"}</span>
              {label === "Library" && <span className="sr-nav-count">12</span>}
            </button>
          ))}
        </nav>

        <div className="sr-sidebar-label sr-playlist-label">Sizning joyingiz</div>
        <nav className="sr-nav sr-secondary-nav" aria-label="Pleylistlar">
          <button type="button" className="sr-nav-item" onClick={() => setActiveNav("Liked")}>
            <Heart size={17} strokeWidth={1.8} className={activeNav === "Liked" ? "is-liked" : ""} />
            <span>Sevimlilar</span>
            <span className="sr-nav-count">{liked.length}</span>
          </button>
          <button type="button" className="sr-nav-item" onClick={() => setActiveNav("Playlist")}>
            <ListMusic size={17} strokeWidth={1.8} />
            <span>Tonggi yo‘l</span>
          </button>
          <button type="button" className="sr-nav-item sr-add-playlist" onClick={() => setActiveNav("New playlist")}>
            <Plus size={17} strokeWidth={1.8} />
            <span>Yangi pleylist</span>
          </button>
        </nav>

        <div className="sr-side-note">
          <span className="sr-note-live"><i /> SADO / 2024</span>
          <p>Tovushlar orasida o‘zingiz uchun joy.</p>
          <button type="button" onClick={() => setActiveNav("Settings")}><Settings2 size={14} /> Sozlamalar</button>
        </div>
      </aside>

      <main className="sr-main">
        <header className="sr-header">
          <div className="sr-breadcrumb">
            <span>COLLECTION</span><span className="sr-slash">/</span><strong>{activeNav === "Home" ? "HOME" : activeNav.toUpperCase()}</strong>
          </div>
          <div className="sr-header-actions">
            <label className="sr-search">
              <Search size={15} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Qo‘shiq yoki ijrochi izlash"
                aria-label="Qo‘shiq yoki ijrochi izlash"
              />
              <kbd>⌘ K</kbd>
            </label>
            <button type="button" className="sr-avatar" onClick={() => setActiveNav("Profile")} aria-label="Profil">S</button>
          </div>
        </header>

        <div className="sr-content">
          <section className="sr-intro">
            <div>
              <div className="sr-eyebrow"><i /> SADO / 01 — SHAXSIY OQIM</div>
              <h1>Assalomu alaykum,<br /><em>Sevara.</em></h1>
              <p>Bugun nimani his qilmoqchisiz?</p>
            </div>
            <div className="sr-date">
              <span>BUGUN</span>
              <strong>24 MAY</strong>
              <small>Juma · Toshkent</small>
            </div>
          </section>

          <section className="sr-feature-grid">
            <article className="sr-feature-card">
              <div className="sr-feature-copy">
                <div className="sr-eyebrow sr-eyebrow-muted"><Waves size={13} /> HOZIR SIZ UCHUN</div>
                <div className="sr-feature-meta"><span>01 / 06</span><span className="sr-dot" /><span>Indie · Akustik</span></div>
                <h2>Sokin<br /><em>shahar</em></h2>
                <p>Mavj <span>—</span> Tongdan oldin</p>
                <div className="sr-feature-actions">
                  <PlayButton playing={currentId === current.id && playing} onClick={() => chooseSong(current)} large label={playing ? "Pauza" : "Ijro etish"} />
                  <button type="button" className={`sr-icon-button ${liked.includes(current.id) ? "is-liked" : ""}`} onClick={() => toggleLiked(current.id)} aria-label="Sevimlilarga qo‘shish">
                    <Heart size={18} fill={liked.includes(current.id) ? "currentColor" : "none"} />
                  </button>
                  <button type="button" className="sr-icon-button" onClick={() => setActiveNav("More")} aria-label="Ko‘proq"><MoreHorizontal size={18} /></button>
                </div>
              </div>
              <div className="sr-feature-art">
                <Cover song={current} size="large" playing={currentId === current.id && playing} />
                <span className="sr-art-caption">MAVJ / 01<br />TONGDAN OLDIN</span>
              </div>
              <div className="sr-feature-wave" aria-hidden="true">{Array.from({ length: 25 }).map((_, i) => <i key={i} style={{ height: `${14 + ((i * 17) % 48)}%` }} />)}</div>
            </article>

            <aside className="sr-activity-card">
              <div className="sr-card-head"><span>SO‘NGGI FAOLLIK</span><Clock3 size={15} /></div>
              <div className="sr-activity-total"><strong>47</strong><span> daqiqa<br />tinglandi</span></div>
              <div className="sr-mini-chart" aria-label="Haftalik tinglash grafigi">{[28, 45, 31, 64, 50, 72, 41].map((height, index) => <div key={index} className={index === 5 ? "is-today" : ""}><i style={{ height: `${height}%` }} /><small>{["Du", "Se", "Cho", "Pa", "Ju", "Sha", "Ya"][index]}</small></div>)}</div>
              <div className="sr-activity-foot"><span>Bu hafta</span><strong>+12 min</strong></div>
            </aside>
          </section>

          <section className="sr-section sr-moods-section">
            <div className="sr-section-head">
              <div><span className="sr-section-kicker">KAYFIYAT</span><h2>Bugungi ohang</h2></div>
              <button type="button" className="sr-text-link" onClick={() => setActiveNav("Moods")}>Barchasini ko‘rish <ArrowRight size={14} /></button>
            </div>
            <div className="sr-moods">
              {moods.map((mood, index) => (
                <button type="button" key={mood.label} className={`sr-mood ${activeMood === mood.label ? "is-selected" : ""}`} onClick={() => { setActiveMood(mood.label); const match = songs.find((song) => song.mood === mood.label); if (match) chooseSong(match); }}>
                  <span className="sr-mood-index">0{index + 1}</span>
                  <span className="sr-mood-pulse" style={{ "--mood": mood.color } as React.CSSProperties} />
                  <span className="sr-mood-copy"><strong>{mood.label}</strong><small>{mood.note}</small></span>
                  <ArrowRight size={15} className="sr-mood-arrow" />
                </button>
              ))}
            </div>
          </section>

          <section className="sr-section sr-listening-section">
            <div className="sr-section-head">
              <div><span className="sr-section-kicker">SADO TAVSIYA QILADI</span><h2>Yangi aylanish</h2></div>
              <div className="sr-list-controls"><button type="button" className="sr-control-button" onClick={() => setSearch("")}><SlidersHorizontal size={14} /> Filtr</button><button type="button" className="sr-circle-arrow" aria-label="Keyingi"><ArrowRight size={16} /></button></div>
            </div>
            <div className="sr-table-head"><span>#</span><span>QO‘SHIQ</span><span>ALBOM</span><span>DAVOMIYLIGI</span><span /></div>
            <div className="sr-song-list">
              {filteredSongs.slice(0, 4).map((song, index) => (
                <div className={`sr-song-row ${currentId === song.id ? "is-current" : ""}`} key={song.id}>
                  <span className="sr-row-index">{currentId === song.id && playing ? <span className="sr-eq"><i /><i /><i /></span> : String(index + 1).padStart(2, "0")}</span>
                  <button type="button" className="sr-song-main" onClick={() => chooseSong(song)}>
                    <span className="sr-row-cover-wrap"><Cover song={song} size="small" />{currentId === song.id && <span className="sr-row-overlay"><Play size={12} fill="currentColor" /></span>}</span>
                    <span><strong>{song.title}</strong><small>{song.artist}</small></span>
                  </button>
                  <span className="sr-album">{song.album}</span>
                  <span className="sr-duration">{song.duration}</span>
                  <button type="button" className={`sr-row-heart ${liked.includes(song.id) ? "is-liked" : ""}`} onClick={() => toggleLiked(song.id)} aria-label="Sevimlilarga qo‘shish"><Heart size={16} fill={liked.includes(song.id) ? "currentColor" : "none"} /></button>
                </div>
              ))}
              {!filteredSongs.length && <div className="sr-empty">Bu qidiruv uchun natija topilmadi.</div>}
            </div>
          </section>
        </div>
      </main>

      <footer className="sr-player">
        <div className="sr-player-track" onClick={() => setActiveNav("Now playing")} role="button" tabIndex={0}>
          <Cover song={current} size="small" playing={playing} />
          <span><strong>{current.title}</strong><small>{current.artist} · {current.album}</small></span>
        </div>
        <div className="sr-player-controls">
          <button type="button" className="sr-player-skip" onClick={() => { const next = songs[(songs.findIndex((song) => song.id === currentId) + songs.length - 1) % songs.length]; chooseSong(next); }} aria-label="Oldingi"><ArrowRight size={15} className="sr-flip" /></button>
          <PlayButton playing={playing} onClick={() => setPlaying((value) => !value)} label={playing ? "Pauza" : "Ijro etish"} />
          <button type="button" className="sr-player-skip" onClick={() => { const next = songs[(songs.findIndex((song) => song.id === currentId) + 1) % songs.length]; chooseSong(next); }} aria-label="Keyingi"><ArrowRight size={15} /></button>
        </div>
        <div className="sr-player-progress"><span>1:12</span><div><i style={{ width: playing ? "42%" : "30%" }} /></div><span>{current.duration}</span></div>
        <div className="sr-player-right"><button type="button" className="sr-player-heart" onClick={() => toggleLiked(current.id)} aria-label="Sevimlilarga qo‘shish"><Heart size={16} fill={liked.includes(current.id) ? "currentColor" : "none"} /></button><Volume2 size={16} /><div className="sr-volume"><i /></div></div>
      </footer>
    </div>
  );
}

export default SadoHomeRefined;