#!/bin/bash

cd server

exec uvivcorn recomendaciones.app:app --host=0.0.0.0 --port=8000