/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Reduce memory during CI builds; local lint still available via `npm run lint`
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Avoid OOM in type checker on low-memory environments; rely on editor/CI tsc instead
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
