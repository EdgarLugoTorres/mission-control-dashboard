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