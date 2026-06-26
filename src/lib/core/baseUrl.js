export const getBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_SERVER_URL) {
        return process.env.NEXT_PUBLIC_SERVER_URL;
    }
    // Check if running in browser
    if (typeof window !== "undefined") {
        if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
            return "https://prompt-forge-server.onrender.com";
        }
    }
    // Check if running on Vercel server or in production
    if (process.env.VERCEL === "1" || process.env.NODE_ENV === "production") {
        return "https://prompt-forge-server.onrender.com";
    }
    return "http://localhost:5000";
};

export const baseUrl = getBaseUrl();
