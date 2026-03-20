export type DeviceInfo = {
    browser?: string;
    os?: string;
    deviceType?: string; // 'desktop', 'smartphone', 'tablet'
    isMobile?: boolean;
    bot?: boolean;
    referer?: string;
    country?: string;
};

export type SessionDeviceInfo = {
    browser?: string;
    os?: string;
    deviceType?: string; // 'desktop', 'smartphone', 'tablet'
    country?: string;
};
