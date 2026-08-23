// Diagonal conveyor phone bank — three belts, uniformly spaced, rendered from the composition clock only.
const { useComposition, CompositionStage } = window;

const SERIF = "'Source Serif 4', Georgia, serif";
const SANS = "'Mulish', system-ui, sans-serif";
const INK = '#161a4d';
const IND = '#5b4fe0';
const IND_SOFT = '#8f87ee';
const MUTE = '#7d82a8';
const FILL = '#f4f4fa';
const LINE = '#e6e6f0';

const PH = 660, PW = 300;
const FRAME_W = 1672, FRAME_H = 941;
const PAD = 40;
const DUR = 24;            // authored loop length, matches OM_SCENES

const mod = (a, n) => ((a % n) + n) % n;

// ---------- illustration sketches ----------
const S = { fill: 'none', stroke: IND_SOFT, strokeWidth: 4.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
const S2 = { fill: 'none', stroke: IND, strokeWidth: 4, strokeLinecap: 'round', strokeLinejoin: 'round' };
const Art = ({ children }) => <svg viewBox="0 0 120 150" width="100%" height="100%">{children}</svg>;

const ART = {
  knee: <Art><g {...S}>
    <path d="M44 4v40" /><path d="M76 4v40" />
    <path d="M44 44c-14 4-16 22-4 26" /><path d="M76 44c14 4 16 22 4 26" />
    <path d="M40 70h40" /><path d="M36 80h48" />
    <path d="M46 84v62" /><path d="M74 84v62" />
    <ellipse cx="60" cy="58" rx="10" ry="8" style={S2} />
  </g></Art>,
  hip: <Art><g {...S}>
    <path d="M26 34c0-16 14-24 30-24s34 10 34 30c0 16-10 24-10 40" />
    <path d="M26 34c-10 14-8 34 6 44 12 8 22 4 26 16" />
    <circle cx="72" cy="52" r="16" style={S2} />
    <path d="M72 68v34" /><path d="M60 108c8 10 20 10 28 0" /><path d="M64 112v34" />
  </g></Art>,
  spine: <Art><g {...S}>
    {[0, 1, 2, 3, 4, 5].map(i => (
      <g key={i} transform={`translate(${60 + (i % 2 ? 3 : -3)} ${18 + i * 22})`}>
        <rect x="-16" y="-8" width="32" height="16" rx="7" />
        <path d="M16 0h12" /><path d="M-16 0h-12" />
      </g>
    ))}
  </g></Art>,
  runner: <Art><g {...S}>
    <circle cx="78" cy="24" r="11" style={S2} />
    <path d="M72 40c-8 6-16 14-18 24l-6 22" />
    <path d="M60 52l-30 6" /><path d="M30 58l-14 16" />
    <path d="M62 62l26 14" /><path d="M88 76l6 24" />
    <path d="M48 88l-20 26" /><path d="M28 114l-18 8" />
    <path d="M54 92l18 20" /><path d="M72 112l20 6" />
  </g></Art>,
  bridge: <Art><g {...S}>
    <path d="M8 120h104" />
    <circle cx="22" cy="92" r="10" style={S2} />
    <path d="M34 92h28" /><path d="M62 92c14 0 20-24 20-24" />
    <path d="M82 68c8 10 14 30 14 52" /><path d="M62 96c10 4 16 12 16 24" />
  </g></Art>,
  bone: <Art><g {...S}>
    <path d="M22 106c-10-6-8-20 4-20-6-12 8-20 16-10l50-46c-8-12 6-24 16-14 12-2 16 12 6 18-2 12-14 14-20 8l-50 46c8 10-2 24-14 18-2 10-14 10-18 0z" />
    <path d="M40 84l38-34" style={S2} />
    {[[44, 78], [56, 68], [68, 58], [80, 48]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="3.5" style={S2} />)}
  </g></Art>,
  skin: <Art><g {...S}>
    <circle cx="60" cy="72" r="42" />
    <circle cx="60" cy="72" r="24" style={S2} />
    <circle cx="52" cy="64" r="5" style={S2} />
    <circle cx="68" cy="80" r="4" style={S2} />
    <path d="M32 44a56 56 0 0 1 20-14" />
  </g></Art>,
  legRaise: <Art><g {...S}>
    <path d="M6 118h108" />
    <circle cx="20" cy="106" r="9" style={S2} />
    <path d="M30 110h34" /><path d="M64 110l34-44" />
    <path d="M64 110l28 8" />
  </g></Art>,
  heelSlide: <Art><g {...S}>
    <path d="M6 120h108" />
    <circle cx="18" cy="108" r="9" style={S2} />
    <path d="M28 112h30" /><path d="M58 112l22-32" /><path d="M80 80l18 38" />
    <path d="M58 60c14-6 30-2 40 8" style={{ ...S2, strokeDasharray: '6 8' }} />
  </g></Art>,
  cycle: <Art><g {...S}>
    <circle cx="34" cy="106" r="20" /><circle cx="90" cy="106" r="20" />
    <path d="M34 106l22-34h26l8 34" />
    <path d="M56 72l-8-22h18" style={S2} />
    <circle cx="60" cy="98" r="7" style={S2} />
  </g></Art>,
  walk: <Art><g {...S}>
    <circle cx="62" cy="22" r="11" style={S2} />
    <path d="M62 34v40" /><path d="M62 44l-22 14" /><path d="M62 48l22 12" />
    <path d="M62 74l-18 34" /><path d="M44 108l-14 12" />
    <path d="M62 74l20 30" /><path d="M82 104l14 14" />
  </g></Art>,
  stretch: <Art><g {...S}>
    <path d="M6 122h108" />
    <circle cx="34" cy="52" r="10" style={S2} />
    <path d="M34 62v34" /><path d="M34 96l40 24" /><path d="M34 96l-16 24" />
    <path d="M34 74l40-8" /><path d="M74 66l16 12" />
  </g></Art>,
  posture: <Art><g {...S}>
    <circle cx="52" cy="20" r="10" style={S2} />
    <path d="M52 30c-4 16-2 34 2 50 2 12 2 24 0 38" />
    <path d="M40 52h24" /><path d="M54 118l-16 10" /><path d="M54 118l16 10" />
    <path d="M92 12v126" style={{ ...S, strokeDasharray: '7 9' }} />
  </g></Art>,
  timer: <Art><g {...S}>
    <circle cx="60" cy="76" r="40" />
    <path d="M60 76V48" style={S2} /><path d="M60 76l20 12" style={S2} />
    <path d="M46 24h28" /><path d="M60 24v12" />
  </g></Art>
};

// ---------- shared atoms ----------
const Wordmark = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <svg viewBox="0 0 24 24" width="18" height="18"><g fill={IND}>
      <circle cx="12" cy="6" r="4" /><circle cx="6.5" cy="14" r="4" /><circle cx="17.5" cy="14" r="4" />
    </g></svg>
    <div style={{ lineHeight: 1 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: INK, letterSpacing: '-.01em' }}>burjeel</div>
      <div style={{ fontSize: 9, color: MUTE, letterSpacing: '.16em' }}>holdings</div>
    </div>
  </div>
);

const cardBox = { background: FILL, borderRadius: 20, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 9 };

const Bar = ({ pct }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <div style={{ flex: 1, height: 9, borderRadius: 5, background: '#e0e0ec' }}>
      <div style={{ width: pct, height: '100%', borderRadius: 5, background: IND }} />
    </div>
    <div style={{ fontSize: 12, color: INK, fontWeight: 600 }}>{pct}</div>
  </div>
);

const Eyebrow = ({ children }) => (
  <div style={{ fontSize: 12, color: IND, fontWeight: 600, letterSpacing: '.02em' }}>{children}</div>
);

const Title = ({ children, size }) => (
  <div style={{ fontFamily: SERIF, fontSize: size || 36, lineHeight: 1.02, color: INK, fontWeight: 600, letterSpacing: '-.015em' }}>{children}</div>
);

const Button = ({ children }) => (
  <div style={{
    background: IND, color: '#fff', borderRadius: 16, padding: '15px 18px',
    fontSize: 14, fontWeight: 600, textAlign: 'center'
  }}>{children}</div>
);

function TabIcon({ i }) {
  const c = i === 0 ? IND : '#b9bcd4';
  const p = [
    'M4 11L12 4l8 7v9H4z',
    'M4 6h16v11H9l-5 4z',
    'M5 19V9M12 19V5M19 19v-7',
    'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c1.6-4 14.4-4 16 0'
  ][i];
  return <svg viewBox="0 0 24 24" width="21" height="21" style={{ display: 'block' }}>
    <path d={p} fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}

// ---------- screen types ----------
function Screen(d) {
  const art = ART[d.art];
  if (d.type === 'exercise') return <>
    <Eyebrow>{d.eyebrow}</Eyebrow>
    <Title>{d.title}</Title>
    <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 0' }}>{art}</div>
    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
      {d.meta.map(m => (
        <div key={m} style={{ flex: 1, background: FILL, borderRadius: 14, padding: '11px 8px', textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: INK, fontWeight: 600 }}>{m[0]}</div>
          <div style={{ fontSize: 10, color: MUTE, marginTop: 3 }}>{m[1]}</div>
        </div>
      ))}
    </div>
    <div style={{ fontSize: 13, lineHeight: 1.35, color: MUTE, marginBottom: 12 }}>{d.note}</div>
    <Button>{d.cta || 'Start exercise'}</Button>
  </>;

  if (d.type === 'checkin') return <>
    <Eyebrow>{d.eyebrow}</Eyebrow>
    <Title>{d.title}</Title>
    <div style={{ fontSize: 15, lineHeight: 1.35, color: INK, marginTop: 14 }}>{d.ask}</div>
    <div style={{ display: 'flex', gap: 4, marginTop: 16 }}>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
        <div key={n} style={{
          flex: 1, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: n === d.pick ? IND : FILL, color: n === d.pick ? '#fff' : MUTE, fontSize: 11, fontWeight: 600
        }}>{n}</div>
      ))}
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: MUTE, marginTop: 7 }}>
      <span>{d.low}</span><span>{d.high}</span>
    </div>
    <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{art}</div>
    <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
      {d.pills.map((p, i) => (
        <div key={p} style={{
          padding: '9px 13px', borderRadius: 999, fontSize: 12,
          border: `1px solid ${i === d.pillPick ? IND : LINE}`,
          background: i === d.pillPick ? '#efedfd' : '#fff', color: i === d.pillPick ? IND : MUTE
        }}>{p}</div>
      ))}
    </div>
    <Button>{d.cta || 'Submit check-in'}</Button>
  </>;

  if (d.type === 'dashboard') return <>
    <Eyebrow>{d.eyebrow}</Eyebrow>
    <Title>{d.title}</Title>
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginTop: 18 }}>
      <div style={{ fontFamily: SERIF, fontSize: 58, lineHeight: .9, color: IND, fontWeight: 600 }}>{d.big}</div>
      <div style={{ fontSize: 12, color: MUTE, paddingBottom: 6 }}>{d.bigLabel}</div>
    </div>
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 7, height: 92, marginTop: 22 }}>
      {d.bars.map((h, i) => (
        <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 6, background: i === d.bars.length - 1 ? IND : '#dcdaf6' }} />
      ))}
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: MUTE, marginTop: 7 }}>
      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((l, i) => <span key={i}>{l}</span>)}
    </div>
    <div style={{ flex: 1, minHeight: 0 }} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 14 }}>
      {d.rows.map(r => (
        <div key={r[0]} style={cardBox}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: MUTE }}>{r[0]}</span><span style={{ color: INK, fontWeight: 600 }}>{r[1]}</span>
          </div>
          <Bar pct={r[2]} />
        </div>
      ))}
    </div>
  </>;

  if (d.type === 'guidance') return <>
    <Eyebrow>{d.eyebrow}</Eyebrow>
    <Title>{d.title}</Title>
    <div style={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '6px 0' }}>{art}</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0 }}>
      {d.steps.map((s, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{
            width: 24, height: 24, flex: 'none', borderRadius: 999, background: '#efedfd',
            color: IND, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>{i + 1}</div>
          <div style={{ fontSize: 13, lineHeight: 1.35, color: INK }}>{s}</div>
        </div>
      ))}
    </div>
    <div style={{ paddingBottom: 14 }}><Button>{d.cta || 'Mark as read'}</Button></div>
  </>;

  if (d.type === 'plan') return <>
    <Eyebrow>{d.eyebrow}</Eyebrow>
    <Title>{d.title}</Title>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20, flex: 1, minHeight: 0 }}>
      {d.items.map((it, i) => (
        <div key={i} style={{ ...cardBox, gap: 6, flexDirection: 'row', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: INK, fontWeight: 600 }}>{it[0]}</div>
            <div style={{ fontSize: 11, color: MUTE, marginTop: 4 }}>{it[1]}</div>
          </div>
          <div style={{
            width: 22, height: 22, borderRadius: 999, flex: 'none',
            border: `1.5px solid ${it[2] ? IND : LINE}`, background: it[2] ? IND : '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {it[2] ? <svg viewBox="0 0 24 24" width="13" height="13"><path d="M5 13l4 4 10-10" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
          </div>
        </div>
      ))}
    </div>
    <div style={{ paddingBottom: 14 }}><Button>{d.cta || 'View full plan'}</Button></div>
  </>;

  // hero
  return <>
    <Title size={40}>{d.title}</Title>
    <div style={{ fontSize: 12.5, color: MUTE, marginTop: 10 }}>{d.sub}</div>
    <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 0' }}>{art}</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 14 }}>
      <div style={cardBox}>
        <div style={{ fontSize: 12, color: MUTE }}>{d.progLabel}</div>
        <div style={{ fontSize: 13, color: INK }}>{d.progVal}</div>
        <Bar pct={d.pct} />
      </div>
      <div style={{ ...cardBox, gap: 8 }}>
        <div style={{ fontSize: 12, color: MUTE }}>Today&rsquo;s follow-up</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
          <div style={{ flex: 1, fontSize: 14, lineHeight: 1.3, color: INK }}>{d.ask}</div>
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M9 5l7 7-7 7" fill="none" stroke={MUTE} strokeWidth="2" strokeLinecap="round" /></svg>
        </div>
      </div>
    </div>
  </>;
}

const Phone = React.memo(function Phone({ data }) {
  return (
    <div style={{
      width: PW, height: PH, borderRadius: 46, background: '#ececf3', padding: 9, boxSizing: 'border-box',
      boxShadow: '0 46px 70px -28px rgba(28,28,74,.30), 0 6px 18px rgba(28,28,74,.10)'
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: 38, background: '#fff', boxSizing: 'border-box',
        padding: '24px 22px 0', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: SANS
      }}>
        <div style={{ marginBottom: 22 }}><Wordmark /></div>
        <Screen {...data} />
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 8px 16px', borderTop: `1px solid #f0f0f6` }}>
          {['Home', 'Messages', 'Progress', 'Profile'].map((l, i) => (
            <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <TabIcon i={i} />
              <div style={{ fontSize: 10, color: i === 0 ? IND : '#b9bcd4' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// ---------- content ----------
const ACL = [
  { type: 'hero', title: <>ACL<br />reconstruction</>, sub: 'Personalized care. Better recovery.', art: 'knee', progLabel: 'Your recovery progress', progVal: 'Week 3 of 12', pct: '42%', ask: 'How is your knee pain today?' },
  { type: 'guidance', eyebrow: 'ACL reconstruction', title: <>Recovery<br />overview</>, art: 'knee', steps: ['Weeks 1–2: swelling control and full knee extension.', 'Weeks 3–6: quad activation and normal walking.', 'Weeks 6–12: strength, balance and cycling.'], cta: 'Continue' },
  { type: 'exercise', eyebrow: 'Week 3 · Exercise 1 of 5', title: 'Heel slides', art: 'heelSlide', meta: [['3', 'sets'], ['10', 'reps'], ['5s', 'hold']], note: 'Slide the heel towards you until you feel a gentle stretch, then release slowly.' },
  { type: 'exercise', eyebrow: 'Week 3 · Exercise 2 of 5', title: 'Quad sets', art: 'legRaise', meta: [['3', 'sets'], ['12', 'reps'], ['5s', 'hold']], note: 'Tighten the thigh muscle and press the back of the knee into the bed.' },
  { type: 'exercise', eyebrow: 'Week 3 · Exercise 3 of 5', title: 'Ankle pumps', art: 'timer', meta: [['4', 'sets'], ['20', 'reps'], ['2s', 'pace']], note: 'Point and flex the foot slowly to keep circulation moving.' },
  { type: 'exercise', eyebrow: 'Week 3 · Exercise 4 of 5', title: <>Seated knee<br />flexion</>, art: 'knee', meta: [['3', 'sets'], ['10', 'reps'], ['10s', 'hold']], note: 'Let the knee bend under its own weight, then assist gently back up.' },
  { type: 'exercise', eyebrow: 'Week 3 · Exercise 5 of 5', title: <>Stationary<br />cycling</>, art: 'cycle', meta: [['10', 'min'], ['Low', 'resist'], ['60', 'rpm']], note: 'Keep a steady, pain-free cadence. Stop if the knee feels sharp.', cta: 'Start session' },
  { type: 'checkin', eyebrow: 'Today’s check-in', title: <>Pain &amp;<br />swelling</>, ask: 'How is your knee pain today?', pick: 3, low: 'No pain', high: 'Severe', art: 'knee', pills: ['None', 'Mild', 'Moderate'], pillPick: 1 },
  { type: 'dashboard', eyebrow: 'ACL reconstruction', title: <>Recovery<br />progress</>, big: '42%', bigLabel: 'Week 3 of 12 complete', bars: [40, 55, 45, 70, 60, 80, 72], rows: [['Knee extension', '0°', '92%'], ['Exercises completed', '18 of 20', '90%'], ['Daily check-ins', '6 of 7', '86%']] }
];

const JOINT = [
  { type: 'hero', title: <>Joint<br />replacement</>, sub: 'Personalized care. Better recovery.', art: 'hip', progLabel: 'Your recovery progress', progVal: 'Week 6 of 12', pct: '55%', ask: 'How is your hip today?' },
  { type: 'plan', eyebrow: 'Joint replacement · Week 6', title: <>Walking<br />progression</>, items: [['Morning walk', '15 min · assisted', true], ['Afternoon walk', '20 min · unassisted', true], ['Evening walk', '20 min · unassisted', false]] },
  { type: 'exercise', eyebrow: 'Week 6 · Mobility', title: <>Hip abduction<br />slides</>, art: 'legRaise', meta: [['3', 'sets'], ['12', 'reps'], ['3s', 'hold']], note: 'Slide the leg out to the side, keeping the toes pointing forward.' },
  { type: 'checkin', eyebrow: 'Today’s check-in', title: 'Pain check-in', ask: 'How is your hip pain after walking?', pick: 2, low: 'No pain', high: 'Severe', art: 'hip', pills: ['Better', 'Same', 'Worse'], pillPick: 0 },
  { type: 'plan', eyebrow: 'Joint replacement', title: <>Recovery<br />milestones</>, items: [['Walk without crutches', 'Reached in week 5', true], ['Climb a full flight of stairs', 'Reached in week 6', true], ['Drive again', 'Expected week 8', false]] }
];

const SPORTS = [
  { type: 'hero', title: <>Sports<br />medicine</>, sub: 'Personalized care. Better recovery.', art: 'runner', progLabel: 'Your recovery progress', progVal: 'Week 2 of 12', pct: '45%', ask: 'How was your activity level today?' },
  { type: 'exercise', eyebrow: 'Week 2 · Mobility', title: <>Hamstring<br />stretch</>, art: 'stretch', meta: [['2', 'sets'], ['4', 'reps'], ['30s', 'hold']], note: 'Hinge from the hip with a long spine until you feel a light pull.' },
  { type: 'dashboard', eyebrow: 'Sports medicine', title: <>Return to<br />activity</>, big: '68%', bigLabel: 'of pre-injury load', bars: [30, 45, 50, 62, 58, 72, 68], rows: [['Running volume', '18 km', '64%'], ['Sprint tolerance', '80% speed', '80%'], ['Symptom-free days', '5 of 7', '71%']] },
  { type: 'exercise', eyebrow: 'Week 2 · Strength', title: <>Single-leg<br />bridge</>, art: 'bridge', meta: [['3', 'sets'], ['8', 'reps'], ['5s', 'hold']], note: 'Drive through the heel and keep the hips level as you lift.' },
  { type: 'checkin', eyebrow: 'Today’s check-in', title: <>Readiness<br />check</>, ask: 'How ready do you feel to train today?', pick: 7, low: 'Not ready', high: 'Fully ready', art: 'runner', pills: ['Fresh', 'Sore', 'Fatigued'], pillPick: 1 }
];

const ORTHO = [
  { type: 'hero', title: 'Orthopedics', sub: 'Personalized care. Better recovery.', art: 'bone', progLabel: 'Your recovery progress', progVal: 'Week 3 of 12', pct: '40%', ask: 'How is your recovery going?' },
  { type: 'dashboard', eyebrow: 'Orthopedics', title: <>Recovery<br />dashboard</>, big: '40%', bigLabel: 'Week 3 of 12 complete', bars: [25, 38, 42, 40, 55, 48, 60], rows: [['Weight bearing', 'Partial', '50%'], ['Range of motion', '70°', '62%'], ['Follow-ups answered', '5 of 7', '71%']] },
  { type: 'guidance', eyebrow: 'Movement guidance', title: <>Protecting<br />the repair</>, art: 'bone', steps: ['Keep the brace on for walking and sleeping.', 'Partial weight bearing only, with crutches.', 'Avoid twisting the leg when standing up.'] },
  { type: 'checkin', eyebrow: 'Follow-up questions', title: <>Weekly<br />review</>, ask: 'Any new pain around the surgical site?', pick: 1, low: 'None', high: 'Severe', art: 'bone', pills: ['No change', 'Some redness', 'Swelling'], pillPick: 0, cta: 'Send to care team' },
  { type: 'exercise', eyebrow: 'Week 3 · Exercise', title: <>Straight leg<br />raise</>, art: 'legRaise', meta: [['3', 'sets'], ['10', 'reps'], ['5s', 'hold']], note: 'Lift the straight leg to hip height, keeping the knee locked.' }
];

const SPINE = [
  { type: 'hero', title: 'Spine', sub: 'Personalized care. Better recovery.', art: 'spine', progLabel: 'Your recovery progress', progVal: 'Week 4 of 12', pct: '35%', ask: 'How is your back feeling today?' },
  { type: 'guidance', eyebrow: 'Posture guidance', title: <>Sitting and<br />standing</>, art: 'posture', steps: ['Stack ears over shoulders over hips.', 'Change position every 30 minutes.', 'Hinge at the hips to lift, never at the waist.'] },
  { type: 'exercise', eyebrow: 'Week 4 · Mobility', title: <>Pelvic tilts</>, art: 'spine', meta: [['3', 'sets'], ['10', 'reps'], ['5s', 'hold']], note: 'Flatten the lower back gently into the mat, then release.' },
  { type: 'checkin', eyebrow: 'Today’s check-in', title: 'Pain check-in', ask: 'How is your back feeling today?', pick: 4, low: 'No pain', high: 'Severe', art: 'spine', pills: ['Lower back', 'Mid back', 'Leg'], pillPick: 0 }
];

const PHYSIO = [
  { type: 'hero', title: 'Physiotherapy', sub: 'Personalized care. Better recovery.', art: 'bridge', progLabel: 'Your recovery progress', progVal: 'Session 6 of 10', pct: '60%', ask: 'How is your session today?' },
  { type: 'exercise', eyebrow: 'Session 6 · Exercise 1', title: <>Glute<br />bridge</>, art: 'bridge', meta: [['3', 'sets'], ['12', 'reps'], ['3s', 'hold']], note: 'Squeeze the glutes at the top and lower one vertebra at a time.' },
  { type: 'exercise', eyebrow: 'Session 6 · Exercise 2', title: <>Straight<br />leg raise</>, art: 'legRaise', meta: [['3', 'sets'], ['10', 'reps'], ['5s', 'hold']], note: 'Keep the opposite knee bent to protect the lower back.' },
  { type: 'exercise', eyebrow: 'Session 6 · Exercise 3', title: <>Hip flexor<br />stretch</>, art: 'stretch', meta: [['2', 'sets'], ['3', 'reps'], ['40s', 'hold']], note: 'Tuck the pelvis under before leaning forward into the stretch.' },
  { type: 'exercise', eyebrow: 'Session 6 · Hold timer', title: <>Wall sit<br />hold</>, art: 'timer', meta: [['4', 'rounds'], ['45s', 'hold'], ['30s', 'rest']], note: 'Round 2 of 4 in progress. Keep the knees behind the toes.', cta: 'Resume timer' },
  { type: 'dashboard', eyebrow: 'Physiotherapy', title: <>Progress<br />tracking</>, big: '60%', bigLabel: 'Session 6 of 10 complete', bars: [45, 52, 58, 55, 66, 62, 74], rows: [['Sessions attended', '6 of 6', '100%'], ['Home exercises', '14 of 18', '78%'], ['Reported pain', 'Down 3 pts', '65%']] }
];

const DERM = [
  { type: 'hero', title: 'Dermatology', sub: 'Personalized care. Better skin health.', art: 'skin', progLabel: 'Your progress', progVal: 'Month 2 of 4', pct: '50%', ask: 'Please share new photos of the area.' },
  { type: 'checkin', eyebrow: 'Today\u2019s check-in', title: <>Skin<br />check-in</>, ask: 'How itchy or irritated is the area today?', pick: 2, low: 'None', high: 'Severe', art: 'skin', pills: ['Clearer', 'No change', 'Flaring'], pillPick: 0, cta: 'Add a photo' },
  { type: 'guidance', eyebrow: 'Guidance', title: <>Caring for<br />the area</>, art: 'skin', steps: ['Apply the cream twice daily on clean, dry skin.', 'Use sun protection on the treated area.', 'Photograph the area in the same light each week.'] },
  { type: 'dashboard', eyebrow: 'Dermatology', title: <>Treatment<br />progress</>, big: '50%', bigLabel: 'Month 2 of 4 complete', bars: [30, 42, 48, 44, 56, 52, 64], rows: [['Photos submitted', '7 of 8', '88%'], ['Treatment applied', '26 of 28 days', '93%'], ['Reported irritation', 'Down 2 pts', '60%']] }
];

// ---------- belts ----------
// Each belt is a straight diagonal track: phones sit at uniform intervals along
// the phones' own tilt axis, and wrap by one full track length (N * spacing),
// so the stream is continuous and the loop closes exactly.
const BELTS = [
  { id: 'A', dir: 1, s: 0.78, uBase: 84, p: [1079, 1087, 1073, 1083, 1069, 1085, 1079, 1071, 1081], spacing: 540, z: 30,
    seq: ACL },
  { id: 'B', dir: -1, s: 0.57, uBase: -212, p: [1289, 1336, 1317], spacing: 332, z: 10,
    seq: [], groups: [JOINT, SPORTS, ORTHO], count: 13 },
  { id: 'C', dir: 1, s: 0.57, uBase: -198, p: [1516, 1563, 1529], spacing: 360, z: 20,
    seq: [], groups: [SPINE, PHYSIO, DERM], count: 12 }
];

function trackFor(belt) {
  if (belt.seq.length) return belt.seq;
  const out = [];
  const counters = belt.groups.map(() => 0);
  for (let i = 0; i < belt.count; i++) {
    const g = i % belt.groups.length;
    const list = belt.groups[g];
    out.push(list[counters[g]++ % list.length]);
  }
  return out;
}

function Belts({ T, tilt, flip }) {
  const rad = (tilt * Math.PI) / 180;
  const sn = Math.sin(rad), cs = Math.cos(rad);
  const out = [];
  BELTS.forEach(belt => {
    const track = trackFor(belt);
    const N = track.length;
    const L = N * belt.spacing;
    const h = PH * belt.s;
    const dir = belt.dir * (flip ? -1 : 1);
    const v = L / DUR;
    track.forEach((data, k) => {
      const p = belt.p[k % belt.p.length];
      const u0 = belt.uBase + k * belt.spacing;
      const uTop = (-(h / 2 + PAD) - p * sn) / cs;   // just off the top edge — the wrap seam
      const u = uTop + mod(u0 + dir * v * T - uTop, L);
      const x = -u * sn + p * cs;
      const y = u * cs + p * sn;
      out.push(
        <div key={belt.id + k} style={{
          position: 'absolute', left: 0, top: 0, width: 0, height: 0, zIndex: belt.z + (k % 2),
          transform: `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`
        }}>
          <div style={{
            position: 'absolute', left: -PW / 2, top: -PH / 2, width: PW, height: PH,
            transform: `rotate(${tilt}deg) scale(${belt.s})`, transformOrigin: '50% 50%'
          }}>
            <Phone data={data} />
          </div>
        </div>
      );
    });
  });
  return out;
}

function Piece({ staticLayer, tilt, flip }) {
  const { T } = useComposition();
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#f6f6fb', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }}>{staticLayer}</div>
      <div style={{ position: 'absolute', left: 706, top: 0, width: FRAME_W - 706, height: FRAME_H, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: -706, top: 0, width: FRAME_W, height: FRAME_H }}>
          <Belts T={T} tilt={tilt} flip={flip} />
        </div>
      </div>
    </div>
  );
}

window.PhoneSlide = function PhoneSlide({ children, tiltDegrees, flipDirections }) {
  const tilt = typeof tiltDegrees === 'number' ? tiltDegrees : 16;
  return (
    <CompositionStage width={FRAME_W} height={FRAME_H} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg="#f6f6fb">
      <Piece staticLayer={children} tilt={tilt} flip={!!flipDirections} />
    </CompositionStage>
  );
};
