const ramaisContainer = document.getElementById("ramaisContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const departmentFilter = document.getElementById("departmentFilter");
const resetFilters = document.getElementById("resetFilters");
const resultCount = document.getElementById("resultCount");

let ramaisData = [];
window.currentSort = { column: "departamento", direction: "asc" };

function parseSemicolonCsv(csvText) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i += 1) {
    const char = csvText[i];
    const next = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === ";" && !inQuotes) {
      row.push(cell.trim());
      cell = "";
      continue;
    }
    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(cell.trim());
      const hasData = row.some((item) => item !== "");
      if (hasData) rows.push(row);
      row = [];
      cell = "";
      continue;
    }
    cell += char;
  }

  if (cell || row.length) {
    row.push(cell.trim());
    const hasData = row.some((item) => item !== "");
    if (hasData) rows.push(row);
  }

  return rows;
}

function normalizeText(value) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "")
    .toLowerCase();
}

function normalizeDepartment(value) {
  return (value || "").replace(/\s+/g, " ").trim();
}

async function loadRamaisData() {
  try {
    const response = await fetch("csv/ramaisNovo.csv");
    const buffer = await response.arrayBuffer();
    const csvText = new TextDecoder("utf-8").decode(buffer);
    const rows = parseSemicolonCsv(csvText);
    const headerIndex = rows.findIndex((row) =>
      normalizeText(row[0]).includes("nome")
    );

    if (headerIndex < 0) {
      throw new Error("Cabecalho do arquivo nao encontrado.");
    }

    ramaisData = rows.slice(headerIndex + 1).map((row) => ({
      nome: row[0] || "",
      departamento: normalizeDepartment(row[1] || ""),
      ramal: row[2] || "",
      ddr: row[3] || "",
      observacao: row[4] || "",
      email: row[5] || "",
    })).filter((row) => row.nome || row.departamento || row.ramal || row.email);

    populateDepartmentFilter();
    filterRamais();
  } catch (error) {
    console.error("Erro ao carregar dados de ramais:", error);
    ramaisContainer.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-md text-center">
        <i class="fas fa-exclamation-circle text-5xl text-red-400 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Erro ao carregar dados</h3>
        <p class="text-gray-500">Nao foi possivel ler o arquivo csv/ramaisNovo.csv.</p>
      </div>
    `;
  }
}

function populateDepartmentFilter() {
  while (departmentFilter.options.length > 1) {
    departmentFilter.remove(1);
  }

  const departments = [
    ...new Set(ramaisData.map((item) => item.departamento).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b));

  departments.forEach((department) => {
    const option = document.createElement("option");
    option.value = department;
    option.textContent = department;
    departmentFilter.appendChild(option);
  });
}

function sortRamais(data, column, direction) {
  return [...data].sort((a, b) => {
    let valueA = a[column] || "";
    let valueB = b[column] || "";

    if (column === "ramal" || column === "ddr") {
      const numA = Number((valueA.match(/\d+/) || ["0"])[0]);
      const numB = Number((valueB.match(/\d+/) || ["0"])[0]);
      return direction === "asc" ? numA - numB : numB - numA;
    }

    valueA = valueA.toString().toLowerCase();
    valueB = valueB.toString().toLowerCase();
    if (valueA === valueB) return 0;
    return direction === "asc"
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });
}

window.handleHeaderClick = function (column) {
  if (window.currentSort.column === column) {
    window.currentSort.direction =
      window.currentSort.direction === "asc" ? "desc" : "asc";
  } else {
    window.currentSort.column = column;
    window.currentSort.direction = "asc";
  }
  filterRamais();
};

function sortIcon(column) {
  if (window.currentSort.column !== column) {
    return '<i class="fas fa-sort ml-1 text-gray-400"></i>';
  }
  return `<i class="fas fa-sort-${window.currentSort.direction === "asc" ? "up" : "down"} ml-1"></i>`;
}

function displayRamais(ramaisToDisplay) {
  ramaisContainer.innerHTML = "";

  if (ramaisToDisplay.length === 0) {
    ramaisContainer.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-md text-center">
        <i class="fas fa-phone text-5xl text-gray-400 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Nenhum ramal encontrado</h3>
        <p class="text-gray-500">Ajuste os filtros para continuar.</p>
      </div>
    `;
    resultCount.textContent = "0";
    return;
  }

  const sortedRamais = sortRamais(
    ramaisToDisplay,
    window.currentSort.column,
    window.currentSort.direction
  );
  resultCount.textContent = String(sortedRamais.length);

  const table = document.createElement("div");
  table.className = "overflow-auto rounded-lg border border-gray-100";
  table.innerHTML = `
    <table class="min-w-full text-sm">
      <thead class="bg-gray-50 text-gray-700">
        <tr>
          <th class="text-left px-3 py-2 cursor-pointer" onclick="handleHeaderClick('nome')">Nome ${sortIcon("nome")}</th>
          <th class="text-left px-3 py-2 cursor-pointer" onclick="handleHeaderClick('departamento')">Departamento/Setor ${sortIcon("departamento")}</th>
          <th class="text-left px-3 py-2 cursor-pointer" onclick="handleHeaderClick('ramal')">Ramal ${sortIcon("ramal")}</th>
          <th class="text-left px-3 py-2 cursor-pointer" onclick="handleHeaderClick('ddr')">DDR ${sortIcon("ddr")}</th>
          <th class="text-left px-3 py-2 cursor-pointer" onclick="handleHeaderClick('observacao')">Observacao ${sortIcon("observacao")}</th>
          <th class="text-left px-3 py-2 cursor-pointer" onclick="handleHeaderClick('email')">E-mail ${sortIcon("email")}</th>
        </tr>
      </thead>
      <tbody id="ramaisRows"></tbody>
    </table>
  `;

  const tbody = table.querySelector("#ramaisRows");
  sortedRamais.forEach((ramal) => {
    const tr = document.createElement("tr");
    tr.className = "border-t hover:bg-gray-50";
    tr.innerHTML = `
      <td class="px-3 py-2 font-medium text-gray-800">${ramal.nome || "-"}</td>
      <td class="px-3 py-2">${ramal.departamento || "-"}</td>
      <td class="px-3 py-2">${ramal.ramal || "-"}</td>
      <td class="px-3 py-2">${ramal.ddr || "-"}</td>
      <td class="px-3 py-2">${ramal.observacao || "-"}</td>
      <td class="px-3 py-2">${ramal.email ? `<a href="mailto:${ramal.email}" class="text-blue-600 hover:underline">${ramal.email}</a>` : "-"}</td>
    `;
    tbody.appendChild(tr);
  });

  ramaisContainer.appendChild(table);
}

function filterRamais() {
  const searchTerm = normalizeText(searchInput.value);
  const selectedDepartment = departmentFilter.value;

  const filtered = ramaisData.filter((ramal) => {
    if (selectedDepartment && ramal.departamento !== selectedDepartment) return false;
    if (!searchTerm) return true;

    const searchIn = normalizeText(
      `${ramal.nome} ${ramal.departamento} ${ramal.ramal} ${ramal.ddr} ${ramal.email} ${ramal.observacao}`
    );
    return searchIn.includes(searchTerm);
  });

  displayRamais(filtered);
}

function resetAllFilters() {
  searchInput.value = "";
  departmentFilter.value = "";
  filterRamais();
}

searchBtn.addEventListener("click", filterRamais);
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") filterRamais();
});
departmentFilter.addEventListener("change", filterRamais);
resetFilters.addEventListener("click", resetAllFilters);

document.addEventListener("DOMContentLoaded", loadRamaisData);
