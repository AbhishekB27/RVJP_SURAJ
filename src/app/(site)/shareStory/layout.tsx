import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Share Your Story — RVJP",
    description:
        "Share your experience with RVJP anonymously or under your name. Every submission is reviewed with care and is never published without your consent.",
    openGraph: {
        title: "Share Your Story — RVJP",
        description:
            "A safe, confidential space to be heard. Share anonymously, on your own terms.",
        type: "website",
        locale: "en_IN",
        siteName: "RVJP",
    },
};

export default function ShareStoryLayout({ children }: LayoutProps<"/shareStory">) {
    return children;
}
