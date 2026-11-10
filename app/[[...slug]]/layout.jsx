import { loadPage, routeFromSlug, toProps } from '@/lib/site';

export const viewport = { width: 'device-width', initialScale: 1, maximumScale: 5 };

function HeadElement({ el }) {
  const props = toProps(el.attrs);
  if (el.tag === 'meta') return <meta {...props} />;
  if (el.tag === 'link') return <link {...props} />;
  if (el.tag === 'title') return <title>{el.html.replace(/&amp;/g, '&')}</title>;
  const Tag = el.tag; // script, noscript, style
  return <Tag {...props} dangerouslySetInnerHTML={{ __html: el.html }} />;
}

export default async function RootLayout({ children, params }) {
  const { slug } = await params;
  const meta = loadPage(routeFromSlug(slug));
  return (
    <html lang={meta.lang}>
      <head>
        {meta.head.map((el, i) => <HeadElement key={i} el={el} />)}
      </head>
      <body {...toProps(meta.bodyAttrs)}>{children}</body>
    </html>
  );
}
