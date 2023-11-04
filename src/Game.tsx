import {
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
import GameResult from "./GameResult";

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
    <Text
      component="div"
      my="xl"
      mx="md"
      fz="lg"
      lh={rem(64)}
    >
      {sections.map((section) => section.component)}
    </Text>
  );
}

function Header() {
  const game = useWdingleGame();

  return (
    <>
      <Title order={2}>wdingle for {game.gameDateString}</Title>
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
        <GameResult/>
      </Stack>
    </Container>
  );
}
