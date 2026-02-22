const SHEET_URL = "https://opensheet.elk.sh/1zo5AMUtvPnzhq9YpuSU8gV6wlmpJXrORbcZOomWFaxc/Feuille 1";

const circuitSelect = document.getElementById("circuit");
const categorySelect = document.getElementById("category");
const table = document.getElementById("table");

let data = [];

fetch(SHEET_URL)
  .then(res => res.json())
  .then(rows => data = rows);

function updateTable() {
  const circuit = circuitSelect.value;
  const category = categorySelect.value;

  if (!circuit || !category) {
    table.innerHTML = "";
    return;
  }

  const classement = data
    .filter(r => r.Circuit === circuit && r.Catégorie === category)
    .sort((a, b) => a.Temps.localeCompare(b.Temps));

  table.innerHTML = classement.map((r, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${r["Nom Prénom"]}</td>
      <td>${r.Temps}</td>
    </tr>
  `).join("");
}

circuitSelect.addEventListener("change", updateTable);
categorySelect.addEventListener("change", updateTable);