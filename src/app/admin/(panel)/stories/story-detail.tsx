'use client';

import { useState } from 'react';
import {
    ArrowLeft,
    BadgeCheck,
    CalendarDays,
    Check,
    Clock,
    Copy,
    FileText,
    Globe,
    Mail,
    MonitorSmartphone,
    ShieldCheck,
    Tag,
    Trash2,
    TriangleAlert,
    X,
    type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { absoluteTime, relativeTime } from '@/lib/format-time';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { categoryStyle, type CategoryColor } from '@/lib/categories';
import type { StoryDTO, StoryStatus } from '@/lib/stories';

import { STATUS_STYLE, avatarTint, initials } from './story-styles';

export function StoryDetail({
    story,
    now,
    categoryColors,
    isPending,
    error,
    onModerate,
    onDelete,
    onBack,
}: {
    story: StoryDTO;
    now: number;
    /** Category name → colour token, from /admin/categories. */
    categoryColors: Record<string, CategoryColor>;
    isPending: boolean;
    error: string | null;
    onModerate: (status: StoryStatus) => void;
    onDelete: () => void;
    onBack: () => void;
}) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const displayName = story.isAnonymous
        ? 'Anonymous'
        : (story.name ?? 'Name not given');

    const copyStory = async () => {
        try {
            await navigator.clipboard.writeText(story.story);
            setCopied(true);
            // The card remounts on selection change, so a stray timer cannot
            // land on a different story's state.
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard access can be refused (insecure origin, denied
            // permission). Nothing useful to say — the icon just stays put.
        }
    };

    // Paragraph breaks are what the submitter typed; blank lines separate them.
    const paragraphs = story.story.split(/\n{2,}/).filter((p) => p.trim());

    return (
        <div className="flex h-full flex-col">
            <header className="shrink-0 border-b border-border px-5 py-4 lg:px-6">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={onBack}
                        aria-label="Back to list"
                        className="lg:hidden"
                    >
                        <ArrowLeft aria-hidden="true" />
                    </Button>

                    <Avatar size="lg" className="size-11">
                        <AvatarFallback
                            className={cn(
                                'font-medium',
                                story.isAnonymous
                                    ? 'bg-muted text-muted-foreground'
                                    : avatarTint(displayName),
                            )}
                        >
                            {story.isAnonymous ? (
                                <ShieldCheck className="size-5" aria-hidden="true" />
                            ) : (
                                initials(displayName)
                            )}
                        </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                        <h2 className="flex items-center gap-1.5 text-[15px] font-semibold">
                            {displayName}
                            {!story.isAnonymous ? (
                                <BadgeCheck
                                    className="size-4 fill-[#4f7cff] text-card"
                                    aria-label="Contact details provided"
                                />
                            ) : null}
                        </h2>

                        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail className="size-3.5" aria-hidden="true" />
                            {story.contact ?? 'No contact provided'}
                        </p>
                    </div>

                    {/* Timestamp over IP, matching the two-line meta column. */}
                    <div className="space-y-1">
                        <p
                            className="flex items-center gap-1.5 text-xs text-muted-foreground"
                            title={absoluteTime(story.createdAt)}
                            suppressHydrationWarning
                        >
                            <Clock className="size-3.5" aria-hidden="true" />
                            {relativeTime(story.createdAt, now)}
                        </p>
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Globe className="size-3.5" aria-hidden="true" />
                            IP: {story.ip ?? 'not recorded'}
                        </p>
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        <Chip className={categoryStyle(categoryColors[story.category])}>
                            <Tag className="mr-1 size-3" aria-hidden="true" />
                            {story.category}
                        </Chip>
                        <Chip className={cn('capitalize', STATUS_STYLE[story.status])}>
                            <Clock className="mr-1 size-3" aria-hidden="true" />
                            {story.status}
                        </Chip>
                    </div>
                </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto p-5 lg:p-6">
                <section className="rounded-xl border border-border bg-background/40">
                    <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
                        <h3 className="flex items-center gap-2 text-sm font-medium">
                            <FileText
                                className="size-4 text-muted-foreground"
                                aria-hidden="true"
                            />
                            Story / Report
                        </h3>

                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={copyStory}
                            aria-label={copied ? 'Story copied' : 'Copy story text'}
                            className="ml-auto text-muted-foreground hover:text-foreground"
                        >
                            {/* The icon swap is the confirmation — a toast would be
                                heavier than the action deserves. */}
                            {copied ? (
                                <Check className="text-emerald-400" aria-hidden="true" />
                            ) : (
                                <Copy aria-hidden="true" />
                            )}
                        </Button>
                    </div>

                    <div className="space-y-4 px-5 py-5">
                        {paragraphs.map((paragraph, index) => (
                            <p
                                // Paragraphs have no ids and can repeat, so the index
                                // is the only stable key available here.
                                key={index}
                                className="text-[0.9rem] leading-[1.75] whitespace-pre-wrap text-foreground/85"
                            >
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </section>

                <section className="mt-4 rounded-xl border border-border bg-background/40">
                    <h3 className="flex items-center gap-2 border-b border-border px-5 py-3.5 text-sm font-medium">
                        <Tag className="size-4 text-muted-foreground" aria-hidden="true" />
                        Additional information
                    </h3>

                    <dl className="grid grid-cols-2 gap-y-5 px-5 py-5 lg:grid-cols-4 lg:divide-x lg:divide-border">
                        <Meta icon={CalendarDays} label="Reported at">
                            <span suppressHydrationWarning>
                                {absoluteTime(story.createdAt)}
                            </span>
                        </Meta>

                        <Meta icon={Tag} label="Category" className="lg:pl-5">
                            <Chip className={categoryStyle(categoryColors[story.category])}>
                                {story.category}
                            </Chip>
                        </Meta>

                        <Meta icon={Globe} label="IP address" className="lg:pl-5">
                            <span className="font-mono text-xs">
                                {story.ip ?? 'Not recorded'}
                            </span>
                        </Meta>

                        <Meta
                            icon={MonitorSmartphone}
                            label="Submitted as"
                            className="lg:pl-5"
                        >
                            {story.isAnonymous ? 'Anonymous' : 'Identified'}
                            <span className="ml-1.5 text-muted-foreground">
                                · {story.story.length.toLocaleString('en-IN')} chars
                            </span>
                        </Meta>
                    </dl>
                </section>
            </div>

            {error ? (
                <p
                    role="alert"
                    className="shrink-0 border-t border-destructive/30 bg-destructive/10 px-5 py-3 text-sm font-medium text-destructive lg:px-6"
                >
                    {error}
                </p>
            ) : null}

            <footer className="flex shrink-0 flex-wrap items-center gap-3 border-t border-border px-5 py-3.5 lg:px-6">
                <p className="hidden items-center gap-3 text-xs text-muted-foreground lg:flex">
                    <span className="flex items-center gap-1.5">
                        <Kbd>A</Kbd> Approve
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Kbd>R</Kbd> Reject
                    </span>
                </p>

                <div className="ml-auto flex items-center gap-2">
                    <Button
                        disabled={isPending || story.status === 'approved'}
                        onClick={() => onModerate('approved')}
                        className="min-w-[7.5rem] bg-emerald-600 text-white hover:bg-emerald-500"
                    >
                        <Check aria-hidden="true" />
                        Approve
                    </Button>

                    <Button
                        variant="outline"
                        disabled={isPending || story.status === 'rejected'}
                        onClick={() => onModerate('rejected')}
                        className="min-w-[7.5rem] border-rose-500/40 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                    >
                        <X aria-hidden="true" />
                        Reject
                    </Button>

                    <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                        <AlertDialogTrigger
                            render={<Button variant="ghost" size="icon" />}
                            disabled={isPending}
                            aria-label="Delete this story"
                            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                            <Trash2 aria-hidden="true" />
                        </AlertDialogTrigger>

                        {/* `size="sm"` is doing real work, not just sizing: at the
                            default size the header left-aligns from `sm:` up and the
                            footer becomes a right-aligned row. The small size keeps
                            the header centred and lays the footer out as two equal
                            columns — the centred, split-button shape this wants.
                            Width is then reclaimed with `!`, because the built-in cap
                            carries a data-attribute selector and wins on specificity. */}
                        <AlertDialogContent
                            size="sm"
                            className="w-[calc(100%-2rem)] max-w-sm! gap-0 p-6"
                        >
                            <AlertDialogHeader className="gap-0">
                                <AlertDialogMedia className="mb-5 size-14 rounded-full bg-destructive/10 *:[svg:not([class*='size-'])]:size-7">
                                    <TriangleAlert
                                        className="text-destructive"
                                        aria-hidden="true"
                                    />
                                </AlertDialogMedia>

                                <AlertDialogTitle className="text-lg font-semibold">
                                    Delete this story?
                                </AlertDialogTitle>

                                <AlertDialogDescription className="mt-2 leading-relaxed text-balance">
                                    This permanently erases the submission and cannot
                                    be undone. To take it off the site while keeping
                                    the record, reject it instead.
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            {/* The component's footer is a full-bleed muted bar with
                                negative margins. These references sit the buttons on
                                the dialog surface, so that bar is undone here. */}
                            <AlertDialogFooter className="mx-0 mt-6 mb-0 gap-3 border-t-0 bg-transparent p-0">
                                <AlertDialogCancel
                                    disabled={isPending}
                                    size="lg"
                                    className="w-full"
                                >
                                    No, keep it
                                </AlertDialogCancel>
                                {/* AlertDialogAction is a plain Button, not a Close,
                                    so the dialog is dismissed by hand. */}
                                <AlertDialogAction
                                    disabled={isPending}
                                    size="lg"
                                    onClick={() => {
                                        setConfirmOpen(false);
                                        onDelete();
                                    }}
                                    className="w-full bg-destructive text-white hover:bg-destructive/90"
                                >
                                    Yes, delete it
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </footer>
        </div>
    );
}

function Chip({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <span
            className={cn(
                'inline-flex w-fit items-center rounded-md border px-2 py-1 text-[11px] font-medium whitespace-nowrap',
                className,
            )}
        >
            {children}
        </span>
    );
}

function Meta({
    icon: Icon,
    label,
    className,
    children,
}: {
    icon: LucideIcon;
    label: string;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div className={cn('min-w-0', className)}>
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon className="size-3.5" aria-hidden="true" />
                {label}
            </dt>
            <dd className="mt-1.5 text-[13px] text-foreground/85">{children}</dd>
        </div>
    );
}

function Kbd({ children }: { children: React.ReactNode }) {
    return (
        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-sans text-[10px] text-foreground/70">
            {children}
        </kbd>
    );
}
