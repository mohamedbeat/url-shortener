import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual, In } from 'typeorm';
import { Visit } from './entities/visits.entity';
import { Link } from './entities/link.entity';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(Visit)
        private visitRepository: Repository<Visit>,
        @InjectRepository(Link)
        private linkRepository: Repository<Link>,
    ) { }

    async getAnalytics(linkId: string, userId?: string) {
        const now = new Date();
        const last7Days = new Date(now.setDate(now.getDate() - 7));
        const last30Days = new Date(now.setDate(now.getDate() - 30));

        // Get link info
        const link = await this.linkRepository.findOne({
            where: { id: linkId, userId },
        });

        if (!link) {
            throw new Error('Link not found');
        }

        // Get all visits for this link
        const allVisits = await this.visitRepository.find({
            where: { linkId },
            order: { visitedAt: 'ASC' },
        });

        // Filter visits by date ranges
        const last7DaysVisits = allVisits.filter(
            v => v.visitedAt >= last7Days
        );
        const last30DaysVisits = allVisits.filter(
            v => v.visitedAt >= last30Days
        );

        return {
            clickMetrics: this.getClickMetrics(allVisits, last7DaysVisits, last30DaysVisits, link.totalClicks),
            clickTrend: this.getClickTrend(allVisits),
            geographicData: this.getGeographicData(allVisits),
            trafficSources: this.getTrafficSources(allVisits),
            deviceData: this.getDeviceData(allVisits),
            temporalPatterns: this.getTemporalPatterns(allVisits),
        };
    }

    private getClickMetrics(allVisits: Visit[], last7DaysVisits: Visit[], last30DaysVisits: Visit[], totalClicks: number) {
        return {
            total: totalClicks,
            last30Days: last30DaysVisits.length,
            last7Days: last7DaysVisits.length,
        };
    }

    private getClickTrend(visits: Visit[]) {
        // Group clicks by day for the last 30 days
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);

        const filteredVisits = visits.filter(v => v.visitedAt >= last30Days);

        const trend = new Map<string, number>();

        // Initialize last 30 days with 0
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            trend.set(dateKey, 0);
        }

        // Count visits per day
        filteredVisits.forEach(visit => {
            const dateKey = visit.visitedAt.toISOString().split('T')[0];
            trend.set(dateKey, (trend.get(dateKey) || 0) + 1);
        });

        // Convert to array and sort by date
        return Array.from(trend.entries())
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }

    private getGeographicData(visits: Visit[]) {
        const countries = new Map<string, number>();

        visits.forEach(visit => {
            if (visit.country) {
                countries.set(visit.country, (countries.get(visit.country) || 0) + 1);
            }
        });

        // Get top 10 countries
        const topCountries = Array.from(countries.entries())
            .map(([country, count]) => ({ country, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        return {
            topCountries,
            totalCountries: countries.size,
        };
    }

    private getTrafficSources(visits: Visit[]) {
        const referrers = new Map<string, number>();

        visits.forEach(visit => {
            let source = visit.referer || 'Direct';

            // Simplify referrer URLs to domain names
            if (source !== 'Direct') {
                try {
                    const url = new URL(source);
                    source = url.hostname.replace('www.', '');
                } catch {
                    // If URL parsing fails, keep as is
                }
            }

            referrers.set(source, (referrers.get(source) || 0) + 1);
        });

        // Get top 10 referrers
        const topReferrers = Array.from(referrers.entries())
            .map(([source, count]) => ({ source, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        return {
            topReferrers,
            totalReferrers: referrers.size,
        };
    }

    private getDeviceData(visits: Visit[]) {
        const deviceTypes = new Map<string, number>();
        const operatingSystems = new Map<string, number>();
        const browsers = new Map<string, number>();

        visits.forEach(visit => {
            // Device type
            if (visit.deviceType) {
                deviceTypes.set(visit.deviceType, (deviceTypes.get(visit.deviceType) || 0) + 1);
            }

            // Operating system
            if (visit.os) {
                operatingSystems.set(visit.os, (operatingSystems.get(visit.os) || 0) + 1);
            }

            // Browser
            if (visit.browser) {
                browsers.set(visit.browser, (browsers.get(visit.browser) || 0) + 1);
            }
        });

        return {
            deviceTypes: this.sortMapToArray(deviceTypes),
            operatingSystems: this.sortMapToArray(operatingSystems),
            browsers: this.sortMapToArray(browsers),
        };
    }

    private getTemporalPatterns(visits: Visit[]) {
        const hours = new Array(24).fill(0);
        const days = new Array(7).fill(0);
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        visits.forEach(visit => {
            const hour = visit.visitedAt.getHours();
            const day = visit.visitedAt.getDay();

            hours[hour]++;
            days[day]++;
        });

        // Find peak hours (top 3)
        const peakHours = hours
            .map((count, hour) => ({ hour, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

        // Find best performing timeframes
        const bestTimeframes = this.getBestTimeframes(visits);

        return {
            clicksByHour: hours.map((count, hour) => ({ hour, count })),
            clicksByDay: days.map((count, day) => ({ day: daysOfWeek[day], count })),
            peakHours,
            bestTimeframes,
        };
    }

    private getBestTimeframes(visits: Visit[]) {
        // Group clicks by day and hour to find best performing time slots
        const timeframes = new Map<string, number>();

        visits.forEach(visit => {
            const day = visit.visitedAt.getDay();
            const hour = visit.visitedAt.getHours();
            const timeframeKey = `${day}-${hour}`;
            timeframes.set(timeframeKey, (timeframes.get(timeframeKey) || 0) + 1);
        });

        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        // Get top 5 timeframes
        return Array.from(timeframes.entries())
            .map(([key, count]) => {
                const [day, hour] = key.split('-').map(Number);
                return {
                    day: daysOfWeek[day],
                    hour,
                    count,
                };
            })
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }

    private sortMapToArray(map: Map<string, number>) {
        return Array.from(map.entries())
            .map(([key, value]) => ({ name: key, count: value }))
            .sort((a, b) => b.count - a.count);
    }

    async getUserAnalytics(userId: string) {
        // Get all links for the user
        const links = await this.linkRepository.find({
            where: { userId },
            select: ['id', 'url', 'shortHash', 'customSlug', 'totalClicks'],
        });

        const linkIds = links.map(link => link.id);

        // Get all visits for user's links
        const visits = await this.visitRepository.find({
            where: { linkId: In(linkIds) },
        });

        const totalClicks = links.reduce((sum, link) => sum + link.totalClicks, 0);

        // Get top performing links
        const topLinks = links
            .map(link => ({
                id: link.id,
                url: link.url,
                shortUrl: link.customSlug || link.shortHash,
                clicks: link.totalClicks,
            }))
            .sort((a, b) => b.clicks - a.clicks)
            .slice(0, 10);

        return {
            totalLinks: links.length,
            totalClicks,
            topLinks,
            clickTrend: this.getClickTrend(visits),
            geographicData: this.getGeographicData(visits),
            trafficSources: this.getTrafficSources(visits),
            deviceData: this.getDeviceData(visits),
            temporalPatterns: this.getTemporalPatterns(visits),
        };
    }
}