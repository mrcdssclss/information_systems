import { useState, useEffect } from "react";

export default function UpdateEntities() {
    const [movieId, setMovieId] = useState("");
    const [movie, setMovie] = useState(null);
    const [coordinates, setCoordinates] = useState(null);
    const [director, setDirector] = useState(null);
    const [operator, setOperator] = useState(null);
    const [screenwriter, setScreenwriter] = useState(null);
    const [location, setLocation] = useState(null);
    const [idRange, setIdRange] = useState({ from: null, to: null });

    // Загружаем общее количество фильмов
    useEffect(() => {
        fetch("http://localhost:8080/movies")
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    const ids = data.map(m => m.id).sort((a, b) => a - b);
                    setIdRange({ from: ids[0], to: ids[ids.length - 1] });
                }
            })
            .catch(err => console.error("Ошибка при загрузке фильмов:", err));
    }, []);

    // Загружаем выбранный фильм
    useEffect(() => {
        if (!movieId) return;
        fetch(`http://localhost:8080/movies/${Number(movieId)}`)
            .then(res => {
                if (!res.ok) throw new Error("Фильм не найден");
                return res.json();
            })
            .then(data => {
                setMovie(data);
                setCoordinates(data.coordinates);
                setDirector(data.director);
                setOperator(data.operator);
                setScreenwriter(data.screenwriter);
                if (data.director && data.director.location) {
                    setLocation(data.director.location);
                }
            })
            .catch(err => {
                console.error(err);
                setMovie(null);
            });
    }, [movieId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const coordRes = await fetch(`http://localhost:8080/coordinates/${coordinates.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(coordinates)
            });
            const savedCoord = await coordRes.json();

            const locRes = await fetch(`http://localhost:8080/locations/${location.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(location)
            });
            const savedLoc = await locRes.json();

            const directorWithLoc = { ...director, location: savedLoc };
            const dirRes = await fetch(`http://localhost:8080/persons/${director.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(directorWithLoc)
            });
            const savedDirector = await dirRes.json();

            const movieToUpdate = {
                ...movie,
                coordinates: savedCoord,
                director: savedDirector,
                operator: operator,
                screenwriter: screenwriter
            };
            const movieRes = await fetch(`http://localhost:8080/movies/${movie.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(movieToUpdate)
            });
            const savedMovie = await movieRes.json();

            alert("Фильм успешно обновлен! ID: " + savedMovie.id);
        } catch (err) {
            console.error(err);
            alert("Ошибка при обновлении!");
        }
    };

    return (
        <div style={{ padding: "20px", border: "1px solid #ccc" }}>
            <h3>Редактировать фильм</h3>
            <input
                type="number"
                placeholder="Введите ID фильма"
                value={movieId}
                onChange={e => setMovieId(e.target.value)}
                style={{ marginBottom: "10px" }}
            />

            {/* 👇 Добавляем динамический текст */}
            {!movieId && (
                <div>
                    {idRange.from !== null
                        ? `Введите ID фильма от ${idRange.from} до ${idRange.to}`
                        : "Загрузка диапазона ID фильмов..."}
                </div>

            )}

            {!movie && movieId && <div>Загрузка фильма или фильм не найден...</div>}

            {movie && (
                <form onSubmit={handleSubmit}>
                    <h4>Основные данные</h4>
                    <label>
                        Name
                        <input
                            value={movie.name}
                            onChange={e => setMovie({ ...movie, name: e.target.value })}
                            placeholder="Название фильма"
                            required
                        />
                    </label>

                    <label>
                        Length
                        <input
                            type="number"
                            value={movie.length}
                            onChange={e => setMovie({ ...movie, length: e.target.value })}
                            placeholder="Length"
                            required
                        />
                    </label>

                    <label>
                        Oscars
                        <input
                            type="number"
                            placeholder="Oscars"
                            value={movie.oscarsCount}
                            onChange={e => setMovie({ ...movie, oscarsCount: e.target.value })}
                        />
                    </label>

                    <label>
                        Budget
                        <input
                            type="number"
                            placeholder="Budget"
                            value={movie.budget}
                            onChange={e => setMovie({ ...movie, budget: e.target.value })}
                        />
                    </label>

                    <label>
                        Golden Palm
                        <input
                            type="number"
                            placeholder="Golden Palm"
                            value={movie.goldenPalmCount}
                            onChange={e => setMovie({ ...movie, goldenPalmCount: e.target.value })}
                        />
                    </label>

                    <label>
                        USA Box Office
                        <input
                            type="number"
                            placeholder="USA Box Office"
                            value={movie.usaBoxOffice}
                            onChange={e => setMovie({ ...movie, usaBoxOffice: e.target.value })}
                        />
                    </label>

                    <label>
                        Total Box Office
                        <input
                            type="number"
                            placeholder="Total Box Office"
                            value={movie.totalBoxOffice}
                            onChange={e => setMovie({ ...movie, totalBoxOffice: e.target.value })}
                        />
                    </label>

                    <label>
                        Genre
                        <select
                            value={movie.genre}
                            onChange={e => setMovie({ ...movie, genre: e.target.value })}
                            required
                        >
                            <option value="DRAMA">Drama</option>
                            <option value="ADVENTURE">Adventure</option>
                            <option value="FANTASY">Fantasy</option>
                        </select>
                    </label>

                    <label>
                        MPAA Rating
                        <select
                            value={movie.mpaaRating}
                            onChange={e => setMovie({ ...movie, mpaaRating: e.target.value })}
                        >
                            <option value="PG">PG</option>
                            <option value="R">R</option>
                            <option value="PG_13">PG_13</option>
                        </select>
                    </label>

                    <h4>Coordinates</h4>
                    <input
                        value={coordinates?.x || ""}
                        onChange={e => setCoordinates({ ...coordinates, x: e.target.value })}
                    />
                    <input
                        value={coordinates?.y || ""}
                        onChange={e => setCoordinates({ ...coordinates, y: e.target.value })}
                        required
                    />

                    <h4>Director</h4>
                    <input
                        value={director?.name || ""}
                        onChange={e => setDirector({ ...director, name: e.target.value })}
                        required
                    />

                    <h4>Operator</h4>
                    <input
                        value={operator?.name || ""}
                        onChange={e => setOperator({ ...operator, name: e.target.value })}
                    />

                    <h4>Screenwriter</h4>
                    <input
                        value={screenwriter?.name || ""}
                        onChange={e =>
                            setScreenwriter({ ...screenwriter, name: e.target.value })
                        }
                        required
                    />

                    <button type="submit" style={{ marginTop: "10px" }}>
                        Сохранить изменения
                    </button>
                </form>
            )}
        </div>
    );
}
