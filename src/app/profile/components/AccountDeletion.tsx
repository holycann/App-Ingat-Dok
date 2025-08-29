import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

export const AccountDeletion: React.FC = () => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAccountDeletion = async () => {
    setIsDeleting(true);
    try {
      // TODO: Implement actual account deletion logic
      // This should call your backend service to delete the account
      console.log("Account deletion initiated");
      // Typically would involve:
      // 1. Calling a backend endpoint to delete the account
      // 2. Logging out the user
      // 3. Redirecting to a landing page
    } catch (error) {
      console.error("Account deletion failed", error);
      // TODO: Add error handling, perhaps show a toast notification
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 border-t border-destructive/20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-destructive">
            Delete Account
          </h2>
          <p className="text-sm text-muted-foreground">
            Permanently delete your account and all associated data
          </p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="w-4 h-4 mr-2" /> Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove all your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleAccountDeletion}
                disabled={isDeleting}
                className="bg-destructive hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Delete Account"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
