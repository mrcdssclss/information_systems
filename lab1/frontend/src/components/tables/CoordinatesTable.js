import React, { useState, useEffect } from "react";

export default function CoordinatesTable({search}) {
    const [coords, setCoords] = useState([]);

    const fetchCoords = async () => {
        const res = await fetch("http://localhost:8080/coordinates");
        const data = await res.json();
        setCoords(data || []);
    };

    useEffect(() => { fetchCoords(); }, []);

    if (!coords || coords.length === 0) return <div>Данных пока нет</div>;

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
            <table border="1" cellPadding="5" style={{marginTop: "10px"}}>
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
        </div>
    );
}
