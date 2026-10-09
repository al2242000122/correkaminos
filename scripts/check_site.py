"""Validate static-site references and the client's contact requirements."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parents[1]
ERRORS = []


class PageParser(HTMLParser):
    def __init__(self, page):
        super().__init__()
        self.page = page
        self.ids = set()
        self.links = []
        self.images = []
        self.landmarks = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'):
            if attrs['id'] in self.ids:
                ERRORS.append(f'{self.page.name}: duplicate id {attrs["id"]}')
            self.ids.add(attrs['id'])
        if tag == 'main':
            self.landmarks += 1
        if tag == 'img':
            self.images.append(attrs)
            if not attrs.get('alt'):
                ERRORS.append(f'{self.page.name}: image without alternative text')
        if tag == 'a':
            self.links.append(attrs)
            if attrs.get('target') == '_blank' and 'noopener' not in attrs.get('rel', ''):
                ERRORS.append(f'{self.page.name}: external link missing noopener')
            if 'nav-cta' in attrs.get('class', '') and attrs.get('href') != 'https://wa.me/16197432209':
                ERRORS.append(f'{self.page.name}: incorrect contact destination')
        for attr in ('src', 'href', 'poster'):
            value = attrs.get(attr, '')
            url = urlsplit(value)
            if not value or url.scheme or url.netloc or not url.path:
                continue
            target = self.page.parent / unquote(url.path)
            if not target.is_file():
                ERRORS.append(f'{self.page.name}: missing file {url.path}')


for page in ROOT.glob('*.html'):
    content = page.read_text()
    parser = PageParser(page)
    parser.feed(content)
    if parser.landmarks != 1:
        ERRORS.append(f'{page.name}: expected one main landmark')
    for link in parser.links:
        if link.get('href', '').startswith('#') and link['href'][1:] not in parser.ids:
            ERRORS.append(f'{page.name}: broken anchor {link["href"]}')
    if 'Puerto de Long Beach' in content or 'Lunes a Viernes' in content or 'Yarim García' in content:
        ERRORS.append(f'{page.name}: outdated client information')
    if 'New Jersey' not in content or 'Houston' not in content:
        ERRORS.append(f'{page.name}: missing port coverage')

contact = (ROOT / 'contacto.html').read_text()
for required in ('— Lizbeth', 'Lunes a domingo', 'Mensaje por WhatsApp'):
    if required not in contact:
        ERRORS.append(f'contacto.html: missing {required}')

if ERRORS:
    raise SystemExit('\n'.join(ERRORS))
print('OK: local files, anchors, image descriptions, page landmarks and contact information.')
