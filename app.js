const SHEET_URL = "https://opensheet.elk.sh/1zo5AMUtvPnzhq9YpuSU8gV6wlmpJXrORbcZOomWFaxc/Feuille 1";

const circuitSelect = document.getElementById("circuit");
const categorySelect = document.getElementById("category");
const table = document.getElementById("table");

let data = [];

// Charger les données depuis la Sheet
fetch(SHEET_URL)
  .then(res => res.json())
  .then(rows => data = rows);

// Mettre à jour le tableau
function updateTable() {
  const circuit = circuitSelect.value;
  const category = categorySelect.value;

  if (!circuit || !category) {
    table.innerHTML = "";
    return;
  }

  // Filtrer par circuit et catégorie
  let filtered = data.filter(r => r.Circuit === circuit && r.Catégorie === category);

  // Garder uniquement le meilleur temps par pilote
  const bestByPilot = [];
  filtered.forEach(r => {
    const existing = bestByPilot.find(e => e["Nom Prénom"] === r["Nom Prénom"]);
    if (!existing) {
      bestByPilot.push(r);
    } else {
      // Comparer les temps : garder le plus petit
      if (r.Temps < existing.Temps) {
        const index = bestByPilot.indexOf(existing);
        bestByPilot[index] = r;
      }
    }
  });

  // Trier par temps
  const classement = bestByPilot.sort((a, b) => a.Temps.localeCompare(b.Temps));

  // Afficher dans le tableau
  table.innerHTML = classement.map((r, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${r["Nom Prénom"]}</td>
      <td>${r.Temps}</td>
    </tr>
  `).join("");
}

// Mettre à jour quand l’utilisateur change le circuit ou la catégorie
circuitSelect.addEventListener("change", updateTable);
categorySelect.addEventListener("change", updateTable);