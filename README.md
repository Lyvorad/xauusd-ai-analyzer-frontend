# Frontend de prueba — Analista de oro (XAU/USD)

Un único archivo `index.html` sin frameworks ni build: HTML + CSS + JS puro.
Ya apunta a tu backend en:
```
https://xauusd-ai-analyzer-dpuh.onrender.com
```
(si esa URL cambia algún día, edítala en la constante `API_BASE` dentro del
`<script>` al final de `index.html`).

## Qué hace

- Muestra el precio y el último reporte generado (`GET /reporte/ultimo`)
- Botón "Analizar ahora" que dispara un análisis en vivo (`POST /reporte/ahora`)
- Historial de los últimos 8 reportes (`GET /reporte/historial`)
- Precisión de las últimas 24h (`GET /reporte/precision`)
- Indicador de conexión con el backend (`GET /salud`)

## 1. Probarlo en local

No necesita instalar nada. Dos opciones:

**Opción A — abrir el archivo directo:**
Haz doble clic en `index.html` y ábrelo en el navegador.

**Opción B — servirlo (recomendado, evita restricciones del navegador con `file://`):**
```bash
cd frontend
python3 -m http.server 8000
```
Luego abre `http://localhost:8000` en el navegador.

## 2. Antes de desplegar: recuerda el CORS

El backend ya fue actualizado para aceptar peticiones desde cualquier origen
(`allow_origins=["*"]` en `app/main.py`). Si vuelves a desplegar el backend
en Render, asegúrate de subir esa versión actualizada — si no, el frontend
va a fallar con errores de CORS en la consola del navegador aunque todo lo
demás esté bien.

Cuando el proyecto ya esté más maduro, conviene cambiar `allow_origins=["*"]`
por la URL exacta de tu frontend en Render, para no dejar la API abierta a
cualquier sitio web.

## 3. Desplegar en Render.com (Static Site)

1. Sube esta carpeta `frontend/` a un repositorio de GitHub (puede ser el
   mismo repo del backend, en una carpeta separada, o uno nuevo).
2. En Render: **New → Static Site**.
3. Conecta el repositorio.
4. Configuración:
   - **Build command:** (déjalo vacío, no hay build)
   - **Publish directory:** `frontend` (o `.` si el repo solo tiene el frontend)
5. Deploy. Render te da una URL tipo `https://tu-frontend.onrender.com`.

Con eso ya puedes compartirle esa URL a tu cliente para que pruebe el sistema
sin tocar nada técnico.
