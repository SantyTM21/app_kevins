import FacturaForm from '@/components/helados/FacturaForm'
import { getHeladosConSabores } from '@/lib/data'

export default async function Page() {
  const helados = await getHeladosConSabores()
  // console.log(helados)
  return (
    <div>
      <h1 className='text-center text-2xl font-bold mb-4'>Hacer un pedido de helados</h1>
      <FacturaForm helados={helados} />
    </div>
  )
}
