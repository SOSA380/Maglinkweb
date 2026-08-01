/**
 * Proxy público de solo lectura para el version.json del repo OTA privado.
 * El token vive únicamente en las variables de entorno de Vercel.
 */
module.exports = async function versionHandler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  const token = process.env.GITHUB_OTA_READ_TOKEN;
  const repo = process.env.GITHUB_OTA_REPO || 'SOSA380/MaglinkUpdate';
  if (!token) {
    res.status(503).json({ error: 'Manifiesto no configurado' });
    return;
  }

  const url = `https://api.github.com/repos/${repo}/contents/version.json`;
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github.raw+json',
        Authorization: `Bearer ${token}`,
        'User-Agent': 'MagPlayer-Web',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    const body = await response.text();
    if (!response.ok) {
      res.status(502).json({ error: 'No se pudo consultar la publicación' });
      return;
    }

    const manifest = JSON.parse(body);
    if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
      res.status(502).json({ error: 'Manifiesto inválido' });
      return;
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).json(manifest);
  } catch (_) {
    res.status(502).json({ error: 'No se pudo leer el manifiesto' });
  }
};
