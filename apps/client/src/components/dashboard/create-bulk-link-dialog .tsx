import { useState } from 'react';
import { useForm, } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link2, Loader2, Plus, Trash2, X } from 'lucide-react';
import { createBulkLink, createBulkLinkSchema } from '@/lib/api/links';
import { handleApiError } from '@/lib/axios';
import { useNavigate } from '@tanstack/react-router';
import { Separator } from '../ui/separator';

interface CreateBulkLinkDialogProps {
    onSuccess?: () => void;
    children?: React.ReactNode;
}

interface LinkItem {
    url: string;
}

export function CreateBulkLinkDialog({ onSuccess, children }: CreateBulkLinkDialogProps) {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const [serverErrors, setServerErrors] = useState<string[]>([]);

    const navigate = useNavigate();

    const createBulkLinkMutation = useMutation({
        mutationFn: createBulkLink,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['links',], exact: false });
            setOpen(false);
            onSuccess?.();
        },
        onError: (error: any) => {
            const err = handleApiError(error);
            if (err.status === 400) {
                setServerErrors(err.message as string[]);
                return;
            }
            if (err.status === 401) {
                navigate({
                    to: "/"
                });
                return;
            }
            setServerErrors([err.message as string]);
        },
    });

    const form = useForm({
        defaultValues: {
            links: [{ url: '' }] as LinkItem[],
        },
        onSubmit: async ({ value }) => {
            // Filter out empty URLs before submitting
            const validLinks = value.links.filter(link => link.url.trim() !== '');

            if (validLinks.length === 0) {
                setServerErrors(['At least one valid URL is required']);
                return;
            }

            await createBulkLinkMutation.mutateAsync(validLinks);
        },
    });

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            form.reset();
            setServerErrors([]);
        }
        setOpen(open);
    };

    const addLinkField = () => {
        const currentLinks = form.getFieldValue('links');
        form.setFieldValue('links', [...currentLinks, { url: '' }]);
    };

    const removeLinkField = (index: number) => {
        const currentLinks = form.getFieldValue('links');
        if (currentLinks.length > 1) {
            form.setFieldValue('links', currentLinks.filter((_, i) => i !== index));
        }
    };

    let trigger: React.ReactNode;
    if (children) {
        trigger = children;
    } else {
        trigger = (
            <Button size="lg">
                <Link2 className="mr-2 h-5 w-5" />
                Create multiple links
            </Button>
        );
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger render={trigger} />
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Multiple Links</DialogTitle>
                    <DialogDescription>
                        Create multiple shortened links at once. Add the URLs you want to shorten below.
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
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>URLs to shorten</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addLinkField}
                                disabled={createBulkLinkMutation.isPending}
                                className={"cursor-pointer"}
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Add URL
                            </Button>
                        </div>

                        <form.Field
                            name="links"
                            mode="array"
                        >
                            {(field) => (
                                <div className="space-y-3">
                                    {field.state.value.map((_, index) => (
                                        <form.Field
                                            key={index}
                                            name={`links[${index}].url`}
                                            validators={{
                                                onChange: createBulkLinkSchema.shape.url,
                                            }}
                                        >
                                            {(subField) => (
                                                <div className="flex gap-2 items-start">
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-1">
                                                                <Input
                                                                    id={subField.name}
                                                                    name={subField.name}
                                                                    value={subField.state.value}
                                                                    onBlur={subField.handleBlur}
                                                                    onChange={(e) => subField.handleChange(e.target.value)}
                                                                    placeholder={`https://example.com/${index + 1}`}
                                                                    type="url"
                                                                    disabled={createBulkLinkMutation.isPending}
                                                                    className="w-full"
                                                                />
                                                            </div>
                                                            {field.state.value.length > 1 && (
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => removeLinkField(index)}
                                                                    disabled={createBulkLinkMutation.isPending}
                                                                    className="h-10 w-10 shrink-0"
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                        {subField.state.meta.errors.length > 0 && (
                                                            <div className="text-sm text-red-500 space-y-1">
                                                                {subField.state.meta.errors.map((error, errorIndex) => (
                                                                    <div key={errorIndex} className="flex items-center gap-1">
                                                                        <span>•</span>
                                                                        <span>{error?.message}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </form.Field>
                                    ))}
                                </div>
                            )}
                        </form.Field>

                        {form.getFieldValue('links').length === 0 && (
                            <div className="text-sm text-muted-foreground text-center py-4">
                                No URLs added. Click "Add URL" to get started.
                            </div>
                        )}
                    </div>

                    {serverErrors?.length > 0 && (
                        <>
                            <Separator />
                            <div className="text-sm text-red-500 space-y-1">
                                {serverErrors.map((err, index) => (
                                    <div key={index} className="flex items-center gap-1">
                                        <span>•</span>
                                        <span>{err}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={createBulkLinkMutation.isPending}
                            className={"cursor-pointer"}
                        >
                            Cancel
                        </Button>
                        <form.Subscribe
                            selector={(state) => [state.canSubmit, state.isSubmitting]}
                        >
                            {([canSubmit, isSubmitting]) => (
                                <Button
                                    type="submit"
                                    disabled={!canSubmit || isSubmitting || createBulkLinkMutation.isPending}
                                >
                                    {createBulkLinkMutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating {form.getFieldValue('links').filter(link => link.url.trim() !== '').length} links...
                                        </>
                                    ) : (
                                        'Create Links'
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