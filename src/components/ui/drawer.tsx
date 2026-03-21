"use client";

import * as React from "react";
import { Drawer as ChakraDrawer, Portal } from "@chakra-ui/react";
import { CloseButton } from "@chakra-ui/react";

export const DrawerRoot = ChakraDrawer.Root;
export const DrawerTrigger = ChakraDrawer.Trigger;
export const DrawerHeader = ChakraDrawer.Header;
export const DrawerBody = ChakraDrawer.Body;
export const DrawerFooter = ChakraDrawer.Footer;
export const DrawerTitle = ChakraDrawer.Title;
export const DrawerDescription = ChakraDrawer.Description;
export const DrawerActionTrigger = ChakraDrawer.ActionTrigger;

export const DrawerContent = React.forwardRef<
  HTMLDivElement,
  ChakraDrawer.ContentProps & { portalled?: boolean; showCloseButton?: boolean }
>(function DrawerContent(props, ref) {
  const { children, portalled = true, showCloseButton, ...rest } = props;
  return (
    <Portal disabled={!portalled}>
      <ChakraDrawer.Backdrop />
      <ChakraDrawer.Positioner>
        <ChakraDrawer.Content ref={ref} {...rest}>
          {children}
          {showCloseButton && (
            <ChakraDrawer.CloseTrigger
              asChild
              position="absolute"
              top="2"
              right="2"
            >
              <CloseButton />
            </ChakraDrawer.CloseTrigger>
          )}
        </ChakraDrawer.Content>
      </ChakraDrawer.Positioner>
    </Portal>
  );
});

export const DrawerCloseTrigger = ChakraDrawer.CloseTrigger;
