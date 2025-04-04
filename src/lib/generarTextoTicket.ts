import { useSession } from '@/hooks/useSession' // ajusta según tu tipado real

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
}

interface Ticket {
  id: number
  fecha: string | Date
  cliente: string
  direccion: string
  telefono: string
  total: string
  observaciones: string | null
  detalles: Detalle[] | null
}
const session = useSession()

export function generarTextoTicket(
  ticket: Ticket,
  heladosData: Helado[],
  session?: any // Cambia el tipo según tu implementación
): string {
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
