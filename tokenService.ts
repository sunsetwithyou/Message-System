import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export function getDelegatedToken() {
    return process.env.DELEGATED_ACCESS_TOKEN!;
}

export async function refreshAccessToken() {
    const res = await fetch(`https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: process.env.CLIENT_ID!,
            client_secret: process.env.CLIENT_SECRET!,
            grant_type: "refresh_token",
            refresh_token: process.env.REFRESH_TOKEN!,
            scope: "ChannelMessage.Send Chat.ReadWrite Chat.ReadWrite.All offline_access openid email profile",
        }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error_description || "Failed to refresh token");
    return data.access_token;
}