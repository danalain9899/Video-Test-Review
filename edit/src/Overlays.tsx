import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, FONT, W, H, FPS} from './theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export type Word = {s: number; e: number; t: string; hi?: boolean};

// Kata kunci diserlahkan dengan warna emas
const KEY = ['negatif', 'positif', 'kejayaan', 'buruk', 'via', 'negativa', 'emosi', 'akal', 'jinakkan', 'convince', 'influence', 'menang', 'tipu', 'bahaya', 'bias', 'cognitive', 'kesilapan', 'checklist', 'hype', 'pengorbanan', 'meletihkan', 'tenaga', 'ancaman', 'fikir', 'epilogue', 'musnahkan', 'buang', 'berjaya'];
const isKey = (t: string) => KEY.includes(t.toLowerCase().replace(/[^a-z]/g, ''));

// Kumpul perkataan jadi baris pendek (maks 4 perkataan / pecah pada jeda)
export const chunk = (words: Word[]) => {
  const out: Word[][] = []; let cur: Word[] = [];
  words.forEach((w, i) => {
    cur.push(w);
    const next = words[i + 1];
    const gap = next ? next.s - w.e : 9;
    if (cur.length >= 4 || gap > 0.28 || /[.?!,]$/.test(w.t)) { out.push(cur); cur = []; }
  });
  if (cur.length) out.push(cur);
  return out;
};

export const Captions: React.FC<{words: Word[]; hideRanges: [number, number][]}> = ({words, hideRanges}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const t = f / fps;
  const groups = React.useMemo(() => chunk(words), [words]);
  const g = groups.find((gr) => t >= gr[0].s - 0.02 && t < gr[gr.length - 1].e + 0.12);
  if (!g) return null;
  const y = hideRanges.some(([a, b]) => t >= a && t <= b) ? 1 : 0; // cutaway: kekal, tapi naikkan sedikit
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: y ? 1560 : 1210, textAlign: 'center', fontFamily: FONT, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 22px'}}>
      {g.map((w, i) => {
        const p = spring({frame: f - Math.round(w.s * fps), fps, config: {damping: 11, stiffness: 220}});
        const shown = t >= w.s - 0.02;
        const hi = isKey(w.t);
        return (
          <span key={i} style={{display: 'inline-block', opacity: shown ? 1 : 0, transform: `scale(${0.7 + 0.3 * p}) translateY(${(1 - p) * 14}px)`, fontSize: 82, fontWeight: 900, letterSpacing: -1.5,
            color: hi ? C.gold : C.white, textShadow: '0 6px 0 rgba(0,0,0,.55), 0 0 28px rgba(0,0,0,.6)', WebkitTextStroke: '2px rgba(0,0,0,.55)', textTransform: 'uppercase'}}>{w.t.replace(/[.,]$/g, '')}</span>
        );
      })}
    </div>
  );
};

export const ProgressBar: React.FC<{total: number}> = ({total}) => {
  const f = useCurrentFrame();
  return <div style={{position: 'absolute', top: 0, left: 0, height: 10, width: `${(f / total) * 100}%`, background: `linear-gradient(90deg,${C.gold},#fff)`, boxShadow: `0 0 16px ${C.gold}`}} />;
};

export const ChapterChip: React.FC<{n: string; title: string; dur: number}> = ({n, title, dur}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 14}});
  const out = interpolate(f, [dur - 8, dur], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', top: 96, left: 56, display: 'flex', alignItems: 'center', gap: 20, transform: `translateX(${(1 - p) * -520}px)`, opacity: out, fontFamily: FONT}}>
      <div style={{background: C.gold, color: C.ink, fontWeight: 900, fontSize: 44, padding: '10px 22px', borderRadius: 16}}>{n}</div>
      <div style={{background: 'rgba(11,12,16,.78)', color: C.white, fontWeight: 800, fontSize: 42, padding: '12px 28px', borderRadius: 16, backdropFilter: 'blur(8px)', border: '2px solid #ffffff22'}}>{title}</div>
    </div>
  );
};

export const LowerThird: React.FC<{title: string; sub: string; dur: number}> = ({title, sub, dur}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 16}});
  const out = interpolate(f, [dur - 8, dur], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: 56, top: 1500, width: 800, opacity: out, fontFamily: FONT, transform: `translateX(${(1 - p) * -700}px)`}}>
      <div style={{borderLeft: `10px solid ${C.gold}`, background: 'rgba(11,12,16,.82)', padding: '18px 30px', borderRadius: '6px 22px 22px 6px'}}>
        <div style={{fontSize: 46, fontWeight: 900, color: C.white}}>{title}</div>
        <div style={{fontSize: 32, fontWeight: 600, color: C.gold, marginTop: 4}}>{sub}</div>
      </div>
    </div>
  );
};

// Kad buku (potongan sebenar dari rakaman, sudah un-mirror) dengan Ken Burns + sudut membulat
export const BookCard: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 13}});
  const out = interpolate(f, [dur - 8, dur], [1, 0], clamp);
  const z = interpolate(f, [0, dur], [1, 1.12], clamp);
  return (
    <div style={{position: 'absolute', top: 150, left: 150, width: 770, height: 520, opacity: out, transform: `scale(${0.6 + 0.4 * p}) rotate(${(1 - p) * -6}deg)`, borderRadius: 32, overflow: 'hidden', border: `4px solid ${C.gold}`, boxShadow: '0 30px 80px rgba(0,0,0,.6)'}}>
      <Img src={staticFile('book.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})`}} />
    </div>
  );
};

// Hook: teks besar + glitch merah pada "KEGAGALAN"
export const Hook: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const out = interpolate(f, [dur - 10, dur], [1, 0], clamp);
  const line = (i: number, t: string, color: string, size: number) => {
    const p = spring({frame: f - 4 - i * 7, fps, config: {damping: 10, stiffness: 190}});
    const glitch = color === C.red && f % 23 < 3 ? (f % 2 ? 8 : -8) : 0;
    return <div key={t} style={{fontSize: size, fontWeight: 900, color, lineHeight: 1.0, letterSpacing: -3, transform: `translateX(${glitch}px) scale(${0.6 + 0.4 * p})`, opacity: Math.min(1, p * 1.5), textShadow: '0 10px 0 rgba(0,0,0,.6),0 0 40px rgba(0,0,0,.7)'}}>{t}</div>;
  };
  return (
    <AbsoluteFill style={{opacity: out}}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(0,0,0,.65),rgba(0,0,0,.05) 45%,rgba(0,0,0,.55))'}} />
      <div style={{position: 'absolute', top: 84, left: 0, width: W, textAlign: 'center', fontFamily: FONT, textTransform: 'uppercase'}}>
        {line(0, 'Kenapa kita lebih nampak', C.white, 64)}
        {line(1, 'Kegagalan', C.red, 150)}
        {line(2, 'bukan kejayaan?', C.gold, 76)}
      </div>
    </AbsoluteFill>
  );
};

export const Flash: React.FC<{dur?: number}> = ({dur = 8}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{background: '#fff', opacity: interpolate(f, [0, dur], [0.85, 0], clamp)}} />;
};

export const CutawayDim: React.FC = () => null;
