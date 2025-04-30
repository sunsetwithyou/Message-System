import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

export async function refreshAccessToken(): Promise<string> {
  const url = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;

  const params = new URLSearchParams();
  params.append("client_id", process.env.CLIENT_ID!);
  params.append("scope", "ChannelMessage.Send Chat.ReadWrite Chat.ReadWrite.All offline_access openid profile email");
  params.append("refresh_token", process.env.REFRESH_TOKEN!);
  params.append("grant_type", "refresh_token");
  params.append("client_secret", process.env.CLIENT_SECRET!);

  const res = await fetch(url, {
    method: "POST",
    body: params,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error_description || "Failed to refresh access token");
  }

  const newAccessToken = data.access_token;
  const newRefreshToken = data.refresh_token;

  process.env.ACCESS_TOKEN = newAccessToken;
  process.env.REFRESH_TOKEN = newRefreshToken;

  return newAccessToken;
}
