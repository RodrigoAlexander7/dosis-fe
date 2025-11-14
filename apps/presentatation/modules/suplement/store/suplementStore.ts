import { Suplement } from "@/modules/suplement/dto/suplement.dto";
import { create } from 'zustand';

const initialSuplementData: Suplement = {
   idSuplement: '',
   name: '',
   type: '',
   presentation: 'gotas', // O el valor por defecto que corresponda
   notes: '',
   elementalIron: 0,
   content: 0,
   dose: [
      {
         from_age: 0,
         to_age: 0,
         doseAmount: 0
      }
   ], // O un array con un objeto de dosis inicial si es necesario
};

type SuplementStore = {
   suplementStore: Suplement; // the suplement object
   setSuplementStore: (suplement: Suplement) => void; // function to set a suplement in zustand memory
   clear: () => void;
}

export const useSuplementStore = create<SuplementStore>((set, get) => ({
   suplementStore: initialSuplementData,
   setSuplementStore: (suplementDto: Suplement) => set({ suplementStore: suplementDto }),
   clear: () => set({ suplementStore: initialSuplementData })
}))