#!/bin/bash

# Agregar la ruta al directorio `server` como PYTHONPATH
export PYTHONPATH=$PYTHONPATH:$(pwd)
printf "PYTHONPATH: %s\n" "$PYTHONPATH"

# Ejecutar el servidor apuntando a recomendaciones.app
exec uvicorn recomendaciones.app:app --host=0.0.0.0 --port=8000 --reload
