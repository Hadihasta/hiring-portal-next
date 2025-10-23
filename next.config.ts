/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, //  skip linting during build
  },
  // add ini agar trust/allow url render bucket photo
    images: {
    domains: ['btyqgogzjyggnwlafqbn.supabase.co'], 
  },
};

export default nextConfig;