import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'bondy-super-secret-jwt-key-2026';
const ADMIN_MASTER_PASSWORD = process.env.ADMIN_MASTER_PASSWORD || 'bondyAdmin2026!';

export function verifyAdminMasterPassword(password: string): boolean {
    return password === ADMIN_MASTER_PASSWORD;
}

export function generateAdminSessionToken(): string {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const body = Buffer.from(
        JSON.stringify({
            role: 'admin',
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours expiry
        })
    ).toString('base64url');

    const signature = crypto
        .createHmac('sha256', JWT_SECRET)
        .update(`${header}.${body}`)
        .digest('base64url');

    return `${header}.${body}.${signature}`;
}

export function verifyAdminSessionToken(token: string): boolean {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return false;
        const [header, body, signature] = parts;

        const validSignature = crypto
            .createHmac('sha256', JWT_SECRET)
            .update(`${header}.${body}`)
            .digest('base64url');

        if (signature !== validSignature) return false;

        const decodedBody = JSON.parse(Buffer.from(body, 'base64url').toString());
        if (decodedBody.role !== 'admin') return false;
        if (decodedBody.exp && decodedBody.exp < Math.floor(Date.now() / 1000)) return false;

        return true;
    } catch {
        return false;
    }
}