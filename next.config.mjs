/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // The production host's /_next/image optimization route returns 503
    // (no `sharp` support in that environment). All images are already
    // web-sized JPGs, so skip on-the-fly optimization and serve
    // them as static files instead.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hostaway-platform.s3.*.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
