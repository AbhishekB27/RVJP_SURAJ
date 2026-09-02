/**
 * Campaign programme. Placeholder editorial copy — review before launch.
 * Deliberately no participant counts or reach figures: those are claims the
 * organisation has to be able to stand behind.
 */

/** Unsplash CDN. Free licence, no attribution required. */
const unsplash = (id: string, w = 900, h = 1100) =>
    `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&crop=entropy&q=70&fm=jpg`;

export type CampaignStatus = 'Active' | 'Ongoing' | 'Upcoming';

export interface Campaign {
    id: string;
    n: string;
    title: string;
    /** Two or three words for the collapsed rail. */
    kicker: string;
    status: CampaignStatus;
    region: string;
    period: string;
    description: string;
    image: string;
    alt: string;
}

export const campaigns: Campaign[] = [
    {
        id: 'campus',
        n: '01',
        title: 'Break the silence on campus',
        kicker: 'Campus',
        status: 'Active',
        region: 'Colleges & universities',
        period: '2026',
        description:
            'Consent workshops and open sessions run inside colleges, built with student bodies rather than delivered at them. Every session ends with the one thing posters cannot do — a person in the room you can actually talk to afterwards.',
        image: unsplash('photo-1686624386665-4cd01b96d0f6'),
        alt: 'Students seated around a table working through printed material',
    },
    {
        id: 'know-your-rights',
        n: '02',
        title: 'Know your rights',
        kicker: 'Legal literacy',
        status: 'Active',
        region: 'District towns',
        period: '2026',
        description:
            'Plain-language legal literacy sessions, held in the language people actually speak at home. No jargon, no lecture — just what the law says, what a complaint involves, and who you can call when you need someone in your corner.',
        image: unsplash('photo-1560831340-b9679dc9e9f0'),
        alt: 'A group gathered around a table during a community session',
    },
    {
        id: 'listening-rooms',
        n: '03',
        title: 'Listening rooms',
        kicker: 'Support circles',
        status: 'Ongoing',
        region: 'Community spaces',
        period: 'Year-round',
        description:
            'Small, closed support circles with one rule carried over from the first room we ever ran: whatever is said here does not leave here. We keep the groups small on purpose, and start new ones rather than let any of them grow.',
        image: unsplash('photo-1642307063371-2e3e8909c3cb'),
        alt: 'People gathered together in a large room',
    },
    {
        id: 'safe-streets',
        n: '04',
        title: 'Safe streets audit',
        kicker: 'Street safety',
        status: 'Upcoming',
        region: 'With local bodies',
        period: 'Late 2026',
        description:
            'Volunteers walk their own neighbourhoods after dark and map what makes them unsafe — broken lighting, blind corners, stretches with nowhere to turn. The findings go to the people who can actually fix them, with names attached.',
        image: unsplash('photo-1524069290683-0457abfe42c3'),
        alt: 'A group photographed together outdoors in a neighbourhood',
    },
];
