let allMissions = [];

async function loadLaunch() {
    const launchData = document.getElementById("launch-data");

    launchData.innerHTML = "<p>Loading launch data...</p>";

    const response = await fetch("/api/latest-launch");
    const launch = await response.json();

    if (!response.ok || launch.error) {
        launchData.innerHTML = `
            <h2>Unable to load launch data</h2>
            <p>${launch.error}</p>
            <p>${launch.details || "Please try again later."}</p>
        `;
        return;
    }

    const launchDate = new Date(launch.date);

    launchData.innerHTML = `
        <h2>${launch.name}</h2>
        <p><strong>Date:</strong> ${launchDate.toLocaleDateString()}</p>
        <p>
            <strong>Status:</strong>
            <span class="status-pill">${launch.status}</span>
        </p>
        <p>${launch.details || "No mission details available."}</p>
    `;
}

async function loadNasaPhoto() {
    const nasaData = document.getElementById("nasa-data");

    nasaData.innerHTML = "<p>Loading NASA's picture...</p>";

    const response = await fetch("/api/nasa-photo");
    const photo = await response.json();

    if (!response.ok || photo.error) {
        nasaData.innerHTML = `
            <p>${photo.error}</p>
            <p>${photo.details || "Please try again later."}</p>
        `;
        return;
    }

    nasaData.innerHTML = `
        <h3>${photo.title}</h3>
        <p><strong>Date:</strong> ${photo.date}</p>
        <img class="nasa-image" src="${photo.image_url}" alt="${photo.title}">
        <p>${photo.explanation}</p>
    `;
}

async function loadMissions() {
    const missionsList = document.getElementById("missions-list");

    missionsList.innerHTML = "<p>Loading missions...</p>";

    const response = await fetch("/api/launches");
    allMissions = await response.json();

    displayMissions(allMissions);
}

function displayMissions(missions) {

    const missionsList = document.getElementById("missions-list");

    missionsList.innerHTML = "";
    document.getElementById("mission-count").textContent =
    `Showing ${missions.length} missions`;



    for (const mission of missions) {
        const missionDate = new Date(mission.date);
        const missionCard = document.createElement("div");
        const statusClass = getStatusClass(mission.status);

        missionCard.className = "mission-item";

        missionCard.innerHTML = `
            <h3>${mission.name}</h3>
            <p>Date: ${missionDate.toLocaleDateString()}</p>
            <p>
                Status:
                <span class="status-pill ${statusClass}">${mission.status}</span>
            </p>
        `;

        missionsList.appendChild(missionCard);
    }
}

const searchInput = document.getElementById("mission-search");

searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredMissions = allMissions.filter(mission =>
        mission.name.toLowerCase().includes(searchTerm)
    );
    displayMissions(filteredMissions);
});

const clearSearchButton = document.getElementById("clear-search");

clearSearchButton.addEventListener("click", () => {
   
  searchInput.value = "";
  
  displayMissions(allMissions);
});

function getStatusClass(status) {
    const statusText = status.toLowerCase();

    if (statusText.includes("success")) {
        return "status-success";
    }

    if (statusText.includes("failure")) {
        return "status-failure";
    }

    return "status-pending";
}