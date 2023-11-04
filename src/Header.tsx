import { Container, Title, Flex, Group, ActionIcon, Image } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import ColorSchemeToggle from "./ColorSchemeToggle";
import wdingKEKW from './assets/wdingKEKW.webp';

export default function Header() {
  return (
    <Container py="sm">
      <Flex align="center" justify="space-between">
        <Group>
          <Image w={48} radius="sm" src={wdingKEKW}/>
          <Title order={1}>wdingle</Title>
        </Group>
        <Group>
          <ActionIcon variant="subtle" aria-label="How to play">
            <IconInfoCircle />
          </ActionIcon>
          <ColorSchemeToggle />
        </Group>
      </Flex>
    </Container>
  );
}
