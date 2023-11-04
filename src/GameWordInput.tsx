import { Group, Text, TextInput, rem, useMantineTheme } from "@mantine/core";
import { KeyboardEvent, forwardRef, useEffect, useState } from "react";
import useWdingleGame from "./GameData";
import { useCounter } from "@mantine/hooks";

interface GameWordInputProps {
  index: number;
  onCorrect?: () => void;
}
type wordStatus = "input" | "incorrect" | "correct";

function cleanString(s: string): string {
  return s.toLowerCase().replaceAll(/[^a-z]/g, "");
}

const GameWordInput = forwardRef<HTMLInputElement, GameWordInputProps>(function ({ index, onCorrect }, ref) {
  const theme = useMantineTheme();
  const game = useWdingleGame();
  const answer = game.gameData[index].text;
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<wordStatus>("input");
  const [localMistakes, setLocalMistakes] = useCounter(0);

  function confirm(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (cleanString(value) == cleanString(answer)) {
        game.setFound(index);
        onCorrect && onCorrect();
      } else {
        setStatus("incorrect");
        game.addMistake();
        setLocalMistakes.increment();
      }
    }
  }

  useEffect(() => {
    setStatus((status) => (status === "incorrect" ? "input" : status));
  }, [value]);

  useEffect(() => {
    if (game.found.includes(index)) {
      setValue(answer);
      setStatus("correct");
    }
  }, [game.found, index, answer]);

  return (
    <TextInput
      styles={{
        input: {
          boxSizing: "content-box",
          backgroundColor: status === "correct" ? "transparent" : undefined,
          color: status === "correct" ? theme.colors.green[3] : undefined,
          fontFamily: theme.fontFamilyMonospace,
          fontSize: theme.spacing.lg,
          paddingLeft: rem(8),
          paddingRight: rem(8),
          width: `calc(${answer.length}ch)`,
          transition: "300ms all ease-out",
        },
        root: {
          display: "inline-block",
        },
      }}
      variant="filled"
      mt={rem(-16)}
      value={value}
      disabled={status === "correct"}
      error={status === "incorrect"}
      description={
        <Group gap="sm">
          <Text inherit>{value.length}/{answer.length}</Text>
          <Text inherit>{answer.slice(0, localMistakes)}</Text>
        </Group>
      }
      onChange={(event) => setValue(event.currentTarget.value)}
      onKeyDown={confirm}
      ref={ref}
    />
  );
});

export default GameWordInput;
