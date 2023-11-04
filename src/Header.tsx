import { Container, Title, Flex, Group, ActionIcon, Image, Modal } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import ColorSchemeToggle from "./ColorSchemeToggle";
import wdingKEKW from './assets/wdingKEKW.webp';
import { useDisclosure } from "@mantine/hooks";
import Instructions from "./Instructions";

export default function Header() {
  const [opened, { open, close }] = useDisclosure(false);
  
  return (
    <Container py="sm">
      <Flex align="center" justify="space-between">
        <Group>
          <Image w={48} radius="sm" src={wdingKEKW}/>
          <Title order={1}>wdingle</Title>
        </Group>
        <Group>
          <ActionIcon variant="subtle" aria-label="How to play" onClick={open}>
            <IconInfoCircle />
          </ActionIcon>
          <ColorSchemeToggle />
        </Group>
      </Flex>

      <Modal opened={opened} onClose={close} title="How To Play" centered size="lg">
        <Instructions />
      </Modal>
    </Container>
  );
}
