import pandas as pd
import pickle
import re
import nltk
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from recomendaciones.models.museos import get_museos_data

# Descargar stopwords si no están ya
nltk.download('stopwords')

# === Funciones auxiliares ===

def preprocesar_texto(texto: str) -> str:
    if not isinstance(texto, str):
        return ""
    texto = texto.lower()
    texto = re.sub(r'[^\w\s]', '', texto)
    texto = re.sub(r'\d+', '', texto)
    texto = re.sub(r'\s+', ' ', texto).strip()
    return texto

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

# === Entrenamiento ===

print("Obteniendo datos de museos...")
museos = get_museos_data()
df = pd.DataFrame(museos)

print("Procesando texto...")
df['texto_procesado'] = df.apply(
    lambda row: ponderar_texto(row['mus_nombre'], row['mus_descripcion'], row['mus_tematica']),
    axis=1
)

print("Vectorizando texto con TF-IDF...")
spanish_stopwords = stopwords.words('spanish') + ['museo', 'exposición']
vectorizer = TfidfVectorizer(
    stop_words=spanish_stopwords,
    ngram_range=(1, 2),
    max_features=5000,
    min_df=2
)
tfidf_matrix = vectorizer.fit_transform(df['texto_procesado'])

print("Calculando similitudes del coseno...")
similarity_matrix = cosine_similarity(tfidf_matrix, tfidf_matrix)

# === Guardado con pickle ===

modelos_path = "./recomendaciones/modelos_contenido/"

print("Guardando modelos entrenados...")
with open(f"{modelos_path}tfidf.pkl", "wb") as f:
    pickle.dump(vectorizer, f)

with open(f"{modelos_path}cosine_sim.pkl", "wb") as f:
    pickle.dump(similarity_matrix, f)

with open(f"{modelos_path}museos_df.pkl", "wb") as f:
    pickle.dump(df[['mus_id']], f)  # Solo guarda el ID para mapear similitudes

print("✅ Modelos entrenados y guardados correctamente.")
