import jwt from "jsonwebtoken";
import { getUserSession } from "./session";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

const resolveUrl = (path) => {
    if (path.startsWith("http")) return path;
    return `${baseUrl}${path}`;
};

// Generate a secure JWT token containing the user details signed with BETTER_AUTH_SECRET
const getAuthToken = async () => {
    try {
        const user = await getUserSession();
        if (user) {
            const secret = process.env.BETTER_AUTH_SECRET || "84yJeei99HZQbTCGH1dvLmr6H0wAGgNQ";
            return jwt.sign({
                id: user.id || user._id,
                email: user.email,
                role: user.role || 'user'
            }, secret, { expiresIn: '1h' });
        }
    } catch (e) {
        console.error("Failed to generate JWT token for backend request:", e);
    }
    return null;
};

// -------------------- FETCH --------------------
export const serverFetch = async (path) => {
    const headers = {};
    const token = await getAuthToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(resolveUrl(path), {
        method: "GET",
        headers,
        cache: 'no-store'
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`serverFetch failed: ${res.status} - ${text}`);
    }

    return res.json();
};

// -------------------- MUTATION --------------------
export const serverMutation = async (path, data, method = "POST") => {
    const headers = {
        "Content-Type": "application/json",
    };
    const token = await getAuthToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(resolveUrl(path), {
        method,
        headers,
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`serverMutation failed: ${res.status} - ${text}`);
    }

    return res.json();
};