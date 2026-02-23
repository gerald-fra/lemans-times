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
    "Spa": "img/Spa.png"
};

const categoryIcons = {
    "Hypercar": "img/hypercar.png",
    "LMP2": "img/lmp2.png",
    "GTE": "img/gte.png",
    "LMGT3": "img/lmgt3.png",
    "LMP3": "img/lmp3.png"
};

// 🔹 Détermine la classe + badge selon le temps
function getClassement(time, refs) {
    if (refs.plat && time <= refs.plat) return ["row-platinium", "PLATINIUM"];
    if (refs.or && time <= refs.or) return ["row-or", "OR"];
    if (refs.argent && time <= refs.argent) return ["row-argent", "ARGENT"];
    if (refs.bronze && time <= refs.bronze) return ["row-bronze", "BRONZE"];
    return ["row-out", "—"];
}

function updateTable() {
    const circuit = circuitSelect.value;
    const category = categorySelect.value;

    if (!circuit || !category) {
        table.innerHTML = "";
        return;
    }

    // 1️⃣ Filtrer par circuit
    let filtered = data.filter(r => r.Circuit === circuit);

    // 2️⃣ Filtrer par catégorie (ou toutes)
    if (category !== "ALL") {
        filtered = filtered.filter(r => r.Catégorie === category);
    }

    // 3️⃣ Lire les références AVANT suppression
    const refs = {
        plat: filtered.find(r => r["Nom Prénom"] === "PLATINIUM")?.Temps,
        or: filtered.find(r => r["Nom Prénom"] === "OR")?.Temps,
        argent: filtered.find(r => r["Nom Prénom"] === "ARGENT")?.Temps,
        bronze: filtered.find(r => r["Nom Prénom"] === "BRONZE")?.Temps
    };

    // 4️⃣ Supprimer les lignes de référence
    filtered = filtered.filter(r =>
        !["PLATINIUM", "OR", "ARGENT", "BRONZE"].includes(r["Nom Prénom"])
    );

    // 5️⃣ Meilleur temps par pilote + catégorie
    const best = {};
    filtered.forEach(r => {
        const key = `${r["Nom Prénom"]}_${r.Catégorie}`;
        if (!best[key] || r.Temps < best[key].Temps) {
            best[key] = r;
        }
    });

    const classement = Object.values(best)
        .sort((a, b) => a.Temps.localeCompare(b.Temps));

    // 6️⃣ Affichage final
    table.innerHTML = classement.map((r, i) => {
        const [rowClass, badge] = getClassement(r.Temps, refs);

        return `
        <tr class="${rowClass}">
            <td>${i + 1}</td>
            <td>
                <img src="${circuitImages[r.Circuit]}" class="circuit-img">
                <img src="${categoryIcons[r.Catégorie]}" class="cat-icon">
                ${r["Nom Prénom"]}
                <span class="badge badge-${badge.toLowerCase()}">${badge}</span>
            </td>
            <td>${r.Catégorie}</td>
            <td>${r.Temps}</td>
        </tr>
        `;
    }).join("");
}

// Événements
circuitSelect.addEventListener("change", updateTable);
categorySelect.addEventListener("change", updateTable);