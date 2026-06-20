const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

const resolveUrl = (path) => {
    if (path.startsWith("http")) return path;
    return `${baseUrl}${path}`;
};

// -------------------- FETCH --------------------
export const serverFetch = async (path) => {
    const res = await fetch(resolveUrl(path));

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`serverFetch failed: ${res.status} - ${text}`);
    }

    return res.json();
};

// -------------------- MUTATION --------------------
export const serverMutation = async (path, data, method = "POST") => {
    const res = await fetch(resolveUrl(path), {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`serverMutation failed: ${res.status} - ${text}`);
    }

    return res.json();
};