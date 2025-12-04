import React, { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";

export default function CoordinatesTable({ search }) {
    const [coords, setCoords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const fetchCoords = async () => {
        try {
            setLoading(true);
            setProgress(0);

            const interval = setInterval(() => {
                setProgress(prev => Math.min(prev + 10, 90));
            }, 100);

            const res = await fetch("http://localhost:8080/coordinates");
            const data = await res.json();
            setCoords(data || []);

            clearInterval(interval);
            setProgress(100);
            setTimeout(() => setLoading(false), 200);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => { fetchCoords(); }, []);

    const filteredCoords = coords.filter(c => {
        const s = search.toLowerCase();
        return (
            c.id.toString().includes(s) ||
            c.x.toString().includes(s) ||
            c.y.toString().includes(s)
        );
    });

    return (
        <div>
            {loading && <ProgressBar label="Загрузка координат..." progress={progress} status="in-progress" />}

            {!loading && coords.length === 0 && <div>Данных пока нет</div>}

            {!loading && coords.length > 0 && (
                <table border="1" cellPadding="5" style={{ marginTop: "10px" }}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>X</th>
                        <th>Y</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredCoords.map(c => (
                        <tr key={c.id}>
                            <td>{c.id}</td>
                            <td>{c.x}</td>
                            <td>{c.y}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
