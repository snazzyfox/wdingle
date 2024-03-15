import { TextInput, rem, useMantineTheme } from "@mantine/core";
import { ChangeEvent, KeyboardEvent, forwardRef, useEffect, useState } from "react";
import { Game } from "./GameData";

interface GameWordInputProps {
  index: number;
  onComplete?: () => void;
  game: Game;
}
type wordStatus = "input" | "incorrect" | "correct" | "missed";

function cleanString(s: string): string {
  return s.toLowerCase().replaceAll(/[^a-z]/g, "");
}

const GameWordInput = forwardRef<HTMLInputElement, GameWordInputProps>(function ({ index, onComplete, game }, ref) {
  const theme = useMantineTheme();
  const answer = game.gameData[index].text;
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<wordStatus>("input");
  const [placeholder, setPlaceholder] = useState("_".repeat(answer.length));

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (cleanString(value) == cleanString(answer)) {
        game.setFound(index);
        onComplete && onComplete();
      } else if (value) {
        // generate new placeholder by adding in letters that are correct and in the right position
        let newPlaceholder = Array.from(placeholder)
          .map((letter, i) => (value[i]?.toLowerCase() === answer[i]?.toLowerCase() ? answer[i] : letter))
          .join("");
        if (newPlaceholder === placeholder) {
          // didn't get any new letters; give them a random one
          const idx = newPlaceholder.indexOf('_');
          if (idx >= 0) {
            newPlaceholder = placeholder.substring(0, idx) + answer[idx] + placeholder.substring(idx + 1);
          }
        }
        if (newPlaceholder.includes("_")) {
          setPlaceholder(newPlaceholder);
          setStatus("incorrect");
          setValue("");
          game.addMistake();
        } else {
          game.setMissed(index);
          onComplete && onComplete();
        }
      }
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value);
    setStatus("input");
  }

  useEffect(() => {
    if (game.found.includes(index)) {
      setValue(answer);
      setStatus("correct");
    } else if (game.status === 'ended' || game.missed.includes(index)) {
      setValue(answer);
      setStatus("missed");
    }
  }, [game.found, game.missed, game.status, index, answer]);

  const disabled = status === "correct" || status === "missed";

  return (
    <TextInput
      styles={{
        input: {
          boxSizing: "content-box",
          backgroundColor: disabled ? "transparent" : undefined,
          color: status === "correct" ? theme.colors.green[5] : status === "missed" ? theme.colors.orange[5] : undefined,
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
      disabled={disabled}
      error={status === "incorrect"}
      description={!disabled && value.length + "/" + answer.length}
      placeholder={placeholder}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      ref={ref}
    />
  );
});

export default GameWordInput;
