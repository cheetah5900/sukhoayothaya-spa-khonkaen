import fs from 'node:fs';
import path from 'node:path';

const CONTENT = path.join(process.cwd(), 'content');
const read = (...p) => fs.readFileSync(path.join(CONTENT, ...p), 'utf8');

/** Every page route, e.g. ['/', '/course/', '/en/news/x/'] */
export function allRoutes() {
  const out = [];
  const walk = (dir, prefix) => {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      if (f.isDirectory()) walk(path.join(dir, f.name), prefix + f.name + '/');
      else if (f.name.endsWith('.json')) {
        const slug = prefix + f.name.replace(/\.json$/, '');
        out.push(slug === 'index' ? '/' : '/' + slug + '/');
      }
    }
  };
  walk(path.join(CONTENT, 'pages'), '');
  return out;
}

export const routeFromSlug = (slug) => (slug && slug.length ? '/' + slug.map(decodeURIComponent).join('/') + '/' : '/');

export function loadPage(route) {
  const slug = route === '/' ? 'index' : route.replace(/^\/|\/$/g, '');
  const meta = JSON.parse(read('pages', slug + '.json'));
  meta.middle = read('pages', slug + '.html');
  return meta;
}

/** Put the page's active nav markers and language-switch links back into a shared partial. */
function fill(html, meta) {
  let out = html
    .replaceAll('{{HREF_TH}}', meta.switch.th ?? '/')
    .replaceAll('{{HREF_EN}}', meta.switch.en ?? '/en/');
  for (const [href, cls] of meta.actives) {
    out = out.replace(`href="${href}" class="${cls}"`, `href="${href}" class="${cls} active"`);
  }
  return out;
}

export function pageBody(meta) {
  return (
    meta.before +
    fill(read('partials', meta.header + '.html'), meta) +
    meta.middle +
    fill(read('partials', meta.footer + '.html'), meta) +
    fill(read('partials', meta.tail + '.html'), meta)
  );
}

const RENAME = { class: 'className', charset: 'charSet', 'http-equiv': 'httpEquiv', crossorigin: 'crossOrigin',
  hreflang: 'hrefLang', referrerpolicy: 'referrerPolicy', itemprop: 'itemProp', sizes: 'sizes' };

export function toProps(attrs) {
  const props = {};
  for (const [k, v] of attrs) props[RENAME[k.toLowerCase()] ?? k] = v;
  return props;
}
