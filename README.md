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

La web es estática y no necesita variables secretas ni funciones serverless.
Vercel solo debe apuntar a la raíz de este repositorio (`.`), con preset
`Other`, sin build command y sin output directory.

El manifiesto público debe tener, como mínimo:

```json
{
  "versionName": "2.4.2",
  "versionCode": 71,
  "apkUrl": "https://github.com/OWNER/REPO/releases/latest/download/maglinktv.apk",
  "apkSha256": "sha256-de-64-caracteres"
}
```

El `version.json` de la web y la URL del APK deben ser públicos. El navegador no
puede descargar un asset privado de GitHub sin un token, y nunca se debe poner
un PAT en `index.html` o `main.js`.

## Publicación

La APK se publica en GitHub Releases mediante el flujo privado de release. La
app continúa usando el `version.json` de `SOSA380/MaglinkUpdate`. La web usa su
propia copia pública en este repositorio: después de cada release hay que
actualizar ambos manifiestos con los mismos datos y publicar el cambio de la
web. No hay que tocar Vercel ni agregar variables.

En la copia de la web se deben actualizar `versionName`, `versionCode`,
`apkUrl`, `apkSha256` y `notes`. `apkUrl` debe ser una URL HTTPS pública.

Desde el proyecto principal, `tool/publish_web.py` automatiza la parte pública:

```bash
GITHUB_WEB_TOKEN=... python3 tool/publish_web.py
```

Lee la APK release compilada, crea o actualiza el Release público de
`SOSA380/Maglinkweb`, sube `magplayer.apk` y actualiza el `version.json` público
con la URL y el SHA-256 correctos. La publicación OTA privada se hace aparte
con `tool/publish.py`.

Podés desplegar `web/` como sitio estático en GitHub Pages o como proyecto
estático en Vercel. El enlace que se entrega para Downloader debe ser siempre la
URL estable de este sitio, no la URL cambiante del APK.
