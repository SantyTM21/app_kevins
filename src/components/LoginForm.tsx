'use client'

import { AtSymbolIcon, KeyIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { ArrowRightIcon } from '@heroicons/react/20/solid'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { login } from '@/lib/actions'

export default function LoginForm() {
  const [cedula, setCedula] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsPending(true)

    try {
      const result = await login(cedula, password)

      if ('error' in result) {
        setError(result.error || 'Error desconocido en el inicio de sesión')
      } else {
        // Guardar la sesión con expiración (por ejemplo, 1 hora)
        const user = result[0] // Tomamos el primer usuario (asumiendo que cedula es única)
        const sessionData = {
          user,
          expiresAt: Date.now() + 60 * 60 * 1000 // 1 hora en milisegundos
        }
        localStorage.setItem('session', JSON.stringify(sessionData))
        router.push('/pedidos')
      }
    } catch (err) {
      console.error('Error en handleSubmit:', err)
      setError('Ocurrió un error durante el inicio de sesión')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-3'>
      <div className='flex-1 rounded-lg px-6 pb-4 pt-8'>
        <h1 className={`mb-3 text-2xl`}>Por favor inicia sesión para continuar.</h1>
        <div className='w-full'>
          <div>
            <label className='mb-3 mt-5 block font-medium text-gray-900' htmlFor='cedula'>
              Cédula
            </label>
            <div className='relative'>
              <input
                className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
                id='cedula'
                type='text'
                name='cedula'
                placeholder='Ingresa tu correo electrónico'
                required
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
              />
              <AtSymbolIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
            </div>
          </div>
          <div className='mt-4'>
            <label className='mb-3 mt-5 block font-medium text-gray-900' htmlFor='password'>
              Contraseña
            </label>
            <div className='relative'>
              <input
                className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
                id='password'
                type='password'
                name='password'
                placeholder='Ingresa tu contraseña'
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <KeyIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
            </div>
          </div>
        </div>
        <button
          className='mt-4 w-full hover:bg-blue-700 flex items-center rounded-md bg-blue-800 px-4 py-2 text-sm font-semibold text-gray-50'
          type='submit'
          disabled={isPending}
        >
          <span className='flex-1'>{isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}</span>
          <ArrowRightIcon className='ml-auto h-5 w-5 text-gray-50' />
        </button>
        <div className='flex h-8 items-end space-x-1' aria-live='polite' aria-atomic='true'>
          {error && (
            <>
              <ExclamationCircleIcon className='h-5 w-5 text-red-500' />
              <p className='text-sm text-red-500'>{error}</p>
            </>
          )}
        </div>
      </div>
    </form>
  )
}
