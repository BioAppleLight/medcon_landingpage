/* Burjeel news → impact composition */
const { useComposition, animate, Easing: E, CompositionStage } = window;
const { useTweaks, TweaksPanel, TweakSection, TweakToggle, TweakSlider, TweakColor } = window;

const MOTION = {
  enter: (from, to, start, dur) => animate({ from, to, start, end: start + dur, ease: E.easeOutCubic }),
  glide: (from, to, start, end) => animate({ from, to, start, end, ease: E.easeInOutCubic }),
  pop: (from, to, start, dur) => animate({ from, to, start, end: start + dur, ease: E.easeOutBack }),
};

const SERIF = "'Playfair Display', Georgia, serif";
const SANS = "'Poppins', system-ui, sans-serif";

const GROUPS = [
  {
    cue: 'Patient', label: 'Patient impact', color: '#8B5CF6', icon: 'person',
    items: ['Easier access to trusted information', 'Fewer uncertainties after discharge',
      'Better understanding of rehabilitation', 'More convenient follow-up',
      'Potential improvement in adherence', 'Reduced dependence on generic internet information'],
  },
  {
    cue: 'Clinician', label: 'Clinician impact', color: '#F472B6', icon: 'doctor',
    items: ['Fewer repetitive explanations', 'Better-prepared patients',
      'More appointment time for examination, correction and decision-making'],
  },
  {
    cue: 'Burjeel', label: 'Burjeel impact', color: '#A78BFA', icon: 'network',
    items: ['Stronger continuity of care', 'Branded digital patient relationship after discharge',
      'Differentiating patient experience', 'Scalable infrastructure for other procedures',
      'Innovation / reputation benefit'],
  },
];

function Icon({ kind, color }) {
  const s = { fill: 'none', stroke: color, strokeWidth: 3.4, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (kind === 'person') return (
    <svg width="54" height="54" viewBox="0 0 64 64"><circle cx="32" cy="20" r="11" {...s} /><path d="M12 56c0-11 9-19 20-19s20 8 20 19" {...s} /></svg>
  );
  if (kind === 'doctor') return (
    <svg width="54" height="54" viewBox="0 0 64 64"><path d="M20 10v10a12 12 0 0 0 24 0V10" {...s} /><path d="M32 32v10" {...s} /><path d="M32 42h10a6 6 0 0 1 6 6v4" {...s} /><circle cx="48" cy="56" r="4" {...s} /><path d="M32 42H22a6 6 0 0 0-6 6v6" {...s} /></svg>
  );
  return (
    <svg width="54" height="54" viewBox="0 0 64 64"><rect x="18" y="8" width="28" height="30" rx="3" {...s} /><circle cx="32" cy="20" r="4" {...s} /><path d="M32 38v8M32 46H14v8M32 46h18v8M32 46v8" {...s} /></svg>
  );
}

function NewsCluster() {
  const card = { background: '#fff', borderRadius: 0, overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,.55)' };
  return (
    <div style={{ width: 1250, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{ ...card, flex: '0 0 700px', padding: '22px 24px 26px' }}>
          <img src="assets/gulf.png" alt="Gulf News: Burjeel Holdings launches BEACON" style={{ width: '100%', display: 'block', borderRadius: 0 }} />
        </div>
        <div style={{ ...card, flex: '1 1 auto', padding: '22px 24px 24px' }}>
          <img src="assets/yahoo.png" alt="Yahoo Finance: Burjeel opens new Day Surgery Center in Al Ain" style={{ width: '100%', display: 'block', borderRadius: 0 }} />
        </div>
      </div>
      <div style={{ ...card, padding: '18px 24px 0' }}>
        <img src="assets/bmc.png" alt="Burjeel Medical City and Digipharm collaborate" style={{ width: '100%', display: 'block', borderRadius: 0 }} />
      </div>
    </div>
  );
}

function Piece({ t }) {
  const { T, CUES } = useComposition();
  const impactVideoRef = React.useRef(null);
  const impactVideoPlayingRef = React.useRef(false);
  const accent = t.accent || '#8B5CF6';
  const shift = CUES.Shift;
  const impact = CUES.Patient;

  React.useEffect(() => {
    const video = impactVideoRef.current;
    if (!video) return;
    const shouldPlay = T >= 6.63;
    if (shouldPlay === impactVideoPlayingRef.current) return;
    impactVideoPlayingRef.current = shouldPlay;
    if (shouldPlay) {
      const request = video.play();
      if (request) request.catch(() => { impactVideoPlayingRef.current = false; });
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [T]);

  const fadeIn = MOTION.enter(0, 1, 0.15, 0.7)(T);

  // news cluster: centred + large -> parked left + small
  const drift = MOTION.glide(0, 1, 0.2, shift)(T);
  const s0 = 1.0 + 0.03 * drift, x0 = 335 - 22 * drift, y0 = 176 - 12 * drift;
  const sc = MOTION.glide(s0, 0.775, shift + 0.1, shift + 1.7)(T);
  const cx = MOTION.glide(x0, 42, shift + 0.1, shift + 1.7)(T);
  const cy = MOTION.glide(y0, 398, shift + 0.1, shift + 1.7)(T);

  const titleA = MOTION.enter(0, 1, 0.35, 0.9)(T) * MOTION.glide(1, 0, shift, shift + 0.5)(T);
  const titleAy = MOTION.enter(34, 0, 0.35, 1.1)(T);
  const titleB = MOTION.enter(0, 1, shift + 0.85, 0.9)(T);
  const titleBy = MOTION.enter(30, 0, shift + 0.85, 1.1)(T);
  const panelX = MOTION.glide(760, 0, shift + 0.35, shift + 1.6)(T);

  const footer = MOTION.pop(0, 1, impact, 0.7)(T);

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#07040f', fontFamily: SANS, opacity: fadeIn, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: -300, top: -260, width: 1400, height: 1100, background: 'radial-gradient(circle at 30% 30%, rgba(124,58,237,.20), transparent 62%)' }} />

      {/* right impact panel, revealed by a diagonal wipe */}
      <div style={{
        position: 'absolute', left: 1140, top: 0, width: 780, height: 1080,
        transform: `translateX(${panelX}px)`,
        clipPath: 'polygon(108px 0, 780px 0, 780px 1080px, 0px 1080px)',
        background: 'linear-gradient(200deg, #1a0b34 0%, #10061f 55%, #0b0417 100%)',
        borderLeft: `2px solid ${accent}`,
      }}>
        <video
          ref={impactVideoRef}
          src="https://pub-9c0b5a57bb204edca8d45fe05db8821c.r2.dev/clipboard--sick--patient--free-stock-video-footage--no-copyright----4k-hospital-notes.mp4"
          muted
          loop
          playsInline
          preload="metadata"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: .3 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(200deg, rgba(26,11,52,.82) 0%, rgba(16,6,31,.9) 55%, rgba(11,4,23,.96) 100%)' }} />
        <div style={{ position: 'absolute', zIndex: 1, left: 118, top: 44, right: 30, bottom: 32, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {GROUPS.map((g, gi) => {
            const c = impact;
            const head = MOTION.enter(0, 1, c, 0.7)(T);
            return (
              <div key={g.label} style={{ display: 'flex', gap: 22, opacity: head, borderTop: gi ? '1px solid rgba(255,255,255,.10)' : 'none', paddingTop: gi ? 14 : 0 }}>
                <div style={{
                  flex: '0 0 92px', height: 92, borderRadius: '50%', display: 'grid', placeItems: 'center',
                  border: `2px solid ${g.color}55`, background: `radial-gradient(circle at 50% 50%, ${g.color}22, transparent 70%)`,
                  transform: `scale(${MOTION.pop(0.7, 1, c, 0.8)(T)})`,
                }}>
                  <Icon kind={g.icon} color={g.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
                  <div style={{ color: g.color, fontSize: 28, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 6 }}>{g.label}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {g.items.map((it) => {
                      const st = c;
                      return (
                        <div key={it} style={{
                          display: 'flex', gap: 12, color: 'rgba(255,255,255,.90)', fontSize: Math.max(22, Number(t.bulletSize) || 22),
                          lineHeight: 1.3, opacity: MOTION.enter(0, 1, st, 0.5)(T),
                          transform: `translateX(${MOTION.enter(26, 0, st, 0.7)(T)}px)`,
                        }}>
                          <span style={{ color: g.color, opacity: .8 }}>•</span>
                          <span>{it}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          <div style={{
            marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 16, padding: '14px 22px',
            borderRadius: 999, border: `1px solid ${accent}66`, background: 'rgba(124,58,237,.10)',
            opacity: t.showTakeaway === false ? 0 : Math.min(1, footer),
            transform: `translateY(${(1 - footer) * 22}px)`,
          }}>
            <div style={{ flex: '0 0 34px', height: 34, borderRadius: '50%', background: accent, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 17 }}>★</div>
            <div style={{ color: 'rgba(255,255,255,.92)', fontSize: 20, lineHeight: 1.3 }}>Better patient experience. More focused clinician time. One scalable Burjeel care layer.</div>
          </div>
        </div>
      </div>

      {/* opening headline */}
      <div style={{
        position: 'absolute', left: 0, top: 46, width: 1920, textAlign: 'center',
        opacity: titleA, transform: `translateY(${titleAy}px)`,
      }}>
        <div style={{ color: accent, fontSize: 54, fontWeight: 700, letterSpacing: '-0.02em' }}>
          Burjeel one of the region’s leading surgical providers
        </div>
      </div>

      {/* impact-slide headline */}
      <div style={{
        position: 'absolute', left: 58, top: 66, width: 640,
        opacity: titleB, transform: `translateY(${titleBy}px)`,
        fontFamily: SERIF, fontWeight: 900, fontSize: 92, lineHeight: 0.98, color: '#fff', letterSpacing: '-0.02em',
      }}>
        Why this<br />matters for<br /><span style={{ color: accent }}>Burjeel</span>
      </div>

      <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate(${cx}px, ${cy}px) scale(${sc})`, transformOrigin: '0 0' }}>
        <NewsCluster />
      </div>
    </div>
  );
}

function App() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  return (
    <div style={{ width: '100%' }}>
      <CompositionStage width={1920} height={1080} bg="#07040f" autoplay={window.self === window.top} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
        <Piece t={t} />
      </CompositionStage>
      <TweaksPanel>
        <TweakSection label="Motion" />
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
        <TweakSection label="Look" />
        <TweakColor label="Accent" value={t.accent} options={['#8B5CF6', '#6D28D9', '#F472B6', '#38BDF8']} onChange={(v) => setTweak('accent', v)} />
        <TweakSlider label="Bullet size" value={t.bulletSize} min={20} max={30} unit="px" onChange={(v) => setTweak('bulletSize', v)} />
        <TweakToggle label="Takeaway line" value={t.showTakeaway} onChange={(v) => setTweak('showTakeaway', v)} />
      </TweaksPanel>
    </div>
  );
}

window.App = App;
