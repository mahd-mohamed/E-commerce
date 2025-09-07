import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'categories/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => [
      { id: '6439d5b90049ad0b52b90048' },
      { id: '6439d5b90049ad0b52b90049' },
      { id: '6439d5b90049ad0b52b9004a' },
      { id: '6439d5b90049ad0b52b9004b' },
      { id: '6439d5b90049ad0b52b9004c' }
    ]
  },
  {
    path: 'category-details/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => [
      { id: '6439d5b90049ad0b52b90048' },
      { id: '6439d5b90049ad0b52b90049' },
      { id: '6439d5b90049ad0b52b9004a' },
      { id: '6439d5b90049ad0b52b9004b' },
      { id: '6439d5b90049ad0b52b9004c' }
    ]
  },
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
    path: 'checkout/:id',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
