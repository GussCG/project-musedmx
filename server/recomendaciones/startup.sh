#!/bin/bash

pip install -r requirements.txt

exec uvicorn recomendaciones.app:app --host=0.0.0.0 --port=8000
