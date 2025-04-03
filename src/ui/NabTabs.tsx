'use client'
import { getSession } from '@/lib/session'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const tabs = [
  { title: 'Pedidos', href: '/pedidos', roles: [1, 2] },
  { title: 'Ver Pedidos', href: '/ver-pedidos', roles: [1, 3] },
  { title: 'Usuarios', href: '/user', roles: [1] },
  { title: 'Perfil', href: '/config', roles: [1, 2, 3] }
]

export default function NavTabs() {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<number | null>(null)

  useEffect(() => {
    const session = getSession()
    setUserRole(session?.rol_id ?? null)
  }, [])

  const filteredTabs = tabs.filter((tab) => tab.roles.includes(userRole ?? 0))

  return (
    <nav className='w-full'>
      <div className='flex justify-center border-b border-gray-200 md:max-w-2xl md:mx-auto'>
        <div className='flex w-full space-x-4 overflow-x-auto md:w-auto md:flex-initial'>
          {filteredTabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 px-4 py-2 text-center text-sm font-medium transition-colors md:flex-initial ${
                pathname === tab.href
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {tab.title}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
