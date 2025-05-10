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
                    <div id="apiData" class="mt-3"></div>
                </div>
            </div>
        `;

        const apiDataDiv = id_element("apiData");

        // Fetch weather data if the user has enabled the Weather API
        if (user.port.Wapi) {
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Ashdod&appid=911369defe8240ed7dd60090ce9dd9b9&units=metric`);
                if (response.ok) {
                    const weatherData = await response.json();

                    // Group data by day
                    const dailyForecast = {};
                    weatherData.list.forEach(item => {
                        const date = item.dt_txt.split(" ")[0]; // Extract the date
                        if (!dailyForecast[date]) {
                            dailyForecast[date] = [];
                        }
                        dailyForecast[date].push(item);
                    });

                    // Get the first 5 days
                    const forecastDays = Object.keys(dailyForecast).slice(0, 5);

                    // Generate HTML for the forecast
                    let forecastHTML = `<h5 class="mt-3">5-Day Weather Forecast:</h5>`;
                    forecastDays.forEach(date => {
                        const dayData = dailyForecast[date][0]; // Use the first entry of each day
                        forecastHTML += `
                            <div class="mt-3">
                                <p><strong>${new Date(date).toDateString()}:</strong></p>
                                <p>Temperature: ${dayData.main.temp}°C</p>
                                <p>Condition: ${dayData.weather[0].description}</p>
                                <img src="https://openweathermap.org/img/wn/${dayData.weather[0].icon}.png" alt="${dayData.weather[0].description}">
                            </div>
                        `;
                    });

                    apiDataDiv.innerHTML += forecastHTML;
                } else {
                    const errorData = await response.json();
                    apiDataDiv.innerHTML += `<p class="text-danger">Error: ${errorData.message}</p>`;
                }
            } catch (error) {
                apiDataDiv.innerHTML += `<p class="text-danger">Error fetching weather data: ${error.message}</p>`;
            }
        }

        // Fetch Forex data if the user has enabled the Forex API
        if (user.port.Fapi) {
            try {
                const response = await fetch(`https://v6.exchangerate-api.com/v6/9746922cd9b76eb0f9130262/latest/USD`);
                if (response.ok) {
                    const forexData = await response.json();

                    // Display Forex data (e.g., USD to EUR and GBP rates)
                    apiDataDiv.innerHTML += `
                        <h5 class="mt-3">Forex Exchange Rates:</h5>
                        <p><strong>USD to EUR:</strong> ${forexData.conversion_rates.EUR}</p>
                        <p><strong>USD to GBP:</strong> ${forexData.conversion_rates.GBP}</p>
                    `;
                } else {
                    const errorData = await response.json();
                    apiDataDiv.innerHTML += `<p class="text-danger">Error: ${errorData.message}</p>`;
                }
            } catch (error) {
                apiDataDiv.innerHTML += `<p class="text-danger">Error fetching Forex data: ${error.message}</p>`;
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