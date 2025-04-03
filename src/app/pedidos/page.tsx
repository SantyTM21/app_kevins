import FacturaForm from '@/components/helados/FacturaForm'
import { getHeladosConSabores } from '@/lib/data'

export default async function Page() {
  const helados = await getHeladosConSabores()
  // console.log(helados)
  return (
    <div>
      <h1>pedidos</h1>
      <FacturaForm helados={helados} />
    </div>
  )
}
