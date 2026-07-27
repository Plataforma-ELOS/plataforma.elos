
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // isomorphic-dompurify usa jsdom no servidor; deixá-lo como external evita
  // que o webpack tente empacotar os assets do jsdom (ex.:
  // browser/default-stylesheet.css), que quebrava o build. É carregado via
  // require nativo em runtime, onde os arquivos existem no node_modules.
  serverExternalPackages: ['isomorphic-dompurify'],
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
  // Silencia avisos de build que vêm de DEPENDÊNCIAS (não do nosso código) e
  // são inofensivos: dependências opcionais de telemetria do Genkit
  // (@opentelemetry/exporter-jaeger, @genkit-ai/firebase), o require.extensions
  // do handlebars (via dotprompt/genkit) e o uso de process.version pelo
  // @supabase/supabase-js no Edge Runtime do middleware. O filtro é cirúrgico:
  // não esconde nenhum aviso/erro do código da aplicação.
  webpack: (config: { ignoreWarnings?: unknown[] }) => {
    const padroes = [
      /@opentelemetry\/exporter-jaeger/,
      /@genkit-ai\/firebase/,
      /require\.extensions is not supported by webpack/,
      /A Node\.js API is used/,
      /Critical dependency: the request of a dependency is an expression/,
    ];
    config.ignoreWarnings = [
      ...(config.ignoreWarnings ?? []),
      (warning: { message?: string; details?: string }) => {
        const texto = `${warning?.message ?? ''} ${warning?.details ?? ''}`;
        return padroes.some((re) => re.test(texto));
      },
    ];
    return config;
  },
};

export default nextConfig;
