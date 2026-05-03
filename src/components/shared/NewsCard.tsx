import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { NewsItem } from '../../types/social';

interface NewsCardProps {
  news: NewsItem;
}

const categoryLabels: Record<NewsItem['category'], string> = {
  promo: 'PROMO',
  evento: 'EVENTO',
  anuncio: 'ANUNCIO',
  sistema: 'SISTEMA',
};

export function NewsCard({ news }: NewsCardProps) {
  const isNew = Date.now() - new Date(news.createdAt).getTime() < 24 * 60 * 60 * 1000;

  return (
    <Card className="space-y-3">
      <div className="h-24 rounded-md border border-border-subtle bg-[linear-gradient(135deg,rgba(10,247,132,0.08),rgba(77,159,255,0.14))]" />
      <div className="flex items-center gap-2">
        <Badge variant={news.category === 'anuncio' ? 'success' : news.category === 'promo' ? 'danger' : 'neutral'}>
          {categoryLabels[news.category]}
        </Badge>
        {news.systemCentral ? <Badge variant="neutral">sistema central</Badge> : null}
        {isNew ? <Badge variant="danger">NUEVO</Badge> : null}
        <span className="ml-auto text-xs text-text-tertiary">
          {formatDistanceToNow(new Date(news.createdAt), { addSuffix: true, locale: es })}
        </span>
      </div>
      <div>
        <h3 className="text-md font-semibold">{news.title}</h3>
        <p className="mt-1 text-sm text-text-secondary">{news.body}</p>
      </div>
      {news.expiresAt ? <p className="text-xs text-warning">expira {formatDistanceToNow(new Date(news.expiresAt), { locale: es })}</p> : null}
      {news.ctaLabel ? (
        <Button className="w-full" size="sm" variant="secondary">
          {news.ctaLabel}
        </Button>
      ) : null}
    </Card>
  );
}
