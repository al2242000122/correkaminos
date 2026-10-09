# Publicación en Hostinger

El repositorio está preparado para alojamiento estático: no necesita compilación ni un servicio Node.js. GitHub Actions valida y prepara un paquete de publicación en cada cambio de `main`; el despliegue en Hostinger lo gestiona la integración descrita a continuación.

## Activar la publicación automática

Hostinger ofrece una integración Git con OAuth para sitios HTML. La conexión inicial se configura una sola vez en hPanel:

1. Abrir **Sitios web → correkaminos.com → Panel → Avanzado → Git**.
2. Seleccionar **Conectar con GitHub** y autorizar a Hostinger para el repositorio `al2242000122/correkaminos`.
3. Elegir la rama `main` y la carpeta pública del sitio (`public_html` por defecto). Confirmar que es la carpeta del dominio correcto y conservar un respaldo de su contenido actual.
4. Pulsar **Deploy** y comprobar que **Auto-deployment** esté activado.

A partir de esa conexión, Hostinger publica los cambios que lleguen a `main`. No hace falta guardar contraseñas FTP en el repositorio. Esta configuración requiere acceso a hPanel; los cambios en GitHub por sí solos no la activan.

Guía oficial: https://www.hostinger.com/support/1583302-how-to-deploy-a-git-repository-in-hostinger/

## Paquete de publicación manual

Mientras se activa la integración, generar un ZIP con los archivos públicos:

```sh
python3 scripts/package_site.py
```

Subir `dist/correkaminos-hostinger.zip` con el administrador de archivos de Hostinger y extraerlo en la carpeta pública del dominio. El paquete incluye las versiones optimizadas de imágenes y video; excluye los originales, archivos de desarrollo y metadatos Git.

## Comprobar la publicación

- Abrir `https://correkaminos.com/contacto.html`: debe mostrar Lizbeth y lunes a domingo.
- Probar “Contactar” y “Mensaje por WhatsApp”: deben dirigirse a `https://wa.me/16197432209`.
- Verificar los cuatro puertos en Nosotros y Preguntas frecuentes.
- Revisar el menú móvil y la nueva ilustración de Nosotros.
- Si aparece una versión anterior, purgar la caché del sitio en hPanel y volver a cargar.

Para volver a una versión anterior, revertir el commit en GitHub y dejar que Hostinger vuelva a desplegar la rama `main`.
