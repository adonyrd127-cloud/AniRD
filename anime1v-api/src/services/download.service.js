const path = require('node:path');
const fs = require('node:fs');

function getDownloadsDir() {
    // Intentar encontrar la carpeta downloads en la raíz del proyecto
    const dir = path.join(process.cwd(), '..', 'downloads');
    if (!fs.existsSync(dir)) {
        try {
            fs.mkdirSync(dir, { recursive: true });
        } catch (e) {
            // Fallback al directorio actual si no hay permisos
            return path.join(process.cwd(), 'downloads');
        }
    }
    return dir;
}

module.exports = {
    getDownloadsDir
};
