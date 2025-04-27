/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      HETZNER_SERVER_IP: process.env.HETZNER_SERVER_IP,
      HETZNER_PORT: process.env.HETZNER_PORT,
      REDIS_URL: process.env.REDIS_URL,
    },
  };
  
  export default nextConfig;
  