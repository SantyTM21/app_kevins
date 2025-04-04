'use server'
import { neon } from '@neondatabase/serverless'
import { Usuario, LoginError } from './types'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function getData() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in the environment variables')
  }
  const sql = neon(process.env.DATABASE_URL)
  const data = await sql`SELECT * FROM roles`
  return data
}
//Login de usuario
export async function login(cedula: string, password: string): Promise<Usuario[] | LoginError> {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in the environment variables')
  }

  try {
    const sql = neon(process.env.DATABASE_URL)
    const data = await sql`
      SELECT * FROM usuarios 
      WHERE cedula = ${cedula} AND password = ${password}
    `

    if (data.length === 0) {
      return { error: 'Credenciales incorrectas' }
    }

    return data as Usuario[]
  } catch (err) {
    console.error('Error en login:', err)
    return { error: 'Error al conectar con la base de datos' }
  }
}

export async function guardarTicket(data: any, idVendedor: number) {
  // console.log('si llega la data', data)
  const fechaRegistro = new Date().toISOString().slice(0, 10) // formato YYYY-MM-DD
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in the environment variables')
  }

  const sql = neon(process.env.DATABASE_URL)
  try {
    // Insertar el ticket
    const result = await sql`
    INSERT INTO ticket (
      fecha,
      cliente,
      direccion,
      telefono,
      total,
      observaciones,
      id_vendedor,
      id_estado
    ) VALUES (
      ${data.fecha},
      ${data.cliente},
      ${data.direccion},
      ${data.telefono},
      ${Number(data.total)},
      ${data.observaciones || null},
      ${idVendedor || null},
      1
    )
    RETURNING id;
  `

    const ticketId = result[0].id

    // Insertar detalles del ticket (helados)
    for (const helado of data.helados) {
      await sql`
        INSERT INTO ticket_detalle (
          cantidad,
          id_helado,
          subtotal,
          id_ticket
        ) VALUES (
          ${helado.cantidad},
          ${helado.id},
          ${helado.total},
          ${ticketId}
        )
      `
    }

    console.log('Ticket guardado exitosamente')
  } catch (error) {
    console.error('Error al guardar ticket:', error)
    throw new Error('No se pudo guardar el ticket')
  }

  // revalidatePath('/tickets/')
  // redirect('//tickets/')
}

// import { QueryResultRow, sql } from '@vercel/postgres';
// import bcrypt from 'bcrypt';

// import { signIn, auth } from '../../auth';
// import { AuthError } from 'next-auth';

// //Editar Perfil
// export async function editarPerfil(formData: FormData) {
//   const { nombre, apellido, email, telefono } = Object.fromEntries(formData);
//   try {
//     await sql`
//     UPDATE usuarios
//     SET nombre = ${nombre.toString()}, apellido = ${apellido.toString()}, telefono = ${telefono.toString()} WHERE email = ${email.toString()}`;
//   } catch (error) {
//     console.error('Error de base de datos:', error);
//     throw { message: 'Error de al actualizar el usuario' };
//   }
//   revalidatePath('/pages/perfil');
// }

// //Registrar Usuario
// export async function registrarUsuario(formData: FormData) {
//   const { nombre, apellido, telefono, password } = Object.fromEntries(formData);
//   const hashedPassword = await bcrypt.hash(password.toString(), 10);
//   const email = Object.fromEntries(formData).email.toString() || '';

//   // Crear la fecha de registro en formato 'YYYY-MM-DD HH:MM:SS'
//   const fecha_registro = new Date().toISOString().slice(0, 19).replace('T', ' ');

//   try {
//     await sql`
//       INSERT INTO usuarios (nombre, apellido, telefono, email, password, fecha_registro, rol_id)
//       VALUES (${nombre.toString()}, ${apellido.toString()}, ${telefono.toString()}, ${email}, ${hashedPassword}, ${fecha_registro}, 2)
//     `;
//   } catch (error) {
//     console.error('Error de base de datos:', error);
//     throw { message: 'Error al registrar usuario' };
//   }

//   revalidatePath('/registro');
//   redirect('/login');
// }

// //Nuevo alquiler
// export async function nuevoAlquiler(formData: FormData) {
//   const { nombre, precio } = Object.fromEntries(formData);
//   try {
//     await sql`
//     INSERT INTO tipo_alquiler (nombre,precio)
//     VALUES (${nombre.toString()}, ${Number(precio)})`;
//   } catch (error) {
//     console.error('Error de base de datos:', error);
//     throw { message: 'Error al registrar el alquiler' };
//   }

//   revalidatePath('/pages/configuraciones/tipo-alquiler');
// }
// //Editar alquiler
// export async function editarAlquiler(formData: FormData) {
//   const { id, nombre, precio } = Object.fromEntries(formData);
//   try {
//     await sql`
//     UPDATE tipo_alquiler
//     SET nombre = ${nombre.toString()}, precio = ${Number(precio)}
//     WHERE id = ${Number(id)}`;
//   } catch (error) {
//     console.error('Error de base de datos:', error);
//     throw { message: 'Error al editar el alquiler' };
//   }

//   revalidatePath('/pages/configuraciones/tipo-alquiler');
// }

// //Nuevo Servicio
// export async function nuevoServicio(formData: FormData) {
//   const { nombre, detalle, precio, stock, urlImg } = Object.fromEntries(formData);
//   console.log(formData);
//   try {
//     await sql`
//     INSERT INTO servicios (nombre,detalle,precio,stock,urlimg)
//     VALUES (${nombre.toString()}, ${detalle.toString()}, ${Number(precio)},
//     ${Number(stock)}, ${urlImg.toString()})`;
//   } catch (error) {
//     console.error('Error de base de datos:', error);
//     throw { message: 'Error al registrar el Servicio' };
//   }
//   revalidatePath('/pages/configuraciones/servicios');
// }

// //Editar Servicio
// export async function editarServicio(formData: FormData) {
//   const { id, nombre, detalle, precio, stock, urlImg } = Object.fromEntries(formData);
//   console.log(urlImg);
//   try {
//     await sql`
//     UPDATE servicios
//     SET nombre = ${nombre.toString()}, detalle = ${detalle.toString()}, precio = ${Number(precio)},
//     stock = ${Number(stock)}, urlimg = ${urlImg.toString()}
//     WHERE id = ${Number(id)}`;
//   } catch (error) {
//     console.error('Error de base de datos:', error);
//     throw { message: 'Error al editar el Servicio' };
//   }
//   revalidatePath('/pages/configuraciones/servicios');
// }

// //Nueva Reservación
// export async function nuevaReservacion(formData: FormData) {
//   // console.log('formData', formData);
//   const session = await auth(); // Obtener la sesión del usuario autenticado
//   const fecha_registro = new Date().toISOString().slice(0, 19).replace('T', ' ');

//   // Obtener los datos desde el formData
//   const { fechaInicio, fechaFin, alquiler, total } = Object.fromEntries(formData);
//   const servicios = JSON.parse(formData.get('servicios') as string);

//   try {
//     const result = await sql`
//     INSERT INTO reservaciones (
//       fecha_registro,
//       fecha_inicio,
//       hora_inicio,
//       fecha_fin,
//       hora_fin,
//       estado,
//       total,
//       usuario_id,
//       tipo_alquiler_id
//     ) VALUES (
//       ${fecha_registro},
//       ${fechaInicio.toString()},
//       ${'00:00:00'},
//       ${fechaFin.toString()},
//       ${'00:00:00'},
//       'Pendiente',
//       ${Number(total)},
//       (SELECT id FROM usuarios WHERE email = ${session?.user?.email}),
//       ${alquiler.toString()}
//     )
//     RETURNING id;
//   `;

//     // Extraer el ID de la nueva reservación
//     const newReservationId = result.rows[0].id;
//     try {
//       // Mapeamos los servicios para generar los valores que queremos insertar
//       for (const servicio of servicios) {
//         await sql`
//             INSERT INTO reservaciones_servicios (
//             reservacion_id,
//             servicio_id,
//             cantidad
//             ) VALUES (
//               ${newReservationId}, ${servicio.id}, ${servicio.cantidad ? servicio.cantidad : 1}
//             )
//         `;
//       }

//       console.log('Servicios añadidos exitosamente a la reservación');
//     } catch (error) {
//       console.error('Error al insertar servicios:', error);
//       throw new Error('Failed to insert services');
//     }
//   } catch (error) {
//     console.error('Error de base de datos:', error);
//     throw { message: 'Error al registrar la reservación' };
//   }

//   revalidatePath('/pages/reservaciones/');
//   redirect('/pages/reservaciones/');
// }

// //Cancelar Reservación
// export async function cancelarReservacionById(formData: FormData) {
//   const { id } = Object.fromEntries(formData);
//   try {
//     await sql`
//     UPDATE reservaciones
//     SET estado = 'Cancelada'
//     WHERE id = ${Number(id)}`;
//   } catch (error) {
//     console.error('Error de base de datos:', error);
//     throw { message: 'Error al cancelar la reservación' };
//   }
//   revalidatePath('/pages/reservaciones/');
//   redirect('/pages/reservaciones/');
// }

// //Aprobar Reservación
// export async function aprobarReservacionById(formData: FormData) {
//   const { id } = Object.fromEntries(formData);
//   try {
//     await sql`
//     UPDATE reservaciones
//     SET estado = 'Aprobada'
//     WHERE id = ${Number(id)}`;
//   } catch (error) {
//     console.error('Error de base de datos:', error);
//     throw { message: 'Error al aprobar la reservación' };
//   }
//   revalidatePath('/pages/reservaciones/');
//   redirect('/pages/reservaciones/');
// }

// //Iniciar Sesion
// export async function authenticate(prevState: string | undefined, formData: FormData) {
//   try {
//     await signIn('credentials', formData);
//   } catch (error) {
//     if (error instanceof AuthError) {
//       switch (error.type) {
//         case 'CredentialsSignin':
//           return 'Invalid credentials.';
//         default:
//           return 'Something went wrong.';
//       }
//     }
//     throw error;
//   }
// }
