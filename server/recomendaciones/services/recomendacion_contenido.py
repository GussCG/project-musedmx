from ..models.museos import get_museos_data
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict
import pandas as pd
from nltk.corpus import stopwords 
import nltk 

# Descargar stopwords si no están instaladas
nltk.download('stopwords')

def recomendar_por_contenido(museo_id: int, top_n: int = 5) -> List[Dict]:
    """
    Recomendaciones de museos similares basadas en contenido.
    - Utiliza TF-IDF para vectorizar el texto combinado de nombre, descripción y temática.
    - Calcula la similitud del coseno entre los museos.
    - Devuelve los museos más similares al museo de referencia.
    - Elimina la foto del museo en los resultados.
    - Se pueden ajustar los parámetros de TF-IDF y el número de recomendaciones.
    Args:
        museo_id (int): ID del museo de referencia.
        top_n (int): Número de recomendaciones a devolver.

    Returns:
        List[Dict]: Lista de museos recomendados, excluyendo la foto.
    """

    # Obtener datos y convertirlos a DataFrame
    museos = get_museos_data()
    museos_df = pd.DataFrame(museos)
    
    # Crear columna de texto combinado
    museos_df['texto'] = (
        museos_df['mus_nombre'].astype(str) + ' ' +
        museos_df['mus_descripcion'].astype(str) + ' ' +
        museos_df['mus_tematica'].astype(str)
    )

    # Obtener stopwords en español
    spanish_stopwords = stopwords.words('spanish')
    
    # Vectorización TF-IDF con stopwords personalizadas
    tfidf = TfidfVectorizer(stop_words=spanish_stopwords)  # Usar lista de stopwords
    tfidf_matrix = tfidf.fit_transform(museos_df['texto'])
    
    # Cálculo de similitud
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    
    # Encontrar índice del museo de referencia
    idx = museos_df[museos_df['mus_id'] == museo_id].index[0]
    
    # Obtener puntuaciones de similitud
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    
    # Obtener índices de los museos más similares
    sim_indices = [i[0] for i in sim_scores[1:top_n+1]]
    
    # Convertir resultados y limpiar datos
    resultados = museos_df.iloc[sim_indices].to_dict('records')
    for museo in resultados:
        museo.pop('mus_foto', None)
    
    return resultados