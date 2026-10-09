# CorreKaminos Logística

Sitio estático en español para los servicios de logística entre Estados Unidos y México. No requiere instalación de dependencias ni compilación.

## Desarrollo local

```sh
python3 -m http.server 8000
```

Abrir `http://localhost:8000`. Las cuatro páginas comparten `styles.css` y `app.js`.

## Contenido y contacto

- Páginas: `index.html`, `servicios.html`, `nosotros.html`, `contacto.html`.
- WhatsApp: `https://wa.me/16197432209`; atención con Lizbeth, de lunes a domingo.
- Puertos de USA: Long Beach, L.A., New Jersey y Houston.
- El formulario prepara un mensaje de WhatsApp; el visitante debe enviarlo para iniciar la solicitud. No almacena datos ni requiere un servidor de correo.
- Los perfiles sociales conservan sus enlaces de Instagram.

## Recursos

`assets/` contiene las versiones optimizadas que utiliza el sitio. Los originales se conservan para futuras ediciones. La portada utiliza un video H.264 sin audio con carga progresiva; muestra una imagen estática cuando se solicita movimiento reducido o ahorro de datos.

## Verificación y despliegue

```sh
python3 scripts/check_site.py
```

Ver [DEPLOY.md](DEPLOY.md) para activar la integración automática GitHub → Hostinger o crear un paquete ZIP con `python3 scripts/package_site.py`. Guardar cambios en GitHub no garantiza que hPanel publique automáticamente: verificar la configuración de despliegue.
