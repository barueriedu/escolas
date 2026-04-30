let map;
const schoolsData = [];
let currentlyDisplayedSchools = [];
let schoolsDataPromise = null;

const schoolTypeColors = {
  EMEF: "#5072e4",
  EMEI: "#e958a0",
  EMM: "#935ef0",
  EMMEI: "#ec5050",
  EMEIEF: "#f19f40",
  OS: "#9da3af",
  CRI: "#111827",
};

const schoolsContainer = document.getElementById("schoolsContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const filterCheckboxes = document.querySelectorAll(".filter-checkbox");
const neighborhoodFilter = document.getElementById("neighborhoodFilter");
const resetFilters = document.getElementById("resetFilters");
const resultCount = document.getElementById("resultCount");
const exportExcelBtn = document.getElementById("exportExcelBtn");

function normalizeText(value) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "")
    .trim();
}

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
      const hasAnyData = row.some((col) => col !== "");
      if (hasAnyData) rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  if (cell || row.length) {
    row.push(cell.trim());
    const hasAnyData = row.some((col) => col !== "");
    if (hasAnyData) rows.push(row);
  }

  return rows;
}

function inferSchoolType(name) {
  const text = normalizeText(name).toUpperCase();
  if (text.startsWith("EMEIEF")) return "EMEIEF";
  if (text.startsWith("EMMEI")) return "EMMEI";
  if (text.startsWith("EMEF")) return "EMEF";
  if (text.startsWith("EMEI")) return "EMEI";
  if (text.startsWith("EMM")) return "EMM";
  if (text.startsWith("O.S.") || text.startsWith("OS")) return "OS";
  if (text.startsWith("INFANTIL")) return "CRI";
  return "OUTROS";
}

function cleanSchoolName(name, type) {
  if (!name) return "";
  if (type === "OS")
    return name.replace(/^O\.?S\.?\s*MATERNAIS\s*/i, "").trim();
  if (type === "CRI") return name.replace(/^INFANTIL\s*/i, "").trim();
  return name.replace(/^[A-Z\.]+\s+/i, "").trim();
}

function parsePhones(value) {
  if (!value) return [];
  return value
    .replace(/Ramais?:?/gi, "")
    .split(/[\/,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseRamais(value) {
  if (!value) return [];
  const matches = value.match(/\d{3,5}/g);
  return matches ? [...new Set(matches)] : [];
}

function formatContact(name, phone, email) {
  const chunks = [];
  if (name) chunks.push(name);
  if (phone) chunks.push(phone);
  if (email)
    chunks.push(
      `<a href="mailto:${email}" class="text-blue-600 hover:underline">${email}</a>`,
    );
  if (chunks.length === 0) return "";
  return chunks.join(" - ");
}

function populateNeighborhoodOptions() {
  while (neighborhoodFilter.options.length > 1) {
    neighborhoodFilter.remove(1);
  }

  const uniqueNeighborhoods = [
    ...new Set(
      schoolsData.map((school) => school.neighborhood).filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b));

  uniqueNeighborhoods.forEach((neighborhood) => {
    const option = document.createElement("option");
    option.value = neighborhood;
    option.textContent = neighborhood;
    neighborhoodFilter.appendChild(option);
  });
}

async function loadSchoolsData() {
  if (schoolsData.length > 0) return schoolsData;
  if (schoolsDataPromise) return schoolsDataPromise;

  schoolsDataPromise = (async () => {
    try {
      const response = await fetch("csv/escolasNovo.csv");
      const buffer = await response.arrayBuffer();
      const csvText = new TextDecoder("utf-8").decode(buffer);
      const rows = parseSemicolonCsv(csvText);
      const headerIndex = rows.findIndex((row) =>
        normalizeText(row[0]).toUpperCase().startsWith("ESCOLA"),
      );

      if (headerIndex < 0) {
        throw new Error("Cabecalho do CSV nao encontrado.");
      }

      const dataRows = rows.slice(headerIndex + 1);
      schoolsData.length = 0;

      dataRows.forEach((row) => {
        const schoolLabel = row[0] || "";
        if (!schoolLabel.trim()) return;

        const type = inferSchoolType(schoolLabel);
        const school = {
          type,
          rawName: schoolLabel,
          name: cleanSchoolName(schoolLabel, type),
          phones: parsePhones(row[1]).concat(parsePhones(row[2])),
          whatsapp: row[3] || "",
          schoolEmail: row[4] || "",
          address: row[5] || "",
          neighborhood: row[6] || "",
          mapsUrl: row[7] || "",
          coordinatorName: row[8] || "",
          coordinatorRamal: row[9] || "",
          coordinatorEmail: row[10] || "",
          director: row[11] || "",
          directorPhone: row[12] || "",
          directorEmail: row[13] || "",
          supervisorName: row[14] || "",
          supervisorPhone: row[15] || "",
          supervisorEmail: row[16] || "",
          supportName: row[17] || "",
          supportPhone: row[18] || "",
          supportRamal: row[19] || "",
          supportEmail: row[20] || "",
        };

        school.ramal = [
          ...parseRamais(row[2]),
          ...parseRamais(row[9]),
          ...parseRamais(row[19]),
        ];

        schoolsData.push(school);
      });

      schoolsData.sort((a, b) => a.name.localeCompare(b.name));
      return schoolsData;
    } finally {
      schoolsDataPromise = null;
    }
  })();

  try {
    const loadedSchools = await schoolsDataPromise;
    if (schoolsContainer && neighborhoodFilter) {
      populateNeighborhoodOptions();
      filterSchools();
    }
    return loadedSchools;
  } catch (error) {
    console.error("Erro ao carregar escolas:", error);
    if (schoolsContainer) {
      schoolsContainer.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-md text-center">
          <i class="fas fa-exclamation-circle text-5xl text-red-400 mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Erro ao carregar dados</h3>
          <p class="text-gray-500">Nao foi possivel carregar o arquivo csv/escolasNovo.csv.</p>
        </div>
      `;
    }
    throw error;
  }
}

function findSchoolByName(name) {
  const target = normalizeText(name).toLowerCase();
  return schoolsData.find((school) => {
    const baseName = normalizeText(school.name).toLowerCase();
    const rawName = normalizeText(school.rawName).toLowerCase();
    return baseName === target || rawName === target;
  });
}

function displaySchools(schoolsToDisplay) {
  schoolsContainer.innerHTML = "";

  if (schoolsToDisplay.length === 0) {
    schoolsContainer.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-md text-center">
        <i class="fas fa-school text-5xl text-gray-400 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Nenhuma escola encontrada</h3>
        <p class="text-gray-500">Tente ajustar os filtros.</p>
      </div>
    `;
    resultCount.textContent = "0";
    currentlyDisplayedSchools = [];
    return;
  }

  resultCount.textContent = String(schoolsToDisplay.length);
  currentlyDisplayedSchools = schoolsToDisplay;

  schoolsToDisplay.forEach((school) => {
    const card = document.createElement("div");
    card.className =
      "school-card bg-white rounded-lg shadow-md p-4 transition duration-300 border border-gray-100";

    card.innerHTML = `
      <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
        <div class="flex-1">
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <span class="inline-block px-2 py-0.5 rounded-full text-sm font-medium text-white" style="background-color: ${schoolTypeColors[school.type] || "#1f2937"}">
              ${school.type}
            </span>
            <h3 class="text-lg font-semibold text-gray-800">${school.name}</h3>
          </div>
          <p class="text-gray-700 text-sm flex items-center">
            <i class="fas fa-map-pin mr-2"></i>${school.address || "-"}${school.neighborhood ? `, ${school.neighborhood}` : ""}
          </p>
          ${school.schoolEmail ? `<p class="text-sm mt-1"><i class="fas fa-envelope mr-2 text-gray-600"></i><a href="mailto:${school.schoolEmail}" class="text-blue-600 hover:underline">${school.schoolEmail}</a></p>` : ""}
        </div>
        <div class="flex gap-2">
          <button class="map-btn px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition flex items-center text-sm">
            <i class="fas fa-map-marker-alt mr-1"></i>Mapa
          </button>
        </div>
      </div>

      <div class="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 text-sm">
        <div class="bg-gray-50 rounded p-2">
          <p class="font-semibold text-gray-700 mb-1 flex items-center">
            <i class="fas fa-address-book mr-2 text-gray-600"></i>Contatos da escola
          </p>
          <p>${school.phones.join(" / ") || "-"}</p>
          ${school.ramal.length ? `<p><i class="fas fa-phone-alt mr-1 text-gray-600"></i>Ramais: ${school.ramal.join(", ")}</p>` : ""}
          ${school.whatsapp ? `<p><i class="fab fa-whatsapp mr-1 text-green-600"></i>${school.whatsapp}</p>` : ""}
        </div>
        <div class="bg-gray-50 rounded p-2">
          <p class="font-semibold text-gray-700 mb-1 flex items-center">
            <i class="fas fa-user-tie mr-2 text-gray-600"></i>Direcao / Coordenação
          </p>
          <p>${formatContact(school.director, school.directorPhone, school.directorEmail) || "-"}</p>
          <p class="mt-1">${formatContact(school.coordinatorName, school.coordinatorRamal, school.coordinatorEmail) || ""}</p>
        </div>
        <div class="bg-gray-50 rounded p-2">
          <p class="font-semibold text-gray-700 mb-1 flex items-center">
            <i class="fas fa-headset mr-2 text-gray-600"></i>Supervisão / Suporte
          </p>
          <p>${formatContact(school.supervisorName, school.supervisorPhone, school.supervisorEmail) || "-"}</p>
          <p class="mt-1">${formatContact(school.supportName, school.supportPhone || school.supportRamal, school.supportEmail) || ""}</p>
        </div>
      </div>
    `;

    schoolsContainer.appendChild(card);
  });
}

function filterSchools() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedTypes = Array.from(filterCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
  const selectedNeighborhood = neighborhoodFilter.value;

  const filteredSchools = schoolsData
    .filter((school) => {
      if (!selectedTypes.includes(school.type)) return false;
      if (selectedNeighborhood && school.neighborhood !== selectedNeighborhood)
        return false;

      if (searchTerm) {
        const searchIn = [
          school.name,
          school.rawName,
          school.neighborhood,
          school.type,
          school.director,
          school.coordinatorName,
          school.supportName,
        ]
          .join(" ")
          .toLowerCase();

        if (!searchIn.includes(searchTerm)) return false;
      }

      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  displaySchools(filteredSchools);
}

function resetAllFilters() {
  searchInput.value = "";
  filterCheckboxes.forEach((checkbox) => {
    checkbox.checked = true;
  });
  neighborhoodFilter.value = "";
  filterSchools();
}

function initMap() {
  map = L.map("map").setView([-23.5115, -46.8723], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);
}

if (exportExcelBtn) {
  exportExcelBtn.addEventListener("click", () => {
    try {
      const header = [
        "Tipo",
        "Escola",
        "Telefone",
        "WhatsApp",
        "E-mail Escola",
        "Endereco",
        "Bairro",
        "Diretor(a)",
        "E-mail Diretor(a)",
        "Coordenador(a) SED",
        "Ramal Coord.",
        "Supervisor(a)",
        "Suporte",
      ];

      const rows = currentlyDisplayedSchools.map((s) => [
        s.type,
        s.name,
        s.phones.join(" / "),
        s.whatsapp || "",
        s.schoolEmail || "",
        s.address || "",
        s.neighborhood || "",
        s.director || "",
        s.directorEmail || "",
        s.coordinatorName || "",
        s.coordinatorRamal || "",
        s.supervisorName || "",
        s.supportName || "",
      ]);

      const worksheet = XLSX.utils.aoa_to_sheet([header, ...rows]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Escolas");
      XLSX.writeFile(
        workbook,
        `escolas_${new Date().toISOString().replace(/[:.]/g, "-")}.xlsx`,
      );
    } catch (error) {
      console.error("Erro ao exportar:", error);
      alert("Nao foi possivel exportar para Excel.");
    }
  });
}

if (searchBtn && searchInput && neighborhoodFilter && resetFilters) {
  searchBtn.addEventListener("click", filterSchools);
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") filterSchools();
  });
  filterCheckboxes.forEach((checkbox) =>
    checkbox.addEventListener("change", filterSchools),
  );
  neighborhoodFilter.addEventListener("change", filterSchools);
  resetFilters.addEventListener("click", resetAllFilters);
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("map-btn") || e.target.closest(".map-btn")) {
    const schoolCard = e.target.closest(".school-card");
    const schoolName = schoolCard?.querySelector("h3")?.textContent || "";
    window.location.href = `mapa.html?name=${encodeURIComponent(schoolName)}`;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (schoolsContainer) {
    setTimeout(initMap, 100);
    loadSchoolsData();
  }
});

window.loadSchoolsData = loadSchoolsData;
window.getSchoolsData = () => schoolsData;
window.findSchoolByName = findSchoolByName;
