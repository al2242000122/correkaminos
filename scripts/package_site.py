"""Create a deployable ZIP containing only the site's public assets."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import subprocess
import sys

root = Path(__file__).resolve().parents[1]
subprocess.run([sys.executable, str(root / 'scripts/check_site.py')], check=True)
files = ['index.html', 'servicios.html', 'nosotros.html', 'contacto.html',
         'styles.css', 'app.js', 'assets/logo.webp', 'assets/favicon.png',
         'assets/inicial.webp', 'assets/final.webp', 'assets/logistica.webp',
         'assets/logistica-768.webp', 'assets/hero-optimized.mp4']
output = root / 'dist/correkaminos-hostinger.zip'
output.parent.mkdir(exist_ok=True)
with ZipFile(output, 'w', ZIP_DEFLATED) as archive:
    for name in files:
        archive.write(root / name, name)
print(f'Package ready: {output} ({output.stat().st_size:,} bytes)')
