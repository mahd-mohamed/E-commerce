import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'details/:id/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => [
      { id: '1', slug: 'sample-product' },
      { id: '2', slug: 'another-product' }
    ]
  },
  {
    path: 'details/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => [
      { id: '1' },
      { id: '2' }
    ]
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
