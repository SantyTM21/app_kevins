export type Usuario = {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string; // Puede ser opcional si es `DEFAULT NULL`
  email: string;
  password: string;
  fecha_registro?: Date; // Asumiendo que podría generarse automáticamente
  rol_id: string;
};

// export type Usuario = {
//   id: string;
//   name: string;
//   email: string;
//   password: string;
// };
