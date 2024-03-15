import { Container, Stack, Transition } from "@mantine/core";
import GameInfo from "./GameInfo";
import GameSentence from "./GameSentence";
import useWdingleGame from "./GameData";

export default function Game() {
  const game = useWdingleGame();

  return (
    <Container my="xl" size="sm">
      <Stack gap="xl" align="center">
        <GameInfo game={game}/>
        <Transition duration={200} mounted={game.status !== "new"}>
          {(style) => <GameSentence game={game} style={style} />}
        </Transition>
      </Stack>
    </Container>
  );
}
