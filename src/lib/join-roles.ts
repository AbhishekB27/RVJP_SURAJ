/**
 * The ways someone can take part. Shared by the home-page Join section and the
 * /join page, so the four options can never drift apart.
 */

export interface JoinRole {
    /** Also the ?role= value the home section deep-links with. */
    id: string;
    n: string;
    title: string;
    note: string;
    /** Shown on the /join page only — what taking this on actually involves. */
    detail: string;
}

export const roles: JoinRole[] = [
    {
        id: 'volunteer',
        n: '01',
        title: 'Volunteer',
        note: 'Work on-ground campaigns, awareness drives and community camps.',
        detail:
            'You will be put in touch with the nearest local team. Most volunteers give a few hours a month; some give a weekend, some give an evening a week. All of it counts.',
    },
    {
        id: 'amplify',
        n: '02',
        title: 'Amplify',
        note: 'Carry resources and survivor stories to the people around you.',
        detail:
            'The lowest-friction way in, and one of the most useful. You get our resources first, and help them travel further than we can reach on our own.',
    },
    {
        id: 'support',
        n: '03',
        title: 'Support',
        note: 'Fund legal aid, counselling and the outreach that reaches further.',
        detail:
            'Contributions go towards legal aid, counselling sessions and getting our teams to places they otherwise could not afford to reach.',
    },
    {
        id: 'legal-aid',
        n: '04',
        title: 'Legal aid',
        note: 'Offer pro-bono help through our network of advocates.',
        detail:
            'For practising advocates and law students. You choose how many matters you can take on, and you are never assigned anything without being asked first.',
    },
];

export function getRole(id: string | undefined) {
    return roles.find((role) => role.id === id);
}
