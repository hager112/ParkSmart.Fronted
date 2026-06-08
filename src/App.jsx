import { useEffect, useState } from "react";
import "./App.css";

const API = "https://localhost:7196/api";

function App() {
const [areas, setAreas] = useState([]);
const [spots, setSpots] = useState([]);
const [sessions, setSessions] = useState([]);
const [newArea, setNewArea] = useState({ name: "", address: "", totalSpots: "", availableSpots: "" });
const [editId, setEditId] = useState(null);

const loadData = () => {
fetch(`${API}/parkingareas`).then(r => r.json()).then(setAreas);
fetch(`${API}/parkingspots`).then(r => r.json()).then(setSpots);
fetch(`${API}/parkingsessions`).then(r => r.json()).then(setSessions);
};

useEffect(() => { loadData(); }, []);

const saveArea = async (e) => {
e.preventDefault();

const area = {
name: newArea.name,
address: newArea.address,
totalSpots: Number(newArea.totalSpots),
availableSpots: Number(newArea.availableSpots),
};

if (editId) {
await fetch(`${API}/parkingareas/${editId}`, {
method: "PUT",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(area),
});
setEditId(null);
} else {
await fetch(`${API}/parkingareas`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(area),
});
}

setNewArea({ name: "", address: "", totalSpots: "", availableSpots: "" });
loadData();
};

const deleteArea = async (id) => {
if (!confirm("Vill du ta bort detta parkeringsområde?")) return;

await fetch(`${API}/parkingareas/${id}`, {
method: "DELETE",
});

loadData();
};

const startEdit = (area) => {
setEditId(area.id);
setNewArea({
name: area.name,
address: area.address,
totalSpots: area.totalSpots,
availableSpots: area.availableSpots,
});
window.scrollTo({ top: 0, behavior: "smooth" });
};

return (
<main className="app">
<header className="header">
<p className="tag">Smart Parking System</p>
<h1>🚗 ParkSmart</h1>
<p>En modern fullstack-app för parkeringsområden, platser och sessioner.</p>
</header>

<section className="stats">
<div><h2>{areas.length}</h2><p>Områden</p></div>
<div><h2>{spots.length}</h2><p>Parkeringsplatser</p></div>
<div><h2>{sessions.length}</h2><p>Parkeringar</p></div>
</section>

<section className="form-card">
<h2>{editId ? "Uppdatera parkeringsområde" : "Lägg till parkeringsområde"}</h2>
<form onSubmit={saveArea}>
<input placeholder="Namn" value={newArea.name} onChange={e => setNewArea({ ...newArea, name: e.target.value })} required />
<input placeholder="Adress" value={newArea.address} onChange={e => setNewArea({ ...newArea, address: e.target.value })} required />
<input placeholder="Totala platser" type="number" value={newArea.totalSpots} onChange={e => setNewArea({ ...newArea, totalSpots: e.target.value })} required />
<input placeholder="Lediga platser" type="number" value={newArea.availableSpots} onChange={e => setNewArea({ ...newArea, availableSpots: e.target.value })} required />
<button type="submit">{editId ? "Spara ändring" : "Lägg till"}</button>
</form>
</section>

<h2 className="section-title">Parkeringsområden</h2>
<section className="cards">
{areas.map(area => (
<article className="card" key={area.id}>
<h3>{area.name}</h3>
<p>{area.address}</p>
<strong>{area.availableSpots}</strong>
<span>lediga platser av {area.totalSpots}</span>

<div className="actions">
<button onClick={() => startEdit(area)}>Ändra</button>
<button className="danger" onClick={() => deleteArea(area.id)}>Ta bort</button>
</div>
</article>
))}
</section>

<h2 className="section-title">Parkeringsplatser</h2>
<section className="list">
{spots.map(spot => (
<div className="list-row" key={spot.id}>
<span>Plats {spot.spotNumber}</span>
<b className={spot.isAvailable ? "free" : "busy"}>
{spot.isAvailable ? "Ledig" : "Upptagen"}
</b>
</div>
))}
</section>

<h2 className="section-title">Parkeringssessioner</h2>
<section className="list">
{sessions.map(session => (
<div className="list-row" key={session.id}>
<span>{session.vehicleRegistration}</span>
<b>Plats-ID {session.parkingSpotId}</b>
</div>
))}
</section>
</main>
);
}

export default App;