import { request, APIResponse } from "@playwright/test";

const BASE_URL = 'http://localhost:3000';

export async function getAdminToken(email: string, password: string): Promise<string> {
    const ctx = await request.newContext({ baseURL: BASE_URL });
    const res = await ctx.post('/api/user/tokens', { data: { email, password } });
    const body = await res.json();
    if (!res.ok()) {
    throw new Error(`Get token failed: ${res.status()} ${JSON.stringify(body)}`);
    }
    await ctx.dispose();
    return body.data.accessToken;
}

export async function createProduct(token: string, body: object): Promise<APIResponse> {
    const ctx = await request.newContext({ baseURL: BASE_URL });
    return await ctx.post('/api/products', {
    headers: { Authorization: `Bearer ${token}` },
    data: body,
    });
}

export async function deleteProduct(token: string, id: string | number): Promise<APIResponse> {
    const ctx = await request.newContext({ baseURL: BASE_URL });
    return await ctx.delete(`/api/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    });
}