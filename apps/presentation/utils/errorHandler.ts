/**
 * Extrae el mensaje de error desde la respuesta de Axios
 * Maneja casos donde el mensaje es un string o array de strings (validaciones)
 */
export function getErrorMessage(error: any, fallback: string = 'Ocurrió un error'): string {
   const errorMessage = error?.response?.data?.message;

   if (Array.isArray(errorMessage)) {
      return errorMessage.join('\n');
   }

   if (typeof errorMessage === 'string') {
      return errorMessage;
   }

   return fallback;
}
