import { redirect } from "next/navigation";
// import { getSessionToken } from "./session"; // আপাতত কমেন্ট করে রাখা হলো

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || '';

/* =========================================================
   TEMPORARILY COMMENTED OUT METHODS
   ========================================================= */
/*
export const authHeader = async () => {
    const token = await getSessionToken()
    const header = token ? {
        authorization: `Bearer ${token}`
    } : {};
    return header;
}

export const serverFetch = async (path) => {
    const url = `${baseUrl}${path}`;
    const res = await fetch(url);

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`serverFetch failed: ${res.status} ${res.statusText} - ${text}`);
    }

    return res.json();
}

export const protectedFetch = async (path) => {
    const res = await fetch(`${baseUrl}${path}`,
        {
            headers: await authHeader()
        })

    return handleStatus(res);
}

const handleStatus = res => {
    if (res.status === 401) {
        redirect('/unauthorize')
    }
    else if (res.status === 403) {
        redirect('/signin')
    }
    return res.json()
}
*/

/* =========================================================
   ACTIVE SIMPLE MUTATION METHOD FOR BACKEND SUBMISSION
   ========================================================= */
export const serverMutation = async (path, data, method = 'POST') => {
    const url = `${baseUrl}${path}`;
    const res = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
            // ...await authHeader() // টোকেন ভেরিফিকেশন পরে অন করার জন্য কমেন্ট রাখা হলো
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`serverMutation failed: ${res.status} ${res.statusText} - ${text}`);
    }

    return res.json();
};