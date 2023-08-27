// Define the bounds for the map
var southWest = L.latLng(-90, -180);
var northEast = L.latLng(90, 180);
var bounds = L.latLngBounds(southWest, northEast);

// Initialize the map with bounds and zoom levels
var map = L.map('map', {
  maxBounds: bounds,
  maxBoundsViscosity: 1.0,
  maxZoom: 18,
  minZoom: 2
}).setView([0, 0], 2);

// Add the OpenStreetMap tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// API key for OpenWeatherMap
const apiKey = 'da41c4d31eb957a02d4f2aa6db4014d7';

// Variable to store country code
let countryCode;

// Function to update weather information in the toolbar
function updateWeatherInfo(temperature, description, humidity, city) {
  const temperatureElement = document.getElementById('temperature');
  const descriptionElement = document.getElementById('description');
  const humidityElement = document.getElementById('humidity');
  const cityElement = document.getElementById('city');

  temperatureElement.textContent = `Temperature in ${city}: ${temperature}°C`;
  descriptionElement.textContent = `Weather: ${description}`;
  humidityElement.textContent = `Humidity: ${humidity}%`;
}

// Function to fetch weather data from OpenWeatherMap API
function fetchWeatherData(zipCode, countryCode) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},${countryCode}&appid=${apiKey}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const temperature = (data.main.temp - 273.15).toFixed(2);
      const description = data.weather[0].description;
      const humidity = data.main.humidity;
      const latitude = data.coord.lat;
      const longitude = data.coord.lon;
      const city = data.name;

      // Update weather information in the UI
      updateWeatherInfo(temperature, description, humidity, city);

      // Set map view to the location
      map.setView([latitude, longitude], 13);

      // Remove existing markers from the map
      map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // Create a custom marker icon
      const customIcon = L.icon({
        iconUrl: 'pin.png',
        iconSize: [20, 20],
        iconAnchor: [16, 32],
      });

      // Add a marker with custom icon to the map
      const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

// Get the input field elements
const zipcodeInput = document.getElementById('zipcode');
const countryCodeInput = document.getElementById('countryCode');

// Event listener for changes in zipcode input
zipcodeInput.addEventListener('change', function () {
  const newZipCode = zipcodeInput.value;
  if (newZipCode) {
    // Fetch weather data when zip code changes
    fetchWeatherData(newZipCode, countryCode);
  }
});

// Event listener for changes in country code input
countryCodeInput.addEventListener('change', function () {
  countryCode = countryCodeInput.value;
  const zipCode = zipcodeInput.value;
  if (zipCode) {
    // Fetch weather data when country code changes
    fetchWeatherData(zipCode, countryCode);
  }
});

// Variable to store the current temperature unit, default to Celsius
let temperatureUnit = 'C';

// Function to update weather information in the toolbar
function updateWeatherInfo(temperature, description, humidity, city) {
  const temperatureElement = document.getElementById('temperature');
  const descriptionElement = document.getElementById('description');
  const humidityElement = document.getElementById('humidity');
  const cityElement = document.getElementById('city');

  // Capitalize the first letter of each word in the description
  const capitalizedDescription = description.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  if (temperatureUnit === 'C') {
    temperatureElement.textContent = `Temperature in ${city}: ${temperature}°C`;
  } else {
    // Convert Celsius to Fahrenheit
    var temperatureFahrenheit = (temperature * 9/5) + 32;
    temperatureFahrenheit =  Math.round(temperatureFahrenheit);
    temperatureElement.textContent = `Temperature in ${city}: ${temperatureFahrenheit}°F`;
  }

  descriptionElement.textContent = `Weather: ${capitalizedDescription}`;
  humidityElement.textContent = `Humidity: ${humidity}%`;
}

// Function to toggle temperature unit between Celsius and Fahrenheit
function toggleTemperatureUnit() {
  if (temperatureUnit === 'C') {
    temperatureUnit = 'F';
  } else {
    temperatureUnit = 'C';
  }
  
  // Fetch weather data again to update the displayed temperature
  const zipCode = zipcodeInput.value;
  if (zipCode) {
    fetchWeatherData(zipCode, countryCode);
  }
}

// Add an event listener to a button or any other element that toggles the unit
const toggleUnitButton = document.getElementById('toggleUnitButton');
toggleUnitButton.addEventListener('click', toggleTemperatureUnit);