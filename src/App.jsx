import { useState, useEffect, useRef } from "react";

// ─── GLOBAL STYLES ───────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #060B14;
      --surface: #0D1526;
      --card: #111D35;
      --card2: #162240;
      --border: rgba(82,160,255,0.12);
      --border2: rgba(82,160,255,0.22);
      --blue: #3A8DFF;
      --blue-glow: rgba(58,141,255,0.35);
      --cyan: #00D4FF;
      --cyan-glow: rgba(0,212,255,0.25);
      --teal: #00C9A7;
      --teal-glow: rgba(0,201,167,0.25);
      --amber: #FFB547;
      --red: #FF5252;
      --red-glow: rgba(255,82,82,0.3);
      --text: #EAF2FF;
      --text2: #7B9CC0;
      --text3: #4A6A8A;
      --font: 'Outfit', sans-serif;
      --mono: 'Space Mono', monospace;
      --radius: 20px;
      --radius-sm: 12px;
    }

    html, body {
      height: 100%;
      margin: 0;
      padding: 0;
      background: #030609;
      font-family: var(--font);
    }

    #root {
      min-height: 100vh;
      width: 100%;
    }

    .app-root {
      min-height: 100vh;
      width: 100%;
      background: radial-gradient(ellipse at center, #0D1B3E 0%, #030609 70%);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      font-family: var(--font);
    }

    .app-root.light {
      background: radial-gradient(ellipse at center, #C8DEFF 0%, #EAF2FF 70%);
    }

    .app-shell {
      width: 100%;
      min-height: 100vh;
      background: var(--bg);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .screen {
      position: absolute;
      inset: 0;
      transition: all 0.45s cubic-bezier(0.4,0,0.2,1);
      display: flex;
      flex-direction: column;
    }
    .screen.hidden { opacity: 0; pointer-events: none; transform: translateX(30px); }
    .screen.slide-left { transform: translateX(-100%); opacity: 0; pointer-events: none; }

    .scroll-content {
      overflow-y: auto;
      flex: 1;
      scrollbar-width: none;
    }
    .scroll-content::-webkit-scrollbar { display: none; }

    .status-bar {
      height: 47px;
      padding: 14px 28px 0;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex-shrink: 0;
      z-index: 10;
      max-width: 900px;
      width: 100%;
      align-self: center;
    }

    .status-time { font-family: var(--mono); font-size: 13px; font-weight: 700; color: var(--blue); letter-spacing: -0.5px; }
    .status-icons { display: flex; gap: 6px; align-items: center; }

    .bottom-nav {
      height: 80px;
      background: rgba(13,21,38,0.95);
      backdrop-filter: blur(20px);
      border-top: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 0 16px 16px;
      flex-shrink: 0;
    }

    .nav-item {
      display: flex; flex-direction: column; align-items: center; gap: 4px;
      cursor: pointer; padding: 8px 20px; border-radius: 16px;
      transition: all 0.2s ease; border: none; background: none;
    }
    .nav-item.active { background: rgba(58,141,255,0.12); }
    .nav-item svg { width: 22px; height: 22px; transition: all 0.2s; }
    .nav-item span { font-size: 10px; font-weight: 600; letter-spacing: 0.3px; transition: color 0.2s; color: var(--text3); }
    .nav-item.active span { color: var(--blue); }
    .nav-item.active svg path, .nav-item.active svg circle, .nav-item.active svg rect, .nav-item.active svg polyline { stroke: var(--blue); }
    .nav-item:not(.active) svg path, .nav-item:not(.active) svg circle, .nav-item:not(.active) svg rect, .nav-item:not(.active) svg polyline { stroke: var(--text3); }

    .page-content {
      width: 100%;
      max-width: 900px;
      align-self: center;
      padding: 0 24px;
    }

    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(58,141,255,0); }
      50% { box-shadow: 0 0 0 8px rgba(58,141,255,0.15); }
    }
    @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes wave { 0%, 100% { transform: scaleY(0.4); } 50% { transform: scaleY(1); } }
    @keyframes breathe {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.08); opacity: 1; }
    }

    .btn {
      width: 100%; padding: 16px; border-radius: var(--radius-sm); border: none;
      font-family: var(--font); font-size: 16px; font-weight: 700;
      cursor: pointer; transition: all 0.2s ease; letter-spacing: 0.3px;
    }
    .btn-primary {
      background: linear-gradient(135deg, var(--blue), #1A6BFF);
      color: white;
      box-shadow: 0 8px 32px var(--blue-glow);
    }
    .btn-primary:active { transform: scale(0.97); box-shadow: 0 4px 16px var(--blue-glow); }
    .btn-ghost {
      background: rgba(58,141,255,0.08);
      color: var(--blue);
      border: 1px solid var(--border2);
    }

    .chip {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 4px 10px; border-radius: 100px;
      font-size: 11px; font-weight: 600; letter-spacing: 0.4px;
    }
    .chip.good { background: rgba(0,201,167,0.15); color: var(--teal); border: 1px solid rgba(0,201,167,0.25); }
    .chip.warn { background: rgba(255,181,71,0.15); color: var(--amber); border: 1px solid rgba(255,181,71,0.25); }
    .chip.bad { background: rgba(255,82,82,0.15); color: var(--red); border: 1px solid rgba(255,82,82,0.25); }
    .chip.info { background: rgba(58,141,255,0.15); color: var(--blue); border: 1px solid rgba(58,141,255,0.25); }

    .noise-overlay {
      position: absolute; inset: 0; pointer-events: none; z-index: 1000;
      opacity: 0.025; border-radius: inherit;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    }

    .mesh-bg {
      position: absolute; inset: 0; pointer-events: none; overflow: hidden; border-radius: inherit;
    }
    .mesh-bg::before {
      content: ''; position: absolute; width: 300px; height: 300px;
      background: radial-gradient(circle, rgba(58,141,255,0.12) 0%, transparent 70%);
      top: -80px; right: -80px; border-radius: 50%;
    }
    .mesh-bg::after {
      content: ''; position: absolute; width: 250px; height: 250px;
      background: radial-gradient(circle, rgba(0,201,167,0.08) 0%, transparent 70%);
      bottom: 100px; left: -60px; border-radius: 50%;
    }

    .glass-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 18px;
    }
    .glass-card.elevated {
      box-shadow: 0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03);
    }
    .glass-card:hover {
      border-color: rgba(82,160,255,0.2);
      transition: border-color 0.2s ease;
    }

    .metric-value { font-family: var(--mono); font-size: 28px; font-weight: 700; color: var(--text); }
    .metric-label { font-size: 11px; font-weight: 600; color: var(--text2); letter-spacing: 0.8px; text-transform: uppercase; margin-top: 2px; }

    .progress-track { height: 6px; background: rgba(255,255,255,0.06); border-radius: 100px; overflow: hidden; }
    .progress-fill { height: 100%; border-radius: 100px; transition: width 1s ease; }

    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
    .section-title { font-size: 16px; font-weight: 700; color: var(--text); }
    .section-link { font-size: 12px; font-weight: 600; color: var(--blue); cursor: pointer; }

    .toggle { width: 46px; height: 26px; border-radius: 100px; border: none; cursor: pointer; position: relative; transition: background 0.3s; }
    .toggle::after { content: ''; position: absolute; width: 20px; height: 20px; border-radius: 50%; background: white; top: 3px; transition: left 0.3s; box-shadow: 0 2px 6px rgba(0,0,0,0.3); }
    .toggle.on { background: var(--blue); }
    .toggle.on::after { left: 23px; }
    .toggle.off { background: rgba(255,255,255,0.1); }
    .toggle.off::after { left: 3px; }

    .vertebra { transition: fill 0.5s ease; }
    .spine-container { animation: float 4s ease-in-out infinite; }

    .chart-bar { transition: height 0.8s cubic-bezier(0.4,0,0.2,1); border-radius: 4px 4px 0 0; }

    .exercise-card {
      background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);
      padding: 16px; display: flex; gap: 14px; align-items: center; cursor: pointer;
      transition: all 0.2s;
    }
    .exercise-card:active { transform: scale(0.98); background: var(--card2); }
    .exercise-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; }

    .alert-banner {
      margin: 0 20px; padding: 12px 16px; border-radius: var(--radius-sm);
      display: flex; align-items: center; gap: 10px;
      animation: slideUp 0.4s ease;
    }
    .alert-banner.warn { background: rgba(255,181,71,0.12); border: 1px solid rgba(255,181,71,0.25); }
    .alert-banner.danger { background: rgba(255,82,82,0.12); border: 1px solid rgba(255,82,82,0.25); }
    .alert-banner.good { background: rgba(0,201,167,0.12); border: 1px solid rgba(0,201,167,0.25); }

    @media (min-width: 768px) {
      .status-bar { padding: 14px 32px 0; }
      .bottom-nav { padding: 0 32px 16px; gap: 8px; }
      .nav-item { padding: 8px 32px; }
    }
  `}</style>
);

// ─── STATUS BAR ──────────────────────────────────────────────────────────────
const StatusBar = () => {
  return (
    <div className="status-bar">
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <SpineIconSVG size={18} color="#3A8DFF" />
        <span style={{ fontFamily: "var(--mono)", fontSize: 13, fontWeight: 700, color: "var(--blue)", letterSpacing: -0.5 }}>SpineSense<span style={{ color: "var(--cyan)" }}>AI</span></span>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div className="chip good" style={{ fontSize: 10 }}>● Live</div>
        <div className="chip info" style={{ fontSize: 10 }}>🔋 87%</div>
      </div>
    </div>
  );
};

// ─── SPLASH SCREEN ────────────────────────────────────────────────────────────
const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(timer); setTimeout(onComplete, 600); return 100; }
        return p + 2;
      });
    }, 40);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="screen" style={{ background: "var(--bg)", justifyContent: "center", alignItems: "center", zIndex: 100 }}>
      <div className="mesh-bg" />
      <div className="noise-overlay" />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {[280, 220, 160].map((size, i) => (
          <div key={i} style={{
            position: "absolute", width: size, height: size, borderRadius: "50%",
            border: `1px solid rgba(58,141,255,${0.06 + i * 0.04})`,
            animation: `pulse-glow ${2 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`
          }} />
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, zIndex: 2 }}>
        <div style={{ width: 90, height: 90, position: "relative", animation: "breathe 3s ease-in-out infinite" }}>
          <div style={{
            width: "100%", height: "100%", borderRadius: "28px",
            background: "linear-gradient(135deg, rgba(58,141,255,0.2), rgba(0,212,255,0.1))",
            border: "1px solid rgba(58,141,255,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 40px rgba(58,141,255,0.25)"
          }}>
            <SpineIconSVG size={52} color="#3A8DFF" glowing />
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 26, fontWeight: 700, color: "var(--text)", letterSpacing: -1, marginBottom: 6 }}>
            SpineSense<span style={{ color: "var(--blue)" }}>AI</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text2)", fontWeight: 500, letterSpacing: 2, textTransform: "uppercase" }}>
            Smart Brace Companion
          </div>
        </div>
        <div style={{ marginTop: 20, width: 200 }}>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%`, background: "linear-gradient(90deg, var(--blue), var(--cyan))" }} />
          </div>
          <div style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)" }}>
            {progress < 100 ? "Initializing sensors..." : "Ready"}
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 50, fontSize: 11, color: "var(--text3)", letterSpacing: 1 }}>
        AI-Based Biometric Spinal Tracking
      </div>
    </div>
  );
};

// ─── SPINE SVG ICON ───────────────────────────────────────────────────────────
const SpineIconSVG = ({ size = 32, color = "#3A8DFF", glowing }) => (
  <svg width={size} height={size} viewBox="0 0 32 48" fill="none" style={glowing ? { filter: `drop-shadow(0 0 6px ${color})` } : {}}>
    {[0,1,2,3,4,5].map(i => (
      <g key={i}>
        <rect x="8" y={4 + i*7} width="16" height="5" rx="2.5" fill={color} opacity={0.9 - i*0.05} />
        {i < 5 && <rect x="14" y={9 + i*7} width="4" height="2" rx="1" fill={color} opacity={0.5} />}
      </g>
    ))}
  </svg>
);

// ─── 3D SPINE ANIMATION ───────────────────────────────────────────────────────
const SpineAnimation3D = ({ status }) => {
  const isGood = status === "correct";
  const color = isGood ? "#00C9A7" : "#FF5252";
  const glowColor = isGood ? "rgba(0,201,167,0.4)" : "rgba(255,82,82,0.4)";
  const vertebrae = [
    { x: 50, yStraight: 20, ySlouch: 20 },
    { x: 50, yStraight: 40, ySlouch: 42 },
    { x: 50, yStraight: 60, ySlouch: 65 },
    { x: 50, yStraight: 80, ySlouch: 90 },
    { x: 50, yStraight: 100, ySlouch: 112 },
    { x: 50, yStraight: 120, ySlouch: 130 },
    { x: 50, yStraight: 140, ySlouch: 148 },
    { x: 50, yStraight: 160, ySlouch: 165 },
  ];
  const getSX = (i, total) => isGood ? 50 : 50 + Math.sin((i / total) * Math.PI * 1.5) * 14;

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="spine-container" style={{ width: 130, height: 200, position: "relative" }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: 80, height: 180, background: `radial-gradient(ellipse, ${glowColor} 0%, transparent 70%)`,
          transition: "background 0.8s ease"
        }} />
        <svg width="130" height="200" viewBox="0 0 100 190" style={{ position: "relative", zIndex: 2 }}>
          <path
            d={isGood ? "M 50 15 L 50 170" : `M 50 15 C ${50} 30, ${50+8} 50, ${50+14} 70 C ${50+18} 90, ${50+12} 110, ${50+6} 130 C ${50+2} 150, ${50} 160, ${50} 170`}
            stroke={color} strokeWidth="3" fill="none" opacity="0.4" strokeDasharray="4 3"
            style={{ transition: "all 0.8s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 4px ${color})` }}
          />
          {vertebrae.map((v, i) => {
            const cx = getSX(i, vertebrae.length);
            const cy = isGood ? v.yStraight : v.ySlouch;
            const highlight = (!isGood && i >= 2 && i <= 5);
            const w = i === 0 || i === vertebrae.length - 1 ? 20 : 24;
            return (
              <g key={i} style={{ transition: "all 0.8s cubic-bezier(0.4,0,0.2,1)" }}>
                <rect x={cx - w/2} y={cy - 5} width={w} height={10} rx={5}
                  fill={highlight ? "#FF5252" : color} opacity={highlight ? 1 : 0.9}
                  style={{ transition: "all 0.8s ease", filter: highlight ? "drop-shadow(0 0 5px rgba(255,82,82,0.7))" : "none" }}
                />
                <rect x={cx - 2} y={cy - 9} width={4} height={4} rx={2}
                  fill={highlight ? "#FF7070" : color} opacity={0.7}
                  style={{ transition: "all 0.8s ease" }}
                />
                {highlight && (
                  <circle cx={cx + 16} cy={cy} r={3} fill="#FF5252" opacity={0.8}>
                    <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            );
          })}
          {!isGood && (
            <g>
              <line x1="50" y1="20" x2="50" y2="170" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 3" />
              <text x="5" y="95" fill="#FF5252" fontSize="7" fontFamily="Space Mono">+14°</text>
            </g>
          )}
        </svg>
        <div style={{ position: "absolute", right: -18, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 0 }}>
          {[{ l: "C", t: 0 }, { l: "T", t: 55 }, { l: "L", t: 55 }, { l: "S", t: 35 }].map((r, i) => (
            <div key={i} style={{ fontSize: 8, color: "var(--text3)", fontFamily: "var(--mono)", height: r.t + "px", display: "flex", alignItems: "center" }}>{r.l}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── POSTURE STATUS WIDGET ─────────────────────────────────────────────────────
const PostureWidget = ({ status, onToggle }) => {
  const isGood = status === "correct";
  return (
    <div className="glass-card elevated" style={{ background: isGood ? "rgba(0,201,167,0.06)" : "rgba(255,82,82,0.06)", borderColor: isGood ? "rgba(0,201,167,0.2)" : "rgba(255,82,82,0.2)", transition: "all 0.6s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text2)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Live Posture Status</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: isGood ? "var(--teal)" : "var(--red)", boxShadow: `0 0 8px ${isGood ? "var(--teal)" : "var(--red)"}`, animation: "pulse-glow 2s infinite" }} />
            <span style={{ fontSize: 18, fontWeight: 800, color: isGood ? "var(--teal)" : "var(--red)", transition: "color 0.5s" }}>
              {isGood ? "Correct Alignment" : "Slouch Detected"}
            </span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--mono)", color: "var(--text)" }}>{isGood ? "94" : "62"}<span style={{ fontSize: 12, color: "var(--text2)" }}>%</span></div>
          <div style={{ fontSize: 10, color: "var(--text2)" }}>Score</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <SpineAnimation3D status={status} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Tilt Angle", value: isGood ? "2.1°" : "14.3°", icon: "↗", color: isGood ? "var(--teal)" : "var(--red)" },
            { label: "Lumbar Curve", value: isGood ? "Normal" : "Reduced", icon: "⌒", color: isGood ? "var(--teal)" : "var(--amber)" },
            { label: "Brace Pressure", value: isGood ? "Optimal" : "High", icon: "◉", color: isGood ? "var(--teal)" : "var(--red)" },
            { label: "Session Time", value: "1h 23m", icon: "⏱", color: "var(--blue)" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 11, color: "var(--text2)", fontWeight: 500 }}>{s.icon} {s.label}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: s.color, fontFamily: "var(--mono)" }}>{s.value}</div>
            </div>
          ))}
          <button onClick={onToggle} style={{ marginTop: 4, padding: "8px 0", borderRadius: 10, border: `1px solid ${isGood ? "rgba(0,201,167,0.25)" : "rgba(255,82,82,0.25)"}`, background: isGood ? "rgba(0,201,167,0.1)" : "rgba(255,82,82,0.1)", color: isGood ? "var(--teal)" : "var(--red)", fontSize: 11, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5 }}>
            {isGood ? "Simulate Slouch" : "Correct Posture"}
          </button>
        </div>
      </div>
      {!isGood && (
        <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 10, background: "rgba(255,82,82,0.1)", border: "1px solid rgba(255,82,82,0.2)", display: "flex", alignItems: "center", gap: 8, animation: "slideUp 0.3s ease" }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--red)" }}>Posture Alert</div>
            <div style={{ fontSize: 10, color: "var(--text2)" }}>Correct your posture — sit upright, shoulders back</div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── HOME SCREEN ─────────────────────────────────────────────────────────────
const HomeScreen = ({ user, userName, postureStatus, setPostureStatus, navigate }) => {
  const profiles = { student: { emoji: "🎓" }, it_pro: { emoji: "💻" }, senior: { emoji: "🌟" } };
  const p = profiles[user] || profiles.student;
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="screen" style={{ background: "var(--bg)" }}>
      <div className="mesh-bg" />
      <StatusBar />
      <div className="scroll-content">
        <div className="page-content" style={{ paddingTop: 8, paddingBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, marginTop: 8 }}>
            <div>
              <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 2 }}>{greeting}, {p.emoji}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text)" }}>{userName}</div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--card)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer" }}>🔔</div>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, var(--blue), var(--cyan))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer" }} onClick={() => navigate("settings")}>👤</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <div className="chip info">● BT Connected</div>
            <div className="chip good">✓ Brace Active</div>
            <div className="chip info">🔋 87%</div>
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            {[
              { val: "82%", label: "Today's Score", color: "var(--blue)" },
              { val: "4.2h", label: "Good Posture", color: "var(--teal)" },
              { val: "12", label: "Corrections", color: "var(--amber)" },
            ].map((m, i) => (
              <div key={i} className="glass-card" style={{ flex: 1, padding: "12px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "var(--mono)", color: m.color }}>{m.val}</div>
                <div style={{ fontSize: 9.5, color: "var(--text2)", fontWeight: 600, marginTop: 2, letterSpacing: 0.3 }}>{m.label}</div>
              </div>
            ))}
          </div>
          <PostureWidget status={postureStatus} onToggle={() => setPostureStatus(s => s === "correct" ? "slouch" : "correct")} />
          <div style={{ marginTop: 20 }}>
            <div className="section-header">
              <span className="section-title">Quick Actions</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { icon: "📊", label: "View Report", color: "rgba(58,141,255,0.15)", action: () => navigate("reports") },
                { icon: "🧘", label: "Start Exercise", color: "rgba(0,201,167,0.15)", action: () => navigate("therapy") },
                { icon: "⚙️", label: "Brace Settings", color: "rgba(255,181,71,0.15)", action: () => {} },
                { icon: "🆘", label: "Emergency", color: "rgba(255,82,82,0.15)", action: () => {} },
              ].map((a, i) => (
                <button key={i} onClick={a.action} style={{ background: a.color, border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "16px 12px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6, transition: "all 0.2s", fontFamily: "var(--font)" }}>
                  <span style={{ fontSize: 22 }}>{a.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <div className="section-header">
              <span className="section-title">Today's Alerts</span>
              <span className="section-link">See all</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { time: "10:32", msg: "Slouch detected for 5 min", type: "warn" },
                { time: "09:15", msg: "Great session! 45min perfect posture", type: "good" },
                { time: "08:47", msg: "Brace activated successfully", type: "info" },
              ].map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 14px", background: "var(--card)", borderRadius: 12, border: "1px solid var(--border)" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: a.type === "good" ? "var(--teal)" : a.type === "warn" ? "var(--amber)" : "var(--blue)" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{a.msg}</div>
                    <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 1, fontFamily: "var(--mono)" }}>{a.time} AM</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── ONBOARDING SCREEN ────────────────────────────────────────────────────────
const OnboardingScreen = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const profiles = [
    { id: "student", emoji: "🎓", title: "Student", desc: "Optimize posture during study sessions, lectures, and desk work", features: ["Study session reminders", "Break timers", "Focus-mode posture"], color: "#3A8DFF" },
    { id: "it_pro", emoji: "💻", title: "IT Professional", desc: "Combat desk fatigue with smart monitoring for long work hours", features: ["Work hours tracking", "Ergonomic tips", "Fatigue detection"], color: "#00C9A7" },
    { id: "senior", emoji: "🌟", title: "Senior Citizen", desc: "Gentle guidance and therapy support for spine health and comfort", features: ["Gentle reminders", "Therapy exercises", "Emergency alerts"], color: "#FFB547" },
  ];

  if (step === 0) {
    return (
      <div className="screen" style={{ background: "var(--bg)", alignItems: "center", overflowY: "auto" }}>
        <div className="mesh-bg" />
        <div style={{ zIndex: 2, width: "100%", maxWidth: 540, animation: "slideUp 0.5s ease", padding: 24 }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>👋</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>Welcome to SpineSense</div>
            <div style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.6 }}>Let's personalize your experience. Who are you?</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
            {profiles.map(p => (
              <div key={p.id} onClick={() => setSelectedProfile(p.id)} style={{
                padding: "18px 20px", borderRadius: "var(--radius)", cursor: "pointer",
                background: selectedProfile === p.id ? `rgba(${p.id === "student" ? "58,141,255" : p.id === "it_pro" ? "0,201,167" : "255,181,71"},0.12)` : "var(--card)",
                border: `1.5px solid ${selectedProfile === p.id ? p.color : "var(--border)"}`,
                transition: "all 0.25s ease", display: "flex", alignItems: "center", gap: 16,
              }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${p.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0, border: `1px solid ${p.color}30` }}>{p.emoji}</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 3 }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>{p.desc}</div>
                </div>
                <div style={{ marginLeft: "auto", width: 20, height: 20, borderRadius: "50%", border: `2px solid ${selectedProfile === p.id ? p.color : "var(--border)"}`, background: selectedProfile === p.id ? p.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                  {selectedProfile === p.id && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "white" }} />}
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" disabled={!selectedProfile} onClick={() => setStep(1)} style={{ opacity: selectedProfile ? 1 : 0.4 }}>
            Continue →
          </button>
        </div>
      </div>
    );
  }

  if (step === 1) {
    const p = profiles.find(x => x.id === selectedProfile);
    return (
      <div className="screen" style={{ background: "var(--bg)", alignItems: "center", overflowY: "auto" }}>
        <div className="mesh-bg" />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", zIndex: 2, animation: "slideUp 0.4s ease", width: "100%", maxWidth: 540, padding: "32px 24px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 50, marginBottom: 12 }}>{p.emoji}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>Perfect for {p.title}s</div>
            <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>Here's what SpineSense will do for you:</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
            {p.features.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)", animation: `slideUp ${0.4 + i * 0.1}s ease` }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `${p.color}20`, border: `1px solid ${p.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✓</div>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{f}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "var(--card)", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: 16, marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>🔐 Required Permissions</div>
            {["Bluetooth (Brace connection)", "Notifications (Posture alerts)", "Health data (Biometrics)"].map((perm, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
                <span style={{ fontSize: 12, color: "var(--text2)" }}>{perm}</span>
                <span className="chip good" style={{ fontSize: 9 }}>Allow</span>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => onComplete(selectedProfile)}>🚀 Get Started</button>
        </div>
      </div>
    );
  }
};

// ─── BIOMETRIC SCREEN ─────────────────────────────────────────────────────────
const BiometricScreen = ({ user }) => {
  const [activeMetric, setActiveMetric] = useState("spine");
  const weekData = [65, 72, 58, 80, 88, 76, 82];
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const maxVal = Math.max(...weekData);

  return (
    <div className="screen" style={{ background: "var(--bg)" }}>
      <div className="mesh-bg" />
      <StatusBar />
      <div className="scroll-content">
        <div className="page-content" style={{ paddingTop: 8, paddingBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text)" }}>Biometrics</div>
            <div className="chip info">This Week</div>
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 18, overflowX: "auto", paddingBottom: 4 }}>
            {["spine", "pressure", "activity"].map(m => (
              <button key={m} onClick={() => setActiveMetric(m)} style={{
                padding: "8px 14px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font)",
                fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", letterSpacing: 0.3, transition: "all 0.2s",
                background: activeMetric === m ? "var(--blue)" : "var(--card)",
                color: activeMetric === m ? "white" : "var(--text2)",
                boxShadow: activeMetric === m ? "0 4px 16px var(--blue-glow)" : "none",
              }}>
                {m === "spine" ? "🦴 Spine" : m === "pressure" ? "⚡ Pressure" : "🏃 Activity"}
              </button>
            ))}
          </div>
          <div className="glass-card elevated" style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text2)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>
                  {activeMetric === "spine" ? "Posture Score" : activeMetric === "pressure" ? "Avg Pressure" : "Active Minutes"}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 48, fontWeight: 700, color: "var(--text)", lineHeight: 1 }}>
                    {activeMetric === "spine" ? "78" : activeMetric === "pressure" ? "2.4" : "94"}
                  </span>
                  <span style={{ fontSize: 16, color: "var(--text2)" }}>{activeMetric === "pressure" ? "N/cm²" : activeMetric === "activity" ? "min" : "%"}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--teal)", marginTop: 4, fontWeight: 600 }}>↑ +6.2% vs last week</div>
              </div>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg, rgba(58,141,255,0.2), rgba(0,212,255,0.1))", border: "2px solid rgba(58,141,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 24 }}>{activeMetric === "spine" ? "🦴" : activeMetric === "pressure" ? "⚡" : "🏃"}</span>
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 11, color: "var(--text2)", fontWeight: 600, letterSpacing: 0.5, marginBottom: 12 }}>7-Day Trend</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
                {weekData.map((v, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{ width: "100%", display: "flex", alignItems: "flex-end", height: 60 }}>
                      <div className="chart-bar" style={{
                        width: "100%", height: `${(v / maxVal) * 100}%`,
                        background: i === 6 ? "linear-gradient(to top, var(--blue), var(--cyan))" : i === 2 ? "linear-gradient(to top, var(--red), #FF7070)" : "rgba(58,141,255,0.35)",
                        boxShadow: i === 6 ? "0 0 10px var(--blue-glow)" : "none",
                      }} />
                    </div>
                    <span style={{ fontSize: 10, color: i === 6 ? "var(--blue)" : "var(--text3)", fontWeight: i === 6 ? 700 : 400 }}>{days[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>Sensor Readings</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
            {[
              { label: "Upper Back", value: "92%", status: "good", icon: "↑" },
              { label: "Lower Back", value: "71%", status: "warn", icon: "↗" },
              { label: "Left Shoulder", value: "85%", status: "good", icon: "←" },
              { label: "Right Shoulder", value: "88%", status: "good", icon: "→" },
            ].map((s, i) => (
              <div key={i} className="glass-card" style={{ padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: "var(--text2)", fontWeight: 600 }}>{s.label}</span>
                  <span style={{ fontSize: 10, color: s.status === "good" ? "var(--teal)" : "var(--amber)" }}>{s.icon}</span>
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 22, fontWeight: 700, color: s.status === "good" ? "var(--teal)" : "var(--amber)", marginBottom: 6 }}>{s.value}</div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: s.value, background: s.status === "good" ? "var(--teal)" : "var(--amber)" }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>Biometric Vitals</div>
          <div className="glass-card" style={{ padding: 4 }}>
            {[
              { label: "Blood Oxygen (SpO2)", value: "98%", color: "var(--blue)", icon: "🫁", trend: "good" },
              { label: "Steps Today", value: "6,240", color: "var(--teal)", icon: "👣", trend: "active" },
            ].map((v, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderBottom: i < 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ fontSize: 18 }}>{v.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: "var(--text2)", fontWeight: 500 }}>{v.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: v.color, fontFamily: "var(--mono)" }}>{v.value}</div>
                </div>
                <div className={`chip ${v.trend === "good" || v.trend === "active" ? "good" : "info"}`} style={{ fontSize: 10 }}>{v.trend}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── PDF EXPORT ───────────────────────────────────────────────────────────────
const exportPDF = () => {
  const script = document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
  script.onload = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const W = 210;
    const margin = 20;
    let y = 0;

    // ── Header band
    doc.setFillColor(6, 11, 20);
    doc.rect(0, 0, W, 40, "F");
    doc.setTextColor(58, 141, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("SpineSenseAI", margin, 18);
    doc.setFontSize(10);
    doc.setTextColor(123, 156, 192);
    doc.setFont("helvetica", "normal");
    doc.text("Posture & Health Report", margin, 26);
    doc.text(`Generated: ${new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })}`, margin, 33);
    y = 52;

    const sectionTitle = (title) => {
      doc.setFillColor(17, 29, 53);
      doc.roundedRect(margin, y - 5, W - margin * 2, 10, 2, 2, "F");
      doc.setTextColor(58, 141, 255);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(title, margin + 4, y + 2);
      y += 12;
    };

    const row = (label, value, color) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 130, 160);
      doc.text(label, margin + 4, y);
      doc.setFont("helvetica", "bold");
      if (color) doc.setTextColor(...color);
      else doc.setTextColor(234, 242, 255);
      doc.text(value, W - margin - 4, y, { align: "right" });
      doc.setDrawColor(30, 50, 80);
      doc.line(margin, y + 2, W - margin, y + 2);
      y += 9;
    };

    // ── Weekly Summary
    sectionTitle("Weekly Summary");
    row("Overall Posture Score", "78%", [58, 141, 255]);
    row("Change vs Last Week", "+12%", [0, 201, 167]);
    row("Total Brace Wear Time", "37.4 hours", null);
    row("Good Posture Time", "31.2 hours", [0, 201, 167]);
    row("Slouching Time", "6.2 hours", [255, 82, 82]);
    row("Posture Corrections Sent", "47 vibrations", [255, 181, 71]);
    row("Best Posture Streak", "3h 12m continuous", [0, 201, 167]);
    y += 4;

    // ── Daily Breakdown
    sectionTitle("Daily Posture Breakdown");
    const days = [
      ["Monday",    "5.2h good", "1.8h poor", "74%"],
      ["Tuesday",   "4.8h good", "2.2h poor", "69%"],
      ["Wednesday", "3.5h good", "3.5h poor", "50%"],
      ["Thursday",  "6.1h good", "0.9h poor", "87%"],
      ["Friday",    "5.8h good", "1.2h poor", "83%"],
      ["Saturday",  "4.0h good", "1.0h poor", "80%"],
      ["Sunday",    "5.5h good", "0.8h poor", "87%"],
    ];
    days.forEach(([day, good, poor, score]) => {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(234, 242, 255);
      doc.text(day, margin + 4, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 201, 167);
      doc.text(good, margin + 44, y);
      doc.setTextColor(255, 82, 82);
      doc.text(poor, margin + 80, y);
      doc.setTextColor(58, 141, 255);
      doc.setFont("helvetica", "bold");
      doc.text(score, W - margin - 4, y, { align: "right" });
      doc.setDrawColor(30, 50, 80);
      doc.line(margin, y + 2, W - margin, y + 2);
      y += 9;
    });
    y += 4;

    // ── Sensor Readings
    sectionTitle("Sensor Readings");
    row("Upper Back", "92% — Good", [0, 201, 167]);
    row("Lower Back", "71% — Warning", [255, 181, 71]);
    row("Left Shoulder", "85% — Good", [0, 201, 167]);
    row("Right Shoulder", "88% — Good", [0, 201, 167]);
    y += 4;

    // ── Biometric Vitals
    sectionTitle("Biometric Vitals");
    row("Blood Oxygen (SpO2)", "98% — Good", [58, 141, 255]);
    row("Steps Today", "6,240 steps — Active", [0, 201, 167]);
    y += 4;

    // ── Exercise Summary
    sectionTitle("Exercise & Therapy");
    row("Sessions Completed", "14 sessions", null);
    row("Morning Activation", "Completed", [0, 201, 167]);
    row("Desk Worker Relief", "Pending", [255, 181, 71]);
    row("Evening Recovery", "Pending", [255, 181, 71]);
    y += 4;

    // ── AI Insights
    sectionTitle("AI Insights");
    const insights = [
      "Posture improved 12% this week compared to last week.",
      "Most slouching occurs between 2-4 PM — consider a break reminder.",
      "Thursday was the best day with 6.1 hours of correct posture.",
    ];
    insights.forEach((ins, i) => {
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(123, 156, 192);
      const lines = doc.splitTextToSize(`${i + 1}. ${ins}`, W - margin * 2 - 8);
      doc.text(lines, margin + 4, y);
      y += lines.length * 5 + 3;
    });
    y += 4;

    // ── Footer
    doc.setFillColor(6, 11, 20);
    doc.rect(0, 287, W, 10, "F");
    doc.setFontSize(8);
    doc.setTextColor(74, 106, 138);
    doc.text("SpineSense AI — AI-Based Biometric Spinal Tracking", W / 2, 293, { align: "center" });

    doc.save("SpineSense_Report.pdf");
  };
  document.head.appendChild(script);
};

// ─── REPORTS SCREEN ───────────────────────────────────────────────────────────
const ReportsScreen = () => {
  const [period, setPeriod] = useState("weekly");
  const dailyHours = [
    { label: "Mon", good: 5.2, bad: 1.8 }, { label: "Tue", good: 4.8, bad: 2.2 },
    { label: "Wed", good: 3.5, bad: 3.5 }, { label: "Thu", good: 6.1, bad: 0.9 },
    { label: "Fri", good: 5.8, bad: 1.2 }, { label: "Sat", good: 4.0, bad: 1.0 },
    { label: "Sun", good: 5.5, bad: 0.8 },
  ];
  const insights = [
    { icon: "📈", text: "Your posture improved 12% this week compared to last week. Keep it up!", color: "var(--teal)" },
    { icon: "⏰", text: "Most slouching occurs between 2–4 PM. Consider a break reminder during this period.", color: "var(--amber)" },
    { icon: "🏆", text: "Thursday was your best day with 6.1 hours of correct posture!", color: "var(--blue)" },
  ];

  return (
    <div className="screen" style={{ background: "var(--bg)" }}>
      <div className="mesh-bg" />
      <StatusBar />
      <div className="scroll-content">
        <div className="page-content" style={{ paddingTop: 8, paddingBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text)" }}>Reports</div>
            <div style={{ display: "flex", gap: 6 }}>
              {["daily", "weekly", "monthly"].map(p => (
                <button key={p} onClick={() => setPeriod(p)} style={{
                  padding: "6px 12px", borderRadius: 100, border: "none", cursor: "pointer",
                  fontFamily: "var(--font)", fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
                  background: period === p ? "var(--blue)" : "var(--card)",
                  color: period === p ? "white" : "var(--text2)", transition: "all 0.2s",
                }}>{p.charAt(0).toUpperCase() + p.slice(1)}</button>
              ))}
            </div>
          </div>
          <div className="glass-card elevated" style={{ marginBottom: 14, background: "linear-gradient(135deg, rgba(58,141,255,0.1), rgba(0,212,255,0.05))", borderColor: "rgba(58,141,255,0.2)" }}>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <div style={{ position: "relative", width: 80, height: 80 }}>
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(58,141,255,0.1)" strokeWidth="8" />
                  <circle cx="40" cy="40" r="34" fill="none" stroke="url(#scoreGrad)" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 34 * 0.78} ${2 * Math.PI * 34}`}
                    strokeDashoffset={2 * Math.PI * 34 * 0.25}
                    strokeLinecap="round" transform="rotate(-90 40 40)"
                  />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3A8DFF" />
                      <stop offset="100%" stopColor="#00D4FF" />
                    </linearGradient>
                  </defs>
                  <text x="40" y="44" textAnchor="middle" fill="white" fontSize="16" fontWeight="800" fontFamily="Space Mono">78%</text>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 13, color: "var(--text2)", fontWeight: 600, marginBottom: 4 }}>Weekly Average</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>Good Progress</div>
                <div className="chip good">↑ +12% vs last week</div>
              </div>
            </div>
          </div>
          <div className="glass-card" style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>Posture Hours Distribution</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 90 }}>
              {dailyHours.map((d, i) => {
                const total = d.good + d.bad;
                const goodH = (d.good / total) * 80;
                const badH = (d.bad / total) * 80;
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                    <div style={{ width: "100%", display: "flex", flexDirection: "column-reverse", height: 75, gap: 1, borderRadius: "4px 4px 0 0", overflow: "hidden" }}>
                      <div style={{ background: "var(--teal)", height: goodH, opacity: 0.85, transition: "height 0.8s ease", flexShrink: 0 }} />
                      <div style={{ background: "var(--red)", height: badH, opacity: 0.7, transition: "height 0.8s ease", flexShrink: 0 }} />
                    </div>
                    <span style={{ fontSize: 9, color: "var(--text3)", fontWeight: 600 }}>{d.label}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: "var(--teal)" }} /><span style={{ fontSize: 11, color: "var(--text2)" }}>Good posture</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: "var(--red)", opacity: 0.7 }} /><span style={{ fontSize: 11, color: "var(--text2)" }}>Slouching</span></div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
            {[
              { label: "Total Wear Time", value: "37.4h", unit: "this week", icon: "⌚", color: "var(--blue)" },
              { label: "Corrections Sent", value: "47", unit: "vibrations", icon: "📳", color: "var(--amber)" },
              { label: "Best Streak", value: "3h 12m", unit: "continuous good posture", icon: "🏆", color: "var(--teal)" },
              { label: "Exercises Done", value: "14", unit: "sessions completed", icon: "🧘", color: "var(--blue)" },
            ].map((s, i) => (
              <div key={i} className="glass-card" style={{ padding: 14 }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 20, fontWeight: 700, color: s.color, marginBottom: 2 }}>{s.value}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text)", marginBottom: 1 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: "var(--text3)" }}>{s.unit}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>🤖 AI Insights</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {insights.map((ins, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "14px", background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)", animation: `slideUp ${0.3 + i * 0.1}s ease` }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{ins.icon}</span>
                <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>{ins.text}</p>
              </div>
            ))}
          </div>
          <button className="btn btn-ghost" onClick={exportPDF} style={{ marginTop: 18 }}>📄 Export PDF Report</button>
        </div>
      </div>
    </div>
  );
};

// ─── THERAPY SCREEN ───────────────────────────────────────────────────────────
const TherapyScreen = () => {
  const [activeTab, setActiveTab] = useState("exercises");
  const [activeExercise, setActiveExercise] = useState(null);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRunning) { timerRef.current = setInterval(() => setTimer(t => t + 1), 1000); }
    else { clearInterval(timerRef.current); }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  const formatTime = s => `${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;

  const exercises = [
    { id: 1, name: "Cat-Cow Stretch", duration: "2 min", reps: "10 cycles", level: "easy", emoji: "🐱", desc: "Gently arch and round your spine to improve flexibility and reduce tension.", category: "Flexibility", color: "rgba(0,201,167,0.15)", border: "rgba(0,201,167,0.3)" },
    { id: 2, name: "Chin Tuck", duration: "1 min", reps: "15 reps", level: "easy", emoji: "🤏", desc: "Retract your chin to strengthen neck flexors and correct forward head posture.", category: "Strength", color: "rgba(58,141,255,0.15)", border: "rgba(58,141,255,0.3)" },
    { id: 3, name: "Thoracic Extension", duration: "3 min", reps: "8 holds", level: "medium", emoji: "🙆", desc: "Open the chest and extend the thoracic spine to counteract desk posture.", category: "Mobility", color: "rgba(255,181,71,0.15)", border: "rgba(255,181,71,0.3)" },
    { id: 4, name: "Shoulder Blade Squeeze", duration: "2 min", reps: "12 reps", level: "easy", emoji: "💪", desc: "Retract and depress shoulder blades to activate postural muscles.", category: "Strength", color: "rgba(58,141,255,0.15)", border: "rgba(58,141,255,0.3)" },
    { id: 5, name: "Child's Pose Hold", duration: "90 sec", reps: "3 holds", level: "easy", emoji: "🧘", desc: "Lengthen the entire spine and relax the lower back muscles.", category: "Recovery", color: "rgba(168,85,247,0.15)", border: "rgba(168,85,247,0.3)" },
    { id: 6, name: "Dead Bug Core", duration: "4 min", reps: "10 reps/side", level: "hard", emoji: "🪲", desc: "Activate deep core muscles to support spinal stabilization throughout the day.", category: "Core", color: "rgba(255,82,82,0.15)", border: "rgba(255,82,82,0.3)" },
  ];

  const programs = [
    { name: "Morning Activation", duration: "8 min", exercises: 4, emoji: "☀️", completed: true },
    { name: "Desk Worker Relief", duration: "12 min", exercises: 6, emoji: "💻", completed: false },
    { name: "Evening Recovery", duration: "10 min", exercises: 5, emoji: "🌙", completed: false },
  ];

  if (activeExercise) {
    const ex = exercises.find(e => e.id === activeExercise);
    return (
      <div className="screen" style={{ background: "var(--bg)", alignItems: "center" }}>
        <div className="mesh-bg" />
        <StatusBar />
        <div style={{ zIndex: 2, flex: 1, display: "flex", flexDirection: "column", width: "100%", maxWidth: 540, padding: "0 24px 24px" }}>
          <button onClick={() => { setActiveExercise(null); setTimerRunning(false); setTimer(0); }} style={{ background: "none", border: "none", color: "var(--blue)", fontSize: 14, fontWeight: 700, cursor: "pointer", alignSelf: "flex-start", marginBottom: 20, padding: "8px 0" }}>← Back</button>
          <div style={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
            <div style={{ fontSize: 80, animation: "float 3s ease-in-out infinite" }}>{ex.emoji}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 6 }}>{ex.name}</div>
              <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, maxWidth: 280, margin: "0 auto" }}>{ex.desc}</div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <div className="chip info">{ex.duration}</div>
              <div className="chip good">{ex.reps}</div>
            </div>
            <div style={{ padding: "24px 40px", background: "var(--card)", borderRadius: 24, border: "1px solid var(--border)", textAlign: "center", width: "100%" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 48, fontWeight: 700, color: timerRunning ? "var(--teal)" : "var(--text)", letterSpacing: -2 }}>{formatTime(timer)}</div>
              <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>Session Timer</div>
            </div>
            <div style={{ display: "flex", gap: 12, width: "100%" }}>
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => setTimerRunning(r => !r)}>
                {timerRunning ? "⏸ Pause" : timer > 0 ? "▶ Resume" : "▶ Start"}
              </button>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => { setTimer(0); setTimerRunning(false); }}>Reset</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen" style={{ background: "var(--bg)" }}>
      <div className="mesh-bg" />
      <StatusBar />
      <div className="scroll-content">
        <div className="page-content" style={{ paddingTop: 8, paddingBottom: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", marginBottom: 14 }}>Exercise & Therapy</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {["exercises", "programs", "schedule"].map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{
                padding: "8px 14px", borderRadius: 100, border: "none", cursor: "pointer",
                fontFamily: "var(--font)", fontSize: 12, fontWeight: 700, letterSpacing: 0.3,
                background: activeTab === t ? "var(--blue)" : "var(--card)",
                color: activeTab === t ? "white" : "var(--text2)", transition: "all 0.2s",
              }}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
            ))}
          </div>
          {activeTab === "exercises" && (
            <>
              <div className="glass-card" style={{ marginBottom: 16, background: "linear-gradient(135deg, rgba(0,201,167,0.1), rgba(0,212,255,0.05))", borderColor: "rgba(0,201,167,0.2)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Today's Goal</div>
                    <div style={{ fontSize: 11, color: "var(--text2)" }}>3 of 5 exercises completed</div>
                  </div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 24, fontWeight: 700, color: "var(--teal)" }}>60%</div>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: "60%", background: "linear-gradient(90deg, var(--teal), var(--cyan))" }} />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {exercises.map(ex => (
                  <div key={ex.id} className="exercise-card" style={{ background: ex.color, borderColor: ex.border }} onClick={() => setActiveExercise(ex.id)}>
                    <div className="exercise-icon" style={{ background: "rgba(255,255,255,0.08)" }}>{ex.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{ex.name}</span>
                        <span className={`chip ${ex.level === "easy" ? "good" : ex.level === "medium" ? "warn" : "bad"}`} style={{ fontSize: 9 }}>{ex.level}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text2)", marginBottom: 4 }}>{ex.category}</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <span style={{ fontSize: 11, color: "var(--text3)" }}>⏱ {ex.duration}</span>
                        <span style={{ fontSize: 11, color: "var(--text3)" }}>🔁 {ex.reps}</span>
                      </div>
                    </div>
                    <div style={{ color: "var(--text3)", fontSize: 18 }}>›</div>
                  </div>
                ))}
              </div>
            </>
          )}
          {activeTab === "programs" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {programs.map((prog, i) => (
                <div key={i} className="glass-card" style={{ cursor: "pointer", borderColor: prog.completed ? "rgba(0,201,167,0.25)" : "var(--border)", position: "relative", overflow: "hidden" }}>
                  {prog.completed && <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 3, background: "var(--teal)" }} />}
                  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <div style={{ fontSize: 32 }}>{prog.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{prog.name}</div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <span style={{ fontSize: 11, color: "var(--text2)" }}>⏱ {prog.duration}</span>
                        <span style={{ fontSize: 11, color: "var(--text2)" }}>🏋️ {prog.exercises} exercises</span>
                      </div>
                    </div>
                    {prog.completed
                      ? <div className="chip good" style={{ fontSize: 10 }}>✓ Done</div>
                      : <button className="btn btn-primary" style={{ width: "auto", padding: "8px 14px", fontSize: 12 }}>Start</button>
                    }
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === "schedule" && (
            <div className="glass-card" style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 14 }}>Reminder Settings</div>
              {[
                { label: "Morning Exercise", time: "7:30 AM", on: true },
                { label: "Midday Break", time: "12:30 PM", on: true },
                { label: "Afternoon Check", time: "3:00 PM", on: false },
                { label: "Evening Stretch", time: "7:00 PM", on: true },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{r.label}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)" }}>{r.time}</div>
                  </div>
                  <ToggleSwitch initialOn={r.on} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── TOGGLE SWITCH ────────────────────────────────────────────────────────────
const ToggleSwitch = ({ initialOn }) => {
  const [on, setOn] = useState(initialOn);
  return <button className={`toggle ${on ? "on" : "off"}`} onClick={() => setOn(o => !o)} />;
};

// ─── SETTINGS SCREEN ──────────────────────────────────────────────────────────
const SettingsScreen = ({ user, userName, setUserName, theme, setTheme, joinDate, onSignOut }) => {
  const userEmoji = { student: "🎓", it_pro: "💻", senior: "🌟" };
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(userName);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const handleSaveName = () => {
    if (draftName.trim()) setUserName(draftName.trim());
    setEditing(false);
  };

  const memberSince = joinDate
    ? joinDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  const sections = [
    { title: "Brace Settings", items: [{ label: "Vibration Intensity", value: "Medium", icon: "📳" }, { label: "Alert Sensitivity", value: "High", icon: "🎚" }, { label: "Correction Mode", value: "Active", icon: "⚡" }, { label: "Auto-Calibrate", value: "toggle", icon: "🔧", on: true }] },
    { title: "Notifications", items: [{ label: "Posture Alerts", value: "toggle", icon: "🔔", on: true }, { label: "Daily Summary", value: "toggle", icon: "📊", on: true }, { label: "Exercise Reminders", value: "toggle", icon: "🏃", on: false }, { label: "Weekly Report", value: "toggle", icon: "📋", on: true }] },
    { title: "App", items: [{ label: "Profile Type", value: user === "student" ? "Student" : user === "it_pro" ? "IT Pro" : "Senior", icon: "👤" }, { label: "Data Sync", value: "Cloud", icon: "☁️" }, { label: "Units", value: "Metric", icon: "📐" }] }
  ];

  return (
    <div className="screen" style={{ background: "var(--bg)" }}>
      <div className="mesh-bg" />
      <StatusBar />
      <div className="scroll-content">
        <div className="page-content" style={{ paddingTop: 8, paddingBottom: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", marginBottom: 16 }}>Settings</div>

          {/* Profile card */}
          <div className="glass-card elevated" style={{ marginBottom: 20, background: "linear-gradient(135deg, rgba(58,141,255,0.1), rgba(0,212,255,0.05))", borderColor: "rgba(58,141,255,0.2)" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, var(--blue), var(--cyan))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{userEmoji[user] || "👤"}</div>
              <div style={{ flex: 1 }}>
                {editing ? (
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      value={draftName}
                      onChange={e => setDraftName(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleSaveName()}
                      autoFocus
                      style={{ flex: 1, background: "rgba(58,141,255,0.1)", border: "1.5px solid var(--blue)", borderRadius: 8, padding: "6px 10px", color: "var(--text)", fontFamily: "var(--font)", fontSize: 15, fontWeight: 700, outline: "none" }}
                    />
                    <button onClick={handleSaveName} style={{ background: "var(--blue)", border: "none", borderRadius: 8, padding: "6px 12px", color: "white", fontFamily: "var(--font)", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Save</button>
                    <button onClick={() => { setEditing(false); setDraftName(userName); }} style={{ background: "rgba(255,82,82,0.15)", border: "none", borderRadius: 8, padding: "6px 10px", color: "var(--red)", fontFamily: "var(--font)", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>✕</button>
                  </div>
                ) : (
                  <div style={{ fontSize: 17, fontWeight: 800, color: "var(--text)" }}>{userName}</div>
                )}
                <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>{user === "student" ? "Student Profile" : user === "it_pro" ? "IT Professional" : "Senior Citizen"}</div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>Member since {memberSince}</div>
              </div>
              {!editing && (
                <button onClick={() => { setEditing(true); setDraftName(userName); }} style={{ background: "rgba(58,141,255,0.1)", border: "1px solid var(--border2)", color: "var(--blue)", padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font)" }}>Edit</button>
              )}
            </div>
          </div>

          {/* Brace status */}
          <div className="glass-card" style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Brace Status</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {[{ label: "Battery", value: "87%", color: "var(--teal)" }, { label: "Firmware", value: "v2.1.4", color: "var(--blue)" }, { label: "Sensors", value: "8/8 OK", color: "var(--teal)" }].map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 16, fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Theme toggle */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Appearance</div>
            <div className="glass-card" style={{ padding: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px" }}>
                <span style={{ fontSize: 16 }}>{theme === "dark" ? "🌙" : "☀️"}</span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Theme</span>
                <div style={{ display: "flex", gap: 6 }}>
                  {["dark", "light"].map(t => (
                    <button key={t} onClick={() => setTheme(t)} style={{ padding: "6px 14px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font)", fontSize: 11, fontWeight: 700, transition: "all 0.2s", background: theme === t ? "var(--blue)" : "rgba(58,141,255,0.08)", color: theme === t ? "white" : "var(--text2)" }}>
                      {t === "dark" ? "🌙 Dark" : "☀️ Light"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Settings sections */}
          {sections.map((section, si) => (
            <div key={si} style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>{section.title}</div>
              <div className="glass-card" style={{ padding: 4 }}>
                {section.items.map((item, ii) => (
                  <div key={ii} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", borderBottom: ii < section.items.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <span style={{ fontSize: 16 }}>{item.icon}</span>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{item.label}</span>
                    {item.value === "toggle" ? <ToggleSwitch initialOn={item.on} /> : <span style={{ fontSize: 12, color: "var(--text2)" }}>{item.value} ›</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Sign out confirmation modal */}
          {showSignOutConfirm && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
              <div style={{ background: "var(--card)", border: "1px solid var(--border2)", borderRadius: "var(--radius)", padding: 28, width: "100%", maxWidth: 380, animation: "slideUp 0.25s ease", textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🚪</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>Sign Out?</div>
                <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, marginBottom: 24 }}>Are you sure you want to sign out? You'll be taken back to the user selection screen.</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowSignOutConfirm(false)}>No, Stay</button>
                  <button className="btn" style={{ flex: 1, background: "rgba(255,82,82,0.15)", border: "1px solid rgba(255,82,82,0.3)", color: "var(--red)", fontFamily: "var(--font)" }} onClick={() => { setShowSignOutConfirm(false); onSignOut(); }}>Yes, Sign Out</button>
                </div>
              </div>
            </div>
          )}

          {/* Sign out button */}
          <button className="btn" onClick={() => setShowSignOutConfirm(true)} style={{ background: "rgba(255,82,82,0.1)", border: "1px solid rgba(255,82,82,0.25)", color: "var(--red)", fontFamily: "var(--font)" }}>
            🚪 Sign Out
          </button>

          <div style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "var(--text3)" }}>
            SpineSense AI v1.4.2 · Build 2025.06<br />AI-Based Biometric Spinal Tracking
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── BOTTOM NAV COMPONENT ─────────────────────────────────────────────────────
const BottomNav = ({ active, navigate }) => {
  const tabs = [
    { id: "home", label: "Home", icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg> },
    { id: "biometrics", label: "Biometrics", icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
    { id: "reports", label: "Reports", icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 17V13"/><path d="M12 17V7"/><path d="M16 17v-5"/></svg> },
    { id: "therapy", label: "Therapy", icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
    { id: "settings", label: "Settings", icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
  ];
  return (
    <div className="bottom-nav">
      {tabs.map(tab => (
        <button key={tab.id} className={`nav-item ${active === tab.id ? "active" : ""}`} onClick={() => navigate(tab.id)}>
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function SpineSenseApp() {
  const [appState, setAppState] = useState("splash");
  const [activeTab, setActiveTab] = useState("home");
  const [user, setUser] = useState(null);
  const [postureStatus, setPostureStatus] = useState("correct");
  const [userName, setUserName] = useState("User");
  const [theme, setTheme] = useState("dark");
  const [joinDate, setJoinDate] = useState(null);
  const navigate = (tab) => setActiveTab(tab);

  const themeVars = theme === "light" ? `
    --bg: #F0F4FF;
    --surface: #E4ECFF;
    --card: #FFFFFF;
    --card2: #EAF0FF;
    --border: rgba(58,141,255,0.15);
    --border2: rgba(58,141,255,0.3);
    --text: #0D1526;
    --text2: #3A5A8A;
    --text3: #6A8AB0;
  ` : ``;

  return (
    <div className={`app-root${theme === "light" ? " light" : ""}`}>
      <GlobalStyles />
      {themeVars && <style>{`:root { ${themeVars} }`}</style>}
      <div className="app-shell">
        <div className="noise-overlay" />
        {appState === "splash" && <SplashScreen onComplete={() => setAppState("onboarding")} />}
        {appState === "onboarding" && <OnboardingScreen onComplete={(p) => { setUser(p); setJoinDate(new Date()); setAppState("main"); }} />}
        {appState === "main" && (
          <>
            <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, transition: "opacity 0.3s", opacity: activeTab === "home" ? 1 : 0, pointerEvents: activeTab === "home" ? "auto" : "none" }}>
                <HomeScreen user={user} userName={userName} postureStatus={postureStatus} setPostureStatus={setPostureStatus} navigate={navigate} />
              </div>
              <div style={{ position: "absolute", inset: 0, transition: "opacity 0.3s", opacity: activeTab === "biometrics" ? 1 : 0, pointerEvents: activeTab === "biometrics" ? "auto" : "none" }}>
                <BiometricScreen user={user} />
              </div>
              <div style={{ position: "absolute", inset: 0, transition: "opacity 0.3s", opacity: activeTab === "reports" ? 1 : 0, pointerEvents: activeTab === "reports" ? "auto" : "none" }}>
                <ReportsScreen />
              </div>
              <div style={{ position: "absolute", inset: 0, transition: "opacity 0.3s", opacity: activeTab === "therapy" ? 1 : 0, pointerEvents: activeTab === "therapy" ? "auto" : "none" }}>
                <TherapyScreen />
              </div>
              <div style={{ position: "absolute", inset: 0, transition: "opacity 0.3s", opacity: activeTab === "settings" ? 1 : 0, pointerEvents: activeTab === "settings" ? "auto" : "none" }}>
                <SettingsScreen user={user} userName={userName} setUserName={setUserName} theme={theme} setTheme={setTheme} joinDate={joinDate} onSignOut={() => { setAppState("onboarding"); setActiveTab("home"); setUser(null); setUserName("User"); setJoinDate(null); }} />
              </div>
            </div>
            <BottomNav active={activeTab} navigate={navigate} />
          </>
        )}
      </div>
    </div>
  );
}
