import { Megaphone } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { NewsCard } from '../shared/NewsCard';
import { SectionHeader } from '../shared/SectionHeader';
import { getNews } from '../../api/feed';
import { useAsyncData } from '../../hooks/useAsyncData';

export default function NewsTab() {
  const { data: news = [] } = useAsyncData(getNews, []);
  const filters = [
    ['todo', news.length],
    ['promos', news.filter((item) => item.category === 'promo').length],
    ['eventos', news.filter((item) => item.category === 'evento').length],
    ['anuncios', news.filter((item) => item.category === 'anuncio').length],
    ['sistema', news.filter((item) => item.category === 'sistema').length],
  ];

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
      {news.length > 0 ? (
        <div className="space-y-3">
          {news.map((item) => (
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
