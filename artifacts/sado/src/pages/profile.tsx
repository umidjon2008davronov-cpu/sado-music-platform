import { Check, ChevronDown, Globe2, Moon, Palette, Sparkles, Sun, UserRound } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { PageHeader, useSado } from '@/components/sado-shell';
import type { Language } from '@/i18n/translations';

const regions = ['Adabiy o‘zbek tili', 'Andijon', 'Buxoro', 'Jizzax', 'Qashqadaryo', 'Navoiy', 'Namangan', 'Samarqand', 'Sirdaryo', 'Surxondaryo', 'Toshkent', 'Farg‘ona', 'Xorazm'];

export default function ProfilePage() {
  const { t, language, setLanguage, themeDark, setThemeDark, profileName, setProfileName, notify } = useSado();
  const [region, setRegion] = useState(() => localStorage.getItem('sado-region') || 'Adabiy o‘zbek tili');
  const [nameDraft, setNameDraft] = useState(profileName);
  const saveName = () => { const clean = nameDraft.trim(); if (!clean) return; setProfileName(clean); notify(t.profileSaved); };
  const changeRegion = (value: string) => { setRegion(value); localStorage.setItem('sado-region', value); };
  return <div className="mx-auto max-w-[1100px]">
    <PageHeader eyebrow="SADO / 05" title={t.profileTitle} description={t.profileIntro} />
    <div className="space-y-5 px-5 sm:px-8 lg:px-12">
      <section className="rounded-2xl border border-border bg-card/55 p-5"><div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-lg font-extrabold text-primary-foreground">{profileName.slice(0, 1).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="font-bold truncate">{profileName}</p><p className="mt-1 text-xs text-muted-foreground">{t.listener}</p></div><UserRound size={19} className="text-muted-foreground" /></div><div className="mt-5 flex gap-2"><input value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} placeholder={t.profileNamePlaceholder} aria-label={t.profileName} className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/60" /><button type="button" onClick={saveName} className="rounded-xl bg-primary px-4 py-2 text-xs font-extrabold text-primary-foreground">{t.saveProfileName}</button></div><p className="mt-2 text-[11px] text-muted-foreground">{t.profileNameHint}</p></section>
      <section className="divide-y divide-border rounded-2xl border border-border bg-card/55">
         <SettingRow icon={<Globe2 size={18} />} label={t.language} hint={t.languageHint}><select value={language} onChange={(event) => setLanguage(event.target.value as Language)} aria-label={t.language} data-testid="select-language" className="rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-bold outline-none"><option value="uz">{t.languageNames.uz}</option><option value="ru">{t.languageNames.ru}</option><option value="en">{t.languageNames.en}</option></select></SettingRow>
        <SettingRow icon={<Palette size={18} />} label={t.region} hint={t.regionHint}><div className="relative"><select value={region} onChange={(event) => changeRegion(event.target.value)} data-testid="select-region" className="max-w-[180px] appearance-none rounded-lg border border-border bg-secondary py-2 pl-3 pr-8 text-xs font-semibold outline-none"><option value="Adabiy o‘zbek tili">Adabiy o‘zbek tili</option>{regions.slice(1).map((item) => <option key={item} value={item}>{item}</option>)}</select><ChevronDown size={13} className="pointer-events-none absolute right-2 top-2.5 text-muted-foreground" /></div></SettingRow>
         <SettingRow icon={themeDark ? <Moon size={18} /> : <Sun size={18} />} label={t.darkMode} hint={t.darkHint}><button type="button" role="switch" aria-label={t.darkMode} aria-checked={themeDark} onClick={() => setThemeDark(!themeDark)} data-testid="button-toggle-dark-mode" className={`relative h-7 w-12 rounded-full p-1 transition ${themeDark ? 'bg-primary' : 'bg-secondary'}`}><span className={`block h-5 w-5 rounded-full bg-foreground transition ${themeDark ? 'translate-x-5 bg-primary-foreground' : 'translate-x-0'}`} /></button></SettingRow>
      </section>
      <section className="rounded-2xl border border-border bg-card/55 p-5 opacity-70"><div className="flex items-start gap-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary"><Sparkles size={18} /></div><div className="flex-1"><div className="flex items-center gap-2"><h2 className="font-bold">{t.aiTitle}</h2><span className="rounded-full bg-primary/15 px-2 py-1 font-mono-ui text-[9px] uppercase tracking-wider text-primary">{t.coming}</span></div><p className="mt-2 text-xs leading-5 text-muted-foreground">{t.aiHint}</p></div><Check size={17} className="text-muted-foreground" /></div></section>
    </div>
  </div>;
}

function SettingRow({ icon, label, hint, children }: { icon: ReactNode; label: string; hint: string; children: ReactNode }) {
  return <div className="flex items-center gap-4 px-5 py-4"><span className="text-primary">{icon}</span><div className="min-w-0 flex-1"><p className="text-sm font-bold">{label}</p><p className="mt-1 text-xs text-muted-foreground">{hint}</p></div>{children}</div>;
}