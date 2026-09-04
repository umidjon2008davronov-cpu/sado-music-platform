import { AudioLines, LockKeyhole, WandSparkles } from 'lucide-react';
import { PageHeader, useSado } from '@/components/sado-shell';

export default function CreatePage() {
  const { t } = useSado();
  return <div className="mx-auto max-w-[1500px]">
    <PageHeader eyebrow="SADO / 04" title={t.createTitle} description={t.createCopy} />
    <div className="px-5 sm:px-8 lg:px-12">
      <section className="relative min-h-[500px] overflow-hidden rounded-[28px] border border-primary/25 bg-primary/10 p-7 sm:p-12"><div className="absolute -right-20 top-10 h-72 w-72 rounded-full border border-primary/15 opacity-70 sm:h-[420px] sm:w-[420px]" /><div className="absolute -right-6 top-24 h-60 w-60 rounded-full border border-primary/15 opacity-70 sm:h-[330px] sm:w-[330px]" /><div className="relative max-w-lg"><div className="mb-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><WandSparkles size={25} /></div><span className="rounded-full border border-primary/30 px-3 py-1 font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">{t.coming}</span><h2 className="mt-6 text-4xl font-extrabold leading-[1.03] tracking-[-.05em] sm:text-6xl">{t.createHeadlineLead} <span className="font-display font-normal italic text-primary">{t.createHeadlineAccent}</span></h2><p className="mt-6 max-w-md text-sm leading-6 text-muted-foreground">{t.createHint}</p><button type="button" disabled data-testid="button-start-creation" className="mt-8 flex cursor-not-allowed items-center gap-2 rounded-full bg-primary/40 px-5 py-3 text-xs font-extrabold text-primary-foreground/70"><LockKeyhole size={15} /> {t.coming}</button></div><div className="absolute bottom-8 right-9 hidden max-w-[230px] text-right sm:block"><AudioLines size={38} className="ml-auto mb-4 text-primary/70" /><p className="whitespace-pre-line font-mono-ui text-[10px] uppercase leading-5 tracking-[.15em] text-muted-foreground">{t.createAside}</p></div></section>
      <div className="mt-6 grid gap-3 pb-5 sm:grid-cols-3">{t.createSteps.map((item, index) => <div key={item} className="rounded-2xl border border-border bg-card/35 p-4"><span className="font-mono-ui text-[10px] text-primary">0{index + 1}</span><p className="mt-5 text-sm font-bold">{item}</p><p className="mt-1 text-xs text-muted-foreground">{t.coming}</p></div>)}</div>
    </div>
  </div>;
}