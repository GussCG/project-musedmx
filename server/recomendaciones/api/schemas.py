from pydantic import BaseModel

class MuseoResponse(BaseModel):
    mus_id: int
    mus_nombre: str
    mus_tematica: str
    mus_descripcion: str

class RecomendacionResponse(BaseModel):
    museo: MuseoResponse
    score: float
    tipo: str
