import type { Metadata } from 'next';
import ContactForm from '@/components/contact-form';

export const metadata: Metadata = {
    title: 'Contact — RVJP',
    description:
        'Questions, offers of help, press enquiries or partnerships — get in touch with RVJP. Every message is read by a person.',
    openGraph: {
        title: 'Contact — RVJP',
        description:
            'Get in touch with RVJP. Every message is read by a person, not an automated inbox.',
        type: 'website',
        locale: 'en_IN',
        siteName: 'RVJP',
    },
};

export default function ContactPage() {
    return <ContactForm />;
}
