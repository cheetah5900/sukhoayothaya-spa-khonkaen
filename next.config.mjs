/** Static export: `npm run build` writes plain HTML/CSS/JS to out/, ready for FTP / shared hosting. */
const nextConfig = {
  output: 'export',
  trailingSlash: true, // keep the existing /path/ URLs (out/path/index.html)
  images: { unoptimized: true },
};

export default nextConfig;
