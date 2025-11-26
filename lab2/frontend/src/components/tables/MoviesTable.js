import React, { useState, useEffect } from "react";
import UpdateEntities from "./UpdateEntities";

export default function MoviesTable({search}) {
    const [movies, setMovies] = useState([]);
    const [selectedMovieId, setSelectedMovieId] = useState(null);

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


    return (
        <div style={{ overflowX: "auto" }}>
            {selectedMovieId && (
                <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                    <UpdateEntities
                        movieId={selectedMovieId}
                        onClose={() => {
                            setSelectedMovieId(null);
                            fetchMovies();
                        }}
                    />
                </div>
            )}
            <table border="1" cellPadding="5" style={{ marginTop: "10px", borderCollapse: "collapse", minWidth: "1200px" }}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Creation Date</th>
                    <th>Oscars Count</th>
                    <th>Budget</th>
                    <th>Total Box Office</th>
                    <th>USA Box Office</th>
                    <th>Length</th>
                    <th>Golden Palm</th>
                    <th>Genre</th>
                    <th>MPAA Rating</th>
                    <th>Coordinates (X, Y)</th>
                    <th>Director (ID / Name)</th>
                    <th>Screenwriter (ID / Name)</th>
                    <th>Operator (ID / Name)</th>
                </tr>
                </thead>

                <tbody>
                {filteredMovies.map(m => (
                    <tr key={m.id}
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelectedMovieId(m.id)}
                    >
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
                        <td>
                            {m.coordinates
                                ? `${m.coordinates.x}, ${m.coordinates.y}`
                                : "-"}
                        </td>
                        <td>
                            {m.director
                                ? `${m.director.id || "-"} / ${m.director.name || "-"}`
                                : "-"}
                        </td>
                        <td>
                            {m.screenwriter
                                ? `${m.screenwriter.id || "-"} / ${m.screenwriter.name || "-"}`
                                : "-"}
                        </td>
                        <td>
                            {m.operator
                                ? `${m.operator.id || "-"} / ${m.operator.name || "-"}`
                                : "-"}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
