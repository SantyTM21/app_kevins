'use client'
import { useCopiarTicket } from '@/hooks/useCopiarTicket'
import { useSession } from '@/hooks/useSession'
import { despacharTicket } from '@/lib/actions'

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

export default function DetalleTicket({ ticket }: { ticket: Ticket }) {
  const heladosData: Helado[] = [
    { id: 11, nombre: 'Cono Clásico', sabor: 'Vainilla' },
    { id: 1, nombre: 'Paleta', sabor: 'Chocolate' },
    { id: 15, nombre: 'Copa Premium', sabor: 'Fresa' }
  ]
  const session = useSession()

  const handleDespacharTicket = async () => {
    try {
      await despacharTicket(ticket.id, session?.id || 0)
    } catch (error) {
      console.error('Error al despachar el ticket:', error)
    }
  }

  const copiarTexto = useCopiarTicket(heladosData, session)

  // Función para generar el texto en formato deseado
  const generarTextoTicket = () => {
    const fecha = new Date(ticket.fecha).toLocaleDateString('es-ES')
    const detallesTexto = ticket.detalles
      ? ticket.detalles
          .map((detalle) => {
            const helado = heladosData.find((h) => h.id === detalle.id_helado) || {
              nombre: 'Desconocido',
              sabor: 'N/A'
            }
            const precioUnitario = (detalle.subtotal / detalle.cantidad).toFixed(2)
            return `${detalle.cantidad.toString().padEnd(4)} | ${helado.nombre.padEnd(
              20
            )} | $${precioUnitario.padEnd(6)} | $${detalle.subtotal.toFixed(2)}`
          })
          .join('\n')
      : 'No hay detalles'

    return `🍦🍨Ⓗ︎Ⓔ︎Ⓛ︎Ⓐ︎Ⓓ︎Ⓞ︎Ⓢ︎🍨🍦
           🅚︎🅔︎🅥︎🅘︎🅝︎🅢︎

               ᴛɪᴄᴋᴇᴛ ᴅᴇ ᴘᴇᴅɪᴅᴏ 

𝐅𝐄𝐂𝐇𝐀:
${fecha}

𝐂𝐋𝐈𝐄𝐍𝐓𝐄:
${ticket.cliente}

𝐃𝐈𝐑𝐄𝐂𝐂𝐈𝐎𝐍:
${ticket.direccion}

𝐓𝐄𝐋𝐄𝐅𝐎𝐍𝐎:
${ticket.telefono}

ᶜ   |      ʰᵉˡᵃᵈᵒˢ          |   ᵖ/ᵘ   |  ᵖ/ᵗ |
${detallesTexto}

𝐓𝐎𝐓𝐀𝐋:                          $${ticket.total}

𝐎𝐛𝐬𝐞𝐫𝐯𝐚𝐜𝐢𝐨𝐧𝐞𝐬:
${ticket.observaciones || 'Ninguna'}

𝐕𝐞𝐧𝐝𝐞𝐝𝐨𝐫:
${session?.nombre || 'Desconocido'} ${session?.telefono || ''}`
  }

  // Función para copiar al portapapeles
  // const copiarTexto = () => {
  //   const texto = generarTextoTicket();
  //   navigator.clipboard.writeText(texto).then(() => {
  //     alert('¡Texto copiado al portapapeles!');
  //   }).catch((err) => {
  //     console.error('Error al copiar:', err);
  //   });
  // };

  return (
    <div className='bg-white shadow-md rounded-lg overflow-hidden'>
      <div className='bg-gray-100 px-6 py-4 border-b border-gray-200'>
        <h2 className='text-xl font-bold text-gray-900'>
          Ticket #{ticket.id} - {ticket.cliente}
        </h2>
        <p className='text-sm text-gray-600'>
          Fecha: {new Date(ticket.fecha).toLocaleDateString()}
        </p>
      </div>
      <div className='px-6 py-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
          <div>
            <p className='text-sm font-medium text-gray-700'>Dirección:</p>
            <p className='text-sm text-gray-900'>{ticket.direccion}</p>
          </div>
          <div>
            <p className='text-sm font-medium text-gray-700'>Teléfono:</p>
            <p className='text-sm text-gray-900'>{ticket.telefono}</p>
          </div>
          <div>
            <p className='text-sm font-medium text-gray-700'>Total:</p>
            <p className='text-sm text-gray-900'>${ticket.total}</p>
          </div>
          <div>
            <p className='text-sm font-medium text-gray-700'>Observaciones:</p>
            <p className='text-sm text-gray-900'>{ticket.observaciones || 'Ninguna'}</p>
          </div>
        </div>
        <div className='mt-4'>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>Detalles de Helados</h3>
          {ticket.detalles ? (
            <div className='overflow-x-auto'>
              <table className='min-w-full table-auto border-collapse'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-4 py-2 text-left text-sm font-medium text-gray-900'>
                      Cantidad
                    </th>
                    <th className='px-4 py-2 text-left text-sm font-medium text-gray-900'>Hend</th>
                    <th className='px-4 py-2 text-left text-sm font-medium text-gray-900'>Sabor</th>
                    <th className='px-4 py-2 text-left text-sm font-medium text-gray-900'>
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {ticket.detalles.map((detalle) => {
                    const helado = heladosData.find((h) => h.id === detalle.id_helado) || {
                      nombre: 'Desconocido',
                      sabor: 'N/A'
                    }
                    return (
                      <tr key={detalle.id} className='hover:bg-gray-50'>
                        <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-900'>
                          {detalle.cantidad}
                        </td>
                        <td className='px-4 py-2 text-sm text-gray-900'>{helado.nombre}</td>
                        <td className='px-4 py-2 text-sm text-gray-900'>{helado.sabor}</td>
                        <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-900'>
                          ${detalle.subtotal}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className='text-sm text-gray-600'>No hay detalles de helados para este ticket.</p>
          )}
        </div>
        {/* Vista previa del texto generado */}
        <div className='mt-4'>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>Vista previa del ticket</h3>
          <pre className='bg-gray-100 p-4 rounded-lg text-sm whitespace-pre-wrap'>
            {generarTextoTicket()}
          </pre>
        </div>
      </div>
      <div className='bg-gray-100 px-6 py-4 border-t border-gray-200'>
        <div className='flex justify-end space-x-2'>
          {ticket.id_estado === 1 && (
            <button
              className='px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
              onClick={handleDespacharTicket}
            >
              Marcar como Despachado
            </button>
          )}
          <button
            className='px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors'
            onClick={() => copiarTexto(ticket)}
          >
            Copiar Ticket
          </button>
        </div>
      </div>
    </div>
  )
}
