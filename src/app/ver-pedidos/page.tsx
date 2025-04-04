import { getAllTickets } from '@/lib/data'

export default async function VerPedidos() {
  const tickets = await getAllTickets()
  console.log(tickets)
  return <div>page</div>
}
