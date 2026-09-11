const RELATIVE = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

/**
 * "3 hours ago", "last week". Takes `now` so callers can pass a value fixed at
 * mount — recomputing it during render would make the server and client
 * disagree by however long the request took.
 */
export function relativeTime(iso: string, now: number): string {
    const elapsed = new Date(iso).getTime() - now;
    const abs = Math.abs(elapsed);

    if (abs < MINUTE) return 'just now';
    if (abs < HOUR) return RELATIVE.format(Math.round(elapsed / MINUTE), 'minute');
    if (abs < DAY) return RELATIVE.format(Math.round(elapsed / HOUR), 'hour');
    if (abs < WEEK) return RELATIVE.format(Math.round(elapsed / DAY), 'day');
    if (abs < 4 * WEEK) return RELATIVE.format(Math.round(elapsed / WEEK), 'week');

    return new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

/** Full timestamp for tooltips and the detail header. */
export function absoluteTime(iso: string): string {
    return new Date(iso).toLocaleString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}
