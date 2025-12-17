/**
 * Mapeo de suplementos a sus imágenes locales
 * En React Native, las imágenes deben ser importadas estáticamente con require()
 */

export const supplementImages: Record<string, any> = {
   // Pediátricos - Gotas
   'Complejo polimaltosado férrico': require('@/assets/supplements/Complejo polimaltosado férrico.png'),
   'Complejo polimaltosado férrico FERRIMAX': require('@/assets/supplements/Complejo polimaltosado férrico FERRIMAX.png'),
   'Ferinsol (Sulfato ferroso)': require('@/assets/supplements/Ferinsol (Sulfato ferroso).png'),
   'Sulfato ferroso en gotas (Estándar)': require('@/assets/supplements/Sulfato ferroso en gotas (Estándar).png'),

   // Pediátricos - Jarabe
   'Sulfato ferroso jarabe': require('@/assets/supplements/Sulfato ferroso jarabe.png'),

   // Adultos - Tabletas
   'Sulfato ferroso 60mg': require('@/assets/supplements/Sulfato ferroso 120mg tabletas.png'),
   'Sulfato ferroso 120mg': require('@/assets/supplements/Sulfato ferroso 120mg tabletas.png'),
   'Tabletas de Sulfato Ferroso 60mg': require('@/assets/supplements/Sulfato ferroso 120mg tabletas.png'),
   'Tabletas de Sulfato Ferroso 120mg': require('@/assets/supplements/Sulfato ferroso 120mg tabletas.png'),
   'Sulfato ferroso 120mg + Ácido Fólico 800µg': require('@/assets/supplements/Sulfato ferroso 120mg + Ácido Fólico 800µg.png'),
   'Tabletas de Sulfato Ferroso 120mg + Ácido Fólico 800µg': require('@/assets/supplements/Sulfato ferroso 120mg + Ácido Fólico 800µg.png'),
};

/**
 * Obtiene la imagen de un suplemento por su nombre
 * @param supplementName Nombre del suplemento
 * @returns ImageSourcePropType o undefined si no existe
 */
export function getSupplementImage(supplementName: string | undefined): any {
   if (!supplementName) return undefined;
   return supplementImages[supplementName];
}

/**
 * Imagen por defecto cuando no se encuentra el suplemento
 */
export const defaultSupplementImage = require('@/assets/icons/adaptive-icon.png');
