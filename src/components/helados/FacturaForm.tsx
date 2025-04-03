'use client'
import { useEffect, useState } from 'react'

interface HeladoSeleccionado {
  id: number
  nombre: string
  sabor?: string
  idSabor?: number
  cantidad: number
  precioUnitario: number
  precioMayorista: number
  uxc: number
  total: number
}

interface DatosFactura {
  fecha: string
  cliente: string
  direccion: string
  telefono: string
  observaciones: string
  total: number
  helados: HeladoSeleccionado[]
}

export default function FacturaForm(props: any) {
  const { helados } = props

  const [heladosSeleccionados, setHeladosSeleccionados] = useState<HeladoSeleccionado[]>([])
  const [datosFactura, setDatosFactura] = useState<DatosFactura>({
    fecha: new Date().toISOString().split('T')[0],
    cliente: '',
    direccion: '',
    telefono: '',
    observaciones: '',
    total: 0,
    helados: []
  })

  const handleSelectHelado = (event: any) => {
    const heladoId = parseInt(event.target.value, 10)
    const heladoOriginal = helados.find((h: any) => h.id === heladoId)

    if (heladoOriginal && !heladosSeleccionados.some((h) => h.id === heladoId)) {
      const nuevoHelado: HeladoSeleccionado = {
        id: heladoOriginal.id,
        nombre: heladoOriginal.nombre,
        cantidad: 1,
        precioUnitario: parseFloat(heladoOriginal.pxu),
        precioMayorista: parseFloat(heladoOriginal.pmayorista),
        uxc: heladoOriginal.uxc,
        total: parseFloat(heladoOriginal.pxu)
      }

      // Si tiene sabores, selecciona el primero por defecto
      if (heladoOriginal.sabores?.length) {
        nuevoHelado.sabor = heladoOriginal.sabores[0].nombre
        nuevoHelado.idSabor = heladoOriginal.sabores[0].id
      }

      setHeladosSeleccionados([...heladosSeleccionados, nuevoHelado])
    }
  }

  const eliminarHelado = (id: number) => {
    setHeladosSeleccionados(heladosSeleccionados.filter((helado) => helado.id !== id))
  }

  const handleCantidadChange = (id: number, value: number) => {
    const nuevosHelados = heladosSeleccionados.map((helado) => {
      if (helado.id === id) {
        const precio = value >= helado.uxc ? helado.precioMayorista : helado.precioUnitario
        return {
          ...helado,
          cantidad: value,
          total: value * precio
        }
      }
      return helado
    })

    setHeladosSeleccionados(nuevosHelados)

    // Actualizar el total general
    const nuevoTotal = nuevosHelados.reduce((suma, helado) => suma + helado.total, 0)
    setDatosFactura((prev) => ({
      ...prev,
      total: nuevoTotal,
      helados: nuevosHelados
    }))
  }

  const handleSaborChange = (heladoId: number, saborNombre: string) => {
    setHeladosSeleccionados((prev) =>
      prev.map((helado) => {
        if (helado.id === heladoId) {
          const heladoOriginal = helados.find((h: any) => h.id === heladoId)
          const sabor = heladoOriginal.sabores.find((s: any) => s.nombre === saborNombre)
          return {
            ...helado,
            sabor: saborNombre,
            idSabor: sabor.id
          }
        }
        return helado
      })
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Validación para fecha no anterior a la actual
    if (name === 'fecha') {
      const fechaSeleccionada = new Date(value)
      const fechaActual = new Date()
      fechaActual.setHours(0, 0, 0, 0)

      if (fechaSeleccionada < fechaActual) {
        alert('La fecha no puede ser anterior a la actual')
        return
      }
    }

    setDatosFactura((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  useEffect(() => {
    const totalCalculado = heladosSeleccionados.reduce((suma, helado) => suma + helado.total, 0)
    setDatosFactura((prev) => ({
      ...prev,
      total: totalCalculado,
      helados: heladosSeleccionados
    }))
  }, [heladosSeleccionados])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    // Validación de campos obligatorios
    if (!datosFactura.cliente || !datosFactura.direccion || !datosFactura.telefono) {
      alert('Por favor complete todos los campos obligatorios')
      return
    }

    if (heladosSeleccionados.length === 0) {
      alert('Debe seleccionar al menos un helado')
      return
    }

    console.log('Factura generada:', datosFactura)
    // Aquí podrías enviar los datos a tu API o realizar otras acciones
  }

  return (
    <form onSubmit={handleSubmit} className='max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg'>
      <h2 className='text-2xl font-bold mb-6 text-center'>Generar Factura</h2>

      {/* Sección de Datos de Factura */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
        <div>
          <label className='block font-medium mb-1'>Fecha:</label>
          <input
            type='date'
            name='fecha'
            value={datosFactura.fecha}
            onChange={handleInputChange}
            className='w-full p-2 border rounded-md'
            required
          />
        </div>

        <div>
          <label className='block font-medium mb-1'>Cliente: *</label>
          <input
            type='text'
            name='cliente'
            value={datosFactura.cliente}
            onChange={handleInputChange}
            className='w-full p-2 border rounded-md'
            placeholder='Nombre del cliente'
            required
          />
        </div>

        <div>
          <label className='block font-medium mb-1'>Dirección: *</label>
          <input
            type='text'
            name='direccion'
            value={datosFactura.direccion}
            onChange={handleInputChange}
            className='w-full p-2 border rounded-md'
            placeholder='Dirección de entrega'
            required
          />
        </div>

        <div>
          <label className='block font-medium mb-1'>Teléfono: *</label>
          <input
            type='tel'
            name='telefono'
            value={datosFactura.telefono}
            onChange={handleInputChange}
            className='w-full p-2 border rounded-md'
            placeholder='Número de contacto'
            required
          />
        </div>
      </div>

      <div className='mb-6'>
        <label className='block font-medium mb-1'>Observaciones:</label>
        <textarea
          name='observaciones'
          value={datosFactura.observaciones}
          onChange={handleInputChange}
          className='w-full p-2 border rounded-md'
          rows={3}
          placeholder='Notas adicionales...'
        />
      </div>

      {/* Selector de Helados */}
      <div className='mb-4'>
        <label className='block font-medium mb-2'>Seleccionar Helado:</label>
        <select onChange={handleSelectHelado} value='' className='w-full p-2 border rounded-md'>
          <option value=''>Seleccione un helado</option>
          {helados?.map((helado: any) => (
            <option key={helado.id} value={helado.id}>
              {helado.nombre} - Caja: ${helado.pxcaja} (Unidad: ${helado.pxu})
            </option>
          ))}
        </select>
      </div>

      {/* Tabla de Helados Seleccionados */}
      {heladosSeleccionados.length > 0 && (
        <>
          <h3 className='font-bold mb-2'>Helados seleccionados:</h3>
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse border border-gray-300 text-sm'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border p-2'>Nombre</th>
                  <th className='border p-2'>Sabor</th>
                  <th className='border p-2'>Precio Unit.</th>
                  <th className='border p-2'>Cantidad</th>
                  <th className='border p-2'>Total</th>
                  <th className='border p-2'>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {heladosSeleccionados.map((helado) => {
                  const heladoOriginal = helados.find((h: any) => h.id === helado.id)
                  return (
                    <tr key={helado.id}>
                      <td className='border p-2'>{helado.nombre}</td>

                      {/* Selector de Sabor (Si tiene opciones) */}
                      <td className='border p-2 text-center'>
                        {heladoOriginal?.sabores?.length ? (
                          <select
                            className='border rounded p-1'
                            value={helado.sabor || ''}
                            onChange={(e) => handleSaborChange(helado.id, e.target.value)}
                          >
                            {heladoOriginal.sabores.map((sabor: any) => (
                              <option key={sabor.id} value={sabor.nombre}>
                                {sabor.nombre}
                              </option>
                            ))}
                          </select>
                        ) : (
                          'N/A'
                        )}
                      </td>

                      <td className='border p-2 text-center'>
                        $
                        {helado.cantidad >= helado.uxc
                          ? helado.precioMayorista
                          : helado.precioUnitario}
                      </td>

                      <td className='border p-2 text-center'>
                        <input
                          type='number'
                          className='w-16 border rounded p-1 text-center'
                          min={1}
                          value={helado.cantidad}
                          onChange={(e) => handleCantidadChange(helado.id, Number(e.target.value))}
                        />
                      </td>

                      <td className='border p-2 text-center'>${helado.total.toFixed(2)}</td>

                      <td className='border p-2 text-center'>
                        <button
                          type='button'
                          className='text-red-500 font-bold'
                          onClick={() => eliminarHelado(helado.id)}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Total */}
      {heladosSeleccionados.length > 0 && (
        <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
          <div className='text-xl font-bold text-right'>
            Total a Pagar: ${datosFactura.total.toFixed(2)}
          </div>
        </div>
      )}

      {/* Botón de Envío */}
      <div className='mt-6 flex justify-end'>
        <button
          type='submit'
          className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium'
        >
          Generar Factura
        </button>
      </div>
    </form>
  )
}
