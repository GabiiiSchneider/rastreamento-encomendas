import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Box, Link, Typography } from '@mui/material'

import appCss from '../styles.css?url'
import { cores, fontes, googleFontsUrl } from '../lib/tema'
import { obterUsuarioLogado } from '../features/user/auth.functions'

export const Route = createRootRoute({
  beforeLoad: async () => {
    try {
      return { usuario: await obterUsuarioLogado() }
    } catch {
      return { usuario: null }
    }
  },
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
        title: 'Estante',
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
    <Box sx={{ textAlign: 'center', pt: '20vh', px: 2, minHeight: '100vh', backgroundColor: cores.fundo, color: cores.tinta }}>
      <Typography sx={{ fontFamily: fontes.titulo, fontStyle: 'italic', fontSize: { xs: 28, md: 36 }, color: cores.terracota, mb: 2 }}>
        Ops! Essa página sumiu como livro emprestado
      </Typography>
      <Link href="/" sx={{ fontFamily: fontes.corpo, color: cores.terracotaEscura, fontWeight: 700 }}>
        Voltar para a estante
      </Link>
    </Box>
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
