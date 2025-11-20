import React, { useState, useEffect } from "react";

export default function PersonsTable({search}) {
    const [persons, setPersons] = useState([]);

    const fetchPersons = async () => {
        const res = await fetch("http://localhost:8080/persons");
        const data = await res.json();
        setPersons(data || []);
    };

    useEffect(() => { fetchPersons(); }, []);

    if (!persons || persons.length === 0) return <div>Данных пока нет</div>;

    const filteredPersons = persons.filter(c => {
        const s = search.toLowerCase();
        return (
            c.id.toString().includes(s) ||
            c.name.toLowerCase().includes(s) ||
            c.eyeColor.toLowerCase().includes(s) ||
            c.hairColor.toLowerCase().includes(s) ||
            (c.location?.id.toString().includes(s)) ||
            c.weight.toString().includes(s) ||
            c.nationality.toLowerCase().includes(s)
        );
    });

    return (
        <div>
            <table border="1" cellPadding="5" style={{marginTop: "10px"}}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>EyeColor</th>
                    <th>HairColor</th>
                    <th>Location ID</th>
                    <th>Weight</th>
                    <th>Nationality</th>
                </tr>
                </thead>
                <tbody>
                {filteredPersons.map(p => (
                    <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.name}</td>
                        <td>{p.eyeColor}</td>
                        <td>{p.hairColor}</td>
                        <td>{p.location?.id}</td>
                        <td>{p.weight}</td>
                        <td>{p.nationality}</td>
                    </tr>
                ))}
                </tbody>

            </table>
        </div>
    );
}
