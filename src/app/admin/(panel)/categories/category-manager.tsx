'use client';

import { useActionState, useEffect, useRef, useState, useTransition } from 'react';
import {
    ChevronDown,
    ChevronUp,
    Check,
    Loader2,
    Pencil,
    Plus,
    Tag,
    Trash2,
    TriangleAlert,
    X,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
} from '@/components/ui/alert-dialog';
import {
    CATEGORY_COLORS,
    CATEGORY_COLOR_STYLE,
    CATEGORY_COLOR_SWATCH,
    MAX_CATEGORY_NAME,
    type CategoryColor,
    type CategoryDTO,
} from '@/lib/categories';

import {
    createCategory,
    deleteCategory,
    moveCategory,
    renameCategory,
    updateCategory,
} from './actions';

export function CategoryManager({ categories }: { categories: CategoryDTO[] }) {
    const [state, formAction, creating] = useActionState(createCategory, {
        error: null,
    });
    const [newColor, setNewColor] = useState<CategoryColor>('violet');
    const formRef = useRef<HTMLFormElement>(null);

    // Clear the field only once the action has actually succeeded, so a
    // rejected name (duplicate, too long) is still there to correct.
    const succeeded = !creating && state.error === null;
    useEffect(() => {
        if (succeeded) formRef.current?.reset();
    }, [succeeded, categories.length]);

    return (
        <div className="space-y-6">
            <form
                ref={formRef}
                action={formAction}
                className="rounded-xl border border-border bg-card p-4"
            >
                <label
                    htmlFor="new-category"
                    className="text-[13px] font-medium"
                >
                    Add a category
                </label>
                <p className="mt-1 text-xs text-muted-foreground">
                    It appears on the share-your-story form straight away.
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Input
                        id="new-category"
                        name="name"
                        required
                        maxLength={MAX_CATEGORY_NAME}
                        placeholder="e.g. Stalking"
                        className="h-9 w-full sm:w-64"
                    />

                    {/* The colour travels with the form as a hidden field, so the
                        action still works if JavaScript never loads. */}
                    <input type="hidden" name="color" value={newColor} />
                    <ColorPicker value={newColor} onChange={setNewColor} />

                    <Button type="submit" disabled={creating} className="h-9">
                        {creating ? (
                            <Loader2 className="animate-spin" aria-hidden="true" />
                        ) : (
                            <Plus aria-hidden="true" />
                        )}
                        Add
                    </Button>
                </div>

                {state.error ? (
                    <p
                        role="alert"
                        className="mt-3 text-[13px] font-medium text-destructive"
                    >
                        {state.error}
                    </p>
                ) : null}
            </form>

            <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                    <Tag className="size-4 text-muted-foreground" aria-hidden="true" />
                    <h2 className="text-sm font-medium">
                        Categories
                        <span className="ml-2 text-muted-foreground tabular-nums">
                            {categories.length}
                        </span>
                    </h2>
                </div>

                {categories.length === 0 ? (
                    <p className="px-4 py-12 text-center text-sm text-muted-foreground">
                        No categories yet. Add the first one above.
                    </p>
                ) : (
                    <ul>
                        {categories.map((category, index) => (
                            <CategoryRow
                                key={category.id}
                                category={category}
                                isFirst={index === 0}
                                isLast={index === categories.length - 1}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

function CategoryRow({
    category,
    isFirst,
    isLast,
}: {
    category: CategoryDTO;
    isFirst: boolean;
    isLast: boolean;
}) {
    const [isPending, startTransition] = useTransition();
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(category.name);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const run = (fn: () => Promise<void>) => {
        setError(null);
        startTransition(async () => {
            try {
                await fn();
            } catch (cause) {
                // These actions throw messages written for a person to read —
                // "3 stories use this category…" — so they are surfaced as-is.
                setError(
                    cause instanceof Error
                        ? cause.message
                        : 'That did not go through. Please try again.',
                );
            }
        });
    };

    const saveName = () => {
        const trimmed = name.trim();
        if (!trimmed || trimmed === category.name) {
            setEditing(false);
            setName(category.name);
            return;
        }
        setEditing(false);
        run(() => renameCategory(category.id, trimmed));
    };

    return (
        <li
            className={cn(
                'border-b border-border/60 px-4 py-3 transition-opacity last:border-b-0',
                isPending && 'opacity-60',
            )}
        >
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        disabled={isFirst || isPending}
                        onClick={() => run(() => moveCategory(category.id, 'up'))}
                        aria-label={`Move ${category.name} up`}
                        className="text-muted-foreground"
                    >
                        <ChevronUp aria-hidden="true" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        disabled={isLast || isPending}
                        onClick={() => run(() => moveCategory(category.id, 'down'))}
                        aria-label={`Move ${category.name} down`}
                        className="text-muted-foreground"
                    >
                        <ChevronDown aria-hidden="true" />
                    </Button>
                </div>

                {editing ? (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            saveName();
                        }}
                        className="flex items-center gap-2"
                    >
                        <Input
                            autoFocus
                            value={name}
                            maxLength={MAX_CATEGORY_NAME}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                    setEditing(false);
                                    setName(category.name);
                                }
                            }}
                            aria-label="Category name"
                            className="h-8 w-48"
                        />
                        <Button type="submit" size="icon-sm" aria-label="Save name">
                            <Check aria-hidden="true" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Cancel"
                            onClick={() => {
                                setEditing(false);
                                setName(category.name);
                            }}
                        >
                            <X aria-hidden="true" />
                        </Button>
                    </form>
                ) : (
                    <>
                        <span
                            className={cn(
                                'inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-medium',
                                CATEGORY_COLOR_STYLE[category.color],
                                !category.isActive && 'opacity-50',
                            )}
                        >
                            {category.name}
                        </span>

                        <Button
                            variant="ghost"
                            size="icon-xs"
                            disabled={isPending}
                            onClick={() => setEditing(true)}
                            aria-label={`Rename ${category.name}`}
                            className="text-muted-foreground"
                        >
                            <Pencil aria-hidden="true" />
                        </Button>

                        <span className="text-xs text-muted-foreground tabular-nums">
                            {category.storyCount}{' '}
                            {category.storyCount === 1 ? 'story' : 'stories'}
                        </span>
                    </>
                )}

                <div className="ml-auto flex items-center gap-2">
                    <ColorPicker
                        value={category.color}
                        disabled={isPending}
                        onChange={(color) =>
                            run(() => updateCategory(category.id, { color }))
                        }
                    />

                    {/* Off rather than deleted is the safe default once a category
                        has stories: they keep their label, it stops being offered. */}
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        onClick={() =>
                            run(() =>
                                updateCategory(category.id, {
                                    isActive: !category.isActive,
                                }),
                            )
                        }
                        className={cn(
                            'w-20',
                            category.isActive
                                ? 'border-emerald-500/40 text-emerald-400'
                                : 'text-muted-foreground',
                        )}
                    >
                        {category.isActive ? 'On' : 'Off'}
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={isPending}
                        onClick={() => setConfirmOpen(true)}
                        aria-label={`Delete ${category.name}`}
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                        <Trash2 aria-hidden="true" />
                    </Button>
                </div>
            </div>

            {error ? (
                <p
                    role="alert"
                    className="mt-2 text-[13px] font-medium text-destructive"
                >
                    {error}
                </p>
            ) : null}

            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
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
                            Delete “{category.name}”?
                        </AlertDialogTitle>

                        <AlertDialogDescription className="mt-2 leading-relaxed text-balance">
                            {category.storyCount > 0
                                ? `${category.storyCount} ${
                                      category.storyCount === 1
                                          ? 'story uses'
                                          : 'stories use'
                                  } this category, so it cannot be deleted. Turn it off instead.`
                                : 'It will stop being offered on the share-your-story form. This cannot be undone.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="mx-0 mt-6 mb-0 gap-3 border-t-0 bg-transparent p-0">
                        <AlertDialogCancel size="lg" className="w-full">
                            {category.storyCount > 0 ? 'Close' : 'No, keep it'}
                        </AlertDialogCancel>
                        {category.storyCount === 0 ? (
                            <AlertDialogAction
                                size="lg"
                                disabled={isPending}
                                onClick={() => {
                                    setConfirmOpen(false);
                                    run(() => deleteCategory(category.id));
                                }}
                                className="w-full bg-destructive text-white hover:bg-destructive/90"
                            >
                                Yes, delete it
                            </AlertDialogAction>
                        ) : null}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </li>
    );
}

function ColorPicker({
    value,
    onChange,
    disabled,
}: {
    value: CategoryColor;
    onChange: (color: CategoryColor) => void;
    disabled?: boolean;
}) {
    return (
        <div
            role="radiogroup"
            aria-label="Category colour"
            className="flex items-center gap-1"
        >
            {CATEGORY_COLORS.map((color) => (
                <button
                    key={color}
                    type="button"
                    role="radio"
                    aria-checked={value === color}
                    aria-label={color}
                    disabled={disabled}
                    onClick={() => onChange(color)}
                    className={cn(
                        'size-5 rounded-full transition-transform disabled:opacity-50',
                        CATEGORY_COLOR_SWATCH[color],
                        value === color
                            ? 'ring-2 ring-foreground/70 ring-offset-2 ring-offset-card'
                            : 'opacity-60 hover:scale-110 hover:opacity-100',
                    )}
                />
            ))}
        </div>
    );
}
