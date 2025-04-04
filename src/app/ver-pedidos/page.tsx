import DetalleTicket from '@/components/ticket/DetalleTicket'
import VerPedidosDespachador from '@/components/ticket/VerPedidosDespachador'
import VerTickets from '@/components/ticket/VerTickets'
import { getAllTickets } from '@/lib/data'

export default async function VerPedidos() {
  const tickets = await getAllTickets()
  // console.log(tickets)

  return (
    <div>
      <h1 className='text-center text-2xl font-bold mb-4'>Ver tickets de helados</h1>
      <div>
        <h1>Código de ejemplo</h1>
      </div>
      {/* <VerPedidosDespachador /> */}
      {/* <DetalleTicket ticketId={1} detalles={tickets[0].detalles} /> */}

      <VerTickets tickets={tickets} />
    </div>
  )
}
