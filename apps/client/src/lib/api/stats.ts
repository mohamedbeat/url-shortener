import axiosInstance from "../axios"

export type Stats = {
    totalLinks: number,
    totalClicks: number
}

export const getStats = async (): Promise<Stats> => {
    const res = await axiosInstance.get<Stats>('api/links/stats')
    return res.data
}