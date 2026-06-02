import { useEffect, useRef } from 'react';

import { trackNewsClick, trackNewsView } from '../../api/news';
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
  const cardRef = useRef<HTMLDivElement>(null);
  const viewedRef = useRef(false);
  const createdAt = parseSafeDate(news.createdAt);
  const isNew = createdAt != null && Date.now() - createdAt.getTime() < 24 * 60 * 60 * 1000;

  useEffect(() => {
    const el = cardRef.current;
    if (!el || !news.code) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !viewedRef.current) {
          viewedRef.current = true;
          trackNewsView(news.code);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [news.code]);

  const handleOpen = () => {
    trackNewsClick(news.code);
    if (news.ctaUrl) {
      window.open(news.ctaUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card ref={cardRef} className="space-y-3">
      {news.imageUrl ? (
        <img src={news.imageUrl} alt="" className="h-32 w-full rounded-md border border-border-subtle object-cover" />
      ) : (
        <div className="h-24 rounded-md border border-border-subtle bg-news-banner" />
      )}
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
        <p className="mt-1 line-clamp-3 text-sm text-text-secondary">{news.body}</p>
      </div>
      {news.expiresAt ? (
        <p className="text-metadata text-warning">
          expira {safeFormatDistanceToNow(news.expiresAt, undefined, 'sin fecha')}
        </p>
      ) : null}
      {news.ctaLabel || news.ctaUrl ? (
        <Button className="w-full" size="sm" variant="secondary" onClick={handleOpen}>
          {news.ctaLabel ?? 'Ver más'}
        </Button>
      ) : null}
    </Card>
  );
}
