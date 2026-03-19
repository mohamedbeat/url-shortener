

export type Link = {
    id: string;
    title: string;
    url: string;
    shortHash: string;
    customSlug: string;
    totalClicks: number;
    isActive: boolean;
    createdAt: string; // ISO 8601 date string
    updatedAt: string; // ISO 8601 date string
    publicURL?: string;
}