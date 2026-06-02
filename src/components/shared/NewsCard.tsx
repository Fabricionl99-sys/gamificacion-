import { safeFormatDistanceToNow, parseSafeDate } from '../../utils/date';
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
  const createdAt = parseSafeDate(news.createdAt);
  const isNew = createdAt != null && Date.now() - createdAt.getTime() < 24 * 60 * 60 * 1000;

  return (
    <Card className="space-y-3">
      <div className="h-24 rounded-md border border-border-subtle bg-news-banner" />
      <div className="flex items-center gap-2">
        <Badge variant={news.category === 'anuncio' ? 'success' : news.category === 'promo' ? 'danger' : 'neutral'}>
          {categoryLabels[news.category]}
        </Badge>
        {news.systemCentral ? <Badge variant="neutral">sistema central</Badge> : null}
        {isNew ? <Badge variant="danger">NUEVO</Badge> : null}
        <span className="ml-auto text-module-body text-text-tertiary">
          {safeFormatDistanceToNow(news.createdAt, { addSuffix: true })}
        </span>
      </div>
      <div>
        <h3 className="text-md font-semibold">{news.title}</h3>
        <p className="mt-1 text-sm text-text-secondary">{news.body}</p>
      </div>
      {news.expiresAt ? (
        <p className="text-metadata text-warning">
          expira {safeFormatDistanceToNow(news.expiresAt, undefined, 'sin fecha')}
        </p>
      ) : null}
      {news.ctaLabel ? (
        <Button className="w-full" size="sm" variant="secondary">
          {news.ctaLabel}
        </Button>
      ) : null}
    </Card>
  );
}
