import { Megaphone } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { NewsCard } from '../shared/NewsCard';
import { SectionHeader } from '../shared/SectionHeader';
import { mockNews } from '../../mocks';

const filters = [
  ['todo', mockNews.length],
  ['promos', mockNews.filter((item) => item.category === 'promo').length],
  ['eventos', mockNews.filter((item) => item.category === 'evento').length],
  ['anuncios', mockNews.filter((item) => item.category === 'anuncio').length],
  ['sistema', mockNews.filter((item) => item.category === 'sistema').length],
];

export default function NewsTab() {
  return (
    <div className="space-y-4">
      <SectionHeader
        eyebrow="Noticias"
        title="Comunicaciones del operador"
        action="todo vigente"
        description="Promos, eventos, anuncios y mensajes del sistema central."
      />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map(([label, count], index) => (
          <Badge key={label} variant={index === 0 ? 'success' : 'default'} className="shrink-0">
            {label} · {count}
          </Badge>
        ))}
      </div>
      {mockNews.length > 0 ? (
        <div className="space-y-3">
          {mockNews.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Megaphone className="h-8 w-8" />}
          title="todavia no hay noticias"
          description="cuando el operador publique novedades las vas a ver aca."
        />
      )}
    </div>
  );
}
