import React, { useState, useEffect } from "react";

export default function LocationsTable({search}) {
    const [locations, setLocations] = useState([]);

    const fetchLocations = async () => {
        const res = await fetch("http://localhost:8080/locations");
        const data = await res.json();
        setLocations(data || []);
    };

    useEffect(() => { fetchLocations(); }, []);

    if (!locations || locations.length === 0) return <div>Данных пока нет</div>;

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
        </div>
    );
}
