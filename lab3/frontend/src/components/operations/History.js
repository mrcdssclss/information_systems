import { useState } from "react";

export default function History({ history }) {
    const [open, setOpen] = useState(false);

    return (
        <div className={`history-container ${open ? "open" : ""}`} onClick={() => setOpen(!open)}>
            <div className={`history-header ${open ? "" : "closed"}`}>
                {open ? "История импорта ▲" : "⇧"}
            </div>

            {open && (
                <div className="history-list">
                    {history.length === 0 ? (
                        <p>Нет операций импорта</p>
                    ) : (
                        <ul>
                            {history.map(op => (
                                <li key={op.id + Math.random()}>
                                    <div><strong>ID:</strong> {op.id ?? "—"}</div>
                                    <div><strong>Статус:</strong> {op.status}</div>
                                    {op.error && (
                                        <div>
                                            <strong>Ошибка:</strong> {op.error}
                                        </div>
                                    )}
                                </li>

                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
