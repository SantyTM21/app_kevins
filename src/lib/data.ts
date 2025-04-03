import { neon } from '@neondatabase/serverless'
import { Helado, SaborHelado } from './types'

// Helados
export async function getHelados(): Promise<Helado[]> {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in the environment variables')
  }
  const sql = neon(process.env.DATABASE_URL)

  try {
    const data = await sql`SELECT * FROM helados;`
    return data as Helado[]
  } catch (error) {
    console.error('Error de base de datos:', error)
    throw new Error('Failed to fetch revenue data.')
  }
}
// Helados con sabores
export async function getHeladosConSabores(): Promise<Helado[]> {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in the environment variables')
  }
  const sql = neon(process.env.DATABASE_URL)

  try {
    const data = await sql`
      SELECT 
        h.id,
        h.nombre,
        h.pxcaja,
        h.uxc,
        h.pxu,
        h.pmayorista,
        (
          SELECT JSON_AGG(JSON_BUILD_OBJECT('id', s.id, 'nombre', s.nombre))
          FROM sabores s
          JOIN helado_sabor hs ON s.id = hs.id_sabor
          WHERE hs.id_helado = h.id
        ) AS sabores
      FROM 
        helados h`

    // Procesar los datos para que coincidan con el tipo Helado
    const helados: Helado[] = data.map((item: any) => ({
      id: item.id,
      nombre: item.nombre,
      pxcaja: item.pxcaja,
      uxc: item.uxc,
      pxu: item.pxu,
      pmayorista: item.pmayorista,
      // Si sabores es null o undefined, devolvemos undefined, si no, lo dejamos como array
      sabores: item.sabores ? item.sabores : undefined
    }))

    return helados
  } catch (error) {
    console.error('Error de base de datos:', error)
    throw new Error('Failed to fetch revenue data.')
  }
}
// Sabores de helados
export async function getSaboresHelados(id: number): Promise<SaborHelado[]> {
  // Cambiado a array
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in the environment variables')
  }
  const sql = neon(process.env.DATABASE_URL)

  try {
    const data = await sql`
      SELECT 
        s.id,
        s.nombre AS sabor
      FROM 
        sabores s
      INNER JOIN 
        helado_sabor hs ON s.id = hs.id_sabor
      WHERE 
        hs.id_helado = ${id}
      ORDER BY 
        s.nombre;
    `
    // console.log('Sabores obtenidos:', data)
    return data as SaborHelado[]
  } catch (error) {
    console.error('Error de base de datos:', error)
    throw new Error('Failed to fetch flavors data.')
  }
}
