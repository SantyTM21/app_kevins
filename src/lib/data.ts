import { sql } from '@vercel/postgres';
import { auth } from '../../auth';

// Reservaciones
export async function fetchReservacionesAdmin() {
  try {
    const data = await sql`
            SELECT 
            r.id AS id,
            CONCAT(u.nombre, ' ', u.apellido) AS usuario,
            r.fecha_inicio,
            r.fecha_fin,
            r.estado,
            ta.nombre AS alquiler,
            r.total
        FROM 
            reservaciones r
        JOIN 
            usuarios u ON r.usuario_id = u.id
        JOIN 
            tipo_alquiler ta ON r.tipo_alquiler_id = ta.id;
        `;
    return data.rows;
  } catch (error) {
    console.error('Error de base de datos:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}
export async function fetchReservacionesUser() {
  const session = await auth();
  try {
    const data = await sql`
            SELECT 
            r.id AS id,
            CONCAT(u.nombre, ' ', u.apellido) AS usuario,
            r.fecha_inicio,
            r.fecha_fin,
            r.estado,
            ta.nombre AS alquiler,
            r.total
        FROM 
            reservaciones r
        JOIN 
            usuarios u ON r.usuario_id = u.id
        JOIN 
            tipo_alquiler ta ON r.tipo_alquiler_id = ta.id
        WHERE 
            u.email = ${session?.user?.email};
        `;
    return data.rows;
  } catch (error) {
    console.error('Error de base de datos:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}
export async function fetchReservacionById(id: number) {
  try {
    const data = await sql`
            SELECT 
            r.id AS id,
            CONCAT(u.nombre, ' ', u.apellido) AS usuario,
            r.fecha_inicio,
            r.fecha_fin,
            r.estado,
            ta.nombre AS alquiler,
            r.total
        FROM 
            reservaciones r
        JOIN 
            usuarios u ON r.usuario_id = u.id
        JOIN 
            tipo_alquiler ta ON r.tipo_alquiler_id = ta.id
        WHERE r.id = ${id};`;
    return data.rows[0];
  } catch (error) {
    console.error('Error de base de datos:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

// Servicios de una reservación
export async function fetchServiciosByReservacion(id: number) {
  try {
    const data = await sql`
          SELECT 
          s.nombre AS nombre,
          s.precio,
          rs.cantidad,
          (s.precio * rs.cantidad) AS total
      FROM 
          reservaciones_servicios rs
      JOIN 
          servicios s ON rs.servicio_id = s.id
      WHERE 
          rs.reservacion_id = ${id}`;
    return data.rows;
  } catch (error) {
    console.error('Error de base de datos:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

// Servicios
export async function fetchServicios() {
  try {
    const data = await sql`SELECT * FROM servicios`;
    return data.rows;
  } catch (error) {
    console.error('Error de base de datos:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchServicioById(id: number) {
  try {
    const data = await sql`SELECT * FROM servicios WHERE id = ${id}`;
    return data.rows;
  } catch (error) {
    console.error('Error de base de datos:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

//Alquileres
export async function fetchAlquileres() {
  try {
    const data = await sql`SELECT * FROM tipo_alquiler`;
    return data.rows;
  } catch (error) {
    console.error('Error de base de datos:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

//Usuario por email
export async function fetchUsuarioByMail() {
  const session = await auth();
  try {
    const data = await sql`SELECT * FROM usuarios WHERE email = ${session?.user?.email}`;
    return data.rows[0];
  } catch (error) {
    console.error('Error de base de datos:', error);
    throw new Error('Failed to fetch user data.');
  }
}

//Listar todos los usuarios
export async function fetchAllUsers() {
  try {
    const data = await sql`SELECT * FROM usuarios WHERE rol_id != 1`;
    return data.rows;
  } catch (error) {
    console.error('Error de base de datos:', error);
    throw new Error('Failed to fetch user data.');
  }
}
