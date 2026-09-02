/**
 * Donation options for /donate.
 *
 * Tier labels are names, not impact claims — "₹500 buys a counselling session"
 * is a promise the organisation would have to be able to account for.
 */

export const amounts = [500, 1000, 2500, 5000];

export const tiers = [
    { amount: 500, label: 'Supporter' },
    { amount: 1000, label: 'Ally' },
    { amount: 2500, label: 'Advocate' },
    { amount: 5000, label: 'Patron' },
];

/** `sentence` is how the option reads inside the running statement on /donate. */
export const frequencies = [
    { id: 'once', label: 'Once', sentence: 'just this once', perYear: 0 },
    { id: 'monthly', label: 'Monthly', sentence: 'every month', perYear: 12 },
    { id: 'quarterly', label: 'Quarterly', sentence: 'every quarter', perYear: 4 },
    { id: 'yearly', label: 'Yearly', sentence: 'every year', perYear: 1 },
];

export const allocations = [
    {
        n: '01',
        title: 'Legal aid',
        note: 'Court fees, documentation and advocates for people who cannot pay.',
    },
    {
        n: '02',
        title: 'Counselling',
        note: 'Trained support for survivors, for as long as they need it.',
    },
    {
        n: '03',
        title: 'Outreach',
        note: 'Getting teams to the districts we otherwise could not afford to reach.',
    },
];

export const funds = [
    'Wherever it is needed most',
    ...allocations.map((a) => a.title),
];

/**
 * PLACEHOLDER FIGURES — these are public fundraising claims. Put the real
 * numbers in before launch, or set `show: false` to drop the progress bar
 * entirely until there is something true to show.
 */
export const campaign = {
    show: true,
    raised: 486_000,
    goal: 1_000_000,
};

/** Formats to the Indian numbering system: 250000 → 2,50,000. */
export const inr = (value: number) => value.toLocaleString('en-IN');
