import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(['Visa', 'Logement', 'Démarches', 'Vie étudiante', 'Communauté']),
    author: z.string().default('Équipe DALILI'),
    readTime: z.number().default(5),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };
