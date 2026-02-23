const SHEET_URL = "https://opensheet.elk.sh/1zo5AMUtvPnzhq9YpuSU8gV6wlmpJXrORbcZOomWFaxc/Feuille 1";

const circuitSelect = document.getElementById("circuit");
const categorySelect = document.getElementById("category");
const table = document.getElementById("table");

let data = [];

fetch(SHEET_URL)
    .then(res => res.json())
    .then(rows => data = rows);

const circuitImages = {
    "Bahrain": "img/bahrain.jpg",
    "Le Mans": "img/le-mans.jpg",
    "Paul Ricard": "img/paul-ricard.jpg",
    "Cota": "img/Cota.jpg",
    "Fuji": "img/Fuji.jpg",
    "Imola": "img/Imola.jpg",
    "Interlagos": "img/Interlagos.jpg",
    "Lusail": "img/Lusail.jpg",
    "Monza": "img/Monza.jpg",
    "Portimao": "img/Portimao.jpg",
    "Sebring": "img/Sebring.jpg",
    "Silverstone": "img/Silverstone.jpg",
    "Spa": "img/Spa.jpg",
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
            <td>${r["Nom Prénom"]}</td>
            <td>${r.Catégorie}</td>
            <td>${r.Temps}</td>
        </tr>
    `).join("");
}
circuitSelect.addEventListener("change", updateTable);
categorySelect.addEventListener("change", updateTable);