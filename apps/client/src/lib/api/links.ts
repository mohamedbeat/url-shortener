import axiosInstance from '@/lib/axios';
import type { Link } from '@/types/link';
import { type LinkSortFields, type Pagination, type SortOrder } from "@packages/shared/types"

import { z } from 'zod';

export const createLinkSchema = z.object({
    title: z.string().optional()
        .transform(val => val === '' ? undefined : val) // Transform empty string to undefined
        .pipe(z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters').optional()), // Ensure proper optional type,
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
    console.log("creating")
    const response = await axiosInstance.post<Link>('api/links', data);
    return response.data;
};

export const checkSlugAvailability = async (slug: string): Promise<boolean> => {
    const response = await axiosInstance.get<{ available: boolean }>(`api/links/checkSlug/${slug}`);
    return response.data.available;
};




export const getAllLinks = async (params?: {
    page?: string,
    limit?: string,
    search?: string;
    status?: string;
},
    sort?: {
        field?: LinkSortFields,
        order?: SortOrder
    }
): Promise<Pagination<Link>> => {

    // await new Promise(resolve => setTimeout(resolve, 3000));

    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const field = sort?.field ?? 'createdAt'
    const order = sort?.order ?? 'DESC'

    const search = params?.search ?? '';
    const status = params?.status ?? 'all';

    const res = await axiosInstance.get<Pagination<Link>>(
        `api/links?page=${page}&limit=${limit}&field=${field}&order=${order}&search=${search}&status=${status}`
    );
    return res.data

}


export const deleteLink = async (id: string) => {

    // await new Promise(resolve => setTimeout(resolve, 5000));
    const res = await axiosInstance.delete(`/api/links/${id}`, {
    });

    return true;
}
export const getlinkById = async (id: string) => {
    const res = await axiosInstance.get<Link>(`/api/links/${id}`, {
    });

    return res.data;
}

export const toggleLinkStatus = async (id: string, data: {
    isActive: boolean
}) => {
    const res = await axiosInstance.patch<Link>(`/api/links/${id}`, data)
    return res.data
}

export async function bulkDeleteLinks(ids: string[]): Promise<void> {
    await axiosInstance.delete(`api/links/bulk-delete`, {
        data: {
            ids
        }
    });
}