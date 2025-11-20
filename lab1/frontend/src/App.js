import React, { useState } from "react";
import MoviesTable from "./components/tables/MoviesTable";
import PersonsTable from "./components/tables/PersonsTable";
import CoordinatesTable from "./components/tables/CoordinatesTable";
import LocationsTable from "./components/tables/LocationsTable";
import CreateEntities from "./components/operations/CreateEntities";
import UpdateEntities from "./components/operations/UpdateEntities";
import DeleteEntities from "./components/operations/DeleteEntities";
import SpecialOperations from "./components/operations/SpecialOperations";
import "./App.css"


export default function App() {
    const [tab, setTab] = useState("movies");
    const [search, setSearch] = useState(""); // общая строка поиска

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <div className="tabs" style={{marginBottom: "10px"}}>
                <button onClick={() => setTab("movies")}>Movies</button>
                <button onClick={() => setTab("persons")}>Persons</button>
                <button onClick={() => setTab("coordinates")}>Coordinates</button>
                <button onClick={() => setTab("locations")}>Locations</button>
                <button onClick={() => setTab("create")}>Create</button>
                <button onClick={() => setTab("update")}>Update</button>
                <button onClick={() => setTab("delete")}>Delete</button>
                <button onClick={() => setTab("special")}>Special</button>
            </div>

            {(tab === "movies" || tab === "persons" || tab === "coordinates" || tab === "locations") && (
                <div style={{ marginBottom: "10px" }}>
                    <input
                        type="text"
                        placeholder="Поиск по всем колонкам..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: "100%", padding: "5px", fontSize: "14px" }}
                    />
                </div>
            )}

            <div className="tab-content">
                {tab === "movies" && <MoviesTable search={search} />}
                {tab === "persons" && <PersonsTable search={search} />}
                {tab === "coordinates" && <CoordinatesTable search={search} />}
                {tab === "locations" && <LocationsTable search={search} />}
                {tab === "create" && <CreateEntities />}
                {tab === "update" && <UpdateEntities />}
                {tab === "delete" && <DeleteEntities />}
                {tab === "special" && <SpecialOperations />}
            </div>
        </div>
    );
}
