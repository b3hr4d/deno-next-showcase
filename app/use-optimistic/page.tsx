"use client";

import { Badge, Box, Button, Flex, Heading, Kbd, Spinner, Text, TextField } from "@radix-ui/themes";
import { useActionState, useOptimistic } from "react";
import { sendMessageAction } from "./action.ts";
import type { FormState } from "./types.ts";

function formatDate(date: Date): string {
  const formatted = date.toISOString();

  return formatted.substring(11, formatted.length - 1);
}

export default function Page() {
  const [state, action, isPending] = useActionState(
    async (currentState: FormState, payload: FormData) => {
      const message = (await payload.get("message")) as string;

      addMessageOptimistic(message);
      const newState = await sendMessageAction(currentState, payload);

      return newState;
    },
    [],
  );

  const [optimisticState, addMessageOptimistic] = useOptimistic<
    FormState,
    string
  >(state, (prevState, newMessage) => [
    ...prevState,
    [new Date(), newMessage, true],
  ]);

  return (
    <Flex flexGrow="1" align="center" justify="center" asChild>
      <main>
        <Box className="~max-w-xs/4xl p-4">
          <Flex direction="column" gap="4">
            <Heading as="h1" className="~text-lg/4xl">
              Deno 2, Next 15 and React 19 Showcase
            </Heading>
            <Heading as="h2" mb="6" className="~text-base/2xl">
              useOptimistic() Demo
            </Heading>

            <Flex direction="column" gap="2" asChild>
              <form action={action}>
                <div>
                  {optimisticState.map(
                    (entry: [Date, string, boolean?], _index: number) => (
                      <Text as="div">
                        {/* time */}
                        <Kbd>{formatDate(entry[0])}</Kbd>
                        {/* message */}
                        <Text ml="2">{entry[1]}</Text>
                        {/* badge */}
                        {entry[2] && (
                          <Badge ml="2" variant="soft">
                            sending...
                          </Badge>
                        )}
                      </Text>
                    ),
                  )}
                </div>

                <TextField.Root type="text" name="message" placeholder="Message" required={true} size="3" />

                <Button type="submit" disabled={isPending} variant="soft" size="3">
                  {isPending && <Spinner />}
                  Send
                </Button>
              </form>
            </Flex>
          </Flex>
        </Box>
      </main>
    </Flex>
  );
}
