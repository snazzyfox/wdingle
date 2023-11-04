import { Flex, Container, Text, rem, Title, Stack, Group } from "@mantine/core";
import GameWordInput from "./GameWordInput";
import { useRef } from "react";
import rawData from "./assets/data.txt?raw";
import { useCounter } from "@mantine/hooks";

type GameData = Array<{ text: string; isBlank: boolean }>;

function getData(): GameData {
  const today = Math.floor(Date.now() / 86_400_000);
  const rows = rawData.split("\n");
  const gameString = rows[today % rows.length];
  return gameString.split(/(\[.+?\])/g).map((section) => {
    if (section.startsWith("[")) {
      return {
        text: section.slice(1, -1),
        isBlank: true,
      };
    } else {
      return {
        text: section,
        isBlank: false,
      };
    }
  });
}

function GameSentence({
  gameData,
  onAnswerCorrect,
  onAnswerIncorrect,
}: {
  gameData: GameData;
  onAnswerCorrect: () => void;
  onAnswerIncorrect: () => void;
}) {
  const inputRefs = useRef<HTMLInputElement[]>([]);

  function handleOnAnswerCorrect(index: number) {
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
    onAnswerCorrect();
  }

  const sections = gameData.map((section, index) => {
    if (section.isBlank) {
      return {
        component: (
          <GameWordInput
            answer={section.text}
            key={index}
            ref={(el) => el && (inputRefs.current[index] = el)}
            onAnswerCorrect={() => handleOnAnswerCorrect(index)}
            onAnswerIncorrect={onAnswerIncorrect}
          />
        ),
        isFocusable: true,
      };
    } else {
      return {
        component: (
          <Text size="xl" key={index}>
            {section.text}
          </Text>
        ),
        isFocusable: false,
      };
    }
  });

  return (
    <Flex columnGap={rem(4)} rowGap="xl" align="center" wrap="wrap" my="xl" mx="md">
      {sections.map((section) => section.component)}
    </Flex>
  );
}

function Header({
  total,
  correct,
  incorrect,
}: {
  total: number;
  correct: number;
  incorrect: number;
}) {
  const date = new Date();
  const dateString =
    date.getUTCFullYear() +
    "/" +
    date.getUTCMonth().toString().padStart(2, "0") +
    "/" +
    date.getUTCDate().toString().padStart(2, "0");

  return (
    <>
      <Title order={2}>wdingle for {dateString}</Title>
      <Group gap="xl">
        <Text>
          Words: {correct} / {total}
        </Text>
        <Text>
          Mistakes: {incorrect} / {total}
        </Text>
      </Group>
    </>
  );
}

export default function Game() {
  const gameData = getData();
  const [correct, setCorrect] = useCounter(0);
  const [incorrect, setIncorrect] = useCounter(0);
  const words = gameData.filter((s) => s.isBlank).length;

  return (
    <Container my="xl" size="sm">
      <Stack gap="xl" align="center">
        <Header total={words} correct={correct} incorrect={incorrect} />
        <GameSentence
          gameData={gameData}
          onAnswerCorrect={() => setCorrect.increment()}
          onAnswerIncorrect={() => setIncorrect.increment()}
        />
      </Stack>
    </Container>
  );
}
