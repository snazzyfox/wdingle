import { Kbd, Title, Text, TypographyStylesProvider } from "@mantine/core";

export default function Instructions() {
  return (
    <TypographyStylesProvider>
      <Title order={2}>Fill out the Whiskey Copypasta!</Title>
      <Text>
        Guess accurately which Whiskey copy pasta is featured today! Press{" "}
        <Kbd>space</Kbd> or <Kbd>enter</Kbd> to submit your answer for each
        blank. Fill out the entirety of the copy pasta while making as few 
        mistakes as possible.
      </Text>
      <Text>
        You do not have to match letter casing and punctuation in the answer,
        but you must spell the word accurately, exactly as in the original
        copypasta!
      </Text>
      <Text>
        If you make a mistake, don't worry - a hint will be added to the word 
        that reveals which letters in the word you got right. If you happen to 
        not get any of them, we'll reveal letters in the word one by one! Don't
        rely on these hints too much though - don't forget each mistake gets you
        closer to a game over.
      </Text>
      <Title order={2}>How scoring works</Title>
      <Text>
        The star scoring you get at the end is purely based on the number of
        mistakes. Make less mistakes, get more stars!
      </Text>
      <Title order={2}>Disclaimer</Title>
      <Text>
        This game includes utterances of Whiskey's chat, which may include
        strong language or themes that some consider pepega, waytoodank, or
        inappropriate for younger audiences. Player discretion is advised.
      </Text>
    </TypographyStylesProvider>
  );
}
