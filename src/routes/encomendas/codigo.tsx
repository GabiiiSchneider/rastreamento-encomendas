import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/encomendas/codigo')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/encomendas/codigo"!</div>
}
