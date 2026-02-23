const SHEET_URL = "https://opensheet.elk.sh/1zo5AMUtvPnzhq9YpuSU8gV6wlmpJXrORbcZOomWFaxc/Feuille 1";

const circuitSelect = document.getElementById("circuit");
const categorySelect = document.getElementById("category");
const table = document.getElementById("table");

let data = [];

fetch(SHEET_URL)
    .then(res => res.json())
    .then(rows => data = rows);

const circuitImages = {
    "Bahrain": "img/Bahrain.png",
    "Le Mans": "img/Le-mans.png",
    "Paul Ricard": "img/paul-ricard.jpg",
    "Cota": "img/Cota.png",
    "Fuji": "img/Fuji.png",
    "Imola": "img/Imola.jpg",
    "Interlagos": "img/Interlagos.jpg",
    "Lusail": "img/Lusail.jpg",
    "Monza": "img/Monza.png",
    "Portimao": "img/Portimao.png",
    "Sebring": "img/Sebring.png",
    "Silverstone": "img/Silverstone.jpg",
    "Spa": "img/Spa.png",
};

const categoryIcons = {
    "Hypercar": "img/hypercar.png",
    "LMP2": "img/lmp2.png",
    "GTE": "img/gte.png",
    "LMGT3": "img/lmgt3.png",
    "LMP3": "img/lmp3.png"
};

function updateTable() {
    const circuit = circuitSelect.value;
    const category = categorySelect.value;

    if (!circuit || !category) {
        table.innerHTML = "";
        return;
    }

    // Filtrer par circuit
    let filtered = data.filter(r => r.Circuit === circuit);

    // Si une catégorie précise est choisie
    if (category !== "ALL") {
        filtered = filtered.filter(r => r.Catégorie === category);
    }

    // Supprimer les lignes de référence (PLATINIUM / OR / ARGENT / BRONZE)
    filtered = filtered.filter(r =>
        !["PLATINIUM", "OR", "ARGENT", "BRONZE"].includes(r["Nom Prénom"])
    );
   
    // Meilleur temps par Pilote + Catégorie
    const best = {};
    filtered.forEach(r => {
        const key = `${r["Nom Prénom"]}_${r.Catégorie}`;
        if (!best[key] || r.Temps < best[key].Temps) {
            best[key] = r;
        }
    });

    const classement = Object.values(best)
        .sort((a, b) => a.Temps.localeCompare(b.Temps));

    table.innerHTML = classement.map((r, i) => `
    <tr>
        <td>${i + 1}</td>
        <td>
            <img src="${circuitImages[r.Circuit]}" class="circuit-img">
            <img src="${categoryIcons[r.Catégorie]}" class="cat-icon">
            ${r["Nom Prénom"]}
        </td>
        <td>${r.Catégorie}</td>
        <td>${r.Temps}</td>
    </tr>
`).join("");
circuitSelect.addEventListener("change", updateTable);
categorySelect.addEventListener("change", updateTable);