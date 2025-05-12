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
                    <p><strong>LinkedIn:</strong> <a href="${user.port.linkedin}" target="_blank">${user.port.linkedin || 'N/A'}</a></p>
                    <p><strong>GitHub:</strong> <a href="${user.port.github}" target="_blank">${user.port.github || 'N/A'}</a></p>
                    <p><strong>API Enabled:</strong> ${user.port.Wapi ? "🌦 Weather" : ""} ${user.port.Fapi ? "💱 Forex" : ""}</p>
                    ${user.port.picture ? `<img src="${user.port.picture}" alt="Profile Picture" class="img-fluid rounded mx-auto d-block mt-3 profile-picture" style="max-width: 200px;">` : ""}
                    <div id="apiData" class="mt-4"></div>
                </div>
            </div>
        `;

        const apiDataDiv = id_element("apiData");

        // 🌦 Weather API
        if (user.port.Wapi) {
            try {
                const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Ashdod&appid=911369defe8240ed7dd60090ce9dd9b9&units=metric`);
                if (!weatherRes.ok) throw new Error("Weather API failed");
                const weatherData = await weatherRes.json();

                const daily = {};
                weatherData.list.forEach(item => {
                    const date = item.dt_txt.split(" ")[0];
                    if (!daily[date]) daily[date] = [];
                    daily[date].push(item);
                });

                const forecastHTML = Object.keys(daily).slice(0, 5).map(date => {
                    const item = daily[date][0];
                    return `
                        <div class="mt-2">
                            <p><strong>${new Date(date).toDateString()}:</strong></p>
                            <p>🌡 Temp: ${item.main.temp}°C</p>
                            <p>🌥 Condition: ${item.weather[0].description}</p>
                            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
                        </div>
                    `;
                }).join("");

                apiDataDiv.innerHTML += `<h5>5-Day Weather Forecast:</h5>${forecastHTML}`;
            } catch (err) {
                apiDataDiv.innerHTML += `<p class="text-danger">⚠ Weather error: ${err.message}</p>`;
            }
        }

        // 💱 Forex API
        if (user.port.Fapi) {
            try {
                const forexRes = await fetch(`https://v6.exchangerate-api.com/v6/9746922cd9b76eb0f9130262/latest/USD`);
                if (!forexRes.ok) throw new Error("Forex API failed");
                const forexData = await forexRes.json();

                apiDataDiv.innerHTML += `
                    <h5 class="mt-4">Forex Exchange Rates:</h5>
                    <p>💵 USD ➜ EUR: <strong>${forexData.conversion_rates.EUR}</strong></p>
                    <p>💵 USD ➜ GBP: <strong>${forexData.conversion_rates.GBP}</strong></p>
                    <p>💵 USD ➜ ILS: <strong>${forexData.conversion_rates.ILS}</strong></p>
                `;
            } catch (err) {
                apiDataDiv.innerHTML += `<p class="text-danger">⚠ Forex error: ${err.message}</p>`;
            }
        }
    } else {
        id_element("userData").innerHTML = `
            <div class="alert alert-danger text-center" role="alert">
                No user data found. Please complete the first session.
            </div>
        `;
    }

    // 🔒 Logout or redirect button functionality
    const portfolioButton = id_element("portfolioButton");
    if (portfolioButton) {
        portfolioButton.addEventListener("click", () => {
            window.location.href = "./login.html";
        });
    }
});
