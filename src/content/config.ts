import { z, defineCollection } from 'astro:content';

const projectsCollection = defineCollection({
    type: 'content', 
    schema: ({ image }) => z.object({
        title: z.string(),
        // Making tags optional prevents errors if a file forgets them
        tags: z.array(z.string()).optional(), 
        // This helper transforms the string path into an Image object
        heroImage: image(), 
        featuredImages: z.array(image()).optional(),
        // It's good practice to allow a description, even if optional
        description: z.string().optional(),
    }),
});

const portfolioCollection = defineCollection({
    type: 'content', 
    schema: ({ image }) => z.object({
        title: z.string(),
        heroImage: image(), 
        featuredImages: z.array(image()).optional(),
        description: z.string().optional(),
    }),
});

export const collections = {
    'projects': projectsCollection,
    'portfolio': portfolioCollection,
};