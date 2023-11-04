import "@mantine/core/styles.css";
import { AppShell, MantineProvider } from "@mantine/core";
import Header from './Header';
import Game from './Game';
import { theme } from "./theme";

export default function App() {
  return <MantineProvider theme={theme} defaultColorScheme="auto">
    <AppShell header={{ height: 72 }}>
      <AppShell.Header>
        <Header/>
      </AppShell.Header>
      <AppShell.Main>
        <Game/>
      </AppShell.Main>
    </AppShell>
  </MantineProvider>;
}
