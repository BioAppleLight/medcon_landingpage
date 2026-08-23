/* Slide 6 — How the content is created.
   Left-to-right: Burjeel documents → MyOS conversion → example output,
   with a machine-readable data stream between the first two. */

(function () {
const { useComposition, CompositionStage, Easing, animate, interpolate, clamp } = window;

const W = 1920, H = 1080;

const K = {
  ink: '#EAF0FE',
  dim: '#9BAAD4',
  blue: '#4A86F7',
  blueDeep: '#1D49BC',
  purple: '#A78BFA',
  purpleDeep: '#6D3FD4',
  coral: '#FB9385',
  paper: '#EEF2FB',
  paperInk: '#16204A',
};

const M = {
  enter: (t, s, d) => animate({ from: 0, to: 1, start: s, end: s + (d || 0.7), ease: Easing.easeOutCubic })(t),
  draw: (t, s, e) => animate({ from: 0, to: 1, start: s, end: e, ease: Easing.easeInOutQuart })(t),
  pop: (t, s, d) => animate({ from: 0, to: 1, start: s, end: s + (d || 0.5), ease: Easing.easeOutBack })(t),
};

const DOCS = ['Procedure', 'Recovery protocol', 'Approved script', 'Exercise instructions', 'Escalation criteria'];
const FEATURES = [
  '2–4 min patient guidance', 'Conversational doctor/avatar experience', 'FAQs',
  'Rehabilitation videos', 'Multilingual versions', 'Consistent Burjeel branding',
];
const FAQS = ['When can I walk?', 'Will I need physiotherapy?', 'When can I return to sports?'];
const HEX = ['3E', '02', '47', '12', '9F', '1E', '2F', 'A7', '4D', 'B0', '5C', 'E9', '7A', '31'];

const rnd = (i) => { const x = Math.sin(i * 91.7 + 4.3) * 43758.5453; return x - Math.floor(x); };

/* ---- small geometric glyphs (no emoji, no illustration) ---- */
function Glyph({ kind, size, color }) {
  const s = size || 26, c = color || K.blue;
  const box = { width: s, height: s, flex: 'none' };
  if (kind === 'rows') return (
    <svg viewBox="0 0 24 24" style={box}><g stroke={c} strokeWidth="1.8" fill="none">
      <rect x="3" y="4" width="18" height="4" rx="1" /><rect x="3" y="10" width="18" height="4" rx="1" /><rect x="3" y="16" width="18" height="4" rx="1" />
    </g></svg>
  );
  if (kind === 'play') return (
    <svg viewBox="0 0 24 24" style={box}><circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.8" fill="none" /><path d="M10 8.5 L16 12 L10 15.5 Z" fill={c} /></svg>
  );
  if (kind === 'globe') return (
    <svg viewBox="0 0 24 24" style={box}><g stroke={c} strokeWidth="1.8" fill="none">
      <circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18M4.6 7h14.8M4.6 17h14.8" />
    </g></svg>
  );
  if (kind === 'clock') return (
    <svg viewBox="0 0 24 24" style={box}><g stroke={c} strokeWidth="1.8" fill="none"><circle cx="12" cy="12" r="9" /><path d="M12 7v5.4l3.4 2" strokeLinecap="round" /></g></svg>
  );
  if (kind === 'person') return (
    <svg viewBox="0 0 24 24" style={box}><g stroke={c} strokeWidth="1.8" fill="none"><circle cx="12" cy="8" r="3.6" /><path d="M4.6 20c1.1-4.3 4-6.4 7.4-6.4S18.3 15.7 19.4 20" strokeLinecap="round" /></g></svg>
  );
  if (kind === 'chat') return (
    <svg viewBox="0 0 24 24" style={box}><path d="M4 5.5h16v11H12l-5 3.5v-3.5H4z" stroke={c} strokeWidth="1.8" fill="none" strokeLinejoin="round" /></svg>
  );
  if (kind === 'video') return (
    <svg viewBox="0 0 24 24" style={box}><g stroke={c} strokeWidth="1.8" fill="none"><rect x="3" y="6" width="12" height="12" rx="2" /><path d="M15 11l6-3.4v8.8L15 13z" strokeLinejoin="round" /></g></svg>
  );
  if (kind === 'badge') return (
    <svg viewBox="0 0 24 24" style={box}><circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.8" fill="none" /><text x="12" y="16.4" textAnchor="middle" fontSize="11" fontFamily="Archivo, sans-serif" fontWeight="600" fill={c}>B</text></svg>
  );
  if (kind === 'shield') return (
    <svg viewBox="0 0 24 24" style={box}><g stroke={c} strokeWidth="1.8" fill="none" strokeLinejoin="round"><path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6z" /><path d="M8.6 12l2.4 2.4 4.4-4.6" strokeLinecap="round" /></g></svg>
  );
  if (kind === 'pen') return (
    <svg viewBox="0 0 24 24" style={box}><g stroke={c} strokeWidth="1.8" fill="none" strokeLinecap="round"><path d="M4 20l4-1 10.5-10.5a2.1 2.1 0 0 0-3-3L5 16z" strokeLinejoin="round" /><path d="M14.5 6.5l3 3" /></g></svg>
  );
  if (kind === 'cal') return (
    <svg viewBox="0 0 24 24" style={box}><g stroke={c} strokeWidth="1.8" fill="none"><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3.5v3M16 3.5v3" strokeLinecap="round" /></g></svg>
  );
  if (kind === 'quote') return (
    <svg viewBox="0 0 24 24" style={box}><g stroke={c} strokeWidth="1.8" fill="none" strokeLinejoin="round"><path d="M4 5.5h16v11H12l-5 3.5v-3.5H4z" /><path d="M8.5 10.5h7M8.5 13.5h4" strokeLinecap="round" /></g></svg>
  );
  if (kind === 'move') return (
    <svg viewBox="0 0 24 24" style={box}><g stroke={c} strokeWidth="1.8" fill="none" strokeLinecap="round"><circle cx="12" cy="4.6" r="2" /><path d="M12 7v6M12 13l-3.4 6M12 13l3.4 6M5.6 9.4L12 8l6.4 1.4" /></g></svg>
  );
  if (kind === 'warn') return (
    <svg viewBox="0 0 24 24" style={box}><g stroke={c} strokeWidth="1.8" fill="none" strokeLinejoin="round"><path d="M12 4l9 16H3z" /><path d="M12 10v4.4" strokeLinecap="round" /></g><circle cx="12" cy="17.4" r="1.1" fill={c} /></svg>
  );
  if (kind === 'sparkle') return (
    <svg viewBox="0 0 24 24" style={box}><g stroke={c} strokeWidth="1.8" fill="none" strokeLinecap="round"><path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z" strokeLinejoin="round" /><path d="M18.5 16.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" strokeLinejoin="round" /></g></svg>
  );
  if (kind === 'wave') return (
    <svg viewBox="0 0 24 24" style={box}><g stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M4 12v2M8 8.5v9M12 5v14M16 8.5v9M20 12v2" /></g></svg>
  );
  if (kind === 'image') return (
    <svg viewBox="0 0 24 24" style={box}><g stroke={c} strokeWidth="1.8" fill="none"><rect x="3.5" y="5" width="17" height="14" rx="2" /><path d="M4 16l4.6-4.4 3.4 3 3-2.6L20 16" strokeLinejoin="round" /></g><circle cx="9" cy="9.6" r="1.4" fill={c} /></svg>
  );
  if (kind === 'audio') return (
    <svg viewBox="0 0 24 24" style={box}><g stroke={c} strokeWidth="1.8" fill="none" strokeLinejoin="round"><path d="M4.5 9.5h3.2L12 5.6v12.8L7.7 14.5H4.5z" /><path d="M15.5 9.4a4 4 0 0 1 0 5.2M18 7a7.4 7.4 0 0 1 0 10" strokeLinecap="round" /></g></svg>
  );
  if (kind === 'cam') return (
    <svg viewBox="0 0 24 24" style={box}><g stroke={c} strokeWidth="1.8" fill="none"><rect x="3" y="7" width="12" height="10" rx="2" /><path d="M15 11l6-3v8l-6-3z" strokeLinejoin="round" /></g></svg>
  );
  if (kind === 'layers') return (
    <svg viewBox="0 0 24 24" style={box}><g stroke={c} strokeWidth="1.8" fill="none" strokeLinejoin="round"><path d="M12 3.5l8.5 4.2L12 11.9 3.5 7.7z" /><path d="M3.5 12L12 16.2 20.5 12M3.5 16.3L12 20.5l8.5-4.2" /></g></svg>
  );
  if (kind === 'frame') return (
    <svg viewBox="0 0 24 24" style={box}><g stroke={c} strokeWidth="1.8" fill="none" strokeLinecap="round"><rect x="3.5" y="5" width="17" height="14" rx="2" /><path d="M3.5 9.5h17M7.5 5v14M16.5 5v14" /></g></svg>
  );
  return null;
}

const DOC_ICONS = ['pen', 'cal', 'quote', 'move', 'warn'];
const FEAT_ICONS = ['clock', 'person', 'chat', 'video', 'globe', 'badge'];

/* ---- panel shell ---- */
function Panel({ n, label, sub, tone, a, bare, children, style }) {
  const edge = tone === 'p' ? 'rgba(139,92,246,0.42)' : tone === 'v' ? 'rgba(167,139,250,0.5)' : 'rgba(74,134,247,0.34)';
  const fill = tone === 'p' ? 'rgba(22,15,62,0.62)' : tone === 'v' ? 'rgba(38,16,72,0.62)' : 'rgba(10,22,64,0.62)';
  return (
    <div style={Object.assign({
      position: 'absolute', boxSizing: 'border-box', borderRadius: 20,
      border: bare ? '1px solid transparent' : '1px solid ' + edge,
      background: bare ? 'transparent' : fill,
      padding: '20px 24px 22px', display: 'flex', flexDirection: 'column',
      opacity: a, transform: 'translateY(' + (1 - a) * 20 + 'px)',
      boxShadow: bare ? 'none' : '0 24px 60px rgba(2,6,26,0.45)',
    }, style)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 38, flex: 'none',
          border: '1px solid ' + edge, background: 'rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          font: '600 22px Archivo, sans-serif', color: tone === 'b' ? K.blue : K.purple,
        }}>{n}</div>
        <div style={{
          font: '600 26px Archivo, sans-serif', letterSpacing: '0.03em', whiteSpace: 'nowrap',
          color: tone === 'b' ? K.blue : K.purple, textTransform: 'uppercase',
        }}>{label}</div>
        {sub ? <div style={{ font: '400 26px Archivo, sans-serif', color: 'rgba(155,170,212,0.9)', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>{sub}</div> : null}
      </div>
      {children}
    </div>
  );
}

function Piece() {
  const { T, CUES } = useComposition();
  const tw = window.__b6 || {};
  const tilt = tw.stackTilt == null ? 1 : tw.stackTilt;

  const hd = M.enter(T, 0.02, 0.36);
  const sub = M.enter(T, 0.06, 0.4);
  const p1 = M.enter(T, 0.08, 0.45);
  const p2 = M.enter(T, 0.08, 0.45);
  const p3 = M.enter(T, 0.08, 0.45);
  const arrow2 = M.draw(T, 0.18, 0.7);
  const flow = M.enter(T, 0.02, 0.3);

  return (
    <div data-screen-label={'s6 t=' + Math.floor(T) + 's'} style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      background: 'radial-gradient(1500px 1100px at 16% 30%, #0B1240 0%, #070B2A 46%, #05061C 100%)',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(1100px 900px at 92% 56%, rgba(88,42,180,0.5) 0%, rgba(88,42,180,0) 68%)',
      }}></div>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.4,
        backgroundImage: 'linear-gradient(rgba(147,170,210,0.05) 1px, transparent 1px)',
        backgroundSize: '100% 120px',
      }}></div>

      {/* header */}
      <div style={{ position: 'absolute', left: 54, top: 34, display: 'flex', alignItems: 'center', gap: 22, opacity: hd }}>
        <div style={{
          padding: '8px 18px', borderRadius: 10, background: K.purpleDeep,
          font: '600 24px Archivo, sans-serif', letterSpacing: '0.14em', color: '#FFFFFF',
        }}>SLIDE 6</div>
        <div style={{ font: '700 56px Archivo, sans-serif', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
          How the content is created
        </div>
      </div>
      <div style={{
        position: 'absolute', left: 200, top: 108, opacity: sub,
        font: '300 32px Archivo, sans-serif', color: K.ink,
      }}>
        Clinical expertise <span style={{ color: K.blue, fontWeight: 500 }}>in.</span> Consistent patient experience <span style={{ color: K.purple, fontWeight: 500 }}>out.</span>
      </div>

      {/* 1 — Burjeel provides */}
      <Panel n="1" label="Burjeel provides" tone="b" bare a={p1} style={{ left: 54, top: 166, width: 484, height: 860 }}>
        <div style={{ position: 'relative', height: 468, marginTop: 4, perspective: '1400px' }}>
          {DOCS.map((d, i) => {
            const SW = 148, SH = 266, PITCH = 136;
            const back = i < 2;
            const col = back ? i : i - 2;
            const left = 16 + (back ? PITCH / 2 : 0) + col * PITCH;
            const top = back ? 0 : 156;
            const en = M.enter(T, 0.1 + i * 0.05, 0.38);
            return (
              <div key={i} style={{
                position: 'absolute', left, top, width: SW, height: SH,
                zIndex: (back ? 10 : 20) - col,
                opacity: en,
                transform: 'skewY(' + (-9 * tilt) + 'deg) translateY(' + (1 - en) * 26 + 'px)',
              }}>
                {[3, 2, 1].map((k) => (
                  <div key={k} style={{
                    position: 'absolute', left: -k * 5, top: -k * 4, width: SW, height: SH,
                    borderRadius: 3, background: ['#C9D4EA', '#D8E0F1', '#E5EAF7'][3 - k],
                    border: '1px solid rgba(22,32,74,0.22)',
                  }}></div>
                ))}
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: 3, background: K.paper,
                  border: '1px solid rgba(22,32,74,0.24)',
                  boxShadow: '14px 16px 30px rgba(2,6,26,0.5)',
                  padding: '12px 11px 11px', display: 'flex', flexDirection: 'column',
                  boxSizing: 'border-box',
                }}>
                  <div style={{
                    font: '400 24px Archivo, sans-serif', color: K.paperInk,
                    lineHeight: 1.16, textAlign: 'center', textWrap: 'pretty',
                  }}>{d}</div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Glyph kind={DOC_ICONS[i]} size={46} color="#22315F" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7, paddingBottom: 2 }}>
                    {[1, 0.92, 0.84, 0.6].map((w, j) => (
                      <div key={j} style={{ height: 3, width: (100 * w) + '%', borderRadius: 3, background: 'rgba(22,32,74,0.17)' }}></div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{
          marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 14,
          padding: '16px 18px', borderRadius: 12,
          border: '1px solid rgba(74,134,247,0.3)', background: 'rgba(11,26,72,0.6)',
          opacity: M.enter(T, 0.3, 0.4),
        }}>
          <Glyph kind="shield" size={28} color={K.blue} />
          <div style={{ font: '300 24px Archivo, sans-serif', color: K.ink }}>Clinical accuracy. Approved by Burjeel.</div>
        </div>
      </Panel>

      {/* data stream + arrow 1 */}
      <div style={{ position: 'absolute', left: 538, top: 166, width: 104, height: 860, overflow: 'hidden' }}>
        {HEX.map((hx, i) => {
          const lane = i % 8;
          const dur = 2.6 + rnd(i) * 1.6;
          const ph = (T * (1 / dur) + rnd(i + 30)) % 1;
          const y = 120 + lane * 84 + Math.sin(ph * 6.0 + i) * 14;
          const fade = Math.sin(ph * Math.PI);
          return (
            <div key={i} style={{
              position: 'absolute', left: -22 + ph * 134, top: y,
              font: '500 22px "Courier New", monospace', letterSpacing: '0.08em',
              color: i % 3 === 0 ? K.purple : K.blue,
              opacity: fade * 0.95 * flow, whiteSpace: 'nowrap',
              textShadow: '0 0 12px rgba(74,134,247,0.6)',
            }}>{hx}</div>
          );
        })}
      </div>

      {/* 2 — MyOS converts into */}
      <Panel n="2" label="MyOS" sub="converts into" tone="p" bare a={p2} style={{ left: 650, top: 166, width: 598, height: 860 }}>
        <div style={{
          marginTop: 54, marginBottom: 54, height: 356, position: 'relative',
          opacity: M.enter(T, 0.12, 0.48),
        }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 6, overflow: 'hidden',
          border: '1px solid rgba(74,134,247,0.3)', background: 'rgba(8,18,58,0.72)',
          transform: 'skewY(' + (9 * tilt) + 'deg)',
          boxShadow: '0 24px 54px rgba(2,6,26,0.5)',
        }}>
          <svg width="548" height="356" viewBox="0 0 548 356" style={{ display: 'block' }}>
            {(() => {
              const COLS = 13, N = COLS * 6;
              const pos = (i) => {
                const c = i % COLS, r = Math.floor(i / COLS);
                return [
                  20 + c * 38 + (r % 2) * 19,
                  34 + r * 58 + (rnd(i) - 0.5) * 34 + Math.sin(T * 0.8 + i * 0.5) * 6,
                ];
              };
              const els = [];
              for (let i = 0; i < N; i++) {
                const [x, y] = pos(i);
                [1, COLS, COLS + 1].forEach((d) => {
                  const j = i + d;
                  if (j >= N) return;
                  if (d === 1 && (i % COLS) === COLS - 1) return;
                  const [nx2, ny2] = pos(j);
                  els.push(<line key={'l' + i + '_' + d} x1={x} y1={y} x2={nx2} y2={ny2}
                    stroke={d === 1 ? 'rgba(122,166,240,0.26)' : 'rgba(139,92,246,0.2)'} strokeWidth="1" />);
                });
              }
              for (let i = 0; i < N; i++) {
                const [x, y] = pos(i);
                const p = 0.5 + 0.5 * Math.sin(T * 1.6 + i * 0.7);
                els.push(<circle key={'n' + i} cx={x} cy={y} r={2.2 + 1.5 * p}
                  fill={i % 4 === 0 ? K.purple : K.blue} opacity={0.45 + 0.55 * p} />);
              }
              return els;
            })()}
          </svg>
          <div style={{ position: 'absolute', left: 14, top: 12, display: 'flex', gap: 7 }}>
            {[0, 1, 2].map((d) => (
              <div key={d} style={{ width: 8, height: 8, borderRadius: 8, background: 'rgba(147,170,210,0.45)' }}></div>
            ))}
          </div>
        </div>
        <div style={{
          position: 'absolute', right: -9, top: 0, width: 9, height: '100%', borderRadius: '0 4px 4px 0',
          background: 'linear-gradient(90deg, rgba(74,134,247,0.34), rgba(20,32,86,0.7))',
          transform: 'skewY(' + (9 * tilt) + 'deg)',
        }}></div>
        </div>
        <div style={{
          marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '26px 22px',
        }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              opacity: M.enter(T, 0.25 + i * 0.06, 0.38),
            }}>
              <Glyph kind={FEAT_ICONS[i]} size={30} color={K.purple} />
              <div style={{ font: '300 26px Archivo, sans-serif', color: K.ink, lineHeight: 1.24, textWrap: 'pretty' }}>{f}</div>
            </div>
          ))}
        </div>
      </Panel>

      {/* thin arrow 2 */}
      <svg width="90" height="860" viewBox="0 0 90 860" style={{ position: 'absolute', left: 1252, top: 166 }}>
        <g opacity={arrow2}>
          <path d="M6 430 H62" stroke={K.purple} strokeWidth="3" strokeLinecap="round" />
          <path d="M58 420 L80 430 L58 440" fill="none" stroke={K.purple} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>

      {/* 3 — example output */}
      <Panel n="3" label="Example output" tone="v" a={p3} style={{ left: 1370, top: 166, width: 496, height: 860 }}>
        <div style={{ font: '500 28px Archivo, sans-serif', color: '#FFFFFF', marginBottom: 12 }}>
          ACL Reconstruction Pathway
        </div>

        <div style={{
          borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(167,139,250,0.28)',
          background: '#000725', display: 'flex', height: 300, flexShrink: 0,
          opacity: M.enter(T, 0.16, 0.42),
        }}>
          <div style={{ flex: 1, padding: '14px 14px 14px 16px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <img src="out-logo.png" alt="Burjeel Hospital for Advanced Surgery"
              style={{ width: 152, height: 'auto', display: 'block', flex: 'none' }} />
            <div style={{ font: '400 21px Archivo, sans-serif', color: '#FFFFFF', marginTop: 10, lineHeight: 1.24 }}>
              Understanding your<br />ACL Reconstruction
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 92, height: 34, borderRadius: 999, flex: 'none',
                background: 'linear-gradient(90deg, #2B4FD8 0%, #3E63EE 46%, rgba(62,99,238,0.35) 100%)',
                display: 'flex', alignItems: 'center', paddingLeft: 5,
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 24, background: '#FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ width: 0, height: 0, borderLeft: '8px solid #2B4FD8', borderTop: '5px solid transparent', borderBottom: '5px solid transparent', marginLeft: 3 }}></div>
                </div>
              </div>
              <div style={{ font: '400 21px Archivo, sans-serif', color: '#FFFFFF' }}>2:45</div>
            </div>
          </div>
          <img src="out-knee.png" alt="" style={{
            width: 214, height: '100%', objectFit: 'cover', objectPosition: 'left center',
            flex: 'none', display: 'block',
          }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
          <div style={{
            borderRadius: 12, border: '1px solid rgba(167,139,250,0.24)', background: 'rgba(24,14,58,0.7)',
            padding: 14, height: 168, boxSizing: 'border-box', overflow: 'hidden',
            opacity: M.enter(T, 0.24, 0.4),
          }}>
            <div style={{ font: '400 21px Archivo, sans-serif', color: K.ink, lineHeight: 1.2 }}>Chat with your<br />recovery guide</div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 8 }}>
              <img src="out-chat.png" alt="" style={{ width: 76, height: 76, objectFit: 'cover', borderRadius: 8, flex: 'none' }} />
              <div style={{
                background: '#E9EEFB', color: K.paperInk, borderRadius: 9, padding: '6px 9px',
                font: '400 16px Archivo, sans-serif', lineHeight: 1.18,
              }}>How long until<br />I can drive?</div>
            </div>
          </div>

          <div style={{
            borderRadius: 12, border: '1px solid rgba(167,139,250,0.24)', background: 'rgba(24,14,58,0.7)',
            padding: 14, height: 168, boxSizing: 'border-box', overflow: 'hidden',
            opacity: M.enter(T, 0.3, 0.4),
          }}>
            <div style={{ font: '400 21px Archivo, sans-serif', color: K.ink, lineHeight: 1.2 }}>Rehabilitation<br />exercises</div>
            <img src="out-rehab.png" alt="" style={{
              width: '100%', height: 84, objectFit: 'cover', borderRadius: 8, marginTop: 10, display: 'block',
            }} />
          </div>

          <div style={{
            borderRadius: 12, border: '1px solid rgba(167,139,250,0.24)', background: 'rgba(24,14,58,0.7)',
            padding: 14, height: 168, boxSizing: 'border-box', overflow: 'hidden',
            opacity: M.enter(T, 0.36, 0.4),
          }}>
            <div style={{ font: '400 21px Archivo, sans-serif', color: K.ink, marginBottom: 7 }}>FAQs</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {FAQS.map((q, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                  padding: '8px 10px', borderRadius: 7, background: 'rgba(48,30,110,0.85)',
                  font: '400 18px Archivo, sans-serif', color: K.ink, whiteSpace: 'nowrap',
                }}>{q}<span style={{ color: K.purple }}>›</span></div>
              ))}
            </div>
          </div>

          <div style={{
            borderRadius: 12, border: '1px solid rgba(167,139,250,0.24)', background: 'rgba(24,14,58,0.7)',
            padding: 14, height: 168, boxSizing: 'border-box', position: 'relative', overflow: 'hidden',
            opacity: M.enter(T, 0.42, 0.4),
          }}>
            <div style={{ font: '400 21px Archivo, sans-serif', color: K.ink, lineHeight: 1.2, position: 'relative', zIndex: 1 }}>Disponible en<br />español</div>
            <svg width="176" height="104" viewBox="0 0 176 104" style={{ position: 'absolute', right: -18, bottom: -14, opacity: 0.5 }}>
              <g stroke={K.purple} strokeWidth="1.4" fill="none">
                <circle cx="88" cy="58" r="50" /><ellipse cx="88" cy="58" rx="21" ry="50" />
                <path d="M38 58h100M46 32h84M46 84h84" />
              </g>
            </svg>
          </div>
        </div>

        <div style={{
          marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
          padding: '12px 18px', borderRadius: 12, flexShrink: 0,
          border: '1px solid rgba(167,139,250,0.3)', background: 'rgba(38,20,84,0.7)',
          opacity: M.enter(T, 0.5, 0.42),
        }}>
          <Glyph kind="badge" size={28} color={K.purple} />
          <div style={{ font: '300 24px Archivo, sans-serif', color: K.ink }}>Consistent Burjeel branding</div>
        </div>
      </Panel>

    </div>
  );
}

function BurjeelSlide6() {
  const [t, setTweak] = window.useTweaks(window.TWEAK_DEFAULTS);
  window.__b6 = t;
  const P = window.TweaksPanel, S = window.TweakSlider, Tg = window.TweakToggle, Sec = window.TweakSection;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <CompositionStage width={W} height={H} bg="#05061C"
        scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
        <Piece />
      </CompositionStage>
      <P>
        <Sec label="Layout" />
        <S label="Document tilt" value={t.stackTilt} min={0} max={1.4} step={0.1}
          onChange={(v) => setTweak('stackTilt', v)} />
        <Tg label="Motion editor" value={t.motionEditor}
          onChange={(v) => setTweak('motionEditor', v)} />
      </P>
    </div>
  );
}

window.BurjeelSlide6 = BurjeelSlide6;
})();
