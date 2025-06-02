import pandas as pd
from collections import defaultdict
from typing import List, Dict
from random import sample
from ..models.tematicas import get_preferencias_by_usuario
from ..models.favoritos import get_favoritos_by_usuario
from ..models.visitas import get_visitas_by_usuario
from ..models.quiero_visitar import get_qv_by_usuario
from ..models.museos import get_museos_data

# Importar fuera para evitar overhead cada llamada
try:
    from ..similaridad import get_similares
    SIMILARIDAD_DISPONIBLE = True
except ImportError:
    SIMILARIDAD_DISPONIBLE = False

# Función principal para recomendaciones personalizadas
# Brief: Recomienda museos basados en las preferencias del usuario, sus favoritos, visitas y "quiero visitar".
# Params: correo (str): Correo del usuario para obtener sus preferencias.
#         top_n (int): Número máximo de recomendaciones a retornar.
def recomendacion_por_personalizada(correo: str, top_n: int = 10) -> List[Dict]:
    tematicas_usuario = get_preferencias_by_usuario(correo) or []
    favoritos_usuario = get_favoritos_by_usuario(correo) or []
    visitas_usuario = get_visitas_by_usuario(correo) or []
    qv_usuario = get_qv_by_usuario(correo) or []

    museos_data = get_museos_data()
    museos_df = pd.DataFrame(museos_data)

    tematicas_usuario = set(map(int, tematicas_usuario))
    museos_df['mus_tematica'] = museos_df['mus_tematica'].astype(int)

    # Convertir listas a sets para búsqueda rápida
    interacciones_usuario = set(favoritos_usuario) | set(visitas_usuario) | set(qv_usuario)

    # Contar interacciones de favoritos y visitas
    fav_counts = defaultdict(int)
    vis_counts = defaultdict(int)
    for mus_id in favoritos_usuario:
        fav_counts[mus_id] += 1
    for mus_id in visitas_usuario:
        vis_counts[mus_id] += 1

    capas = []

    # Capa 1: Temáticas preferidas no interactuadas
    capa1 = museos_df[
        museos_df['mus_tematica'].isin(tematicas_usuario) &
        ~museos_df['mus_id'].isin(interacciones_usuario)
    ]
    capas.append(capa1)

    # Capa 2: Museos similares a favoritos si necesario
    if len(capa1) < top_n and favoritos_usuario and SIMILARIDAD_DISPONIBLE:
        favoritos_muestra = sample(favoritos_usuario, min(len(favoritos_usuario), 10))
        similares_favoritos = []
        for fav in favoritos_muestra:
            similares_favoritos.extend(get_similares(fav, top_n=3))

        similares_favoritos_set = set(similares_favoritos) - interacciones_usuario
        capa2 = museos_df[museos_df['mus_id'].isin(similares_favoritos_set)]
        capas.append(capa2)

    # Capa 3: Museos últimos favoritos recientes (si sigue faltando)
    total_candidatos = pd.concat(capas) if capas else pd.DataFrame()
    if len(total_candidatos) < top_n and len(favoritos_usuario) > 3:
        ultimos_favs = set(favoritos_usuario[-3:])
        ultimos_favs -= interacciones_usuario
        capa3 = museos_df[museos_df['mus_id'].isin(ultimos_favs)]
        capas.append(capa3)

    # Concatenar todas las capas solo una vez
    museos_candidatos = pd.concat(capas).drop_duplicates(subset='mus_id')

    # Vectorizar cálculo de puntuación
    # Crear Series para fav_counts y vis_counts con índice mus_id para mapear
    fav_series = pd.Series(fav_counts)
    vis_series = pd.Series(vis_counts)

    fav_punt = museos_candidatos['mus_id'].map(fav_series).fillna(0) * 0.7
    vis_punt = museos_candidatos['mus_id'].map(vis_series).fillna(0) * 0.3
    tema_punt = museos_candidatos['mus_tematica'].apply(lambda t: 0.5 if t in tematicas_usuario else 0)

    museos_candidatos = museos_candidatos.assign(puntuacion=fav_punt + vis_punt + tema_punt)

    resultados = museos_candidatos.sort_values('puntuacion', ascending=False).head(top_n).fillna(0)

    return [{'mus_id': int(mus_id)} for mus_id in resultados['mus_id']]
