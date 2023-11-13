import { Container, Stack, Transition } from "@mantine/core";
import GameInfo from "./GameInfo";
import GameSentence from "./GameSentence";
import useWdingleGame from "./GameData";

export default function Game() {
  const { status } = useWdingleGame();

  return (
    <Container my="xl" size="sm">
      <Stack gap="xl" align="center">
        <GameInfo />
        <Transition transition="slide-down" duration={200} mounted={status !== "new"}>
          {(style) => <GameSentence style={style} />}
        </Transition>
      </Stack>
    </Container>
  );
}
