import ChakraProvider from "../components/ChakraProvider";
import { render as rtlRender } from "@testing-library/react";
import React from "react";

export function render(ui: React.ReactNode) {
    return rtlRender(<>{ui}</>, {
        wrapper: (props) => <ChakraProvider>{props.children}</ChakraProvider>,
    });
}
