import { useState } from 'react';
import axios from 'axios';
import dotenv from 'dotenv';

export default function WeatherApp() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState('');
    const [background, setBackground] = useState('/assets/main.jpg'); // Default background

    const fetchWeather = async () => {
        if (!city) {
            setError('Please enter a city');
            return;
        }
        try {
            setError('');
            const response = await axios.get(`http://localhost:3000/weather?city=${city}`);
            setWeather(response.data);

            // Set background based on weather condition
            const condition = response.data.weather[0].main.toLowerCase();
            switch (condition) {
                case 'clear':
                    setBackground('/assets/sunny.jpg');
                    break;
                case 'clouds':
                    setBackground('/assets/cloudy.jpg');
                    break;
                case 'rain':
                    setBackground('/assets/rain.jpg');
                    break;
                case 'haze':
                    setBackground('/assets/haze.jpg');
                    break;
                default:
                    setBackground('/assets/main.jpg'); 
            }
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || 'City not found or API error';
            setError(errorMessage);
            setWeather(null);
        }
    };

    return (
        <div
            className="container"
            style={{
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                padding: '20px',
            }}
        >
            <h1 className="title">Weather App</h1>
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Enter city name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input"
                />
                <button onClick={fetchWeather} className="button">
                    Get Weather
                </button>
            </div>
            {error && <p className="error">{error}</p>}
            {weather && (
                <div className="weather-display">
                    <h2 className="weather-title">
                        {weather.name}, {weather.sys.country}
                    </h2>
                    <p className="temperature">{weather.main.temp}°C</p>
                    <p className="description">{weather.weather[0].description}</p>
                    <img
                        src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                        alt="Weather icon"
                    />
                </div>
            )}
        </div>
    );
}