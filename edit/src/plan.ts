// Pelan editing: semua masa dikira daripada transkrip (words.json) supaya kekal selari jika potongan berubah.
import words from '../public/words.json';
import cuts from '../public/cuts.json';

export type SceneName = 'threat' | 'via' | 'rider' | 'influence' | 'checklist' | 'energy' | 'book';
type W = {s: number; e: number; t: string};
const W_: W[] = words as W[];
const norm = (t: string) => t.toLowerCase().replace(/[^a-z]/g, '');
const hookEnd = cuts.joints[cuts.hookSegs] ?? 0;

// cari perkataan `tok` (kejadian pertama selepas `after` saat, dan selepas perkataan `afterTok` jika diberi)
const find = (tok: string, after = hookEnd, afterTok?: string): number => {
  let from = after;
  if (afterTok) { const a = W_.find((w) => w.s >= after && norm(w.t) === afterTok); if (a) from = a.e; }
  const w = W_.find((x) => x.s >= from && norm(x.t) === tok);
  if (!w) throw new Error(`token tak jumpa: ${tok} selepas ${afterTok ?? after}`);
  return w.s;
};

const tArt = find('art'), tPertama = find('pertama'), tMusnah = find('memusnahkan'), tVia = find('via'), tMaks = find('maksudnya'),
  tRider = find('penunggang'), tSesiapa = find('sesiapa'), tTipu = find('tipu'), tLast = find('last'), tSenarai = find('senarai'),
  tBerfikir = find('berfikir', tSenarai), tMeletih = find('meletihkan');

export const plan = {
  hookEnd,
  cutaways: [
    {at: tArt - 0.3, dur: 3.4, scene: 'book' as SceneName},
    {at: tMusnah - 0.6, dur: 3.0, scene: 'threat' as SceneName},
    {at: tMaks - 0.2, dur: 3.2, scene: 'via' as SceneName},
    {at: tRider + 0.1, dur: 4.4, scene: 'rider' as SceneName},
    {at: tSesiapa + 0.2, dur: 3.4, scene: 'influence' as SceneName},
    {at: tSenarai - 0.5, dur: 3.8, scene: 'checklist' as SceneName},
    {at: tMeletih - 1.2, dur: 3.4, scene: 'energy' as SceneName},
  ],
  chapters: [
    {at: tPertama - 0.2, dur: 3.2, n: '01', title: 'NEGATIF LEBIH KUAT'},
    {at: tVia - 0.4, dur: 3.0, n: '02', title: 'VIA NEGATIVA'},
    {at: tRider - 0.5, dur: 3.0, n: '03', title: 'PENUNGGANG & KUDA'},
    {at: tSesiapa - 1.6, dur: 3.0, n: '04', title: 'PEMIKIRAN UNTUK MEMUJUK'},
    {at: tLast - 0.2, dur: 3.2, n: '05', title: 'SENARAI KESILAPAN'},
    {at: tBerfikir - 0.2, dur: 3.2, n: '+', title: 'BERFIKIR ITU PENAT'},
  ],
  lowerThirds: [{at: tArt + 3.4, dur: 3.2, title: 'The Art of Thinking Clearly', sub: 'Rolf Dobelli · Epilogue & Bab 1'}],
  flashes: [hookEnd],
  sfx: [] as {at: number; name: string; vol?: number}[],
};
// SFX: impact di hook, riser sebelum transisi, whoosh pada setiap cutaway/chapter, pop pada lower third, tick pada checklist
const chk = plan.cutaways.find((c) => c.scene === 'checklist')!;
plan.sfx = [
  {at: 0.05, name: 'impact', vol: 0.7},
  {at: 1.1, name: 'pop', vol: 0.45},
  {at: Math.max(0, hookEnd - 1.5), name: 'riser', vol: 0.5},
  {at: hookEnd - 0.05, name: 'impact', vol: 0.6},
  ...plan.cutaways.map((c) => ({at: c.at, name: 'whoosh', vol: 0.5})),
  ...plan.cutaways.map((c) => ({at: c.at + c.dur - 0.25, name: 'whoosh', vol: 0.35})),
  ...plan.chapters.map((c) => ({at: c.at, name: 'pop', vol: 0.55})),
  ...plan.lowerThirds.map((c) => ({at: c.at, name: 'pop', vol: 0.5})),
  ...[0.74, 1.2, 1.67, 2.13].map((d) => ({at: chk.at + d + 0.1, name: 'tick', vol: 0.6})),
];
