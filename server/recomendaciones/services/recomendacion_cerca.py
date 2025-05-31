from typing import List, Dict
import pandas as pd
import numpy as np
from scipy.spatial.distance import cdist
from ..models.museos import get_museos_data

# Recomendación por cercanía geográfica
# Brief: Devuelve los top_n museos más cercanos a un museo dado por su ID.
# Params: museo_id (int): ID del museo de referencia.
#         top_n (int): Número de museos a recomendar (default 5).
def recomendar_por_cercania(museo_id: int, top_n: int = 5) -> List[Dict]:
    museos = get_museos_data()
    museos_df = pd.DataFrame(museos)

    # Obtener coordenadas
    museo_ref = museos_df[museos_df['mus_id'] == museo_id]
    if museo_ref.empty:
        return []

    ref_coords = museo_ref[['mus_g_latitud', 'mus_g_longitud']].to_numpy()
    all_coords = museos_df[['mus_g_latitud', 'mus_g_longitud']].to_numpy()

    # Distancia euclidiana (grados)
    distancias = cdist(ref_coords, all_coords, metric='euclidean')[0]

    # Agregar la distancia al DataFrame
    museos_df['distancia'] = distancias

    # Excluir el museo de referencia y ordenar
    recomendaciones = museos_df[museos_df['mus_id'] != museo_id].nsmallest(top_n, 'distancia')

    return [
        {
            'mus_id': int(row['mus_id']),
            'distancia_grados': round(row['distancia'], 6)
        }
        for _, row in recomendaciones.iterrows()
    ]
