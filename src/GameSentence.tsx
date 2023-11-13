import { Text, rem } from "@mantine/core";
import GameWordInput from "./GameWordInput";
import { CSSProperties, useEffect, useRef } from "react";
import useWdingleGame from "./GameData";

export default function GameSentence({ style }: { style: CSSProperties }) {
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
  useEffect(() => focusNextInput(0), []);

  const sections = game.gameData.map((section, index) => {
    if (section.isBlank) {
      return {
        component: (
          <GameWordInput
            key={index}
            index={index}
            ref={(el) => el && (inputRefs.current[index] = el)}
            onComplete={() => focusNextInput(index)}
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

  return (
    <Text component="div" my="xl" mx="md" fz="lg" lh={rem(64)} style={style}>
      {sections.map((section) => section.component)}
    </Text>
  );
}
