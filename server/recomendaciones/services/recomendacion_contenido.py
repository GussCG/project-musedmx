from ..models.museos import get_museos_data
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict
import pandas as pd
from nltk.corpus import stopwords
import nltk
import re  # Para expresiones regulares en preprocesamiento

# Descargar stopwords si no están instaladas
nltk.download('stopwords')

def ponderar_texto(nombre, descripcion, tematica, pesos=(3, 1, 2)):
    nombre = preprocesar_texto(nombre)
    descripcion = preprocesar_texto(descripcion)
    tematica = preprocesar_texto(tematica)
    
    texto_ponderado = (
        (nombre + ' ') * pesos[0] +
        (descripcion + ' ') * pesos[1] +
        (tematica + ' ') * pesos[2]
    )
    
    return texto_ponderado.strip()

def preprocesar_texto(texto: str) -> str:
    """
    Limpia y normaliza el texto para mejorar la vectorización:
    - Convierte a minúsculas
    - Elimina puntuación
    - Elimina números (opcional)
    - Elimina espacios extras
    """
    if not isinstance(texto, str):
        return ""
    
    texto = texto.lower()  # Minúsculas
    texto = re.sub(r'[^\w\s]', '', texto)  # Elimina puntuación
    texto = re.sub(r'\d+', '', texto)  # Opcional: Elimina números
    texto = re.sub(r'\s+', ' ', texto).strip()  # Normaliza espacios
    return texto

def recomendar_por_contenido(museo_id: int, top_n: int = 5) -> List[Dict]:
    """
    Recomendaciones de museos similares basadas en contenido (versión mejorada).
    
    Mejoras incluidas:
    - Preprocesamiento avanzado del texto
    - Ajustes en TF-IDF (ngrams y filtrado de términos)
    - Exclusión automática del museo de referencia
    
    Args:
        museo_id (int): ID del museo de referencia.
        top_n (int): Número de recomendaciones a devolver.

    Returns:
        List[Dict]: Lista de museos recomendados (sin foto y ordenados por similitud).
    """

    # 1. Obtener datos y crear DataFrame
    museos = get_museos_data()
    museos_df = pd.DataFrame(museos)
    
    # 2. Preprocesamiento de texto combinado
    museos_df['texto_procesado'] = museos_df.apply(
        lambda row: ponderar_texto(
            row['mus_nombre'],
            row['mus_descripcion'],
            row['mus_tematica']
        ),
        axis=1
    )
    
    # 3. Vectorización TF-IDF con ajustes
    spanish_stopwords = stopwords.words('spanish') + ['museo', 'exposición'] # Agregar términos específicos a ignorar
    
    tfidf = TfidfVectorizer(
        stop_words=spanish_stopwords,
        ngram_range=(1, 2),  # Captura palabras sueltas y bigramas
        max_features=5000,   # Limita a los 5000 términos más relevantes
        min_df=2            # Ignora términos que aparezcan en menos de 2 museos
    )
    
    tfidf_matrix = tfidf.fit_transform(museos_df['texto_procesado'])
    
    # 4. Cálculo de similitud del coseno
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    
    # 5. Obtener índice del museo de referencia
    try:
        idx = museos_df[museos_df['mus_id'] == museo_id].index[0]
    except IndexError:
        return []  # Si el museo no existe
    
    # 6. Ordenar por similitud (excluyendo al propio museo)
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:top_n + 1]  # Excluye el museo actual
    
    # 7. Generar resultados limpios
    resultados = []
    for i, score in sim_scores:
        museo = museos_df.iloc[i].to_dict()
        museo.pop('mus_foto', None)  # Eliminar campo binario
        museo.pop('texto_procesado', None)  # Eliminar campo temporal
        museo['similitud'] = float(score)  # Agregar puntuación (opcional)
        resultados.append(museo)
    
    return resultados