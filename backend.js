import dotenv from 'dotenv';
import express, { json } from 'express';
import axios from 'axios';
import cors from 'cors';

dotenv.config({ path: './main.env' });

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

app.use(cors());
app.use(json());

app.get('/weather', async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) {
            return res.status(400).json({ error: 'City is required' });
        }

        const response = await axios.get(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        const weatherData = response.data;

        console.log(`Temperature in ${city}: ${weatherData.main.temp}°C`);

        res.json(weatherData);
    } catch (error) {
        console.error('API Error:', error.response?.data); // Log the full error response

        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.message || 'Error fetching weather data';

            return res.status(status).json({ error: message });
        }
        
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));