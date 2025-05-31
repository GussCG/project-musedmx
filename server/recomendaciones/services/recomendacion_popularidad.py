from ..models.museos import get_museos_data
from ..models.favoritos import get_all_favoritos_count
from ..models.visitas import get_all_visitas_count
from typing import List

import heapq

# Recomendación por popularidad basada en favoritos y visitas
# Brief: Devuelve los top_n museos más populares basados en una combinación ponderada de favoritos y visitas.
# Params: top_n (int): Número de museos a recomendar (default 5).
def recomendar_por_popularidad(top_n: int = 5) -> List[int]:
    museos = get_museos_data()  # lista de diccionarios con 'mus_id'
    favoritos_counts = get_all_favoritos_count()  # dict {mus_id: count}
    visitas_counts = get_all_visitas_count()      # dict {mus_id: count}

    # Calcular puntuaciones para cada mus_id y guardarlas en un dict
    puntuaciones = {}
    for mus_id in favoritos_counts.keys() | visitas_counts.keys():  # unión de claves
        favoritos = favoritos_counts.get(mus_id, 0)
        visitas = visitas_counts.get(mus_id, 0)
        puntuaciones[mus_id] = favoritos * 0.7 + visitas * 0.3

    # Construir lista de (puntuacion, mus_id) solo para museos existentes
    puntuacion_museos = []
    for museo in museos:
        mus_id = museo['mus_id']
        score = puntuaciones.get(mus_id, 0)
        puntuacion_museos.append((score, mus_id))

    # Obtener top_n usando heap (más eficiente que ordenar toda la lista)
    top_museos = heapq.nlargest(top_n, puntuacion_museos, key=lambda x: x[0])

    # Devolver solo los IDs
    return [mus_id for _, mus_id in top_museos]
