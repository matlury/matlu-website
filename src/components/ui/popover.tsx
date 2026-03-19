"use client";

import * as React from "react";
import { Popover as ChakraPopover, Portal } from "@chakra-ui/react";

export interface PopoverContentProps extends React.ComponentProps<typeof ChakraPopover.Content> {
    portalled?: boolean;
}

export const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
    function PopoverContent(props, ref) {
        const { portalled = true, children, ...rest } = props;
        const Wrapper = portalled ? Portal : React.Fragment;
        return (
            <Wrapper>
                <ChakraPopover.Content ref={ref} {...rest}>
                    {children}
                </ChakraPopover.Content>
            </Wrapper>
        );
    }
);

export const PopoverArrow = ChakraPopover.Arrow;
export const PopoverBody = ChakraPopover.Body;
export const PopoverCloseTrigger = ChakraPopover.CloseTrigger;
export const PopoverFooter = ChakraPopover.Footer;
export const PopoverHeader = ChakraPopover.Header;
export const PopoverRoot = ChakraPopover.Root;
export const PopoverTitle = ChakraPopover.Title;
export const PopoverTrigger = ChakraPopover.Trigger;
