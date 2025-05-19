from typing import List, Dict, Optional
import pandas as pd
from ..models.visitas import get_visitas_agrupadas
from ..models.museos import get_museo_by_id
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori, association_rules
import logging

logger = logging.getLogger(__name__)

def recomendar_por_asociacion(museo_id: int, top_n: int = 10) -> List[Dict]:
    try:
        # 1. Obtener y preparar datos
        visitas_por_usuario = get_visitas_agrupadas()
        
        # Verificar que hay datos suficientes
        if not visitas_por_usuario or len(visitas_por_usuario) < 5:
            logger.warning("Datos insuficientes para generar reglas de asociación")
            return []
        
        # 2. Preprocesamiento
        te = TransactionEncoder()
        te_ary = te.fit(visitas_por_usuario).transform(visitas_por_usuario)
        df = pd.DataFrame(te_ary, columns=te.columns_)
        
        # 3. Generar itemsets frecuentes con soporte más bajo
        min_support = 0.01  # Reducir el soporte mínimo
        frequent_itemsets = apriori(
            df, 
            min_support=min_support, 
            use_colnames=True,
            max_len=2  # Solo itemsets de hasta 2 elementos
        )
        
        # Verificar si se encontraron itemsets
        if frequent_itemsets.empty:
            logger.warning("No se encontraron itemsets frecuentes")
            return []
        
        # 4. Generar reglas con confianza mínima más baja
        reglas = association_rules(
            frequent_itemsets, 
            metric="confidence", 
            min_threshold=0.3  # Reducir el umbral de confianza
        )
        
        if reglas.empty:
            logger.warning("No se generaron reglas de asociación")
            return []
        
        # 5. Filtrar y formatear resultados
        recomendaciones = []
        mask = reglas['antecedents'].apply(lambda x: museo_id in x)
        
        for _, row in reglas[mask].iterrows():
            for museo_asociado in row['consequents']:
                if museo_asociado != museo_id:
                    museo = get_museo_by_id(museo_asociado)
                    if museo:
                        museo.pop('mus_foto', None)  # Eliminar binarios
                        recomendaciones.append({
                            **museo,
                            'confianza': round(float(row['confidence']), 4),
                            'soporte': round(float(row['support']), 4),
                            'lift': round(float(row['lift']), 4)
                        })
        
        # Ordenar y limitar resultados
        return sorted(recomendaciones, key=lambda x: (-x['confianza'], -x['lift']))[:top_n]
    
    except Exception as e:
        logger.error(f"Error en recomendación por asociación: {str(e)}", exc_info=True)
        return []