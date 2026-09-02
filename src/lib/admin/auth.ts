/**
 * DUMMY AUTH — placeholder until the backend lands.
 *
 * The session cookie carries the username in plain base64 and is not signed, so
 * anyone can forge one. That is acceptable for a demo panel over dummy data and
 * NOT acceptable once real submissions are behind it. When the backend arrives,
 * replace `verifyCredentials` with a real lookup + password hash check, and
 * `readSession` with a signed/encrypted session token.
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const SESSION_COOKIE = 'rvjp_admin_session';

export interface AdminSession {
    username: string;
    name: string;
    role: string;
}

/** PLACEHOLDER ACCOUNTS. Delete these the moment real auth exists. */
const demoAccounts: Array<AdminSession & { password: string }> = [
    {
        username: 'admin',
        password: 'rvjp@2026',
        name: 'Aarti Deshpande',
        role: 'Administrator',
    },
    {
        username: 'editor',
        password: 'rvjp@2026',
        name: 'Editorial Desk',
        role: 'Editor',
    },
];

export function verifyCredentials(
    username: string,
    password: string,
): AdminSession | null {
    const account = demoAccounts.find(
        (a) => a.username === username.trim().toLowerCase() && a.password === password,
    );
    if (!account) return null;
    return { username: account.username, name: account.name, role: account.role };
}

export function encodeSession(session: AdminSession): string {
    return Buffer.from(JSON.stringify(session), 'utf8').toString('base64url');
}

function decodeSession(value: string): AdminSession | null {
    try {
        const parsed = JSON.parse(
            Buffer.from(value, 'base64url').toString('utf8'),
        ) as Partial<AdminSession>;
        if (!parsed.username || !parsed.name || !parsed.role) return null;
        return parsed as AdminSession;
    } catch {
        return null;
    }
}

/** The current session, or null when signed out. */
export async function getSession(): Promise<AdminSession | null> {
    const value = (await cookies()).get(SESSION_COOKIE)?.value;
    return value ? decodeSession(value) : null;
}

/** Guard for admin pages and server actions. Redirects when signed out. */
export async function requireSession(): Promise<AdminSession> {
    const session = await getSession();
    if (!session) redirect('/admin/login');
    return session;
}
