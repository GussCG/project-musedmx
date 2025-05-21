from ..models.museos import get_museos_data
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict
import pandas as pd
from nltk.corpus import stopwords 
import nltk 

def recomendar_por_cercania(museo_id: int, top_n: int = 5) -> List[Dict]:
    """
    Recomendaciones de museos cercanos basadas en la distancia geográfica.
    - Utiliza la distancia euclidiana entre las coordenadas de los museos.
    - Devuelve los museos más cercanos al museo de referencia (excluyendo el propio museo).
    - Ordena de más cercano a más lejano.
    - Elimina la foto del museo en los resultados.
    Args:
        museo_id (int): ID del museo de referencia.
        top_n (int): Número de recomendaciones a devolver.

    Returns:
        List[Dict]: Lista de museos recomendados, excluyendo la foto.
    """

    # Obtener datos y convertirlos a DataFrame
    museos = get_museos_data()
    museos_df = pd.DataFrame(museos)
    
    # Filtrar el museo de referencia
    museo_ref = museos_df[museos_df['mus_id'] == museo_id]
    
    if museo_ref.empty:
        return []
    
    # Calcular distancia euclidiana
    def calcular_distancia(row):
        return ((row['mus_g_latitud'] - museo_ref.iloc[0]['mus_g_latitud']) ** 2 + 
                (row['mus_g_longitud'] - museo_ref.iloc[0]['mus_g_longitud']) ** 2) ** 0.5
    
    museos_df['distancia'] = museos_df.apply(calcular_distancia, axis=1)
    
    # Excluir el museo propio y ordenar por distancia (ascendente)
    recomendaciones = museos_df[museos_df['mus_id'] != museo_id].sort_values('distancia').head(top_n)
    
    # Limpiar resultados
    resultados = recomendaciones.to_dict('records')
    for museo in resultados:
        museo.pop('mus_foto', None)  # Eliminar binarios
    
    return resultados