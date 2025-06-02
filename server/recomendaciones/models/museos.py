from typing import List, Dict, Optional, Any
from ..database import db

def get_museos_data() -> List[Dict[str, Any]]:
    cursor, conn = db.get_cursor()
    try: 
        cursor.execute("""
            SELECT 
                mus_id, mus_nombre, mus_calle, mus_num_ext,
                mus_colonia, mus_cp, mus_alcaldia, mus_descripcion,
                mus_fec_ap, mus_tematica, mus_g_longitud, mus_g_latitud
                /* Excluir mus_foto */
            FROM museos
        """)
        museos = cursor.fetchall()
        return museos
    except Exception as e:
        print(f"Error al obtener los museos: {e}")
        return []
    finally:
        cursor.close()
        db.close(conn)

def get_museo_by_id(museo_id: str) -> Optional[Dict[str, Any]]:
    cursor, conn = db.get_cursor()
    try:
        cursor.execute("""
            SELECT 
                * 
            FROM museos 
            WHERE mus_id = %s
        """, (museo_id,))
        museo = cursor.fetchone()
        return museo
    except Exception as e:
        print(f"Error al obtener el museo: {e}")
        return None
    finally:
        cursor.close()
        db.close(conn)
