import type { Metadata } from 'next';
import JoinForm from '@/components/join-form';
import { getRole } from '@/lib/join-roles';

export const metadata: Metadata = {
    title: 'Join the Movement — RVJP',
    description:
        'Volunteer, amplify, support or offer legal aid. Whether you have five minutes or five hours a week, there is a place for you at RVJP.',
    openGraph: {
        title: 'Join the Movement — RVJP',
        description:
            'Pick the part that fits your life — volunteer, amplify, support, or offer pro-bono legal aid.',
        type: 'website',
        locale: 'en_IN',
        siteName: 'RVJP',
    },
};

export default async function JoinPage(props: PageProps<'/join'>) {
    const { role } = await props.searchParams;

    // ?role= comes from the home page's four cards; anything unrecognised is
    // dropped so the form simply opens with nothing preselected.
    const preset = typeof role === 'string' ? getRole(role)?.id : undefined;

    return <JoinForm initialRole={preset} />;
}
