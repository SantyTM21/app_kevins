export interface Usuario {
  id: number
  nombre: string
  cedula: string
  telefono: string
  password: string
  direccion?: string
  rol_id: number
}
export interface LoginError {
  error: string
}

export interface SessionData {
  user: Usuario
  expiresAt: number
}

export type Helado = {
  id: number
  nombre: string
  descripcion?: string
  uxc: number
  pxu: string
  pxcaja: string
  pmayorista: string
  psugerido?: string
  tienesabores?: boolean
  sabores?: Sabor[]
}
export type Sabor = {
  id: number
  nombre: string
}

export type FormValues = {
  cliente: string
  productos: {
    id: string
    nombre: string
    cantidad: number
    precio: number
    total: number
  }[]
}

export interface FacturaFormProps {
  helados: Helado[]
}

export type SaborHelado = {
  id: number
  nombre: string
}

export interface FacturaFormData {
  cliente: string
  productos: {
    id: string
    nombre: string
    cantidad: number
    precio: number
    total: number
    sabor: string
  }[]
}

// src/lib/types.d.ts
export interface Ticket {
  id: number
  fecha: string
  cliente: string
  direccion: string
  telefono: string
  total: string // Cambiar a string
  observaciones: string | null
  id_vendedor: number | null
  id_estado: number
  detalles: {
    id: number
    cantidad: number
    id_helado: number
    subtotal: number
    id_ticket: number
  }[]
}
