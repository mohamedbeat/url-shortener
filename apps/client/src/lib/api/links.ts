import axiosInstance from '@/lib/axios';
import type { Link } from '@/types/link';

import { z } from 'zod';

export const createLinkSchema = z.object({
    title: z.string()
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title must be less than 100 characters'),
    url: z
        .url('Please enter a valid URL')
        .min(1, 'URL is required'),
    customSlug: z.string()
        .min(3, 'Custom slug must be at least 3 characters')
        .max(50, 'Custom slug must be less than 50 characters')
        .regex(/^[a-zA-Z0-9-]+$/, 'Custom slug can only contain letters, numbers, and hyphens')
        .optional()
        .or(z.literal('')),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;


export const createLink = async (data: CreateLinkInput): Promise<Link> => {
    const response = await axiosInstance.post<Link>('api/links', data);
    return response.data;
};

export const checkSlugAvailability = async (slug: string): Promise<boolean> => {
    const response = await axiosInstance.get<{ available: boolean }>(`api/links/checkSlug/${slug}`);
    return response.data.available;
};