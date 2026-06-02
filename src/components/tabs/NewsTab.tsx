import { Megaphone } from 'lucide-react';

import { getNews } from '../../api/news';
import { useAsyncData } from '../../hooks/useAsyncData';
import { NewsCard } from '../shared/NewsCard';
import { SectionHeader } from '../shared/SectionHeader';
import { EmptyState } from '../ui/EmptyState';
import { Skeleton } from '../ui/Skeleton';
import { tabEmptyStates } from './emptyStateConfig';

export default function NewsTab() {
  const { data: news = [], isLoading, error } = useAsyncData(getNews, []);

  if (isLoading) return <Skeleton className="h-40" />;

  if (error) {
    return (
      <EmptyState
        icon={<Megaphone className="h-8 w-8" />}
        title="No pudimos cargar noticias"
        description="Intentá de nuevo en unos segundos."
      />
    );
  }

  return (
    <div className="space-y-4">
      <SectionHeader
        eyebrow="Noticias"
        title="Comunicaciones del operador"
        description="Promos, eventos, anuncios y mensajes del sistema central."
      />
      {news.length > 0 ? (
        <div className="space-y-3">
          {news.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={tabEmptyStates.news.icon}
          title={tabEmptyStates.news.title}
          description={tabEmptyStates.news.description}
        />
      )}
    </div>
  );
}
