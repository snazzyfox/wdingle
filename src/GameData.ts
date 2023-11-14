import { useLocalStorage } from "@mantine/hooks";
import rawData from "./assets/data.txt?raw";

const GAME_OFFSET = 31;

interface GameSaveData {
  id: number;
  found: number[];
  missed: number[];
  mistakes: number;
  status: 'new' | 'playing' | 'ended';
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
    defaultValue: { id: gameNumber, found: [], missed: [], mistakes: 0, status: 'new', },
  });
  if (gameSave!.id !== gameNumber) {
    setGameSave({ id: gameNumber, found: [], missed: [], mistakes: 0, status: 'new' });
  }

  const correct = gameSave?.found.length ?? 0;
  const mistakes = gameSave?.mistakes ?? 0;
  const missed = gameSave?.missed.length ?? 0;
  const status = correct + missed === totalWords ? 'ended' : gameSave?.status ?? 'new';

  // number of stars if UNDER OR EQUAL this number of mistakes
  const starLevels = [
    Math.max(4, totalWords),
    Math.max(3, Math.ceil(totalWords * 0.50)),
    Math.max(2, Math.ceil(totalWords * 0.25)),
    Math.max(1, Math.ceil(totalWords * 0.10)),
    0
  ]
  const maxStars = starLevels.length;
  const stars = starLevels.findLastIndex((s) => mistakes <= s) + 1;

  function setFound(index: number) {
    setGameSave({ ...gameSave!, found: [...(gameSave!.found ?? []), index] });
  }

  function setMissed(index: number) {
    setGameSave({ ...gameSave!, missed: [...(gameSave!.missed ?? []), index], mistakes: gameSave!.mistakes + 1 });
  }

  function addMistake() {
    setGameSave({ ...gameSave!, mistakes: gameSave!.mistakes + 1 });
  }

  function setStartGame() {
    setGameSave({ ...gameSave!, status: 'playing' });
  }

  function setEndGame() {
    setGameSave({ ...gameSave!, status: 'ended' });
  }

  return {
    gameDate,
    gameDateString,
    gameNumber,
    gameData,
    totalWords,
    correct,
    found: gameSave?.found ?? [],
    missed: gameSave?.missed ?? [],
    setFound,
    setMissed,
    mistakes,
    stars,
    maxStars,
    starLevels,
    maxMistakes,
    addMistake,
    setStartGame,
    setEndGame,
    status,
  };
}
