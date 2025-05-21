import pandas as pd
from collections import defaultdict
from typing import List, Dict
from ..models.tematicas import get_preferencias_by_usuario
from ..models.favoritos import get_favoritos_by_usuario
from ..models.visitas import get_visitas_by_usuario
from ..models.quiero_visitar import get_qv_by_usuario
from ..models.museos import get_museos_data


def recomendacion_por_personalizada(correo: str, top_n: int = 10) -> List[Dict]:
    """
    Recomienda museos personalizados para un usuario basado en un sistema de 3 capas:
    1. Museos de temáticas preferidas no interactuados
    2. Museos similares a sus favoritos
    3. Museos populares como respaldo
    
    Args:
        correo (str): Correo del usuario.
        top_n (int): Número de museos a recomendar.
        
    Returns:
        List[Dict]: Lista de diccionarios con información de los museos recomendados.
    """
    
    # 1. Obtener datos del usuario
    tematicas_usuario = get_preferencias_by_usuario(correo) or []
    favoritos_usuario = get_favoritos_by_usuario(correo) or []
    visitas_usuario = get_visitas_by_usuario(correo) or []
    qv_usuario = get_qv_by_usuario(correo) or []

    # 2. Obtener y preparar datos de museos
    museos_data = get_museos_data()
    museos_df = pd.DataFrame(museos_data)
    
    # Convertir temáticas a enteros
    tematicas_usuario = [int(t) for t in tematicas_usuario]
    museos_df['mus_tematica'] = museos_df['mus_tematica'].astype(int)

    # 3. Contar interacciones para ponderación
    fav_counts = defaultdict(int)
    vis_counts = defaultdict(int)
    for mus_id in favoritos_usuario:
        fav_counts[mus_id] += 1
    for mus_id in visitas_usuario:
        vis_counts[mus_id] += 1

    # 4. Sistema de recomendación en 3 capas
    
    # Capa 1: Museos de temática preferida no interactuados
    museos_primera_capa = museos_df[
        museos_df['mus_tematica'].isin(tematicas_usuario) &
        ~museos_df['mus_id'].isin(favoritos_usuario + visitas_usuario + qv_usuario)
    ].copy()
    
    # Capa 2: Museos similares a favoritos (si es necesario)
    museos_candidatos = museos_primera_capa
    if len(museos_primera_capa) < top_n and favoritos_usuario:
        try:
            from ..similaridad import get_similares
            similares_favoritos = []
            for fav in favoritos_usuario[:5]:  # Limitar a 5 favoritos para no sobrecargar
                similares_favoritos.extend(get_similares(fav, top_n=3))
            
            museos_segunda_capa = museos_df[
                museos_df['mus_id'].isin(similares_favoritos) &
                ~museos_df['mus_id'].isin(favoritos_usuario + visitas_usuario + qv_usuario)
            ].copy()
            
            museos_candidatos = pd.concat([museos_primera_capa, museos_segunda_capa])
        except ImportError:
            pass  # Si no hay módulo de similaridad, continuar sin esta capa
    
    # Capa 3: Museos populares como respaldo (si es necesario)
    if len(museos_candidatos) < top_n:
        # Asumimos que existe un campo de popularidad, si no, usar conteo de favoritos/visitas
        if 'mus_popularidad' not in museos_df.columns:
            museos_df['mus_popularidad'] = museos_df['mus_id'].map(
                lambda x: fav_counts.get(x, 0) + vis_counts.get(x, 0)
            )
            
        museos_tercera_capa = museos_df[
            ~museos_df['mus_id'].isin(favoritos_usuario + visitas_usuario + qv_usuario)
        ].sort_values(by='mus_popularidad', ascending=False).copy()
        
        museos_candidatos = pd.concat([museos_candidatos, museos_tercera_capa])
    
    # 5. Calcular puntuación personalizada
    museos_candidatos = museos_candidatos.assign(
        puntuacion=lambda x: (
            x['mus_id'].map(lambda id: fav_counts.get(id, 0) * 0.7) +
            x['mus_id'].map(lambda id: vis_counts.get(id, 0) * 0.3) +
            x['mus_tematica'].apply(lambda t: 1 if t in tematicas_usuario else 0) * 0.5
        )
    ).drop_duplicates('mus_id')

    # 6. Seleccionar y devolver resultados
    resultados = museos_candidatos.sort_values(
        by=['puntuacion', 'mus_popularidad'], 
        ascending=[False, False]
    ).head(top_n)
    
    resultados = resultados.fillna(0)
    return resultados.to_dict(orient='records')
