# Web pública de MagPlayer+

Esta carpeta contiene la página pública que se puede usar como enlace fijo en
Downloader. Es una alternativa para instalaciones nuevas o para usuarios a
quienes el sistema les impide actualizar desde la aplicación. Quien ya tiene
MagPlayer+ funcionando puede actualizar desde Ajustes y no necesita descargar
el APK en cada lanzamiento. La versión nueva se instala encima de la anterior;
no hace falta desinstalarla. No es un panel de administración y no incluye
tokens.

## Funciones

- Consulta la publicación más reciente desde `version.json`.
- Lleva al APK oficial alojado en GitHub Releases.
- Permite elegir un APK local y calcular su SHA-256 en el navegador.
- Nunca sube el archivo elegido ni guarda datos personales.

## Configuración de Vercel

La web consulta `api/version.js`. Esa función lee el `version.json` oficial del
repo OTA privado sin exponer credenciales en el navegador. En el proyecto de
Vercel configurá estas variables de entorno (Production y Preview si querés
probarlo allí):

```text
GITHUB_OTA_READ_TOKEN=token_de_lectura_del_repo
GITHUB_OTA_REPO=SOSA380/MaglinkUpdate
```

El token debe tener únicamente permiso de lectura de Contents. No lo guardes en
`index.html`, `main.js` ni en el repositorio de la web. Durante una prueba local,
si la función no está disponible, la página usa `version.json` como respaldo.

El manifiesto público debe tener, como mínimo:

```json
{
  "versionName": "2.4.2",
  "versionCode": 71,
  "apkUrl": "https://github.com/OWNER/REPO/releases/latest/download/maglinktv.apk",
  "apkSha256": "sha256-de-64-caracteres"
}
```

El repositorio del manifiesto y el asset de descarga tienen que ser públicos para que cualquier
persona pueda descargarlo sin exponer un token. Si el manifiesto se mantiene
privado, hace falta una función de Vercel que lo lea con una variable secreta;
el APK igualmente debe estar disponible en una URL pública o en un CDN. Nunca
pongas un PAT en `index.html` o `main.js`.

## Publicación

La APK se publica en GitHub Releases mediante el flujo privado de release. La
web no recibe APK por un endpoint público: las funciones serverless tienen
límites de tamaño y no deben convertirse en un proxy de archivos grandes.
Después de publicar una nueva versión, `tool/publish.py` actualiza el
`version.json` del repo OTA. No hace falta editar el manifiesto de esta web ni
volver a desplegarla: la función de Vercel lo leerá en el siguiente acceso.

Podés desplegar `web/` como sitio estático en GitHub Pages o como proyecto
estático en Vercel. El enlace que se entrega para Downloader debe ser siempre la
URL estable de este sitio, no la URL cambiante del APK.
