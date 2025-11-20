import React, { useState, useEffect } from "react";

export default function MoviesTable({ search }) {
    const [movies, setMovies] = useState([]);
    const [sortKey, setSortKey] = useState("");
    const [sortAsc, setSortAsc] = useState(true);

    const fetchMovies = async () => {
        const res = await fetch("http://localhost:8080/movies");
        const data = await res.json();
        setMovies(data || []);
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    if (!movies || movies.length === 0) return <div>Данных пока нет</div>;

    const filteredMovies = movies.filter(m => {
        const s = search.toLowerCase();
        return (
            m.name?.toLowerCase().includes(s) ||
            m.genre?.toLowerCase().includes(s) ||
            m.mpaaRating?.toLowerCase().includes(s) ||
            m.director?.name?.toLowerCase().includes(s) ||
            m.screenwriter?.name?.toLowerCase().includes(s) ||
            m.operator?.name?.toLowerCase().includes(s) ||
            (m.coordinates && `${m.coordinates.x},${m.coordinates.y}`.includes(s)) ||
            m.id.toString().includes(s) ||
            (m.oscarsCount && m.oscarsCount.toString().includes(s)) ||
            (m.budget && m.budget.toString().includes(s))
        );
    });

    const sortedMovies = sortKey
        ? [...filteredMovies].sort((a, b) => {
            let aValue = a[sortKey];
            let bValue = b[sortKey];

            // Для вложенных объектов (например, director.name)
            if (sortKey.includes(".")) {
                const keys = sortKey.split(".");
                aValue = keys.reduce((obj, key) => obj?.[key], a);
                bValue = keys.reduce((obj, key) => obj?.[key], b);
            }

            if (aValue === undefined || aValue === null) aValue = "";
            if (bValue === undefined || bValue === null) bValue = "";

            if (typeof aValue === "string") aValue = aValue.toLowerCase();
            if (typeof bValue === "string") bValue = bValue.toLowerCase();

            if (aValue < bValue) return sortAsc ? -1 : 1;
            if (aValue > bValue) return sortAsc ? 1 : -1;
            return 0;
        })
        : filteredMovies;

    const handleSort = key => {
        if (sortKey === key) {
            setSortAsc(!sortAsc);
        } else {
            setSortKey(key);
            setSortAsc(true);
        }
    };

    return (
        <div style={{ overflowX: "auto" }}>
            <table border="1" cellPadding="5" style={{ marginTop: "10px", borderCollapse: "collapse", minWidth: "1200px" }}>
                <thead>
                <tr>
                    <th onClick={() => handleSort("id")}>ID {sortKey === "id" ? (sortAsc ? "▲" : "▼") : ""}</th>
                    <th onClick={() => handleSort("name")}>Name {sortKey === "name" ? (sortAsc ? "▲" : "▼") : ""}</th>
                    <th onClick={() => handleSort("creationDate")}>Creation Date {sortKey === "creationDate" ? (sortAsc ? "▲" : "▼") : ""}</th>
                    <th onClick={() => handleSort("oscarsCount")}>Oscars Count {sortKey === "oscarsCount" ? (sortAsc ? "▲" : "▼") : ""}</th>
                    <th onClick={() => handleSort("budget")}>Budget {sortKey === "budget" ? (sortAsc ? "▲" : "▼") : ""}</th>
                    <th onClick={() => handleSort("totalBoxOffice")}>Total Box Office {sortKey === "totalBoxOffice" ? (sortAsc ? "▲" : "▼") : ""}</th>
                    <th onClick={() => handleSort("usaBoxOffice")}>USA Box Office {sortKey === "usaBoxOffice" ? (sortAsc ? "▲" : "▼") : ""}</th>
                    <th onClick={() => handleSort("length")}>Length {sortKey === "length" ? (sortAsc ? "▲" : "▼") : ""}</th>
                    <th onClick={() => handleSort("goldenPalmCount")}>Golden Palm {sortKey === "goldenPalmCount" ? (sortAsc ? "▲" : "▼") : ""}</th>
                    <th onClick={() => handleSort("genre")}>Genre {sortKey === "genre" ? (sortAsc ? "▲" : "▼") : ""}</th>
                    <th onClick={() => handleSort("mpaaRating")}>MPAA Rating {sortKey === "mpaaRating" ? (sortAsc ? "▲" : "▼") : ""}</th>
                    <th onClick={() => handleSort("coordinates.x")}>Coordinates (X, Y) {sortKey === "coordinates.x" ? (sortAsc ? "▲" : "▼") : ""}</th>
                    <th onClick={() => handleSort("director.name")}>Director (ID / Name) {sortKey === "director.name" ? (sortAsc ? "▲" : "▼") : ""}</th>
                    <th onClick={() => handleSort("screenwriter.name")}>Screenwriter (ID / Name) {sortKey === "screenwriter.name" ? (sortAsc ? "▲" : "▼") : ""}</th>
                    <th onClick={() => handleSort("operator.name")}>Operator (ID / Name) {sortKey === "operator.name" ? (sortAsc ? "▲" : "▼") : ""}</th>
                </tr>
                </thead>
                <tbody>
                {sortedMovies.map(m => (
                    <tr key={m.id}>
                        <td>{m.id}</td>
                        <td>{m.name}</td>
                        <td>{m.creationDate ? new Date(m.creationDate).toLocaleString() : "-"}</td>
                        <td>{m.oscarsCount ?? "-"}</td>
                        <td>{m.budget ?? "-"}</td>
                        <td>{m.totalBoxOffice ?? "-"}</td>
                        <td>{m.usaBoxOffice ?? "-"}</td>
                        <td>{m.length ?? "-"}</td>
                        <td>{m.goldenPalmCount ?? "-"}</td>
                        <td>{m.genre ?? "-"}</td>
                        <td>{m.mpaaRating ?? "-"}</td>
                        <td>{m.coordinates ? `${m.coordinates.x}, ${m.coordinates.y}` : "-"}</td>
                        <td>{m.director ? `${m.director.id || "-"} / ${m.director.name || "-"}` : "-"}</td>
                        <td>{m.screenwriter ? `${m.screenwriter.id || "-"} / ${m.screenwriter.name || "-"}` : "-"}</td>
                        <td>{m.operator ? `${m.operator.id || "-"} / ${m.operator.name || "-"}` : "-"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
