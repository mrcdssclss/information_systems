export default function ProgressBar({ progress, status, label }) {
    return (
        <div style={{ marginBottom: 5 }}>
            {label && <div style={{ fontSize: 12, marginBottom: 2 }}>{label}</div>}
            <div style={{ width: "100%", background: "#eee", borderRadius: 4, height: 16 }}>
                <div style={{
                    width: `${progress}%`,
                    height: "100%",
                    background: status === "success" ? "#B890E0" : status === "fail" ? "red" : "#B890E0",
                    borderRadius: 4,
                    transition: "width 0.3s"
                }} />
            </div>
        </div>
    );
}
