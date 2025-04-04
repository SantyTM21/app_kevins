import { generarTextoTicket } from '@/lib/generarTextoTicket'

export function useCopiarTicket(
  heladosData: { id: number; nombre: string; sabor: string }[],
  session?: any
) {
  const copiar = (ticket: any) => {
    const texto = generarTextoTicket(ticket, heladosData, session)
    navigator.clipboard
      .writeText(texto)
      .then(() => {
        alert('¡Texto copiado al portapapeles!')
      })
      .catch((err) => {
        console.error('Error al copiar:', err)
      })
  }

  return copiar
}
