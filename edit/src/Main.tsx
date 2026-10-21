import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {FPS, W, H, sec, C} from './theme';
import cuts from '../public/cuts.json';
import words from '../public/words.json';
import {plan, SceneName} from './plan';
import {Captions, ProgressBar, ChapterChip, LowerThird, BookCard, Hook, Flash, Word} from './Overlays';
import {SceneThreat, SceneVia, SceneRider, SceneInfluence, SceneChecklist, SceneEnergy} from './Scenes';

const SCENES: Record<SceneName, React.FC<{dur: number}>> = {
  threat: SceneThreat, via: SceneVia, rider: SceneRider, influence: SceneInfluence, checklist: SceneChecklist, energy: SceneEnergy,
};
const ZOOMS = [1.0, 1.12, 1.0, 1.2, 1.06, 1.15];
const sfx = (n: string) => staticFile(`sfx/${n}.wav`);

export const Main: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const hookEnd = cuts.joints[cuts.hookSegs] ?? 0;

  // Zoom variasi: tukar tahap zoom pada cut (jump-cut), sekurang-kurangnya 2.4s antara perubahan
  const blocks = useMemo(() => {
    const b: {start: number; z: number}[] = [{start: 0, z: 1.14}];
    let last = hookEnd, k = 0;
    cuts.joints.forEach((j, i) => {
      if (i <= cuts.hookSegs) return;
      if (j - last >= 2.4) { b.push({start: j, z: ZOOMS[k++ % ZOOMS.length]}); last = j; }
    });
    if (b.length === 1 || b[1].start > hookEnd) b.splice(1, 0, {start: hookEnd, z: 1.0});
    return b;
  }, [hookEnd]);
  const bi = blocks.reduce((acc, x, i) => (x.start <= t ? i : acc), 0);
  const blk = blocks[bi];
  const next = blocks[bi + 1]?.start ?? cuts.duration;
  const push = interpolate(t, [blk.start, next], [0, 0.035]);
  const shake = t < hookEnd ? Math.sin(f * 1.7) * 3 * Math.max(0, 1 - t / 1.2) : 0;
  const scale = blk.z + push;

  // Audio ducking: BGM turun bila ada suara
  const duck = useMemo(() => {
    const n = Math.ceil(cuts.duration * FPS) + 2; const raw = new Float32Array(n);
    (words as Word[]).forEach((w) => { for (let i = Math.floor((w.s - 0.05) * FPS); i <= Math.ceil((w.e + 0.1) * FPS); i++) if (i >= 0 && i < n) raw[i] = 1; });
    const out = new Float32Array(n); let s = 0;
    for (let i = 0; i < n; i++) { s += (raw[i] - s) * (raw[i] > s ? 0.35 : 0.06); out[i] = s; }
    return out;
  }, []);
  const bgmVol = (fr: number) => {
    const fadeIn = interpolate(fr, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
    const fadeOut = interpolate(fr, [Math.ceil(cuts.duration * FPS) - 45, Math.ceil(cuts.duration * FPS)], [1, 0], {extrapolateLeft: 'clamp'});
    const d = duck[Math.min(fr, duck.length - 1)] ?? 0;
    return (0.2 - 0.14 * d) * fadeIn * fadeOut;
  };

  const cutRanges = plan.cutaways.map((c) => [c.at, c.at + c.dur] as [number, number]);
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <AbsoluteFill style={{transform: `translate(${shake}px,${shake * 0.6}px) scale(${scale})`, transformOrigin: '50% 30%'}}>
        <OffthreadVideo src={staticFile('base.mp4')} style={{width: W, height: H}} />
      </AbsoluteFill>

      {/* Audio */}
      <Audio src={staticFile('sfx/bgm.wav')} volume={bgmVol} />
      {plan.sfx.map((s, i) => (
        <Sequence key={i} from={sec(s.at)} durationInFrames={sec(2)}><Audio src={sfx(s.name)} volume={s.vol ?? 0.5} /></Sequence>
      ))}

      {/* Hook */}
      <Sequence from={0} durationInFrames={sec(hookEnd)}><Hook dur={sec(hookEnd)} /></Sequence>

      {/* B-roll cutaway */}
      {plan.cutaways.map((c, i) => {
        const S = SCENES[c.scene];
        return <Sequence key={i} from={sec(c.at)} durationInFrames={sec(c.dur)}><S dur={sec(c.dur)} /></Sequence>;
      })}

      {/* Elemen teks */}
      {plan.chapters.map((c, i) => (
        <Sequence key={i} from={sec(c.at)} durationInFrames={sec(c.dur)}><ChapterChip n={c.n} title={c.title} dur={sec(c.dur)} /></Sequence>
      ))}
      {plan.lowerThirds.map((c, i) => (
        <Sequence key={i} from={sec(c.at)} durationInFrames={sec(c.dur)}><LowerThird title={c.title} sub={c.sub} dur={sec(c.dur)} /></Sequence>
      ))}
      {plan.book && <Sequence from={sec(plan.book.at)} durationInFrames={sec(plan.book.dur)}><BookCard dur={sec(plan.book.dur)} /></Sequence>}

      <Captions words={words as Word[]} hideRanges={cutRanges} />
      {plan.flashes.map((a, i) => <Sequence key={i} from={sec(a)} durationInFrames={10}><Flash /></Sequence>)}
      <ProgressBar total={Math.ceil(cuts.duration * FPS)} />
    </AbsoluteFill>
  );
};
