import { ShieldCheck, ShoppingBag, Flame, Megaphone } from 'lucide-react';

export const tabEmptyStates = {
  missions: {
    icon: <ShieldCheck className="h-8 w-8" />,
    title: 'Todavía no tenés misiones disponibles',
    description: 'Volvé pronto.',
  },
  shop: {
    icon: <ShoppingBag className="h-8 w-8" />,
    title: 'El catálogo de la tienda está vacío',
    description: 'Cuando haya productos disponibles los vas a ver acá.',
  },
  streak: {
    icon: <Flame className="h-8 w-8" />,
    title: 'No hay programas de asistencia activos',
    description: 'El operador todavía no configuró rachas de asistencia.',
  },
  news: {
    icon: <Megaphone className="h-8 w-8" />,
    title: 'No hay novedades por ahora',
    description: 'Cuando el operador publique noticias las vas a ver acá.',
  },
};
