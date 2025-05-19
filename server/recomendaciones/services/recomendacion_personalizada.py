from typing import List, Dict
from ..models.tematicas import get_preferencias_by_usuario
from ..models.favoritos import get_favoritos_by_usuario
from ..models.visitas import get_visitas_by_usuario
from ..models.quiero_visitar import get_qv_by_usuario
from ..models.museos import get_museos_data

def recomendacion_por_personalizada(correo: str, top_n: int = 10) -> List[Dict]:
    """
    Recomienda museos personalizados para un usuario basado en sus preferencias, favoritos y visitas.
    
    Args:
        correo (str): Correo del usuario.
        top_n (int): Número de museos a recomendar.
        
    Returns:
        List[Dict]: Lista de diccionarios con información de los museos recomendados.
    """
    
    # 1. Obtener datos del usuario
    tematicas_usuario = get_preferencias_by_usuario(correo)
    favoritos_usuario = get_favoritos_by_usuario(correo)
    visitas_usuario = get_visitas_by_usuario(correo)
    qv_usuario = get_qv_by_usuario(correo)

    # 2. Obtener datos de los museos
    museos_df = get_museos_data()

    # 3. Filtrar museos según las preferencias del usuario
    museos_tematica = museos_df[museos_df['museo_tematica_n1'].isin(tematicas_usuario)]

    # 4. Eliminar museos ya interactuados
    museos_no_interactuados = museos_tematica[
        ~museos_tematica['museo_id'].isin(favoritos_usuario + visitas_usuario + qv_usuario)
    ]

    # 5. Ordenar museos por popularidad (favoritos y visitas)
    museos_no_interactuados['puntuacion'] = (
        museos_no_interactuados['museo_id'].map(favoritos_usuario) * 0.7 +
        museos_no_interactuados['museo_id'].map(visitas_usuario) * 0.3
    )

    # 6. Devolver los top_n museos recomendados
    museos_recomendados = museos_no_interactuados.sort_values('puntuacion', ascending=False).head(top_n)
    return museos_recomendados.to_dict(orient='records')