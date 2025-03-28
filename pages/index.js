import dotenv from 'dotenv';
import { useState } from 'react';
import axios from 'axios';

dotenv.config({ path: './main.env' });

export default function WeatherApp() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState('');

    const fetchWeather = async () => {
        if (!city) {
            setError('Please enter a city');
            return;
        }
        try {
            setError('');
            const response = await axios.get(`http://localhost:3000/weather?city=${city}`);
            setWeather(response.data);
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.error || 'City not found or API error';
            setError(errorMessage);
            setWeather(null);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4">Weather App</h1>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Enter city name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="border p-2 rounded"
                />
                <button onClick={fetchWeather} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Get Weather
                </button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {weather && (
                <div className="bg-white p-4 rounded shadow-md text-center">
                    <h2 className="text-xl font-semibold">{weather.name}, {weather.sys.country}</h2>
                    <p className="text-lg">{weather.main.temp}°C</p>
                    <p>{weather.weather[0].description}</p>
                    <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt="Weather icon" />
                </div>
            )}
        </div>
    );
}