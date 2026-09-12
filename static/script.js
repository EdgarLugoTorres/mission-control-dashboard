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