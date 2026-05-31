import { describe, expect, it } from 'vitest';

import { buildDetailPath, buildTabPath, parseWidgetPath } from '../routes/widgetPaths';

describe('widgetPaths', () => {
  it('maps tab list paths', () => {
    expect(parseWidgetPath('/sorteos').tab).toBe('raffles');
    expect(parseWidgetPath('/tienda').tab).toBe('shop');
    expect(parseWidgetPath('/').tab).toBe('home');
    expect(parseWidgetPath('/perfil').view).toBe('own-profile');
  });

  it('parses detail routes and query actions', () => {
    const route = parseWidgetPath('/sorteos/winasist3', '?action=buy');
    expect(route.tab).toBe('raffles');
    expect(route.detailId).toBe('winasist3');
    expect(route.action).toBe('buy');
  });

  it('parses player profile route', () => {
    const route = parseWidgetPath('/perfil/player-123');
    expect(route.view).toBe('player-profile');
    expect(route.playerStateId).toBe('player-123');
  });

  it('parses tournament detail routes', () => {
    const route = parseWidgetPath('/torneos/summer-cup');
    expect(route.tab).toBe('tournaments');
    expect(route.detailId).toBe('summer-cup');
  });

  it('builds paths', () => {
    expect(buildTabPath('missions')).toBe('/misiones');
    expect(buildDetailPath('sorteos', 'abc', 'buy')).toBe('/sorteos/abc?action=buy');
  });
});
