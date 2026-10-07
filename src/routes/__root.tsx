import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'
import { cores, fontes, googleFontsUrl } from '../lib/tema'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Estante 📚',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: googleFontsUrl,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => (
    <div style={{ textAlign: 'center', paddingTop: '20vh', minHeight: '100vh', fontFamily: fontes.corpo, backgroundColor: cores.fundo, color: cores.preto }}>
      <div style={{ fontSize: 64 }}>📚</div>
      <h2 style={{ fontFamily: fontes.titulo, color: cores.roxo }}>Ops! Essa página sumiu como livro emprestado</h2>
      <a href="/" style={{ color: cores.roxo }}>Voltar para a estante</a>
    </div>
  ),
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
