import React, { useState } from "react";

export default function DeleteEntities() {
    const [movieId, setMovieId] = useState("");
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleDelete = async () => {
        if (!movieId) {
            setMessage("Введите ID фильма для удаления");
            setIsSuccess(false);
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/movies/${Number(movieId)}`, {
                method: "DELETE"
            });

            if (res.ok) {
                setMessage(`Фильм с ID ${movieId} успешно удалён`);
                setIsSuccess(true);
                setMovieId("");
            } else if (res.status === 404) {
                setMessage(`Фильм с ID ${movieId} не найден`);
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
        <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "10px", width: "300px" }}>
            <h3>Удалить фильм</h3>

            <input
                type="number"
                placeholder="Введите ID фильма"
                value={movieId}
                onChange={e => setMovieId(e.target.value)}
                style={{
                    marginBottom: "10px",
                    padding: "5px",
                    width: "100%",
                    borderRadius: "5px",
                    border: "1px solid #aaa"
                }}
            />

            <button
                onClick={handleDelete}
                style={{
                    padding: "6px 12px",
                    border: "none",
                    borderRadius: "5px",
                    backgroundColor: "#d9534f",
                    color: "white",
                    cursor: "pointer"
                }}
            >
                Удалить
            </button>

            {message && (
                <div
                    style={{
                        marginTop: "15px",
                        fontWeight: "500",
                        color: isSuccess ? "green" : "red"
                    }}
                >
                    {message}
                </div>
            )}
        </div>
    );
}
