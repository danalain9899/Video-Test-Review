// B-roll bergerak (motion graphics) untuk setiap point. Semua dianimasi dengan frame, tiada aset luar.
import React from 'react';
import {AbsoluteFill, Img, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, FONT, W, H} from './theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const Backdrop: React.FC<{children: React.ReactNode; tint?: string; dur: number}> = ({children, tint = C.teal, dur}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 6, dur - 6, dur], [0, 1, 1, 0], clamp);
  const drift = interpolate(f, [0, dur], [0, 40], clamp);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <AbsoluteFill style={{background: `radial-gradient(900px 900px at ${50}% ${30 + drift / 10}%, ${tint}33, transparent 70%), linear-gradient(180deg,#0B0C10,#12141B 60%,#0B0C10)`}} />
      <AbsoluteFill style={{backgroundImage: 'linear-gradient(#ffffff08 1px,transparent 1px),linear-gradient(90deg,#ffffff08 1px,transparent 1px)', backgroundSize: '64px 64px', transform: `translateY(${-drift}px)`}} />
      {children}
    </AbsoluteFill>
  );
};

const Label: React.FC<{t: string; sub?: string; color?: string; y?: number; delay?: number}> = ({t, sub, color = C.white, y = 1330, delay = 4}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - delay, fps, config: {damping: 14}});
  return (
    <div style={{position: 'absolute', top: y, left: 0, width: W, textAlign: 'center', fontFamily: FONT, transform: `translateY(${(1 - p) * 40}px)`, opacity: p}}>
      <div style={{fontSize: 84, fontWeight: 900, color, letterSpacing: -2, lineHeight: 1}}>{t}</div>
      {sub && <div style={{fontSize: 40, fontWeight: 600, color: C.mute, marginTop: 18}}>{sub}</div>}
    </div>
  );
};

// 1) Negatif vs positif: bar ancaman melonjak, peluang kecil
export const SceneThreat: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const a = spring({frame: f - 6, fps, config: {damping: 12, stiffness: 110}});
  const b = spring({frame: f - 14, fps, config: {damping: 18}});
  const pulse = 1 + Math.sin(f / 3) * 0.04;
  return (
    <Backdrop dur={dur} tint={C.red}>
      <svg width={W} height={H} style={{position: 'absolute'}}>
        <rect x={190} y={1120 - 620 * a} width={250} height={620 * a} rx={22} fill={C.red} />
        <rect x={630} y={1120 - 150 * b} width={250} height={150 * b} rx={22} fill={C.green} />
        <line x1={120} x2={950} y1={1120} y2={1120} stroke="#ffffff40" strokeWidth={4} />
        <g transform={`translate(315 ${470 - 620 * a * 0.0}) scale(${pulse})`} opacity={a}>
          <path d="M0 -90 L95 70 L-95 70 Z" fill="none" stroke={C.red} strokeWidth={14} strokeLinejoin="round" />
          <rect x={-7} y={-40} width={14} height={60} rx={7} fill={C.red} /><circle cx={0} cy={46} r={9} fill={C.red} />
        </g>
      </svg>
      <div style={{position: 'absolute', top: 1160, left: 150, width: 330, textAlign: 'center', fontFamily: FONT, fontSize: 44, fontWeight: 800, color: C.red}}>ANCAMAN</div>
      <div style={{position: 'absolute', top: 1160, left: 590, width: 330, textAlign: 'center', fontFamily: FONT, fontSize: 44, fontWeight: 800, color: C.green}}>PELUANG</div>
      <Label t="Otak lebih nampak risiko" sub="berbanding peluang kejayaan" y={1300} />
    </Backdrop>
  );
};

// 2) Via negativa: buang yang negatif
export const SceneVia: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const items = ['Gangguan', 'Tabiat buruk', 'Pemikiran negatif', 'Kesilapan berulang'];
  return (
    <Backdrop dur={dur} tint={C.gold}>
      <div style={{position: 'absolute', top: 360, left: 0, width: W, fontFamily: FONT}}>
        {items.map((t, i) => {
          const enter = spring({frame: f - 4 - i * 4, fps, config: {damping: 15}});
          const strike = interpolate(f, [26 + i * 9, 34 + i * 9], [0, 1], clamp);
          const out = interpolate(f, [40 + i * 9, 52 + i * 9], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
          return (
            <div key={t} style={{margin: '0 90px 34px', padding: '34px 44px', borderRadius: 28, background: C.card, border: '2px solid #ffffff18', fontSize: 58, fontWeight: 800, color: C.white, position: 'relative',
              transform: `translateX(${(1 - enter) * -700 + out * 900}px)`, opacity: 1 - out * 0.4}}>
              {t}
              <div style={{position: 'absolute', left: 44, top: '50%', height: 8, width: `calc(${strike * 100}% - 88px)`, background: C.red, borderRadius: 4}} />
            </div>
          );
        })}
      </div>
      <Label t="VIA NEGATIVA" sub="Buang dulu, yang baik akan nampak" color={C.gold} y={1250} delay={30} />
    </Backdrop>
  );
};

// 3) Penunggang & kuda: garisan emosi bergelora -> tenang, titik 'akal' menunggang
export const SceneRider: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const calm = interpolate(f, [30, dur - 14], [1, 0.06], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const pts: string[] = []; const yAt = (x: number) => 760 + Math.sin(x / 55 + f / 5) * 150 * calm + Math.sin(x / 23 + f / 3) * 70 * calm;
  for (let x = 60; x <= W - 60; x += 8) pts.push(`${x},${yAt(x)}`);
  const rx = 160 + ((f * 9) % (W - 320));
  return (
    <Backdrop dur={dur} tint={C.teal}>
      <svg width={W} height={H} style={{position: 'absolute'}}>
        <polyline points={pts.join(' ')} fill="none" stroke={C.red} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" style={{filter: `drop-shadow(0 0 18px ${C.red})`}} />
        <circle cx={rx} cy={yAt(rx) - 56} r={34} fill={C.teal} style={{filter: `drop-shadow(0 0 22px ${C.teal})`}} />
        <line x1={rx} x2={rx} y1={yAt(rx) - 22} y2={yAt(rx)} stroke={C.teal} strokeWidth={8} />
      </svg>
      <div style={{position: 'absolute', top: 460, width: W, textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 46}}>
        <span style={{color: C.teal}}>● AKAL (penunggang)</span>&nbsp;&nbsp;<span style={{color: C.red}}>━ EMOSI (kuda)</span>
      </div>
      <Label t="Jinakkan emosi" sub="akal pegang kekang" color={C.teal} y={1180} delay={20} />
    </Backdrop>
  );
};

// 4) Pemikiran untuk memujuk: ramai titik mengikut pemimpin, cop INFO TIPU?
export const SceneInfluence: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const dots = Array.from({length: 26}, (_, i) => ({a: (i * 137.5) % 360, r: 120 + ((i * 53) % 300)}));
  const follow = interpolate(f, [8, 44], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const stamp = spring({frame: f - 52, fps, config: {damping: 9, stiffness: 160}});
  return (
    <Backdrop dur={dur} tint={C.gold}>
      <svg width={W} height={H} style={{position: 'absolute'}}>
        {dots.map((d, i) => {
          const x0 = W / 2 + Math.cos((d.a * Math.PI) / 180) * (d.r + 130), y0 = 760 + Math.sin((d.a * Math.PI) / 180) * (d.r + 130);
          const x1 = W / 2 + Math.cos((d.a * Math.PI) / 180) * (60 + (i % 5) * 26), y1 = 760 + Math.sin((d.a * Math.PI) / 180) * (60 + (i % 5) * 26);
          return <circle key={i} cx={x0 + (x1 - x0) * follow} cy={y0 + (y1 - y0) * follow} r={16} fill="#ffffff90" />;
        })}
        <circle cx={W / 2} cy={760} r={46} fill={C.gold} style={{filter: `drop-shadow(0 0 30px ${C.gold})`}} />
      </svg>
      <div style={{position: 'absolute', top: 1040, width: W, textAlign: 'center', fontFamily: FONT}}>
        <div style={{display: 'inline-block', transform: `rotate(-6deg) scale(${0.4 + stamp * 0.6})`, opacity: Math.min(1, stamp), border: `10px solid ${C.red}`, color: C.red, fontSize: 96, fontWeight: 900, padding: '8px 40px', borderRadius: 18, letterSpacing: 2}}>INFO TIPU?</div>
      </div>
      <Label t="Yang meyakinkan = menang" sub="walaupun maklumat salah" y={1300} delay={14} />
    </Backdrop>
  );
};

// 5) Senarai kesilapan: checklist bertanda
export const SceneChecklist: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const items = ['Apa yang orang tak nampak?', 'Pengorbanan sebenar', 'Kesilapan yang perlu dielak', 'Semak satu-satu'];
  return (
    <Backdrop dur={dur} tint={C.green}>
      <div style={{position: 'absolute', top: 330, left: 80, right: 80, fontFamily: FONT}}>
        {items.map((t, i) => {
          const enter = spring({frame: f - 4 - i * 5, fps, config: {damping: 15}});
          const tick = spring({frame: f - 22 - i * 14, fps, config: {damping: 10, stiffness: 180}});
          return (
            <div key={t} style={{display: 'flex', alignItems: 'center', gap: 34, marginBottom: 36, padding: '30px 38px', borderRadius: 28, background: C.card, border: '2px solid #ffffff18', transform: `translateX(${(1 - enter) * 600}px)`, opacity: enter}}>
              <svg width={78} height={78} viewBox="0 0 78 78"><rect x={4} y={4} width={70} height={70} rx={18} fill={tick > 0.05 ? C.green : 'none'} stroke={C.green} strokeWidth={6} />
                <path d="M20 40 L34 54 L58 24" fill="none" stroke={C.ink} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={80} strokeDashoffset={80 * (1 - Math.min(1, tick))} /></svg>
              <div style={{fontSize: 50, fontWeight: 800, color: C.white, lineHeight: 1.1}}>{t}</div>
            </div>
          );
        })}
      </div>
      <Label t="CHECKLIST KESILAPAN" sub="bukan hype, tapi proses" color={C.green} y={1240} delay={50} />
    </Backdrop>
  );
};

// 6) Berfikir meletihkan: bateri kosong, kemudian ancaman besar = fikir
export const SceneEnergy: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const lvl = interpolate(f, [8, dur - 16], [1, 0.12], {...clamp, easing: Easing.inOut(Easing.quad)});
  const col = lvl > 0.5 ? C.green : lvl > 0.25 ? C.gold : C.red;
  return (
    <Backdrop dur={dur} tint={C.gold}>
      <svg width={W} height={H} style={{position: 'absolute'}}>
        <rect x={236} y={560} width={560} height={300} rx={44} fill="none" stroke={C.white} strokeWidth={14} />
        <rect x={806} y={650} width={46} height={120} rx={14} fill={C.white} />
        <rect x={262} y={586} width={508 * lvl} height={248} rx={26} fill={col} />
      </svg>
      <Label t="Berfikir itu penat" sub="simpan tenaga untuk keputusan besar" color={col} y={1010} delay={10} />
    </Backdrop>
  );
};

// 0) Buku: potongan sebenar dari rakaman (sudah un-mirror), Ken Burns + kad membulat
export const SceneBook: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 13}});
  const z = interpolate(f, [0, dur], [1, 1.1], clamp);
  return (
    <Backdrop dur={dur} tint={C.gold}>
      <div style={{position: 'absolute', top: 430, left: 46, width: 980, height: 653, borderRadius: 36, overflow: 'hidden', border: `5px solid ${C.gold}`, boxShadow: '0 40px 100px rgba(0,0,0,.7)', transform: `scale(${0.7 + 0.3 * p}) rotate(${(1 - p) * -5}deg)`}}>
        <Img src={staticFile('book.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})`}} />
      </div>
      <Label t="ROLF DOBELLI" sub="Epilogue & Bab 1" color={C.gold} y={1220} delay={10} />
    </Backdrop>
  );
};
