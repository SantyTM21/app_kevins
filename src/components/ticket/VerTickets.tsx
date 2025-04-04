import DetalleTicket from './DetalleTicket'

interface Detalle {
  id: number
  cantidad: number
  id_helado: number
  subtotal: number
  id_ticket: number
}

interface Ticket {
  id: number
  fecha: string | Date
  cliente: string
  direccion: string
  telefono: string
  total: string
  observaciones: string | null
  id_vendedor: number
  id_estado: number
  detalles: Detalle[] | null
}

interface VerTicketsProps {
  tickets: Ticket[]
}

export default function VerTickets({ tickets }: VerTicketsProps) {
  return (
    <div className='container mx-auto px-4 py-6'>
      <h1 className='text-center text-2xl font-bold mb-6'>Lista de Pedidos</h1>
      <div className='space-y-6'>
        {tickets.map((ticket) => (
          <DetalleTicket key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  )
}
