
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // ESLint não tem nenhuma configuração neste repo (sem eslint-config-next
    // instalado, sem .eslintrc/eslint.config.*) — sem esta flag o build trava
    // no prompt interativo de setup do `next lint`. Configurar ESLint do
    // zero é um passo separado, fora do escopo desta migração.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      }
    ],
  },
  // Adicionado para resolver o aviso de cross-origin no ambiente de desenvolvimento
  allowedDevOrigins: ['https://*.cloudworkstations.dev'],
};

export default nextConfig;
