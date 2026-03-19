import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link2, Loader2, Plus } from 'lucide-react';
import { createLink, type CreateLinkInput, createLinkSchema } from '@/lib/api/links';
import { parseValidationErrors } from '@/lib/form-validation-parser';
import { handleApiError } from '@/lib/axios';
import { useNavigate } from '@tanstack/react-router';
import { Separator } from '../ui/separator';

interface CreateLinkDialogProps {
    onSuccess?: () => void;
    children?: React.ReactNode;
}

export function CreateLinkDialog({ onSuccess, children }: CreateLinkDialogProps) {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const [serverErrors, setServerErrors] = useState<string[]>([])

    const navigate = useNavigate()


    const createLinkMutation = useMutation({
        mutationFn: createLink,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['links'], exact: false });

            setOpen(false);
            onSuccess?.();
        },
        onError: (error: any) => {
            const err = handleApiError(error)
            if (err.status === 400) {
                setServerErrors(err.message as string[])
                return
            }
            if (err.status === 401) {
                navigate({
                    to: "/"
                })
                return
            }
            setServerErrors([err.message as string])

        },
    });

    const form = useForm({
        defaultValues: {
            title: '',
            url: '',
            customSlug: '',
        } as CreateLinkInput,
        onSubmit: async ({ value }) => {
            if (value.customSlug?.length === 0) {
                value.customSlug = undefined
            }
            await createLinkMutation.mutateAsync(value);
        },
    });

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            form.reset();
        }
        setOpen(open);
    };


    let trigger: React.ReactNode
    if (children) {
        trigger = children
    } else {
        trigger = (
            <Button size="lg" >
                <Link2 className="mr-2 h-5 w-5" />
                Create your short link
            </Button>
        )
    }


    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger render={
                trigger

            } />
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Link</DialogTitle>
                    <DialogDescription>
                        Create a new shortened link. Fill in the details below.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="space-y-4"
                >
                    <form.Field
                        name="title"
                        validators={{
                            onChange: createLinkSchema.shape.title,
                        }}
                    >
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor={field.name}>Title</Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="My Portfolio"
                                    disabled={createLinkMutation.isPending}
                                />
                                {/* {field.state.meta.errors.length > 0 && (
                                    <div className="text-sm text-red-500 space-y-1">
                                        {field.state.meta.errors.map((error, index) => (
                                            <div key={index} className="flex items-center gap-1">
                                                <span>•</span>
                                                <span>{error?.message}</span>
                                            </div>
                                        ))}
                                    </div>
                                )} */}
                                {
                                    parseValidationErrors(field)
                                }
                            </div>
                        )}
                    </form.Field>

                    <form.Field
                        name="url"
                        validators={{
                            onChange: createLinkSchema.shape.url,
                        }}
                    >
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor={field.name}>URL</Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="https://example.com"
                                    type="url"
                                    disabled={createLinkMutation.isPending}
                                />
                                {
                                    parseValidationErrors(field)
                                }
                            </div>
                        )}
                    </form.Field>

                    <form.Field
                        name="customSlug"
                        validators={{
                            onChange: createLinkSchema.shape.customSlug,
                        }}
                    >
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor={field.name}>Custom Slug (Optional)</Label>
                                <div className="flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                                        shurl.com/
                                    </span>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="my-custom-slug"
                                        className="rounded-l-none"
                                        disabled={createLinkMutation.isPending}
                                    />
                                </div>
                                {
                                    parseValidationErrors(field)
                                }
                            </div>
                        )}
                    </form.Field>

                    {serverErrors?.length > 0 && (<>
                        <Separator />
                        <div className="text-sm text-red-500 space-y-1">
                            {
                                serverErrors.map((err) => {
                                    return (
                                        <div className="flex items-center gap-1">
                                            <span>•</span>
                                            <span>{err}</span>
                                        </div>

                                    )
                                })
                            }
                            {/* <div className="flex items-center gap-1">
                                <span>•</span>
                                <span>{error?.message}</span>
                            </div> */}
                        </div>
                    </>
                    )

                    }
                    {/* {createLinkMutation.isError && (
                        <Alert variant="destructive">
                            <AlertDescription>
                                {createLinkMutation.error?.message || 'An error occurred while creating the link'}
                            </AlertDescription>
                        </Alert>
                    )} */}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={createLinkMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <form.Subscribe
                            selector={(state) => [state.canSubmit, state.isSubmitting]}
                        >
                            {([canSubmit, isSubmitting]) => (
                                <Button
                                    type="submit"
                                    disabled={!canSubmit || isSubmitting || createLinkMutation.isPending}
                                >
                                    {createLinkMutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Link'
                                    )}
                                </Button>
                            )}
                        </form.Subscribe>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}