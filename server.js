const express = require('express');
const path = require('path');
const app = express();

// --- Credenciales ---
// Cambiar estos valores cuando quieran (o usar variables de entorno en Render:
// Settings -> Environment -> Add Environment Variable: DASH_USER / DASH_PASS)
const USER = process.env.DASH_USER || 'SDV';
const PASS = process.env.DASH_PASS || 'SDV12';

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, encoded] = header.split(' ');

  if (scheme === 'Basic' && encoded) {
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    const sep = decoded.indexOf(':');
    const user = decoded.substring(0, sep);
    const pass = decoded.substring(sep + 1);
    if (user === USER && pass === PASS) {
      return next();
    }
  }

  res.set('WWW-Authenticate', 'Basic realm="Azul Natural Beef - Dashboard"');
  res.status(401).send('Acceso restringido.');
}

// Todo lo que sirve esta app queda detrás del login
app.use(auth);
app.use(express.static(path.join(__dirname)));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
