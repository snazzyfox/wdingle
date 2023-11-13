import { Group, Stack, Text, Box } from "@mantine/core";
import useWdingleGame from "./GameData";
import { IconStarFilled } from "@tabler/icons-react";
import { ReactNode } from "react";

function Star({ filled, text }: { filled: boolean; text: ReactNode }) {
  return (
    <Stack align="center" gap="0">
      <Box c={ filled ? 'yellow' : 'gray' } style={{transition: 'color 500ms ease-in'}}><IconStarFilled size={36}/></Box>
      <Text size="xs">{text}</Text>
    </Stack>
  );
}

export default function StarRating() {
  const { stars, starLevels } = useWdingleGame();
  return (
    <Group gap="xs">
      {starLevels.map((l, i) => (
        <Star text={l} filled={i < stars} key={i}/>
      ))}
    </Group>
  );
}
