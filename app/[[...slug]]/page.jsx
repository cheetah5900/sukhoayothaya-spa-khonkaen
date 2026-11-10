import { allRoutes, loadPage, pageBody, routeFromSlug } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return allRoutes().map((r) => ({ slug: r === '/' ? [] : r.replace(/^\/|\/$/g, '').split('/') }));
}

export default async function Page({ params }) {
  const { slug } = await params;
  const meta = loadPage(routeFromSlug(slug));
  // display: contents keeps the original header/main/footer as direct layout children of <body>
  return <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: pageBody(meta) }} />;
}
