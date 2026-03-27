import { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// World map topology URL
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json";
// const geoUrl =
//     "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

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

    // Create color scale based on count (blue gradient with opacity)
    const colorScale = scaleLinear<string>()
        .domain([0, maxCount])
        .range(["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0.9)"])
        .interpolate((a, b) => (t) => {
            const color1 = a.match(/\d+/g)?.map(Number);
            const color2 = b.match(/\d+/g)?.map(Number);
            if (!color1 || !color2) return a;

            const r = Math.round(color1[0] + (color2[0] - color1[0]) * t);
            const g = Math.round(color1[1] + (color2[1] - color1[1]) * t);
            const bVal = Math.round(color1[2] + (color2[2] - color1[2]) * t);
            const opacity = color1[3] + (color2[3] - color1[3]) * t;

            return `rgba(${r}, ${g}, ${bVal}, ${opacity})`;
        });

    const getCountryColor = (countryName: string) => {
        const count = countryDataMap.get(countryName.toLowerCase());
        if (!count) return "rgba(156, 163, 175, 0.1)"; // Light gray for no data
        return colorScale(count);
    };

    const handleMouseEnter = (geo: any, evt: React.MouseEvent) => {
        const countryName = geo.properties.name;
        const count = countryDataMap.get(countryName.toLowerCase()) || 0;

        setTooltipData({
            country: countryName,
            count,
            x: evt.clientX,
            y: evt.clientY,
        });
    };

    const handleMouseMove = (evt: React.MouseEvent) => {
        if (tooltipData) {
            setTooltipData({
                ...tooltipData,
                x: evt.clientX,
                y: evt.clientY,
            });
        }
    };

    const handleMouseLeave = () => {
        setTooltipData(null);
    };

    const handleClick = (geo: any) => {
        const countryName = geo.properties.name;
        const count = countryDataMap.get(countryName.toLowerCase()) || 0;
        // You can add additional logic here, like showing a modal with more details
        console.log(`Clicked on ${countryName}: ${count} clicks`);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>World Map View</CardTitle>
                    <CardDescription>
                        Countries colored by click count. Hover or click to see details.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full h-[500px] bg-muted/20 rounded-lg">
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
                                                    },
                                                    hover: {
                                                        fill: "#3b82f6",
                                                        stroke: "#ffffff",
                                                        strokeWidth: 1,
                                                        cursor: "pointer",
                                                        transition: "all 0.3s ease",
                                                    },
                                                    pressed: {
                                                        fill: "#2563eb",
                                                        stroke: "#ffffff",
                                                        strokeWidth: 1,
                                                    },
                                                }}
                                                onMouseEnter={(evt) => handleMouseEnter(geo, evt)}
                                                onMouseMove={handleMouseMove}
                                                onMouseLeave={handleMouseLeave}
                                                onClick={() => handleClick(geo)}
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
                                    <div className="w-6 h-3 rounded" style={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }} />
                                    <span className="text-xs">Low</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-3 rounded" style={{ backgroundColor: "rgba(59, 130, 246, 0.5)" }} />
                                    <span className="text-xs">Medium</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-3 rounded" style={{ backgroundColor: "rgba(59, 130, 246, 0.9)" }} />
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

            {/* Custom Tooltip */}
            {tooltipData && (
                <div
                    className="fixed z-50 pointer-events-none"
                    style={{
                        left: tooltipData.x + 10,
                        top: tooltipData.y - 10,
                        transform: 'translate(0, -100%)',
                    }}
                >
                    <div className="bg-popover text-popover-foreground rounded-lg shadow-md border p-2 min-w-[150px]">
                        <div className="font-semibold">{tooltipData.country}</div>
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
            )}
        </>
    );
}