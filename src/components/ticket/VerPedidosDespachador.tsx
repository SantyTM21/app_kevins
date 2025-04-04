import { getAllTickets } from '@/lib/data'

// Interface para la información del helado (puedes ajustarla según tu DB)
interface Helado {
  id: number
  nombre: string
  sabor: string
}

interface Detalle {
  id: number
  cantidad: number
  id_helado: number
  subtotal: number
  id_ticket: number
}

interface Ticket {
  id: number
  fecha: string
  cliente: string
  direccion: string
  telefono: string
  total: string
  observaciones: string | null
  id_vendedor: number
  id_estado: number
  detalles: Detalle[]
}

// Simulación de datos de helados (esto vendría de tu DB)
const heladosData: Helado[] = [
  { id: 11, nombre: 'Cono Clásico', sabor: 'Vainilla' },
  { id: 1, nombre: 'Paleta', sabor: 'Chocolate' }
]

export default async function VerPedidosDespachador() {
  const tickets = await getAllTickets()

  return (
    <div>
      <h1 className='text-center text-2xl font-bold mb-4'>Pedidos para Despacho</h1>
      <div className='container mx-auto px-4 py-6'>
        <div className='overflow-x-auto'>
          <table className='min-w-full table-auto border-collapse'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='px-4 py-2 text-left text-sm font-medium text-gray-900'>Ticket ID</th>
                <th className='px-4 py-2 text-left text-sm font-medium text-gray-900'>
                  Detalles de Helados
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className='hover:bg-gray-50'>
                  <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-900'>{ticket.id}</td>
                  <td className='px-4 py-2 text-sm text-gray-900'>
                    <ul className='list-disc list-inside'>
                      {ticket.detalles.map((detalle) => {
                        // Buscar info del helado por id_helado
                        const helado = heladosData.find((h) => h.id === detalle.id_helado) || {
                          nombre: 'Desconocido',
                          sabor: 'N/A'
                        }
                        return (
                          <li key={detalle.id}>
                            Cantidad: {detalle.cantidad} - {helado.nombre} ({helado.sabor})
                          </li>
                        )
                      })}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
