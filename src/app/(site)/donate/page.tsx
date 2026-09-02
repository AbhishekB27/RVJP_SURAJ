import type { Metadata } from 'next';
import DonateForm from '@/components/donate-form';

export const metadata: Metadata = {
    title: 'Donate — RVJP',
    description:
        'Fund legal aid, counselling and outreach. Give once or monthly — you can cancel a monthly gift at any time.',
    openGraph: {
        title: 'Donate — RVJP',
        description:
            'Awareness is free to talk about and expensive to do. Fund the parts of this work that cannot run on goodwill alone.',
        type: 'website',
        locale: 'en_IN',
        siteName: 'RVJP',
    },
};

export default async function DonatePage(props: PageProps<'/donate'>) {
    const { amount } = await props.searchParams;

    // ?amount= comes from the home page's quick-give chips; anything that is not
    // a positive number is dropped and the form opens on its default.
    const parsed = typeof amount === 'string' ? Number(amount) : NaN;
    const initialAmount = Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;

    return <DonateForm initialAmount={initialAmount} />;
}
