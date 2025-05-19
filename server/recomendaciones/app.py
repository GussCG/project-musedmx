from fastapi import FastAPI
from recomendaciones.api.endpoints import router
import uvicorn

app = FastAPI(
    title="API de Recomendaciones",
    description="API para obtener recomendaciones de museos y exposiciones.",
    version="1.0.0",
)

app.include_router(router)
@app.get("/")
def health_check():
    return {"status": "API de Recomendaciones en funcionamiento"}

# Añade esto al final del archivo
if __name__ == "__main__":
    uvicorn.run("recomendaciones.app:app", host="0.0.0.0", port=8000, reload=True)