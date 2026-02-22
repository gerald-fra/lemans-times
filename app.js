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
    "Paul Ricard": "img/paul-ricard.jpg"
    // Ajoute toutes les photos des circuits ici
};

const categoryIcons = {
    "Hypercar": "img/hypercar.png",
    "LMP2": "img/lmp2.png",
    "GTE": "img/gte.png",
    "GT3": "img/gt3.png",
    "LMP3": "img/lmp3.png"
};

function updateTable() {
    const circuit = circuitSelect.value;
    const category = categorySelect.value;

    if (!circuit || !category) {
        table.innerHTML = "";
        return;
    }

    let filtered = data.filter(r => r.Circuit === circuit && r.Catégorie === category);

    const bestByPilot = [];
    filtered.forEach(r => {
        const existing = bestByPilot.find(e => e["Nom Prénom"] === r["Nom Prénom"]);
        if (!existing) {
            bestByPilot.push(r);
        } else {
            if (r.Temps < existing.Temps) {
                const index = bestByPilot.indexOf(existing);
                bestByPilot[index] = r;
            }
        }
    });

    const classement = bestByPilot.sort((a, b) => a.Temps.localeCompare(b.Temps));

    table.innerHTML = classement.map((r, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>
                <img src="${circuitImages[r.Circuit]}" class="circuit-img" alt="${r.Circuit}">
                <img src="${categoryIcons[r.Catégorie]}" class="cat-icon" alt="${r.Catégorie}">
                ${r["Nom Prénom"]}
            </td>
            <td>${r.Temps}</td>
        </tr>
    `).join("");
}

circuitSelect.addEventListener("change", updateTable);
categorySelect.addEventListener("change", updateTable);