// Initialize map
let map;

// School type colors
const schoolTypeColors = {
  EMEF: "#5072e4", // Blue
  EMEI: "#e958a0", // Pink
  EMM: "#935ef0", // Purple
  EMMEI: "#ec5050", // Red
  EMEIEF: "#f19f40", // Orange
  OS: "#9da3af", // Gray
  CRI: "#000000", // Black
};

// DOM elements
const schoolsContainer = document.getElementById("schoolsContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const filterCheckboxes = document.querySelectorAll(".filter-checkbox");
const neighborhoodFilter = document.getElementById("neighborhoodFilter");
const resetFilters = document.getElementById("resetFilters");
const resultCount = document.getElementById("resultCount");

// Populate neighborhood options
const uniqueNeighborhoods = [
  ...new Set(schools.map((school) => school.neighborhood)),
].sort();
uniqueNeighborhoods.forEach((neighborhood) => {
  const option = document.createElement("option");
  option.value = neighborhood;
  option.textContent = neighborhood;
  neighborhoodFilter.appendChild(option);
});

// Initial display
displaySchools(schools.sort((a, b) => a.name.localeCompare(b.name)));

// Event listeners
searchBtn.addEventListener("click", filterSchools);
searchInput.addEventListener("keyup", function (e) {
  if (e.key === "Enter") filterSchools();
});

filterCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", filterSchools);
});

neighborhoodFilter.addEventListener("change", filterSchools);
resetFilters.addEventListener("click", resetAllFilters);

// Functions
function displaySchools(schoolsToDisplay) {
  schoolsContainer.innerHTML = "";

  if (schoolsToDisplay.length === 0) {
    schoolsContainer.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-md text-center">
        <i class="fas fa-school text-5xl text-gray-400 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Nenhuma escola encontrada</h3>
        <p class="text-gray-500">Tente ajustar seus filtros de busca</p>
      </div>
    `;
    resultCount.textContent = "0";
    return;
  }

  resultCount.textContent = schoolsToDisplay.length;

  schoolsToDisplay.forEach((school) => {
    const card = document.createElement("div");
    card.className =
      "school-card bg-white rounded-lg shadow-md p-4 transition duration-300";
    card.innerHTML = `
      <div class="school-card flex flex-col md:flex-row md:items-start justify-between gap-2">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span class="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              ${school.type}
            </span>
            <h3 class="text-lg font-semibold text-gray-800">${school.name}</h3>
          </div>
          <p class="text-gray-800 flex items-center text-sm">
            <i class="fas fa-map-pin mr-1" style="color: ${
              schoolTypeColors[school.type] || "#5072e4"
            }"></i> ${school.address}, ${school.neighborhood}
          </p>
        </div>
        <div class="flex gap-2">
          <button class="map-btn px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition flex items-center text-sm">
            <i class="fas fa-map-marker-alt mr-1"></i> Mapa
          </button>
          <button class="details-btn px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center text-sm">
            <i class="fas fa-info-circle mr-1"></i> Detalhes
          </button>
        </div>
      </div>
      
      <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        ${school.phones
          .map(
            (phone) => `
          <p class="text-gray-800 flex items-center whitespace-nowrap">
            <i class="fas fa-phone mr-1 text-blue-500"></i> ${phone}
          </p>
        `
          )
          .join("")}
        ${
          school.ramal && school.ramal.length > 0
            ? [...new Set(school.ramal)]
                .map(
                  (ramal) => `
            <p class="text-gray-800 flex items-center whitespace-nowrap">
              <i class="fas fa-phone-alt mr-1 text-gray-800"></i> ${ramal}
            </p>
          `
                )
                .join("")
            : ""
        }
        ${
          school.whatsapp
            ? `
          <p class="text-gray-800 flex items-center whitespace-nowrap">
            <i class="fab fa-whatsapp mr-1 text-green-500"></i> ${school.whatsapp}
          </p>
        `
            : ""
        }
      </div>
    `;

    schoolsContainer.appendChild(card);
  });
}

function filterSchools() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedTypes = Array.from(filterCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
  const selectedNeighborhood = neighborhoodFilter.value;

  const filteredSchools = schools
    .filter((school) => {
      // Filter by type
      if (!selectedTypes.includes(school.type)) return false;

      // Filter by neighborhood
      if (selectedNeighborhood && school.neighborhood !== selectedNeighborhood)
        return false;

      // Filter by search term
      if (searchTerm) {
        const searchIn =
          `${school.name} ${school.neighborhood} ${school.type}`.toLowerCase();
        if (!searchIn.includes(searchTerm)) return false;
      }

      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  displaySchools(filteredSchools);
}

function resetAllFilters() {
  searchInput.value = "";
  filterCheckboxes.forEach((checkbox) => (checkbox.checked = true));
  neighborhoodFilter.value = "";
  filterSchools();
}

// Simulate map click functionality
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("map-btn") || e.target.closest(".map-btn")) {
    const schoolCard = e.target.closest(".school-card");
    const schoolName = schoolCard.querySelector("h3").textContent;
    window.location.href = `mapa.html?name=${encodeURIComponent(schoolName)}`;
  }

  if (
    e.target.classList.contains("details-btn") ||
    e.target.closest(".details-btn")
  ) {
    alert("Mostraria detalhes completos da escola em uma implementação real");
  }
});

// Initialize map when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Wait a bit to ensure the map container is ready
  setTimeout(initMap, 100);
});

function initMap() {
  // Initialize the map centered on Barueri
  map = L.map("map").setView([-23.5115, -46.8723], 13);

  // Add the OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);
}
