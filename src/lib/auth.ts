import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'bondy-super-secret-jwt-key-2026';

export function hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}

export function verifyPassword(password: string, combinedHash: string): boolean {
    const [salt, originalHash] = combinedHash.split(':');
    if (!salt || !originalHash) return false;
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === originalHash;
}

export function generateToken(payload: { userId: string; email: string }): string {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const body = Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 })).toString('base64url');
    const signature = crypto
        .createHmac('sha256', JWT_SECRET)
        .update(`${header}.${body}`)
        .digest('base64url');
    return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): { userId: string; email: string } | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const [header, body, signature] = parts;
        const validSignature = crypto
            .createHmac('sha256', JWT_SECRET)
            .update(`${header}.${body}`)
            .digest('base64url');

        if (signature !== validSignature) return null;

        const decodedBody = JSON.parse(Buffer.from(body, 'base64url').toString());
        if (decodedBody.exp && decodedBody.exp < Math.floor(Date.now() / 1000)) {
            return null;
        }
        return decodedBody;
    } catch {
        return null;
    }
}

export function getUserIdFromRequest(req: Request): string | null {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    return payload ? payload.userId : null;
}