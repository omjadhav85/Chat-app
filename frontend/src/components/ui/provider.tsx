"use client";

import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defaultSystem,
} from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

export const system = createSystem(defaultConfig, {
  // theme: {
  //   tokens: {
  //     fonts: {
  //       heading: { value: `'Figtree', sans-serif` },
  //       body: { value: `'Figtree', sans-serif` },
  //     },
  //   },
  // },
});

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
