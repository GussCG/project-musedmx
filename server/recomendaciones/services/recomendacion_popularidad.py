from ..models.museos import get_museos_data
from ..models.favoritos import get_all_favoritos_count
from ..models.visitas import get_all_visitas_count
from typing import List, Dict

def recomendar_por_popularidad(top_n: int = 5) -> List[Dict]:
    # Obtener los datos
    museos = get_museos_data()  # Esto devuelve lista de diccionarios
    favoritos_counts = get_all_favoritos_count()  # {mus_id: count}
    visitas_counts = get_all_visitas_count()      # {mus_id: count}
    
    # Calcular puntuación para cada museo
    for museo in museos:
        mus_id = museo['mus_id']
        puntuacion = (
            favoritos_counts.get(mus_id, 0) * 0.7 + 
            visitas_counts.get(mus_id, 0) * 0.3
        )
        museo['puntuacion'] = puntuacion  # Añadimos el campo dinámicamente
    
    # Ordenar por puntuación (de mayor a menor)
    museos_ordenados = sorted(
        museos, 
        key=lambda x: x['puntuacion'], 
        reverse=True
    )
    
    # Devolver solo los top_n museos
    return museos_ordenados[:top_n]