import { get_from_storage, id_element, set_to_storage } from "../js/utils.js";

document.addEventListener("DOMContentLoaded", async () => {
    const currentUser = get_from_storage("currentUser");
    const users = get_from_storage("users");
    const user = users.find(u => u.username === currentUser);

    if (user && user.port) {
        const userDataDiv = id_element("userData");
        userDataDiv.innerHTML = `
            <div class="card mx-auto fade-in" style="max-width: 600px;">
                <div class="card-body">
                    <h5 class="card-title text-center">${currentUser}'s Information</h5>
                    <p><strong>Age:</strong> ${user.port.age}</p>
                    <p><strong>Address:</strong> ${user.port.address}</p>
                    <p><strong>About:</strong> ${user.port.about}</p>
                    <p><strong>LinkedIn:</strong> <a href="${user.port.linkedin}" target="_blank">${user.port.linkedin}</a></p>
                    <p><strong>GitHub:</strong> <a href="${user.port.github}" target="_blank">${user.port.github}</a></p>
                    <p><strong>API:</strong> ${user.port.Wapi ? "Weather" : ""} ${user.port.Fapi ? "Forex" : ""}</p>
                    ${!!user.port.picture ? `<img src="${user.port.picture}" alt="Profile Picture" class="img-fluid rounded mx-auto d-block mt-3 profile-picture" style="max-width: 200px;">` : ""}
                    <div id="weatherData" class="mt-3"></div>
                </div>
            </div>
        `;

        // Fetch weather data if the user has enabled the Weather API
        if (user.port.Wapi) {
            const weatherDataDiv = id_element("weatherData");
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=London&appid=911369defe8240ed7dd60090ce9dd9b9&units=metric`);
                if (response.ok) {
                    const weatherData = await response.json();
                    weatherDataDiv.innerHTML = `
                        <p><strong>Weather in ${weatherData.name}:</strong></p>
                        <p>Temperature: ${weatherData.main.temp}°C</p>
                        <p>Condition: ${weatherData.weather[0].description}</p>
                    `;
                } else {
                    const errorData = await response.json();
                    weatherDataDiv.innerHTML = `<p class="text-danger">Error: ${errorData.message}</p>`;
                }
            } catch (error) {
                weatherDataDiv.innerHTML = `<p class="text-danger">Error fetching weather data: ${error.message}</p>`;
            }
        }
    } else {
        id_element("userData").innerHTML = `
            <div class="alert alert-danger text-center" role="alert">
                No user data found. Please complete the first session.
            </div>
        `;
    }

    // Logout button functionality
    const logoutButton = id_element("logoutButton");
    logoutButton.addEventListener("click", () => {
        set_to_storage("currentUser", null); // Clear the current user
        window.location.href = "./login.html"; // Redirect to the login page
    });
});