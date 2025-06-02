from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict
from ..models.usuario import get_usuario
from ..services.recomendacion_asociacion import recomendar_por_asociacion
from ..services.recomendacion_contenido import recomendar_por_contenido
from ..services.recomendacion_personalizada import recomendacion_por_personalizada
from ..services.recomendacion_popularidad import recomendar_por_popularidad
from ..services.recomendacion_cerca import recomendar_por_cercania

router = APIRouter(prefix="/api/v1", tags=["Recomendaciones"])

@router.get("/recomendaciones/personalizada/{correo}", response_model=List[Dict])
async def obtener_recomendaciones_personalizada(correo: str, top_n: int = 5):
    """
    Endpoint para obtener recomendaciones personalizadas para un usuario.
    - Tematicas favoritas
    - Historial de visitas
    - Favoritos
    - Quiero visitar
    """
    if not get_usuario(correo):
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    return recomendacion_por_personalizada(correo, top_n)

@router.get("/recomendaciones/similares/{museoId}", response_model=List[Dict])
async def obtener_similares(museoId: int, top_n: int = 5):
    """ Recomendaciones de museos similares basadas en reglas de asociación """
    return recomendar_por_contenido(museoId, top_n)

@router.get("/recomendaciones/asociadas/{museoId}", response_model=List[Dict])
async def obtener_asociadas(museoId: int, top_n: int = 5):
    """ Recomendaciones de 'Los usuarios que visitaron X tambien visitaron Y' """
    return recomendar_por_asociacion(museoId, top_n)

@router.get("/recomendaciones/populares", response_model=List[str])
async def obtener_populares(top_n: int = 5):
    """ Recomendaciones de museos populares {favoritos + visitas} """
    return recomendar_por_popularidad(top_n)

@router.get("/recomendaciones/cercanas/{museoId}", response_model=List[Dict])
async def obtener_cercanas(museoId: int, top_n: int = 5):
    """ Recomendaciones de museos cercanos """
    return recomendar_por_cercania(museoId, top_n)