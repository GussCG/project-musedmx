# Librerias
import pandas as pd # Importamos la librería pandas para trabajar con datos tabulares

# Cargar el archivo CSV, se descarga en: https://sic.cultura.gob.mx/datos.php?table=museo
file_path = './data/0_museo_directorio.csv'
# Lo codificamos con ISO-8859-1 porque es el que se utilizó para guardar el archivo
# Si no se especifica la codificación se puede obtener un error de UnicodeDecodeError
df = pd.read_csv(file_path, encoding='ISO-8859-1')

# Eliminar datos donde la columna 'nom_ent' sea diferente de 'Ciudad de México'
df = df[df['nom_ent'] == 'Ciudad de México']

# Ahora buscamos los museos en el centro y sus alrededores (alcaldías = Cuauhtémoc, Miguel Hidalgo, Benito Juárez)
alcaldias = ['Cuauhtémoc', 'Miguel Hidalgo', 'Benito Juárez']
df = df[df['nom_mun'].isin(alcaldias)]

# Eliminamos las columnas que no necesitamos (nom_loc, estado_id, municipio_id, localidad_id)
df = df.drop(columns=['nom_loc', 'estado_id', 'municipio_id', 'localidad_id'])

# En donde la columna 'museo_tematica_n1' no sea nula poner 'Otro'
df['museo_tematica_n1'] = df['museo_tematica_n1'].fillna('Otro')

# Cambiar las tematicas por numeros
df['museo_tematica_n1'] = df['museo_tematica_n1'].replace({
    "Antropología": 1,
    "Arte": 2,
    "Arte Alternativo": 3,
    "Arqueología": 4,
    "Ciencia y tecnología": 5,
    "Especializado": 6,
    "Historia": 7,
    "Otro": 8,
})

def normalizar_direccion(df):
    df['museo_calle_numero'] = df['museo_calle_numero'].astype(str).str.strip()
    
    # Limpieza inicial
    df['museo_calle_numero'] = df['museo_calle_numero'].str.replace(r'\s+', ' ', regex=True)
    
    # Inicializamos columnas
    df['museo_num_ext'] = None
    df['museo_calle'] = df['museo_calle_numero']
    df['direccion_complemento'] = None

    # s/n (sin número)
    mask_sn = df['museo_calle_numero'].str.contains(r'\bs/?n\b', case=False, na=False)
    df.loc[mask_sn, 'museo_num_ext'] = 's/n'
    df.loc[mask_sn, 'museo_calle'] = df.loc[mask_sn, 'museo_calle_numero'].str.replace(r'\bs/?n\b', '', regex=True)

    # núm. o num. o No.
    mask_num = df['museo_calle_numero'].str.contains(r'núm\.|num\.|No\.', case=False, na=False)
    df.loc[mask_num, 'museo_num_ext'] = df.loc[mask_num, 'museo_calle_numero'].str.extract(r'(?:núm\.|num\.|No\.)\s*(\d+)', expand=False)
    df.loc[mask_num, 'museo_calle'] = df.loc[mask_num, 'museo_calle_numero'].str.replace(r'(núm\.|num\.|No\.)\s*\d+', '', regex=True)

    # Piso o complemento
    df['direccion_complemento'] = df['museo_calle'].str.extract(r'(piso\s*\d+|segundo piso)', expand=False)
    df['museo_calle'] = df['museo_calle'].str.replace(r'(,?\s*(piso\s*\d+|segundo piso))', '', regex=True)

    # Extraer número si aún no hay y hay un número simple en la dirección
    sin_numero = df['museo_num_ext'].isnull()
    df.loc[sin_numero, 'museo_num_ext'] = df.loc[sin_numero, 'museo_calle'].str.extract(r'\b(\d+)\b', expand=False)
    df.loc[sin_numero, 'museo_calle'] = df.loc[sin_numero, 'museo_calle'].str.replace(r'\b\d+\b', '', regex=True)

    # Limpieza final
    df['museo_calle'] = df['museo_calle'].str.strip()

    # Poner s/n en los que no tengan número
    df['museo_num_ext'] = df['museo_num_ext'].fillna('s/n')

    # Borramos la columna original
    df = df.drop(columns=['museo_calle_numero'])

    return df

normalizar_direccion(df)

# En donde la adscripcion sea nula poner 'No disponible'
df['museo_adscripcion'] = df['museo_adscripcion'].fillna('No disponible')

# Agregar una columna de descripcion pero vacia
df['museo_descripcion'] = ''

# Crear un nuevo archivo CSV con los datos limpios
df.to_csv('./data/museo-directorio-cdmx.csv', index=False)

# Mostrar tematicas
print(df['museo_tematica_n1'].unique())

