import {
  Dialog,
  DialogClose,
  DialogFooter as ShadcnDialogFooter,
  DialogHeader as ShadcnDialogHeader,
  DialogTitle as ShadcnDialogTitle,
  DialogOverlay as ShadcnDialogOverlay,
  DialogTrigger,
  DialogPortal,
  DialogDescription,
} from "~/components/ui/dialog";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "~/lib/utils";
import { X } from "lucide-react";

function DialogHeader({
  className,
  ...props
}: React.ComponentProps<typeof ShadcnDialogHeader>) {
  return (
    <ShadcnDialogHeader
      {...props}
      className={cn(
        "flex flex-col gap-2 justify-center border-b bg-(--gray-1)",
        className,
      )}
    />
  );
}

function DialogTitle(props: React.ComponentProps<typeof ShadcnDialogTitle>) {
  return (
    <div className="flex items-center justify-between relative">
      <ShadcnDialogTitle
        className="text-xl leading-none font-semibold"
        {...props}
      />

      <DialogClose
        className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-(--gray-7) focus:ring-offset-2"
        aria-label="Close"
      >
        <X size="1.25rem" className="text-(--gray-11)" />
      </DialogClose>
    </div>
  );
}

function DialogContent({
  children,
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-(--gray-1) data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-lg border border-gray-200 shadow-lg duration-200 sm:max-w-lg dark:border-gray-800 overflow-hidden",
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <ShadcnDialogFooter
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end mt-4 border-t p-2 bg-(--gray-1)",
        className,
      )}
      {...props}
    />
  );
}

function DialogOverlay(
  props: React.ComponentProps<typeof DialogPrimitive.Overlay>,
) {
  return (
    <ShadcnDialogOverlay
      className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-(--gray-4)/40 backdrop-blur-xs"
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
};
