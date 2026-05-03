import { ShieldCheck, ShoppingBag } from 'lucide-react';

export const tabEmptyStates = {
  missions: {
    icon: <ShieldCheck className="h-8 w-8" />,
    title: 'sin misiones por ahora',
    description: 'vamos a avisarte cuando haya nuevas',
  },
  shop: {
    icon: <ShoppingBag className="h-8 w-8" />,
    title: 'el operador todavia no configuro items',
    description: 'cuando haya premios o bonos disponibles los vas a ver aca.',
  },
};
