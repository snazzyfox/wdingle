import { Modal, Rating, Title, Text, Stack, Space, CopyButton, Button, Blockquote } from "@mantine/core";
import useWdingleGame from "./GameData";
import { IconClipboard } from "@tabler/icons-react";
import Confetti from "react-confetti";

function shareData(date: string, stars: number, mistakes: number, words: number) {
  return (
    `wdingle ${date} \n` + `${"⭐".repeat(stars)}${"⬛".repeat(3 - stars)}\n` + `${mistakes} / ${words} mistakes\n`
  );
}

export default function GameResult() {
  const gameData = useWdingleGame();
  const losePhrases = [
    "Welp, you didn't get that one.",
    "Looks like some skill issue to me.",
    "Oh naur, you ran out of tries.",
    "Hmm, that's a bit pepega today.",
    "KEKW, Skill Issue, F",
    "Officially cheddar mishandler",
  ];
  const winPhrases = ["CHAT in the CHAT!", "You got it!", "Heck Yeah!", "That's it!", "A Believer Win!"];

  const isWin = gameData.correct === gameData.totalWords;
  const isLose = gameData.mistakes === gameData.totalWords;
  const stars = Math.floor((1.2 - gameData.mistakes / gameData.totalWords) * 3);
  console.log;

  return (
    <>
      <Modal.Root
        opened={isWin || isLose}
        onClose={() => null}
        closeOnClickOutside={false}
        closeOnEscape={false}
        centered
        size="lg"
        padding="xl"
      >
        <Modal.Overlay>{gameData.mistakes === 0 && <Confetti />}</Modal.Overlay>
        <Modal.Content>
          <Modal.Body>
            <Stack align="center">
              <Rating value={stars} count={3} size="xl" readOnly />
              <Title order={3}>
                {isWin && winPhrases[gameData.gameNumber % winPhrases.length]}
                {isLose && losePhrases[gameData.gameNumber % losePhrases.length]}
              </Title>
              <Text>
                {gameData.mistakes} / {gameData.totalWords} mistakes
              </Text>
              <Space />
              <Blockquote>{gameData.gameData.map(({ text }) => text)}</Blockquote>
              <Space />
              {isWin && <Text>You got the copy pasta! Share this results with your frens!</Text>}
              {isLose && (
                <Text>
                  You might not have gotten the correct answer, but you can still share this result with your frens.
                </Text>
              )}
              <CopyButton value={shareData(gameData.gameDateString, stars, gameData.mistakes, gameData.totalWords)}>
                {({ copied, copy }) => (
                  <Button color={copied ? "green" : "yellow"} leftSection={<IconClipboard />} onClick={copy}>
                    Copy Your Results
                  </Button>
                )}
              </CopyButton>
            </Stack>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
