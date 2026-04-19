"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Box, CloseButton } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

type DialogButtonProps = React.PropsWithChildren<{
  asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>>;

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext(): DialogContextValue {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used inside Dialog");
  }
  return context;
}

function composeHandlers<E>(
  original?: (event: E) => void,
  next?: (event: E) => void,
): (event: E) => void {
  return (event: E) => {
    original?.(event);
    next?.(event);
  };
}

function Dialog({
  open,
  onOpenChange,
  children,
}: React.PropsWithChildren<{ open?: boolean; onOpenChange?: (open: boolean) => void }>) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = typeof open === "boolean";
  const resolvedOpen = isControlled ? open : internalOpen;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  return (
    <DialogContext.Provider value={{ open: resolvedOpen, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

function DialogTrigger({
  asChild,
  children,
  ...props
}: DialogButtonProps) {
  const { setOpen } = useDialogContext();

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{
      onClick?: React.MouseEventHandler;
    }>;
    return React.cloneElement(child, {
      ...props,
      onClick: composeHandlers(child.props.onClick, () => setOpen(true)),
    });
  }

  return (
    <button type="button" {...props} onClick={composeHandlers(props.onClick, () => setOpen(true))}>
      {children}
    </button>
  );
}

function DialogClose({
  asChild,
  children,
  ...props
}: DialogButtonProps) {
  const { setOpen } = useDialogContext();

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{
      onClick?: React.MouseEventHandler;
    }>;
    return React.cloneElement(child, {
      ...props,
      onClick: composeHandlers(child.props.onClick, () => setOpen(false)),
    });
  }

  return (
    <button type="button" {...props} onClick={composeHandlers(props.onClick, () => setOpen(false))}>
      {children}
    </button>
  );
}

function DialogPortal({ children }: React.PropsWithChildren) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(children, document.body);
}

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof Box>) {
  const { open } = useDialogContext();
  if (!open) {
    return null;
  }

  return (
    <Box
      data-slot="dialog-overlay"
      position="fixed"
      inset={0}
      zIndex={200}
      bg="blackAlpha.300"
      backdropFilter="blur(2px)"
      className={className}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof Box> & {
  showCloseButton?: boolean;
}) {
  const { open, setOpen } = useDialogContext();

  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalStyle;
    };
  }, [open, setOpen]);

  if (!open) {
    return null;
  }

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      setOpen(false);
    }
  };

  return (
    <DialogPortal>
      <DialogOverlay onClick={handleOverlayClick} />
      <Box
        position="fixed"
        inset={0}
        zIndex={210}
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={4}
        onMouseDown={handleOverlayClick}
      >
        <Box
          data-slot="dialog-content"
          position="relative"
          width="full"
          maxW="calc(100% - 2rem)"
          className={className}
          onClick={(event) => event.stopPropagation()}
          {...props}
        >
          {children}
          {showCloseButton && (
            <DialogClose asChild>
              <CloseButton aria-label="Close" position="absolute" top={4} right={4} size="lg" />
            </DialogClose>
          )}
        </Box>
      </Box>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<typeof Box>) {
  return <Box data-slot="dialog-header" className={className} {...props} />;
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<typeof Box> & {
  showCloseButton?: boolean;
}) {
  return (
    <Box data-slot="dialog-footer" className={className} {...props}>
      {children}
      {showCloseButton && (
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      )}
    </Box>
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof Box>) {
  return (
    <Box
      as="h2"
      data-slot="dialog-title"
      className={className}
      fontSize="var(--font-size-h2)"
      lineHeight="var(--line-height-h2)"
      fontWeight="700"
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof Box>) {
  return (
    <Box
      as="p"
      data-slot="dialog-description"
      className={className}
      fontSize="var(--font-size-body)"
      lineHeight="var(--line-height-body)"
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};