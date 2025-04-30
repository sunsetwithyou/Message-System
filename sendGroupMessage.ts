import fetch from "node-fetch";
import { getDelegatedToken, refreshAccessToken } from "../auth/tokenService";

export async function sendGroupMessage(chatId: string, content: string) {
    let token = getDelegatedToken();

    let res = await fetch(`https://graph.microsoft.com/v1.0/chats/${chatId}/messages`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: { content } }),
    });

    if (res.status === 401 || res.status === 403) {
        console.log("Access Token expired. Refreshing...");
        token = await refreshAccessToken();

        res = await fetch(`https://graph.microsoft.com/v1.0/chats/${chatId}/messages`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ body: { content } }),
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error?.message || "Failed to send group message after refresh");
        }
    } else if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || "Failed to send group message");
    }
}