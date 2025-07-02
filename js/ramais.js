// DOM elements
const ramaisContainer = document.getElementById("ramaisContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const departmentFilter = document.getElementById("departmentFilter");
const resetFilters = document.getElementById("resetFilters");
const resultCount = document.getElementById("resultCount");

let ramaisData = [];

// Add sorting state
window.currentSort = {
  column: "SETOR",
  direction: "asc",
};

// Function to normalize special characters
function normalizeText(text) {
  if (!text) return "";

  // Mapeamento direto de caracteres problemáticos
  const charMap = {
    Ã: "A",
    Á: "A",
    À: "A",
    Â: "A",
    Ä: "A",
    É: "E",
    Ê: "E",
    È: "E",
    Ë: "E",
    Í: "I",
    Î: "I",
    Ì: "I",
    Ï: "I",
    Ó: "O",
    Ô: "O",
    Ò: "O",
    Õ: "O",
    Ö: "O",
    Ú: "U",
    Û: "U",
    Ù: "U",
    Ü: "U",
    Ç: "C",
    Ñ: "N",
    ã: "a",
    á: "a",
    à: "a",
    â: "a",
    ä: "a",
    é: "e",
    ê: "e",
    è: "e",
    ë: "e",
    í: "i",
    î: "i",
    ì: "i",
    ï: "i",
    ó: "o",
    ô: "o",
    ò: "o",
    õ: "o",
    ö: "o",
    ú: "u",
    û: "u",
    ù: "u",
    ü: "u",
    ç: "c",
    ñ: "n",
  };

  return text.replace(/[À-ÿ]/g, (char) => charMap[char] || char);
}

// Function to decode HTML entities
function decodeHTMLEntities(text) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

// Function to fix encoding issues
function fixEncoding(text) {
  // Mapeamento de caracteres mal codificados
  const encodingMap = {
    "": "Â",
    "": "É",
    "": "Ê",
    "": "Í",
    "": "Ó",
    "": "Ô",
    "": "Õ",
    "": "Ú",
    "": "á",
    "": "â",
    "": "ã",
    "": "é",
    "": "ê",
    "": "í",
    "": "ó",
    "": "ô",
    "": "õ",
    "": "ú",
    "": "ç",
  };

  return text.replace(/[^\x00-\x7F]/g, (char) => encodingMap[char] || char);
}

// Load and parse CSV data
async function loadRamaisData() {
  try {
    const response = await fetch("csv/ramais_SE.CSV");
    const csvText = await response.text();
    console.log("CSV loaded:", csvText.substring(0, 200));

    const rows = csvText.split("\n").map((row) => row.split(";"));
    const headers = rows[0];
    console.log("Headers:", headers);

    ramaisData = rows.slice(1).map((row) => {
      const ramal = {};
      headers.forEach((header, index) => {
        const value = row[index]?.trim() || "";
        ramal[header.trim()] = decodeHTMLEntities(fixEncoding(value));
      });
      return ramal;
    });

    console.log("First few ramais:", ramaisData.slice(0, 3));

    // Populate department filter
    const departments = [...new Set(ramaisData.map((ramal) => ramal.SETOR))]
      .filter(Boolean)
      .sort();
    console.log("Departments found:", departments);

    // Clear existing options except the first one
    while (departmentFilter.options.length > 1) {
      departmentFilter.remove(1);
    }

    departments.forEach((department) => {
      if (department) {
        const option = document.createElement("option");
        option.value = department;
        option.textContent = department;
        departmentFilter.appendChild(option);
      }
    });

    // Initial display
    displayRamais(ramaisData);
  } catch (error) {
    console.error("Error loading ramais data:", error);
    ramaisContainer.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-md text-center">
        <i class="fas fa-exclamation-circle text-5xl text-red-400 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Erro ao carregar dados</h3>
        <p class="text-gray-500">Não foi possível carregar os dados dos ramais</p>
      </div>
    `;
  }
}

// Function to sort ramais data
window.sortRamais = function (data, column, direction) {
  return [...data].sort((a, b) => {
    let valueA = a[column] || "";
    let valueB = b[column] || "";

    // Handle numeric values for RAMAL and DDR
    if (column === "RAMAL" || column === "DDR") {
      valueA = parseInt(valueA) || 0;
      valueB = parseInt(valueB) || 0;
    }

    if (direction === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });
};

// Function to handle header click
function handleHeaderClick(column) {
  if (window.currentSort.column === column) {
    window.currentSort.direction =
      window.currentSort.direction === "asc" ? "desc" : "asc";
  } else {
    window.currentSort.column = column;
    window.currentSort.direction = "asc";
  }
  filterRamais();
}

// Display ramais
function displayRamais(ramaisToDisplay) {
  ramaisContainer.innerHTML = "";
  const selectedDepartment = departmentFilter.value;
  const hasSearchTerm = searchInput.value.trim() !== "";

  if (ramaisToDisplay.length === 0) {
    ramaisContainer.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-md text-center">
        <i class="fas fa-phone text-5xl text-gray-400 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Nenhum ramal encontrado</h3>
        <p class="text-gray-500">Tente ajustar seus filtros de busca</p>
      </div>
    `;
    resultCount.textContent = "0";
    return;
  }

  resultCount.textContent = ramaisToDisplay.length;

  // Sort the data
  const sortedRamais = window.sortRamais(
    ramaisToDisplay,
    window.currentSort.column,
    window.currentSort.direction
  );

  if (hasSearchTerm) {
    // Layout tabular para resultados de busca
    const table = document.createElement("div");
    table.className = "bg-white rounded-lg overflow-hidden";

    // Cabeçalho da tabela
    table.innerHTML = `
      <div class="grid grid-cols-5 bg-gray-50 px-1 py-1.5 text-sm font-medium text-gray-700 border-b">
        <div class="w-50 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded flex items-center" onclick="handleHeaderClick('SETOR')">
          Departamento
          ${
            window.currentSort.column === "SETOR"
              ? `<i class="fas fa-sort-${
                  window.currentSort.direction === "asc" ? "up" : "down"
                } ml-1"></i>`
              : `<i class="fas fa-sort ml-1 text-gray-400"></i>`
          }
        </div>
        <div class="w-50 ml-5 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded flex items-center" onclick="handleHeaderClick('NOME')">
          Nome
          ${
            window.currentSort.column === "NOME"
              ? `<i class="fas fa-sort-${
                  window.currentSort.direction === "asc" ? "up" : "down"
                } ml-1"></i>`
              : `<i class="fas fa-sort ml-1 text-gray-400"></i>`
          }
        </div>
        <div class="w-24 ml-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded flex items-center" onclick="handleHeaderClick('RAMAL')">
          Ramal
          ${
            window.currentSort.column === "RAMAL"
              ? `<i class="fas fa-sort-${
                  window.currentSort.direction === "asc" ? "up" : "down"
                } ml-1"></i>`
              : `<i class="fas fa-sort ml-1 text-gray-400"></i>`
          }
        </div>
        <div class="w-24 ml-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded flex items-center" onclick="handleHeaderClick('DDR')">
          DDR
          ${
            window.currentSort.column === "DDR"
              ? `<i class="fas fa-sort-${
                  window.currentSort.direction === "asc" ? "up" : "down"
                } ml-1"></i>`
              : `<i class="fas fa-sort ml-1 text-gray-400"></i>`
          }
        </div>
        <div class="w-48 ml-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded flex items-center" onclick="handleHeaderClick('OBS')">
          Observação
          ${
            window.currentSort.column === "OBS"
              ? `<i class="fas fa-sort-${
                  window.currentSort.direction === "asc" ? "up" : "down"
                } ml-1"></i>`
              : `<i class="fas fa-sort ml-1 text-gray-400"></i>`
          }
        </div>
      </div>
    `;

    // Linhas da tabela
    sortedRamais.forEach((ramal) => {
      const row = document.createElement("div");
      row.className =
        "grid grid-cols-5 px-1 py-1 text-sm border-b border-gray-100 hover:bg-gray-50";
      row.innerHTML = `
        <div class="font-medium text-blue-800 w-50">${ramal.SETOR}</div>
        <div class="font-medium text-gray-800 truncate w-50 ml-5">${
          ramal.NOME
        }</div>
        <div class="text-gray-600 whitespace-nowrap w-24 ml-2">
          <i class="fas fa-phone mr-1 text-blue-500"></i>${ramal.RAMAL}
        </div>
        <div class="text-gray-600 whitespace-nowrap w-24 ml-2">
          ${
            ramal.DDR
              ? `<i class="fas fa-phone-alt mr-1 text-gray-600"></i>${ramal.DDR}`
              : "-"
          }
        </div>
        <div class="text-gray-600 truncate w-48 ml-2">
          ${
            ramal.OBS
              ? `<i class="fas fa-info-circle mr-1"></i>${ramal.OBS}`
              : "-"
          }
        </div>
      `;
      table.appendChild(row);
    });

    ramaisContainer.appendChild(table);
  } else {
    // Layout em grade para visualização normal
    const grid = document.createElement("div");
    grid.className = "bg-white rounded-lg overflow-hidden";

    // Cabeçalho
    grid.innerHTML = `
      <div class="grid grid-cols-5 bg-gray-50 px-1 py-1.5 text-sm font-medium text-gray-700 border-b">
        <div class="w-50 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded flex items-center" onclick="handleHeaderClick('SETOR')">
          Departamento
          ${
            window.currentSort.column === "SETOR"
              ? `<i class="fas fa-sort-${
                  window.currentSort.direction === "asc" ? "up" : "down"
                } ml-1"></i>`
              : `<i class="fas fa-sort ml-1 text-gray-400"></i>`
          }
        </div>
        <div class="w-50 ml-5 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded flex items-center" onclick="handleHeaderClick('NOME')">
          Nome
          ${
            window.currentSort.column === "NOME"
              ? `<i class="fas fa-sort-${
                  window.currentSort.direction === "asc" ? "up" : "down"
                } ml-1"></i>`
              : `<i class="fas fa-sort ml-1 text-gray-400"></i>`
          }
        </div>
        <div class="w-24 ml-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded flex items-center" onclick="handleHeaderClick('RAMAL')">
          Ramal
          ${
            window.currentSort.column === "RAMAL"
              ? `<i class="fas fa-sort-${
                  window.currentSort.direction === "asc" ? "up" : "down"
                } ml-1"></i>`
              : `<i class="fas fa-sort ml-1 text-gray-400"></i>`
          }
        </div>
        <div class="w-24 ml-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded flex items-center" onclick="handleHeaderClick('DDR')">
          DDR
          ${
            window.currentSort.column === "DDR"
              ? `<i class="fas fa-sort-${
                  window.currentSort.direction === "asc" ? "up" : "down"
                } ml-1"></i>`
              : `<i class="fas fa-sort ml-1 text-gray-400"></i>`
          }
        </div>
        <div class="w-48 ml-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded flex items-center" onclick="handleHeaderClick('OBS')">
          Observação
          ${
            window.currentSort.column === "OBS"
              ? `<i class="fas fa-sort-${
                  window.currentSort.direction === "asc" ? "up" : "down"
                } ml-1"></i>`
              : `<i class="fas fa-sort ml-1 text-gray-400"></i>`
          }
        </div>
      </div>
    `;

    // Linhas
    sortedRamais.forEach((ramal) => {
      const row = document.createElement("div");
      row.className =
        "grid grid-cols-5 px-1 py-1 text-sm border-b border-gray-100 hover:bg-gray-50";
      row.innerHTML = `
        <div class="font-medium text-blue-800 w-50">
          ${
            !selectedDepartment
              ? `<span class="inline-block px-0.5 py-0 bg-blue-100 text-blue-800 rounded-full text-sm whitespace-nowrap">${ramal.SETOR}</span>`
              : ""
          }
        </div>
        <div class="font-medium text-gray-800 truncate w-50 ml-5">${
          ramal.NOME
        }</div>
        <div class="text-gray-600 whitespace-nowrap w-24 ml-2">
          <i class="fas fa-phone mr-1 text-blue-500"></i>${ramal.RAMAL}
        </div>
        <div class="text-gray-600 whitespace-nowrap w-24 ml-2">
          ${
            ramal.DDR
              ? `<i class="fas fa-phone-alt mr-1 text-gray-600"></i>${ramal.DDR}`
              : "-"
          }
        </div>
        <div class="text-gray-600 truncate w-48 ml-2">
          ${
            ramal.OBS
              ? `<i class="fas fa-info-circle mr-1"></i>${ramal.OBS}`
              : "-"
          }
        </div>
      `;
      grid.appendChild(row);
    });

    ramaisContainer.appendChild(grid);
  }
}

// Filter ramais
function filterRamais() {
  const searchTerm = normalizeText(searchInput.value.toLowerCase());
  const selectedDepartment = departmentFilter.value;

  const filteredRamais = ramaisData.filter((ramal) => {
    // Se houver termo de busca, procura em todos os departamentos
    if (searchTerm) {
      const searchIn = normalizeText(
        `${ramal.NOME} ${ramal.SETOR}`.toLowerCase()
      );
      if (!searchIn.includes(searchTerm)) return false;
    }

    // Filtro por departamento só é aplicado se não houver termo de busca
    if (
      !searchTerm &&
      selectedDepartment &&
      ramal.SETOR !== selectedDepartment
    ) {
      return false;
    }

    return true;
  });

  displayRamais(filteredRamais);
}

// Reset filters
function resetAllFilters() {
  searchInput.value = "";
  departmentFilter.value = "";
  filterRamais();
}

// Event listeners
searchBtn.addEventListener("click", filterRamais);
searchInput.addEventListener("keyup", function (e) {
  if (e.key === "Enter") filterRamais();
});
departmentFilter.addEventListener("change", filterRamais);
resetFilters.addEventListener("click", resetAllFilters);

// Load data when page loads
document.addEventListener("DOMContentLoaded", loadRamaisData);
