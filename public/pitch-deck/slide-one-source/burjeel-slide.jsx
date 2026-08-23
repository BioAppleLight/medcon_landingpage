/* Burjeel × MyOS — Slide 1 opener.
   One continuous composition: a rotating ACL-reconstruction wireframe on the
   right, the headline building line by line on the left, a recovery axis
   under it, and the Burjeel × MyOS lockup settling last. */

const { useComposition, CompositionStage, Easing, animate, interpolate, clamp } = window;

const W = 1920, H = 1080, TAU = Math.PI * 2, N = 28;

const C = {
  bg0: '#05102a',
  bg1: '#0a1d47',
  navy: '#112967',
  blue: '#1D49BC',
  blueLit: '#4A86F7',
  coral: '#FB9385',
  ink: '#EAF1FC',
  dim: '#93AAD2',
  silver: '#DCD6F2',
  purple: '#8B6BE0',
};

/* --- exactly three motion helpers ------------------------------------- */
const MOTION = {
  enter: (t, start, dur) => animate({ from: 0, to: 1, start, end: start + (dur || 0.85), ease: Easing.easeOutCubic })(t),
  draw: (t, start, end) => animate({ from: 0, to: 1, start, end, ease: Easing.easeInOutQuart })(t),
  pop: (t, start, dur) => animate({ from: 0, to: 1, start, end: start + (dur || 0.6), ease: Easing.easeOutBack })(t),
};

const rnd = (i) => { const x = Math.sin(i * 127.1 + 13.7) * 43758.5453; return x - Math.floor(x); };

function ringPts(cx, y, rx, rz, cz) {
  cz = cz || 0;
  const a = [];
  for (let i = 0; i < N; i++) {
    const t = (i / N) * TAU;
    a.push([cx + rx * Math.cos(t), y, cz + rz * Math.sin(t)]);
  }
  return a;
}

function lobe(cx, cy, rx, ry, rz) {
  return [-0.8, -0.5, -0.15, 0.2, 0.55].map((l) => {
    const k = Math.sqrt(Math.max(0, 1 - l * l));
    return ringPts(cx, cy + ry * l, rx * k, rz * k);
  });
}

/* Stylised distal femur + proximal tibia as stacked scan rings. */
const GROUPS = (() => {
  const g = [];
  // distal femur: short shaft, quick flare, two condylar lobes with a notch between
  g.push({ rings: [ringPts(0, 214, 46, 34), ringPts(0, 150, 48, 35), ringPts(0, 88, 54, 40), ringPts(0, 40, 76, 50), ringPts(0, 8, 98, 60)], sil: true });
  g.push({ rings: lobe(-54, -16, 52, 50, 64), sil: true });
  g.push({ rings: lobe(54, -16, 52, 50, 64), sil: true });
  // proximal tibia: plateau, then shaft
  g.push({ rings: [ringPts(0, -94, 104, 66), ringPts(0, -118, 96, 62), ringPts(0, -148, 74, 54), ringPts(0, -196, 60, 44), ringPts(0, -250, 56, 42), ringPts(0, -300, 52, 40)], sil: true });
  return g;
})();

const ACL_A = [-24, -38, -34], ACL_B = [18, -86, 26];
const STRANDS = [0, 1, 2, 3, 4, 5].map((k) => {
  const pts = [], n = 18;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const ang = (k / 6) * TAU + t * 1.15;
    const sp = 9 * Math.sin(Math.PI * t) + 4.5;
    pts.push([
      ACL_A[0] + (ACL_B[0] - ACL_A[0]) * t + Math.cos(ang) * sp,
      ACL_A[1] + (ACL_B[1] - ACL_A[1]) * t,
      ACL_A[2] + (ACL_B[2] - ACL_A[2]) * t + Math.sin(ang) * sp,
    ]);
  }
  return pts;
});
const TUNNELS = [
  ringPts(ACL_A[0], ACL_A[1] + 2, 17, 12, ACL_A[2]),
  ringPts(ACL_B[0], ACL_B[1] - 2, 17, 12, ACL_B[2]),
];

/* --- the knee ---------------------------------------------------------- */
function Knee({ T, speed, cx, cy, scale }) {
  const rotY = -0.62 + T * 0.30 * speed;
  const rotX = 0.05 + 0.05 * Math.sin(T * 0.45);
  const sinY = Math.sin(rotY), cosY = Math.cos(rotY);
  const sinX = Math.sin(rotX), cosX = Math.cos(rotX);
  const f = 1500;

  // assembly: rings converge from a scattered cloud, bottom-up
  const asmOf = (k) => MOTION.enter(T, k * 0.052, 1.0);

  const proj = (p, k, spread) => {
    let x = p[0], y = p[1], z = p[2];
    if (spread > 0) {
      x += (rnd(k) - 0.5) * 460 * spread;
      y += (rnd(k + 7.3) - 0.5) * 300 * spread;
      z += (rnd(k + 3.1) - 0.5) * 460 * spread;
    }
    const x1 = x * cosY + z * sinY;
    const z1 = -x * sinY + z * cosY;
    const y2 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;
    const s = (f / (f - z2)) * scale;
    return [cx + x1 * s, cy - y2 * s, z2];
  };

  const els = [];
  let ringNo = 0, key = 0;

  GROUPS.forEach((grp, gi) => {
    const projected = grp.rings.map((ring) => {
      const a = asmOf(ringNo);
      const spread = 1 - Easing.easeOutCubic(a);
      const pp = ring.map((p, i) => proj(p, ringNo * 97 + i * 13 + gi, spread));
      ringNo++;
      const line = Math.pow(clamp((a - 0.34) / 0.5, 0, 1), 1.6);
      return { pp, a, v: 0.34 + 0.66 * a, line };
    });

    projected.forEach((r, i) => {
      const zAvg = r.pp.reduce((s, p) => s + p[2], 0) / r.pp.length;
      const d = clamp((zAvg + 150) / 300, 0, 1);
      els.push(
        <polyline
          key={'r' + key++}
          points={r.pp.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')}
          fill="none"
          stroke={'rgba(122,166,240,' + (0.16 + 0.5 * d) * r.line + ')'}
          strokeWidth={1 + 0.7 * d}
        />
      );
      if (i % 2 === 0 || r.line < 0.2) {
        for (let j = 0; j < N; j += 3) {
          els.push(
            <circle key={'d' + key++} cx={r.pp[j][0]} cy={r.pp[j][1]} r={1.5 + d}
              fill={'rgba(220,214,242,' + (0.2 + 0.45 * d) * r.v + ')'} />
          );
        }
      }
      const nxt = projected[i + 1];
      if (nxt) {
        for (let j = 0; j < N; j += 4) {
          els.push(
            <line key={'w' + key++}
              x1={r.pp[j][0]} y1={r.pp[j][1]} x2={nxt.pp[j][0]} y2={nxt.pp[j][1]}
              stroke={'rgba(74,134,247,' + 0.22 * Math.min(r.line, nxt.line) + ')'} strokeWidth={0.9} />
          );
        }
      }
    });

    // silhouette: the bone's outer profile, traced through each ring's extremes
    if (grp.sil) {
      const lft = [], rgt = [];
      projected.forEach((r) => {
        let lo = r.pp[0], hi = r.pp[0];
        r.pp.forEach((p) => { if (p[0] < lo[0]) lo = p; if (p[0] > hi[0]) hi = p; });
        lft.push(lo); rgt.push(hi);
      });
      const aMin = Math.min.apply(null, projected.map((r) => r.line));
      [lft, rgt].forEach((side, si) => {
        els.push(
          <polyline key={'sil' + gi + si}
            points={side.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')}
            fill="none" stroke={'rgba(190,214,252,' + 0.7 * aMin + ')'} strokeWidth={1.9}
            strokeLinejoin="round" strokeLinecap="round" />
        );
      });
    }
  });

  // graft + tunnels come in after the bone, then hold a soft pulse
  const gA = MOTION.enter(T, 1.5, 1.1);
  const pulse = 0.72 + 0.28 * Math.sin((T - 3.2) * 2.1) * clamp((T - 3.2) / 1.2, 0, 1);
  const graft = [];
  TUNNELS.forEach((ring, i) => {
    const pp = ring.map((p, j) => proj(p, 900 + i * 31 + j, 0));
    graft.push(
      <polyline key={'t' + i} points={pp.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')}
        fill="none" stroke={'rgba(220,214,242,' + 0.75 * gA + ')'} strokeWidth={1.4} />
    );
  });
  STRANDS.forEach((s, i) => {
    const seg = Math.round(s.length * clamp((gA - i * 0.04) / 0.7, 0, 1));
    if (seg < 2) return;
    const pp = s.slice(0, seg).map((p, j) => proj(p, 700 + i * 17 + j, 0));
    graft.push(
      <polyline key={'s' + i} points={pp.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')}
        fill="none" stroke={C.coral} strokeWidth={3} strokeLinecap="round"
        opacity={(0.55 + 0.45 * pulse) * gA} />
    );
  });

  return (
    <svg width={W} height={H} viewBox={'0 0 ' + W + ' ' + H}
      style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <filter id="bglow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <linearGradient id="kfade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.02" stopColor="#000" />
          <stop offset="0.16" stopColor="#fff" />
          <stop offset="0.74" stopColor="#fff" />
          <stop offset="0.97" stopColor="#000" />
        </linearGradient>
        <mask id="kmask">
          <rect x="0" y="0" width={W} height={H} fill="url(#kfade)" />
        </mask>
      </defs>
      <g transform={'rotate(7 ' + cx + ' ' + cy + ')'} mask="url(#kmask)">
        <g>{els}</g>
        <g filter="url(#bglow)" opacity={0.6 * gA * pulse}>{graft}</g>
        <g>{graft}</g>
      </g>
    </svg>
  );
}

/* --- recovery axis ------------------------------------------------------ */
function Axis({ T, cues }) {
  const draw = MOTION.draw(T, cues.Hours + 0.9, cues.Months + 2.3);
  const surg = MOTION.enter(T, cues.Hours + 0.85, 0.5);
  const trav = clamp((T - (cues.Question + 0.5)) / 3.6, 0, 1);
  const full = 940;
  const ticks = 24;
  return (
    <div style={{ position: 'absolute', left: 132, top: 792, width: full, height: 40 }}>
      <div style={{ position: 'absolute', left: 0, top: 18, height: 1, width: full * draw, background: 'rgba(147,170,210,0.5)' }}></div>
      <div style={{ position: 'absolute', left: 0, top: 13, height: 11, width: 44 * surg, background: C.coral, borderRadius: 1 }}></div>
      {Array.from({ length: ticks }).map((_, i) => {
        const x = 70 + i * ((full - 90) / (ticks - 1));
        const a = clamp((draw * full - x) / 60, 0, 1);
        const near = clamp(1 - Math.abs(trav * full - x) / 130, 0, 1);
        return (
          <div key={i} style={{
            position: 'absolute', left: x, top: 18 - (i % 4 === 0 ? 7 : 4),
            width: 1, height: (i % 4 === 0 ? 14 : 8) + near * 8,
            background: near > 0.02
              ? 'rgba(' + [220, 214, 242].join(',') + ',' + (0.4 + 0.6 * near) + ')'
              : 'rgba(147,170,210,' + 0.5 * a + ')',
            opacity: a,
          }}></div>
        );
      })}
      <div style={{
        position: 'absolute', left: trav * full - 60, top: 17, width: 120, height: 3,
        background: 'linear-gradient(90deg, rgba(139,107,224,0) 0%, ' + C.silver + ' 60%, rgba(255,255,255,0.95) 100%)',
        opacity: trav > 0 && trav < 1 ? 1 : trav >= 1 ? 0 : 0, borderRadius: 2,
      }}></div>
      <div style={{
        position: 'absolute', left: full - 20, top: 12, width: 9, height: 9, borderRadius: 9,
        background: C.silver, opacity: clamp((trav - 0.86) / 0.14, 0, 1),
        boxShadow: '0 0 18px rgba(220,214,242,0.8)',
      }}></div>
    </div>
  );
}

/* --- lockup ------------------------------------------------------------- */
function Lockup({ T, cues }) {
  const a = 1;
  const x = 1;
  const m = 1;
  const shimmer = 0.72 + 0.28 * Math.sin(T * 1.15);
  const settle = MOTION.enter(T, cues.Settle - 0.3, 1.0);
  return (
    <div className="slide-copy-pop" style={{
      position: 'absolute', left: 132, top: 890, display: 'flex', alignItems: 'center', gap: 28,
    }}>
      <div style={{
        background: '#FFFFFF', borderRadius: 10, width: 160, height: 104,
        position: 'relative', overflow: 'hidden', flex: 'none',
        opacity: a, transform: 'translateY(' + (1 - a) * 14 + 'px)',
      }}>
        <img src="/pitch-deck/burjeel-logo.png" alt="Burjeel"
          style={{ position: 'absolute', height: 150, width: 'auto', left: -7, top: -30, display: 'block' }} />
      </div>
      <svg width="34" height="34" viewBox="0 0 34 34" style={{ flex: 'none', opacity: x }}>
        <g stroke="rgba(220,214,242,0.9)" strokeWidth="2.4" strokeLinecap="round"
           transform={'rotate(' + (1 - x) * 40 + ' 17 17)'}>
          <line x1="6" y1="6" x2={6 + 22 * x} y2={6 + 22 * x} />
          <line x1="28" y1="6" x2={28 - 22 * x} y2={6 + 22 * x} />
        </g>
      </svg>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, opacity: m,
        transform: 'scale(' + (0.86 + 0.14 * m) + ')', transformOrigin: 'left center',
        filter: 'drop-shadow(0 0 ' + (10 + 18 * shimmer * settle) + 'px rgba(139,107,224,' + 0.6 * shimmer + '))',
      }}>
        <img src="/icon.svg" alt="" style={{ height: 92, width: 'auto', flex: 'none', display: 'block' }} />
        <span style={{
          color: C.silver, fontFamily: 'Archivo, sans-serif', fontSize: 42,
          fontWeight: 600, letterSpacing: '-0.03em', whiteSpace: 'nowrap',
        }}>MyOS</span>
      </div>
    </div>
  );
}

/* --- the piece ---------------------------------------------------------- */
function Piece() {
  const { T, CUES } = useComposition();
  const tw = window.__burjeelTweaks || {};
  const speed = tw.rotationSpeed == null ? 1 : tw.rotationSpeed;

  const kScale = interpolate([0, CUES.Question, 17.2], [1.55, 1.78, 1.86], Easing.easeInOutSine)(T);
  const kx = interpolate([0, 17.2], [1466, 1392], Easing.easeInOutSine)(T);

  const l1 = MOTION.enter(T, CUES.Hours + 0.15, 0.9);
  const l2 = MOTION.enter(T, CUES.Months + 0.15, 0.9);
  const l3 = MOTION.enter(T, CUES.Question + 0.25, 1.1);
  const rule = MOTION.pop(T, CUES.Question + 0.05, 0.8);

  const line = (o, size, family, extra) => Object.assign({
    margin: 0, opacity: o, transform: 'translateY(' + (1 - o) * 22 + 'px)',
    fontFamily: family, fontSize: size, lineHeight: 1.06,
  }, extra || {});

  const photoA = interpolate([0, 1.6], [0.5, 1], Easing.easeInOutSine)(T);
  const scrim = interpolate([2.2, CUES.Months + 1, CUES.Question + 1.2], [0.52, 0.62, 0.8], Easing.easeInOutSine)(T);
  const photoZ = interpolate([0, 17.2], [1.04, 1.14], Easing.easeInOutSine)(T);

  return (
    <div data-screen-label={'t=' + Math.floor(T) + 's'} style={{
      position: 'absolute', inset: 0, overflow: 'hidden', background: C.bg0,
    }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: photoA }}>
        <img src="/pitch-deck/burjeel-or-backdrop.png" alt="" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          transform: 'scale(' + photoZ + ') translateX(' + (photoZ - 1.04) * -160 + 'px)',
          transformOrigin: '54% 62%',
        }} />
      </div>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(1400px 1000px at 74% 48%, rgba(10,29,71,0.55) 0%, rgba(5,16,42,0.92) 68%, #030a1c 100%)',
        opacity: scrim,
      }}></div>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(100deg, ' + C.bg0 + ' 0%, rgba(5,16,42,0.9) 30%, rgba(5,16,42,0.35) 60%, rgba(5,16,42,0) 84%)',
        opacity: 0.62 + 0.38 * scrim,
      }}></div>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(620px 620px at ' + kx + 'px 520px, rgba(46,99,217,0.34) 0%, rgba(46,99,217,0) 68%)',
      }}></div>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.5,
        backgroundImage: 'linear-gradient(rgba(147,170,210,0.055) 1px, transparent 1px)',
        backgroundSize: '100% 120px',
      }}></div>

      <Knee T={T} speed={speed} cx={kx} cy={524} scale={kScale} />

      <div className="slide-copy-pop" style={{ position: 'absolute', left: 132, top: 292, width: 940 }}>
        <p style={line(1, 56, 'Archivo, sans-serif', { color: C.ink, fontWeight: 300, letterSpacing: '-0.015em' })}>
          The surgery lasts hours.
        </p>
        <p style={line(1, 56, 'Archivo, sans-serif', { color: C.ink, fontWeight: 300, letterSpacing: '-0.015em', marginTop: 18 })}>
          Recovery lasts months.
        </p>
        <div style={{ height: 3, width: 132, background: C.coral, margin: '56px 0 34px' }}></div>
        <p style={line(1, 86, 'Instrument Serif, serif', { color: '#FFFFFF', fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1.1, textWrap: 'pretty' })}>
          What if Burjeel could stay with the patient throughout it?
        </p>
      </div>

      <Axis T={T} cues={CUES} />
      <Lockup T={T} cues={CUES} />
    </div>
  );
}

function BurjeelSlide() {
  const [t, setTweak] = window.useTweaks(window.TWEAK_DEFAULTS);
  window.__burjeelTweaks = t;
  const P = window.TweaksPanel, S = window.TweakSlider, Tg = window.TweakToggle, Sec = window.TweakSection;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <CompositionStage width={W} height={H} bg={C.bg0} autoplay={true}
        scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
        <Piece />
      </CompositionStage>
      <P>
        <Sec label="Motion" />
        <S label="Rotation speed" value={t.rotationSpeed} min={0} max={2} step={0.1}
          onChange={(v) => setTweak('rotationSpeed', v)} />
        <Tg label="Motion editor" value={t.motionEditor}
          onChange={(v) => setTweak('motionEditor', v)} />
      </P>
    </div>
  );
}

window.BurjeelSlide = BurjeelSlide;
