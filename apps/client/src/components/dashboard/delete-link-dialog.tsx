import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteLink, getlinkById } from "@/lib/api/links";
import { handleApiError } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

type DeleteLinkDialogProps = {
  id: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteLinkDialog({ id, open, onOpenChange }: DeleteLinkDialogProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const canFetch = Boolean(open && id);

  const linkQuery = useQuery({
    queryKey: ["link", id],
    queryFn: () => getlinkById(id as string),
    enabled: canFetch,
  });

  const deleteMutation = useMutation({
    mutationFn: (linkId: string) => deleteLink(linkId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["links", "stats", "top-links"] });
      if (id) {
        queryClient.removeQueries({ queryKey: ["link", id] });
      }
      onOpenChange(false);
    },
    onError: (error: any) => {
      const err = handleApiError(error);
      if (err.status === 401) {
        navigate({ to: "/" });
      }
    },
  });

  const friendlyError = useMemo(() => {
    if (!linkQuery.isError) return null;
    return handleApiError(linkQuery.error).message as string;
  }, [linkQuery.isError, linkQuery.error]);

  const confirmDisabled =
    !id || deleteMutation.isPending || (linkQuery.isPending && canFetch) || linkQuery.isError;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          deleteMutation.reset();
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Delete link</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>

        {canFetch && linkQuery.isPending ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : null}

        {canFetch && linkQuery.isSuccess ? (
          <div className="space-y-2 flex items-center justify-items-end gap-5">
            <div className="h-16 w-16">
              <img src={linkQuery.data.publicURL} alt="" className="w-full h-full" />
            </div>
            <div>
              <div className="text-sm font-medium">{linkQuery.data.title}</div>
              <div className="text-sm text-muted-foreground break-all">{linkQuery.data.url}</div>
            </div>
          </div>
        ) : null}

        {canFetch && linkQuery.isError ? (
          <Alert variant="destructive">
            <AlertTitle>Couldn&apos;t load link</AlertTitle>
            <AlertDescription>{friendlyError ?? "Something went wrong."}</AlertDescription>
          </Alert>
        ) : null}

        {deleteMutation.isError ? (
          <Alert variant="destructive">
            <AlertTitle>Delete failed</AlertTitle>
            <AlertDescription>
              {handleApiError(deleteMutation.error as any).message as string}
            </AlertDescription>
          </Alert>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={confirmDisabled}
            onClick={() => {
              if (!id) return;
              deleteMutation.mutate(id);
            }}
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

