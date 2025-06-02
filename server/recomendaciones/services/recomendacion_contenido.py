import os
import pickle
from typing import List, Dict
import pandas as pd

MODELO_PATH = "./recomendaciones/modelos_contenido/"

# Cargar modelos de contenido previamente entrenados
# Brief: Carga los modelos de TF-IDF, similitud coseno y DataFrame de museos.
#         similares_favoritos = list(set(similares_favoritos))  # Eliminar duplicados
# Params: None
def cargar_modelos():
    try:
        with open(os.path.join(MODELO_PATH, "tfidf.pkl"), "rb") as f:
            tfidf = pickle.load(f)
        with open(os.path.join(MODELO_PATH, "cosine_sim.pkl"), "rb") as f:
            cosine_sim = pickle.load(f)
        with open(os.path.join(MODELO_PATH, "museos_df.pkl"), "rb") as f:
            museos_df = pickle.load(f)
        return tfidf, cosine_sim, museos_df
    except FileNotFoundError:
        raise RuntimeError("Modelos no encontrados. Debes ejecutar primero `reentrenar_modelos.py`.")

# Recomendación por contenido basada en TF-IDF y similitud coseno
# Brief: Recomienda museos similares basados en el contenido textual de sus descripciones.
# Params: museo_id (int): ID del museo para el cual se quieren recomendaciones.
#         top_n (int): Número máximo de recomendaciones a retornar (default 5).
def recomendar_por_contenido(museo_id: int, top_n: int = 5) -> List[Dict]:
    tfidf, cosine_sim, museos_df = cargar_modelos()

    try:
        idx = museos_df[museos_df['mus_id'] == museo_id].index[0]
    except IndexError:
        return []

    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:top_n + 1]

    resultados = []
    for i, score in sim_scores:
        mus_id = int(museos_df.iloc[i]['mus_id'])
        resultados.append({'mus_id': mus_id})

    return resultados
