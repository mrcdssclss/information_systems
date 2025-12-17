import React, { useState, useEffect } from "react";
import UpdateEntities from "./UpdateEntities";
import ProgressBar from "./ProgressBar"; // твой компонент прогресса

export default function MoviesTable({ search }) {
    const [movies, setMovies] = useState([]);
    const [selectedMovieId, setSelectedMovieId] = useState(null);
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const fetchMovies = async () => {
        try {
            setLoading(true);
            setProgress(0);

            const interval = setInterval(() => {
                setProgress(prev => Math.min(prev + 10, 90));
            }, 100);

            const res = await fetch("http://localhost:8080/movies");
            const data = await res.json();
            setMovies(data || []);

            clearInterval(interval);
            setProgress(100);
            setTimeout(() => setLoading(false), 200);
        } catch (err) {
            console.error(err);
            setLoading(false);
            setMessage("Ошибка при загрузке фильмов");
            setIsSuccess(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

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

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`http://localhost:8080/movies/${id}`, { method: "DELETE" });

            if (res.ok) {
                setMessage(`Фильм с ID ${id} успешно удалён`);
                setIsSuccess(true);
                setMovies(prev => prev.filter(m => m.id !== id));
            } else if (res.status === 404) {
                setMessage(`Фильм с ID ${id} не найден`);
                setIsSuccess(false);
            } else {
                setMessage("Ошибка при удалении фильма");
                setIsSuccess(false);
            }
        } catch (err) {
            console.error(err);
            setMessage("Ошибка при соединении с сервером");
            setIsSuccess(false);
        }
    };

    return (
        <div style={{ overflowX: "auto" }}>
            {loading && <ProgressBar label="Загрузка фильмов..." progress={progress} status="in-progress" />}

            {message && (
                <div style={{ marginBottom: "10px", fontWeight: "500", color: isSuccess ? "green" : "red" }}>
                    {message}
                </div>
            )}

            {selectedMovieId && !loading && (
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

            {!loading && (
                <table border="1" cellPadding="5" style={{ marginTop: "10px", borderCollapse: "collapse", minWidth: "1300px" }}>
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
                        <th>Действие</th>
                    </tr>
                    </thead>

                    <tbody>
                    {filteredMovies.map(m => (
                        <tr key={m.id} style={{ cursor: "pointer" }}>
                            <td onClick={() => setSelectedMovieId(m.id)}>{m.id}</td>
                            <td onClick={() => setSelectedMovieId(m.id)}>{m.name}</td>
                            <td onClick={() => setSelectedMovieId(m.id)}>
                                {m.creationDate ? new Date(m.creationDate).toLocaleString() : "-"}
                            </td>
                            <td onClick={() => setSelectedMovieId(m.id)}>{m.oscarsCount ?? "-"}</td>
                            <td onClick={() => setSelectedMovieId(m.id)}>{m.budget ?? "-"}</td>
                            <td onClick={() => setSelectedMovieId(m.id)}>{m.totalBoxOffice ?? "-"}</td>
                            <td onClick={() => setSelectedMovieId(m.id)}>{m.usaBoxOffice ?? "-"}</td>
                            <td onClick={() => setSelectedMovieId(m.id)}>{m.length ?? "-"}</td>
                            <td onClick={() => setSelectedMovieId(m.id)}>{m.goldenPalmCount ?? "-"}</td>
                            <td onClick={() => setSelectedMovieId(m.id)}>{m.genre ?? "-"}</td>
                            <td onClick={() => setSelectedMovieId(m.id)}>{m.mpaaRating ?? "-"}</td>
                            <td onClick={() => setSelectedMovieId(m.id)}>
                                {m.coordinates ? `${m.coordinates.x}, ${m.coordinates.y}` : "-"}
                            </td>
                            <td onClick={() => setSelectedMovieId(m.id)}>
                                {m.director ? `${m.director.id || "-"} / ${m.director.name || "-"}` : "-"}
                            </td>
                            <td onClick={() => setSelectedMovieId(m.id)}>
                                {m.screenwriter ? `${m.screenwriter.id || "-"} / ${m.screenwriter.name || "-"}` : "-"}
                            </td>
                            <td onClick={() => setSelectedMovieId(m.id)}>
                                {m.operator ? `${m.operator.id || "-"} / ${m.operator.name || "-"}` : "-"}
                            </td>
                            <td>
                                <button
                                    onClick={() => handleDelete(m.id)}
                                    style={{
                                        padding: "4px 10px",
                                        border: "none",
                                        borderRadius: "5px",
                                        backgroundColor: "#d9534f",
                                        color: "white",
                                        cursor: "pointer"
                                    }}
                                >
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    ))}
                    {filteredMovies.length === 0 && (
                        <tr>
                            <td colSpan="16" style={{ textAlign: "center", padding: "10px" }}>
                                Нет фильмов для отображения
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            )}
        </div>
    );
}
