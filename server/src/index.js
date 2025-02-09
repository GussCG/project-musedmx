import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 3000;
const app = express();

// Configuración de CORS
const corsOptions = {
    origin: process.env.FRONTEND_URL + process.env.FRONTEND_PORT,// URL de frontend
    methods: ['GET', 'POST'], // Métodos permitidos
    allowedHeaders: ['Content-Type'] // Cabeceras permitidas
}

app.use(cors(corsOptions));

// Endpoint para obtener la API key de Google Maps
app.get('/api/maps-key', (req, res) => {
    res.json({
        key: process.env.GOOGLE_MAPS_API_KEY
    });
});

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:' + PORT);
});