export const formatoFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString();
};
export const formatoMoneda = (amount: number) => {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};
