import {
  Flex,
  Container,
  Text,
  rem,
  Title,
  Stack,
  Group,
} from "@mantine/core";
import GameWordInput from "./GameWordInput";
import { useEffect, useRef } from "react";
import useWdingleGame from "./GameData";

function GameSentence() {
  const game = useWdingleGame();
  const inputRefs = useRef<HTMLInputElement[]>([]);

  function focusNextInput(index: number) {
    sections[index].isFocusable = false;
    let nextSection = sections.slice(index).findIndex((s) => s.isFocusable);
    if (nextSection >= 0) {
      nextSection += index;
    } else {
      nextSection = sections.findIndex((s) => s.isFocusable);
    }
    if (nextSection >= 0) {
      inputRefs.current[nextSection].focus();
    }
  }

  const sections = game.gameData.map((section, index) => {
    if (section.isBlank) {
      return {
        component: (
          <GameWordInput
            key={index}
            index={index}
            ref={(el) => el && (inputRefs.current[index] = el)}
            onCorrect={() => focusNextInput(index)}
          />
        ),
        isFocusable: true,
      };
    } else {
      return {
        component: section.text,
        isFocusable: false,
      };
    }
  });

  useEffect(() => focusNextInput(0), []);

  return (
    <Flex
      columnGap={rem(4)}
      rowGap="xl"
      align="center"
      wrap="wrap"
      my="xl"
      mx="md"
      fz="lg"
    >
      {sections.map((section) => section.component)}
    </Flex>
  );
}

function Header() {
  const game = useWdingleGame();
  const dateString =
    game.gameDate.getUTCFullYear() +
    "/" +
    game.gameDate.getUTCMonth().toString().padStart(2, "0") +
    "/" +
    game.gameDate.getUTCDate().toString().padStart(2, "0");

  return (
    <>
      <Title order={2}>wdingle for {dateString}</Title>
      <Group gap="xl">
        <Text>
          Words: {game.correct} / {game.totalWords}
        </Text>
        <Text>
          Mistakes: {game.mistakes} / {game.maxMistakes}
        </Text>
      </Group>
    </>
  );
}

export default function Game() {
  return (
    <Container my="xl" size="sm">
      <Stack gap="xl" align="center">
        <Header />
        <GameSentence />
      </Stack>
    </Container>
  );
}
