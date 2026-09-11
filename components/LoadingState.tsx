export default function LoadingState() {
  return (
    <div aria-label="Loading listings" role="status">
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 16,
      }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="shimmer" style={{
            background: "var(--bg-raised)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "18px 20px",
            display: "flex", flexDirection: "column", gap: 10,
            animationDelay: `${i * 0.08}s`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={bone(56, 18, "var(--bg-subtle)", 6)} />
              <div style={bone(40, 14, "var(--bg-subtle)")} />
            </div>
            <div style={bone("72%", 16, "var(--bg-subtle)")} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={bone("100%", 11, "var(--bg-subtle)")} />
              <div style={bone("85%", 11, "var(--bg-subtle)")} />
              <div style={bone("60%", 11, "var(--bg-subtle)")} />
            </div>
            <div style={bone("35%", 10, "var(--bg-subtle)")} />
            <div style={bone("100%", 34, "var(--bg-subtle)", 10)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function bone(w: string | number, h: number, bg: string, borderRadius = 4): React.CSSProperties {
  return { width: w, height: h, background: bg, borderRadius };
}
