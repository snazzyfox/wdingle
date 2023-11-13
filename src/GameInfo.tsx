import { Button, CopyButton, Group, Paper, Stack, Text, Title } from "@mantine/core";
import useWdingleGame from "./GameData";
import StarRating from "./StarRating";
import { IconClipboard, IconPlayerPlayFilled, IconTrashFilled } from "@tabler/icons-react";
import Confetti from "react-confetti";

function shareData(date: string, stars: number, maxStars: number, correct: number, mistakes: number, words: number) {
  return (
    `wdingle ${date} \n` +
    `${"⭐".repeat(stars)}${"⬛".repeat(maxStars - stars)}\n` +
    `${correct} / ${words} found\n` +
    `${mistakes} incorrect guesses\n\n` +
    window.location.toString()
  );
}

const losePhrases = [
  "Welp, you didn't get that one.",
  "Looks like some skill issue to me.",
  "Oh naur, you ran out of tries.",
  "Hmm, that's a bit pepega today.",
  "KEKW, Skill Issue, F",
  "Officially cheddar mishandler",
];
const winPhrases = [
  "CHAT in the CHAT!",
  "You got it!",
  "Heck Yeah!",
  "That's it!",
  "A Believer Win!",
  "No Malding Necessary!",
];

export default function GameInfo() {
  const { gameDateString, gameNumber, correct, mistakes, stars, maxStars, totalWords, setStartGame, setEndGame, status } =
    useWdingleGame();
  const isWin = correct === totalWords;
  const isLose = status === 'ended' && !isWin;

  return (
    <>
      <Title order={2}>wdingle for {gameDateString}</Title>

      <Paper w="100%" p="lg" shadow="xs" withBorder>
        <Group gap="xl" justify="space-evenly" align="center">
          <Stack gap="xs">
            <Text>
              {correct} / {totalWords} Words
            </Text>
            <Text>{mistakes} incorrect guesses</Text>
          </Stack>
          <StarRating />
          {
            status === 'new' && 
            <Button onClick={setStartGame} leftSection={<IconPlayerPlayFilled/>}>Start Game</Button>
          }
          { 
            status === 'playing' &&
            <Button onClick={setEndGame} leftSection={<IconTrashFilled/>} color="red" disabled={stars > 0}>Give Up</Button>
          }
          { status === 'ended' && 
          <CopyButton value={shareData(gameDateString, stars, maxStars, correct, mistakes, totalWords)}>
            {({ copied, copy }) => (
              <Button color={copied ? "green" : "yellow"} leftSection={<IconClipboard />} onClick={copy}>
                Copy Your Results
              </Button>
            )}
          </CopyButton>
          }
        </Group>
      </Paper>

      <Title order={3}>
        {isWin && winPhrases[gameNumber % winPhrases.length]}
        {isLose && losePhrases[gameNumber % losePhrases.length]}
      </Title>
      { status === 'ended' && mistakes === 0 && <Confetti /> } 
    </>
  );
}
