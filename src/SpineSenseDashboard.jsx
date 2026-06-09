import { useEffect, useState } from "react";
import { db } from "./firebase";
import { ref, onValue } from "firebase/database";

export default function SpineSenseDashboard() {
  const [live, setLive]           = useState(null);
  const [history, setHistory]     = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const liveRef = ref(db, "/spinesense/live");
    onValue(liveRef, (snapshot) => {
      const data = snapshot.val();
      if (data) { setLive(data); setConnected(true); }
    });

    const historyRef = ref(db, "/spinesense/history");
    onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const entries = Object.values(data).reverse().slice(0, 20);
        setHistory(entries);
      }
    });
  }, []);

  const statusColor = live?.poor_posture ? "#ef4444" : "#22c55e";
  const statusText  = live?.poor_posture ? "⚠ BAD POSTURE" : "✓ Good Posture";

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      background: "#0f0f0f",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: "40px 16px",
      boxSizing: "border-box",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "780px",
      }}>

        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <h1 style={{ fontSize: "2.4rem", fontWeight: "800", margin: 0, color: "#ffffff", letterSpacing: "2px" }}>
            SPINE
            <span style={{
              background: "#ffffff", color: "#0f0f0f",
              padding: "2px 10px", borderRadius: "6px",
              marginLeft: "4px"
            }}>SENSE</span>
          </h1>
          <p style={{ color: "#888", marginTop: "8px", fontSize: "0.95rem", letterSpacing: "1px" }}>
            Live Posture Monitor
          </p>
          <span style={{
            display: "inline-block", marginTop: "12px",
            padding: "6px 18px", borderRadius: "999px", fontSize: "0.78rem",
            fontWeight: "600", letterSpacing: "0.5px",
            background: connected ? "#052e16" : "#2d0a0a",
            color: connected ? "#4ade80" : "#f87171",
            border: `1px solid ${connected ? "#16a34a" : "#dc2626"}`
          }}>
            {connected ? "● Device Connected" : "○ Waiting for device..."}
          </span>
        </div>

        {/* ── Live Status ── */}
        {live && (
          <>
            <div style={{
              background: statusColor,
              borderRadius: "16px", padding: "28px",
              textAlign: "center", marginBottom: "28px",
              fontSize: "1.6rem", fontWeight: "800",
              color: "#fff", letterSpacing: "1px",
              boxShadow: `0 0 30px ${live?.poor_posture ? "#ef444466" : "#22c55e66"}`
            }}>
              {statusText}
            </div>

            {/* ── Sensor Grid ── */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "28px"
            }}>
              <SensorCard title="📐 IMU Orientation">
                <Row label="Pitch" value={`${live.pitch?.toFixed(1)}°`} />
                <Row label="Roll"  value={`${live.roll?.toFixed(1)}°`} />
              </SensorCard>

              <SensorCard title="〰 Flex Sensors">
                <Row label="Upper Back" value={live.flex_upper} />
                <Row label="Mid Back"   value={live.flex_mid} />
                <Row label="Lower Back" value={live.flex_lower} />
              </SensorCard>

              <SensorCard title="⬇ Pressure (FSR)">
                <Row label="Left Shoulder"  value={live.fsr_left} />
                <Row label="Center Spine"   value={live.fsr_center} />
                <Row label="Right Shoulder" value={live.fsr_right} />
              </SensorCard>

              <SensorCard title="⏱ Session">
                <Row label="Uptime"      value={`${live.timestamp}s`} />
                <Row label="Last Update" value="Live" />
              </SensorCard>
            </div>
          </>
        )}

        {/* ── Waiting State ── */}
        {!live && (
          <div style={{ textAlign: "center", color: "#555", marginTop: "80px" }}>
            <p style={{ fontSize: "3.5rem", margin: 0 }}>📡</p>
            <p style={{ fontSize: "1rem", marginTop: "16px", color: "#888" }}>
              Waiting for SpineSense device to connect...
            </p>
            <p style={{ fontSize: "0.78rem", color: "#555", marginTop: "8px" }}>
              Make sure the ESP32 is powered on and connected to WiFi
            </p>
          </div>
        )}

        {/* ── History Table ── */}
        {history.length > 0 && (
          <div>
            <h2 style={{
              fontSize: "1rem", fontWeight: "700",
              marginBottom: "14px", color: "#ccc",
              letterSpacing: "0.5px"
            }}>
              🕘 Poor Posture History — last 20 alerts
            </h2>
            <div style={{ overflowX: "auto", borderRadius: "12px", border: "1px solid #222" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                <thead>
                  <tr style={{ background: "#1a1a1a" }}>
                    {["Time(s)", "Pitch", "Roll", "Flex U", "Flex M", "Flex L", "FSR L", "FSR C", "FSR R"].map(h => (
                      <th key={h} style={{
                        padding: "10px 12px", textAlign: "left",
                        borderBottom: "1px solid #2a2a2a", color: "#aaa",
                        fontWeight: "600"
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#111" : "#0f0f0f" }}>
                      <td style={{ padding: "9px 12px", color: "#ddd" }}>{entry.timestamp}</td>
                      <td style={{ padding: "9px 12px", color: "#ddd" }}>{entry.pitch?.toFixed(1)}°</td>
                      <td style={{ padding: "9px 12px", color: "#ddd" }}>{entry.roll?.toFixed(1)}°</td>
                      <td style={{ padding: "9px 12px", color: "#ddd" }}>{entry.flex_upper}</td>
                      <td style={{ padding: "9px 12px", color: "#ddd" }}>{entry.flex_mid}</td>
                      <td style={{ padding: "9px 12px", color: "#ddd" }}>{entry.flex_lower}</td>
                      <td style={{ padding: "9px 12px", color: "#ddd" }}>{entry.fsr_left}</td>
                      <td style={{ padding: "9px 12px", color: "#ddd" }}>{entry.fsr_center}</td>
                      <td style={{ padding: "9px 12px", color: "#ddd" }}>{entry.fsr_right}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div style={{ textAlign: "center", marginTop: "48px", color: "#333", fontSize: "0.75rem" }}>
          SpineSense © 2026 — Posture Monitoring System
        </div>

      </div>
    </div>
  );
}

function SensorCard({ title, children }) {
  return (
    <div style={{
      background: "#1a1a1a",
      borderRadius: "14px", padding: "18px",
      border: "1px solid #2a2a2a"
    }}>
      <h3 style={{
        margin: "0 0 14px 0", fontSize: "0.85rem",
        fontWeight: "700", color: "#aaa", letterSpacing: "0.5px"
      }}>{title}</h3>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between",
      padding: "6px 0", borderBottom: "1px solid #222"
    }}>
      <span style={{ color: "#666", fontSize: "0.83rem" }}>{label}</span>
      <span style={{ fontWeight: "700", fontSize: "0.83rem", color: "#fff" }}>{value}</span>
    </div>
  );
}