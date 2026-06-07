import { getAllSchools, toSlug, getDisplayName } from '../lib/schools';

export default function sitemap() {
  const schools = getAllSchools();
  const baseUrl = 'https://www.collegevisualizer.com';

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/schools`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/rankings`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  const schoolPages = schools.map(s => ({
    url: `${baseUrl}/schools/${toSlug(getDisplayName(s))}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: s.app ? 0.9 : 0.7,
  }));

  return [...staticPages, ...schoolPages];
}
