from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from recomendaciones.api.endpoints import router
import uvicorn

app = FastAPI(
    title="API de Recomendaciones",
    description="API para obtener recomendaciones de museos y exposiciones.",
    version="1.0.0",
)

# 👇 Agrega esto para habilitar CORS
origins = [
    "http://localhost:5173",         # Desarrollo local (React Vite)
    "https://musedmx.com.mx",        # Tu dominio personalizado en producción
    "https://www.musedmx.com.mx",    # Variante con www
    "witty-ocean-09dbb1910.6.azurestaticapps.net"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # Puedes usar ["*"] para permitir todo (no recomendado en producción)
    allow_credentials=True,
    allow_methods=["*"],            # GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],
)

# Rutas
app.include_router(router)

@app.get("/")
def health_check():
    return {"status": "API de Recomendaciones en funcionamiento"}

# Solo para ejecución local
if __name__ == "__main__":
    uvicorn.run("recomendaciones.app:app", host="0.0.0.0", port=8000, reload=True)
