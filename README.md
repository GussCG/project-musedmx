# MusedMX

Plataforma web full stack enfocada en optimizar la exploración cultural en la zona centro de la Ciudad de México mediante un sistema de recomendaciones personalizadas de museos.

## Descripción

El sistema implementa un enfoque híbrido de recomendación basado en:

- Preferencias del usuario
- Temáticas de interés
- Radio geográfico de búsqueda
- Historial de visitas
- Calificaciones y retroalimentación

El proyecto obtuvo calificación final de 10/10 con mención honorífica en el Trabajo Terminal de Ingeniería en Sistemas Computacionales (ESCOM-IPN) y fue presentado en el Congreso Internacional CAECH 2025.

## Arquitectura del Sistema

### Frontend

- React 19
- Vite
- SASS
- Integración con Google Maps
- Deck.GL para visualización geoespacial
- React Router
- Formik + Yup
- Framer Motion

### Backend

- Node.js
- Express.js
- MySQL
- Autenticación con JWT
- bcrypt para cifrado de contraseñas
- Multer + Sharp para manejo y optimización de imágenes
- Azure Blob Storage para almacenamiento de archivos
- Nodemailer para notificaciones

## Funcionalidades Principales

- Recomendaciones personalizadas de museos
- Filtro por radio geográfico
- Visualización interactiva en mapa
- Sistema de autenticación con JWT
- Gestión de perfil de usuario
- Sistema de calificaciones y comentarios
- Carga y optimización de imágenes
- Retraining del modelo de recomendación
- Panel administrativo para gestión de contenido

## Installation

### Backend

```bash
  cd server
  npm install
  npm run dev
```

Variables de entorno necesarias:

`DB_HOST`
`DB_USER`
`DB_PASSWORD`
`DB_NAME`
`JWT_SECRET`
`AZURE_STORAGE_CONNECTION_STRING`

### Frontend

```bash
  cd client
  npm install
  npm run dev
```
