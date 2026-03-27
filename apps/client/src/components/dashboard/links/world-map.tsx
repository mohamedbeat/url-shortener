import { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react'; // Make sure you have lucide-react installed

// World map topology URL
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json";

interface WorldMapProps {
    data: Array<{ country: string; count: number }>;
    totalClicks: number;
}

interface TooltipData {
    country: string;
    count: number;
    x: number;
    y: number;
}

export function WorldMap({ data, totalClicks }: WorldMapProps) {
    const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);

    // Create a map for quick lookup of country data
    const countryDataMap = new Map(
        data.map(item => [item.country.toLowerCase(), item.count])
    );

    // Find max count for color scaling
    const maxCount = Math.max(...data.map(d => d.count), 1);

    // Create color scale based on count - using solid colors (no opacity)
    const colorScale = scaleLinear<string>()
        .domain([0, maxCount])
        .range(["#e0f2fe", "#1e3a8a"]) // Light blue to dark blue (solid colors)
        .interpolate((a, b) => (t) => {
            // Simple RGB interpolation for solid colors
            const color1 = hexToRgb(a);
            const color2 = hexToRgb(b);
            if (!color1 || !color2) return a;

            const r = Math.round(color1.r + (color2.r - color1.r) * t);
            const g = Math.round(color1.g + (color2.g - color1.g) * t);
            const bVal = Math.round(color1.b + (color2.b - color1.b) * t);

            return `rgb(${r}, ${g}, ${bVal})`;
        });

    // Helper function to convert hex to RGB
    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    const getCountryColor = (countryName: string) => {
        const count = countryDataMap.get(countryName.toLowerCase());
        if (count === undefined) return "#e5e7eb"; // Light gray for no data
        return colorScale(count);
    };

    const handleClick = (geo: any, evt: React.MouseEvent) => {
        // Stop propagation to prevent the map click handler from closing the tooltip immediately
        evt.stopPropagation();

        const countryName = geo.properties.name;
        const count = countryDataMap.get(countryName.toLowerCase()) || 0;
        console.log(`Clicked on ${countryName}: ${count} clicks`);

        // Show tooltip on click
        setTooltipData({
            country: countryName,
            count,
            x: evt.clientX,
            y: evt.clientY,
        });
    };

    // Close tooltip when clicking outside (on the map container but not on a country)
    const handleMapClick = (evt: React.MouseEvent) => {
        // Only close if clicking directly on the map background, not on a country
        if (evt.target === evt.currentTarget || (evt.target as HTMLElement).classList.contains('rsm-svg')) {
            setTooltipData(null);
        }
    };

    // Close tooltip function
    const closeTooltip = (evt: React.MouseEvent) => {
        evt.stopPropagation(); // Prevent click from bubbling to map
        setTooltipData(null);
    };

    // Optional: Close tooltip when pressing Escape key
    const handleKeyDown = (evt: React.KeyboardEvent) => {
        if (evt.key === 'Escape') {
            setTooltipData(null);
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>World Map View</CardTitle>
                    <CardDescription>
                        Countries colored by click count. Click on any country to see details.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div
                        className="relative w-full h-[500px] bg-muted/20 rounded-lg"
                        onClick={handleMapClick}
                        onKeyDown={handleKeyDown}
                        tabIndex={0}
                    >
                        <ComposableMap
                            projection="geoMercator"
                            projectionConfig={{
                                scale: 120,
                                center: [0, 20],
                            }}
                            style={{
                                width: "100%",
                                height: "100%",
                            }}
                        >
                            <ZoomableGroup zoom={1}>
                                <Geographies geography={geoUrl}>
                                    {({ geographies }) =>
                                        geographies.map((geo) => (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                fill={getCountryColor(geo.properties.name)}
                                                stroke="#ffffff"
                                                strokeWidth={0.5}
                                                style={{
                                                    default: {
                                                        outline: "none",
                                                        transition: "all 0.3s ease",
                                                        cursor: "pointer",
                                                    },
                                                    hover: {
                                                        fill: "#3b82f6", // Brighter blue on hover
                                                        stroke: "#ffffff",
                                                        strokeWidth: 1,
                                                        transition: "all 0.3s ease",
                                                    },
                                                    pressed: {
                                                        fill: "#2563eb",
                                                        stroke: "#ffffff",
                                                        strokeWidth: 1,
                                                    },
                                                }}
                                                onClick={(evt) => handleClick(geo, evt)}
                                            />
                                        ))
                                    }
                                </Geographies>
                            </ZoomableGroup>
                        </ComposableMap>

                        {/* Legend */}
                        <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm p-3 rounded-lg shadow-md border">
                            <div className="text-sm font-semibold mb-2">Click Count</div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-3 rounded" style={{ backgroundColor: "#e0f2fe" }} />
                                    <span className="text-xs">Low</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-3 rounded" style={{ backgroundColor: "#7c3aed" }} />
                                    <span className="text-xs">Medium</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-3 rounded" style={{ backgroundColor: "#1e3a8a" }} />
                                    <span className="text-xs">High</span>
                                </div>
                            </div>
                            <div className="mt-2 pt-2 border-t">
                                <div className="text-xs text-muted-foreground">
                                    Max: {maxCount.toLocaleString()} clicks
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Custom Tooltip with Close Button */}
            {tooltipData && (
                <div
                    className="fixed z-50"
                    style={{
                        left: tooltipData.x + 10,
                        top: tooltipData.y - 10,
                        transform: 'translate(0, -100%)',
                    }}
                >
                    <div className="bg-popover text-popover-foreground rounded-lg shadow-md border min-w-[200px]">
                        <div className="flex items-center justify-between p-2 border-b">
                            <div className="font-semibold">{tooltipData.country}</div>
                            <button
                                onClick={closeTooltip}
                                className="p-1 hover:bg-muted rounded-md transition-colors"
                                aria-label="Close tooltip"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="p-2">
                            <div className="text-sm text-muted-foreground">
                                {tooltipData.count.toLocaleString()} clicks
                                {totalClicks > 0 && (
                                    <span className="ml-1">
                                        ({((tooltipData.count / totalClicks) * 100).toFixed(1)}%)
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}