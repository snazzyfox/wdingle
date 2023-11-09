import { useLocalStorage } from "@mantine/hooks";
import rawData from "./assets/data.txt?raw";

const GAME_OFFSET = 3;

interface GameSaveData {
  id: number;
  found: number[];
  mistakes: number;
}
type GameData = Array<{ text: string; isBlank: boolean }>;
let _gamedata: GameData | null = null;

function getGameData(gameNumber: number): GameData {
  if (!_gamedata) {
    const rows = rawData.split("\n");
    const gameString = rows[(gameNumber + GAME_OFFSET) % rows.length];
    _gamedata = gameString.split(/(\[.+?\])/g).map((section) => {
      if (section.startsWith("[")) {
        return {
          text: section.slice(1, -1),
          isBlank: true,
        };
      } else {
        return {
          text: section,
          isBlank: false,
        };
      }
    });
  }
  return _gamedata;
}

export default function useWdingleGame() {
  const gameDate = new Date();

  // Debug override: id url param
  const params = new URLSearchParams(window.location.search);
  const gameNumber = Number(new URLSearchParams(params).get("id") ?? Math.floor(gameDate.getTime() / 86_400_000));

  const gameData = getGameData(gameNumber);
  const totalWords = gameData.filter((s) => s.isBlank).length;
  const maxMistakes = totalWords;
  const gameDateString =
    gameDate.getUTCFullYear() +
    "/" +
    (gameDate.getUTCMonth() + 1).toString().padStart(2, "0") +
    "/" +
    gameDate.getUTCDate().toString().padStart(2, "0");

  const [gameSave, setGameSave] = useLocalStorage<GameSaveData>({
    key: "wdingle-game",
    defaultValue: { id: gameNumber, found: [], mistakes: 0 },
  });
  if (gameSave!.id !== gameNumber) {
    setGameSave({ id: gameNumber, found: [], mistakes: 0 });
  }

  const correct = gameSave?.found.length ?? 0;
  const mistakes = gameSave?.mistakes ?? 0;

  function setFound(index: number) {
    setGameSave({ ...gameSave!, found: [...(gameSave!.found ?? []), index] });
  }

  function addMistake() {
    setGameSave({ ...gameSave!, mistakes: gameSave!.mistakes + 1 });
  }

  return {
    gameDate,
    gameDateString,
    gameNumber,
    gameData,
    totalWords,
    correct,
    found: gameSave?.found ?? [],
    mistakes,
    setFound,
    addMistake,
    maxMistakes,
  };
}
