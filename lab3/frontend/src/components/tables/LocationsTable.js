import React, { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar"; // твой компонент прогресса

export default function LocationsTable({ search }) {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const fetchLocations = async () => {
        try {
            setLoading(true);
            setProgress(0);

            const interval = setInterval(() => {
                setProgress(prev => Math.min(prev + 10, 90));
            }, 100);

            const res = await fetch("http://localhost:8080/locations");
            const data = await res.json();
            setLocations(data || []);

            clearInterval(interval);
            setProgress(100);
            setTimeout(() => setLoading(false), 200);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => { fetchLocations(); }, []);

    const filteredLocations = locations.filter(l => {
        const s = search.toLowerCase();
        return (
            l.id.toString().includes(s) ||
            l.name.toLowerCase().includes(s) ||
            l.x.toString().includes(s) ||
            l.y.toString().includes(s) ||
            l.z.toString().includes(s)
        );
    });

    return (
        <div>
            {loading && <ProgressBar label="Загрузка локаций..." progress={progress} status="in-progress" />}

            {!loading && locations.length === 0 && <div>Данных пока нет</div>}

            {!loading && locations.length > 0 && (
                <table border="1" cellPadding="5" style={{ marginTop: "10px" }}>
                    <thead>
                    <tr><th>ID</th><th>X</th><th>Y</th><th>Z</th><th>Name</th></tr>
                    </thead>
                    <tbody>
                    {filteredLocations.map(l => (
                        <tr key={l.id}>
                            <td>{l.id}</td>
                            <td>{l.x}</td>
                            <td>{l.y}</td>
                            <td>{l.z}</td>
                            <td>{l.name}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
