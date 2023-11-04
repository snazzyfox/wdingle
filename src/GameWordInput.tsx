import { TextInput, rem, useMantineTheme } from "@mantine/core";
import { KeyboardEvent, forwardRef, useEffect, useState } from "react";

interface GameWordInputProps {
  answer: string;
  onAnswerCorrect?: () => void;
  onAnswerIncorrect?: () => void;
}
type wordStatus = "input" | "incorrect" | "correct";

function cleanString(s: string): string {
  return s.toLowerCase().replaceAll(/[^a-z]/g, "");
}

const GameWordInput = forwardRef<HTMLInputElement, GameWordInputProps>(function ({
  answer,
  onAnswerCorrect,
  onAnswerIncorrect,
}, ref) {
  const theme = useMantineTheme();
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<wordStatus>("input");

  function confirm(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (cleanString(value) == cleanString(answer)) {
        setValue(answer);
        setStatus("correct");
        onAnswerCorrect && onAnswerCorrect();
      } else {
        setStatus("incorrect");
        onAnswerIncorrect && onAnswerIncorrect();
      }
    }
  }

  useEffect(() => {
    if (status === "incorrect") {
      setStatus("input");
    }
  }, [value, status]);

  return (
    <TextInput
      styles={{
        input: {
          boxSizing: 'content-box',
          backgroundColor: status === "correct" ? "transparent" : undefined,
          color: status === "correct" ? theme.colors.green[8] : undefined,
          fontFamily: theme.fontFamilyMonospace,
          fontSize: theme.spacing.lg,
          paddingLeft: rem(8),
          paddingRight: rem(8),
          width: `calc(${answer.length}ch)`,
        },
      }}
      variant="filled"
      mt={rem(-16)}
      value={value}
      disabled={status === "correct"}
      error={status === "incorrect"}
      description={value.length + " / " + answer.length}
      onChange={(event) => setValue(event.currentTarget.value)}
      onKeyDown={confirm}
      ref={ref}
    />
  );
});

export default GameWordInput;