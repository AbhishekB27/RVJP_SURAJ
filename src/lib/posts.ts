/**
 * Blog content, shared by the home-page section, the index at /blog and the
 * article pages at /blog/[slug]. Placeholder editorial copy — review and
 * replace before launch.
 */

/** Unsplash CDN. Free licence, no attribution required. */
const unsplash = (id: string, w = 1000, h = 625) =>
    `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&crop=entropy&q=70&fm=jpg`;

export interface BlogPost {
    slug: string;
    category: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    author: string;
    image: string;
    /** Wide crop for the article hero. */
    hero: string;
    /** Describes the photo itself — the title already carries the article. */
    alt: string;
    body: string[];
}

export const posts: BlogPost[] = [
    {
        slug: 'why-survivors-stay-silent',
        category: 'Awareness',
        title: 'Why survivors stay silent — and how we change that',
        excerpt:
            'Silence is rarely about weakness. It’s about fear, shame, and a system that hasn’t always listened. Here’s what actually helps someone come forward.',
        date: 'Aug 12, 2026',
        readTime: '6 min read',
        author: 'Editorial Team',
        image: unsplash('photo-1512404682926-1261456aa399'),
        hero: unsplash('photo-1512404682926-1261456aa399', 1600, 900),
        alt: 'Marchers holding placards at a women’s rights demonstration',
        body: [
            'The first thing to understand about silence is that it is usually a decision, not an absence of one. People weigh what speaking will cost them — at home, at work, in their community — against what it might gain. When the cost looks higher, silence is the rational choice. Changing that means changing the cost, not lecturing people about courage.',
            'Fear of not being believed comes up more than anything else. Many people have already tested the waters once — a hint dropped to a friend, a half-sentence to a relative — and watched the reaction. A raised eyebrow, a question about what they were wearing, a quick change of subject. That single moment can close the door for years.',
            'What helps is simpler than most people expect. Believe the person in front of you, and say so out loud. Do not open with questions that sound like cross-examination. Do not rush to fix it, report it, or tell anyone else — the decision about what happens next belongs to them, and taking it away repeats the original harm in a smaller form.',
            'Ask what they need rather than assuming. Sometimes it is information. Sometimes it is company on a difficult day. Often it is just to have said the thing out loud to someone who did not flinch. Offer to stay available, then actually stay available; the days and weeks after a disclosure matter more than the conversation itself.',
            'RVJP exists to widen that door. Every campaign, resource and conversation we run is aimed at the same thing — making it a little less expensive to speak, and a little harder for anyone to look away.',
        ],
    },
    {
        slug: 'filing-your-first-complaint',
        category: 'Legal',
        title: 'A plain-language guide to filing your first complaint',
        excerpt:
            'The legal process can feel like a maze. We break down the first three steps — what to expect, what to bring, and who to call.',
        date: 'Aug 5, 2026',
        readTime: '8 min read',
        author: 'Legal Desk',
        image: unsplash('photo-1562564055-71e051d33c19'),
        hero: unsplash('photo-1562564055-71e051d33c19', 1600, 900),
        alt: 'Two people going through paperwork together at a desk',
        body: [
            'This is general orientation, not legal advice. Procedure differs by state and by the specifics of a case, and nothing here replaces a conversation with a lawyer or with our legal desk. What it can do is make the first few steps feel less unfamiliar.',
            'The process feels like a maze mostly because it is unfamiliar, not because you are doing it wrong. Rooms are noisy, forms use language nobody speaks, and people move faster than you can follow. None of that is a signal about your case. It is simply what an overloaded system looks like from the inside.',
            'Before anything else, write down what you remember while you still remember it — dates, times, places, who was present, what was said. Keep it factual and keep it somewhere private. Memory for detail fades quickly under stress, and a contemporaneous note written for yourself is far easier to work from later than a reconstruction months on.',
            'You do not have to go alone. Bringing someone — a friend, a relative, a support worker — changes the experience considerably. They can hold paperwork, take notes while you talk, and remember what was said when you cannot. If you would rather not involve anyone you know, ask us and we will arrange for someone to go with you.',
            'Finally, ask for a copy of everything you sign, and note down the name of the person you spoke to and the date. If something seems wrong or you are turned away, that record is what lets us or a lawyer take it further on your behalf.',
            'Our legal desk can walk you through your specific situation. Nothing you tell us is shared without your consent.',
        ],
    },
    {
        slug: 'small-town-support-group',
        category: 'Community',
        title: 'How one small-town support group grew into a movement',
        excerpt:
            'It started with five women meeting in a living room. Two years later, it’s a network across three states. This is how it happened.',
        date: 'Jul 29, 2026',
        readTime: '5 min read',
        author: 'Field Reports',
        image: unsplash('photo-1582213782179-e0d53f98f2ca'),
        hero: unsplash('photo-1582213782179-e0d53f98f2ca', 1600, 900),
        alt: 'A group of people stacking their hands together in a circle',
        body: [
            'It began without a plan. Five women, one living room, a standing Thursday evening. No agenda, no facilitator, no funding. The only rule was the one they set in the first week: whatever is said here does not leave here.',
            'That rule turned out to be the whole foundation. Trust is not a nice-to-have in this work — it is the product. Every decision the group made afterwards was measured against whether it would protect or erode the confidence people had placed in the room.',
            'Growth was slow and entirely by word of mouth. A sister brought a sister. A colleague mentioned it to someone at work. By the end of the first year there were two evenings a week and a waiting list, which forced the first real decision: split into smaller groups rather than let any single room get too large to be safe.',
            'That instinct — keep the unit small, replicate it rather than scale it — is what let the model travel. There are now more than twenty rooms across three states. None of them is run centrally. Each one holds the same rule from that first Thursday, and that is mostly what they have in common.',
            'If you are thinking about starting something similar where you live, you need far less than you think. A room, a fixed time, and a promise you intend to keep. Get in touch and we will help with the rest.',
        ],
    },
];

export function getPost(slug: string) {
    return posts.find((post) => post.slug === slug);
}
