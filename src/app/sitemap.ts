import { MetadataRoute } from 'next';
import { SERVICE_CATEGORIES } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://truckrescueindia.in';
  const currentDate = new Date().toISOString();

  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/refund-policy',
    '/disclaimer',
    '/nearby',
    '/emergency',
    '/ai-diagnostic',
    '/register',
    '/login',
    '/join',
    '/join/mechanic',
    '/join/electrician',
    '/join/scanner-expert',
    '/join/ecm-expert',
    '/join/tyre-service',
    '/join/towing',
    '/join/spare-parts',
    '/india',
    '/maharashtra',
    '/mumbai',
    '/delhi',
    '/uttar-pradesh',
    '/services',
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => {
    let priority = 0.7;
    let changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' = 'weekly';

    if (route === '') {
      priority = 1.0;
      changeFrequency = 'daily';
    } else if (route === '/nearby' || route === '/emergency' || route === '/ai-diagnostic') {
      priority = 0.9;
      changeFrequency = 'daily';
    } else if (route.startsWith('/join') || route === '/register') {
      priority = 0.85;
    } else if (['/india', '/maharashtra', '/mumbai', '/delhi', '/uttar-pradesh'].includes(route)) {
      priority = 0.8;
      changeFrequency = 'daily';
    }

    return {
      url: `${baseUrl}${route}`,
      lastModified: currentDate,
      changeFrequency,
      priority,
    };
  });

  // Service categories
  const serviceEntries: MetadataRoute.Sitemap = SERVICE_CATEGORIES.map((cat) => ({
    url: `${baseUrl}/services/${cat.id.replace(/_/g, '-')}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticEntries, ...serviceEntries];
}
