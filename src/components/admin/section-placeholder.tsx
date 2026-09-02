/**
 * Placeholder masthead for a section that has not been built yet. Each nav
 * entry renders this with its own name until we decide what goes inside.
 */
export function SectionPlaceholder({ title }: { title: string }) {
    return (
        <h1 className="font-display text-[1.75rem] uppercase leading-none tracking-[0.01em] sm:text-3xl lg:text-4xl">
            {title}
        </h1>
    );
}
