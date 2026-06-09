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
    <div style={{ fontFamily: "sans-serif", padding: "24px", maxWidth: "800px", margin: "0 auto" }}>

      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>
          SPINE<span style={{ background: "#000", color: "#fff", padding: "0 6px", borderRadius: "4px" }}>SENSE</span>
        </h1>
        <p style={{ color: "#888", marginTop: "4px" }}>Live Posture Monitor</p>
        <span style={{
          display: "inline-block", marginTop: "8px",
          padding: "4px 12px", borderRadius: "999px", fontSize: "0.75rem",
          background: connected ? "#dcfce7" : "#fee2e2",
          color: connected ? "#16a34a" : "#dc2626"
        }}>
          {connected ? "● Device Connected" : "○ Waiting for device..."}
        </span>
      </div>

      {live && (
        <>
          <div style={{
            background: statusColor, color: "#fff",
            borderRadius: "16px", padding: "24px",
            textAlign: "center", marginBottom: "24px",
            fontSize: "1.5rem", fontWeight: "bold"
          }}>
            {statusText}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>

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
              <Row label="Last update" value="Live" />
            </SensorCard>

          </div>
        </>
      )}

      {history.length > 0 && (
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "12px" }}>
            🕘 Poor Posture History (last 20 alerts)
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ background: "#f3f4f6" }}>
                  {["Time(s)", "Pitch", "Roll", "Flex U", "Flex M", "Flex L", "FSR L", "FSR C", "FSR R"].map(h => (
                    <th key={h} style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((entry, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "8px" }}>{entry.timestamp}</td>
                    <td style={{ padding: "8px" }}>{entry.pitch?.toFixed(1)}°</td>
                    <td style={{ padding: "8px" }}>{entry.roll?.toFixed(1)}°</td>
                    <td style={{ padding: "8px" }}>{entry.flex_upper}</td>
                    <td style={{ padding: "8px" }}>{entry.flex_mid}</td>
                    <td style={{ padding: "8px" }}>{entry.flex_lower}</td>
                    <td style={{ padding: "8px" }}>{entry.fsr_left}</td>
                    <td style={{ padding: "8px" }}>{entry.fsr_center}</td>
                    <td style={{ padding: "8px" }}>{entry.fsr_right}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!live && (
        <div style={{ textAlign: "center", color: "#aaa", marginTop: "60px" }}>
          <p style={{ fontSize: "3rem" }}>📡</p>
          <p>Waiting for SpineSense device to connect...</p>
          <p style={{ fontSize: "0.8rem" }}>Make sure the ESP32 is powered on and connected to WiFi</p>
        </div>
      )}

    </div>
  );
}

function SensorCard({ title, children }) {
  return (
    <div style={{ background: "#f9fafb", borderRadius: "12px", padding: "16px", border: "1px solid #e5e7eb" }}>
      <h3 style={{ margin: "0 0 12px 0", fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>{title}</h3>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #e5e7eb" }}>
      <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>{label}</span>
      <span style={{ fontWeight: "600", fontSize: "0.85rem" }}>{value}</span>
    </div>
  );
}