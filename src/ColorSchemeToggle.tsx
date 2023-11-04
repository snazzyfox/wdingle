import { useMantineColorScheme, useComputedColorScheme, ActionIcon } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

export default function ColorSchemeToggle() {
  const { toggleColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('dark');

  const Icon = computedColorScheme == 'light' ? IconSun : IconMoon;

  return (
    <ActionIcon
      variant="subtle"
      aria-label="Switch Color Scheme"
      onClick={toggleColorScheme}
    >
      <Icon/>
    </ActionIcon>
  );
}
