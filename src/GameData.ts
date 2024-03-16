import { useLocalStorage } from "@mantine/hooks";
import rawData from "./assets/data.txt?raw";
import seedrandom from "seedrandom";
import { useMemo } from "react";

interface GameSaveData {
  id: string;
  found: number[];
  missed: number[];
  mistakes: number;
  status: "new" | "playing" | "ended";
}
type GameData = Array<{ text: string; isBlank: boolean }>;

const BLANK_RATE = 0.6; // % of blanks actually shown in game
const MAX_BLANKS = 24; // never present more than this many blanks to user
const MIN_BLANKS = 6; // never present less than this many blanks to user (unless if the game has less)

const _allGameData = rawData.split("\n");
let _gamedata: GameData | null = null;

function getGameData(gameNumber: number): GameData {
  const gameString = _allGameData[gameNumber];
  return gameString.split(/(\[.+?\])/g).map((section) => {
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

function getRandomizedGameData(seed: string): GameData {
  if (!_gamedata) {
    const rng = seedrandom(seed);

    // Pick a game number based on the RNG.
    const gameNumber = Math.floor(rng() * _allGameData.length);
    const game = getGameData(gameNumber);

    // Randomly pick blanks by flipping some of them back to not blanks, clamped between total blanks, min, max
    const blanks = game.filter((g) => g.isBlank);
    const desiredBlankCount = Math.min(
      Math.max(Math.min(Math.ceil(blanks.length * BLANK_RATE), MAX_BLANKS), MIN_BLANKS),
      game.length,
    );

    while (blanks.length > desiredBlankCount) {
      const index = Math.floor(rng() * blanks.length);
      blanks[index].isBlank = false;
      blanks.splice(index, 1);
    }

    _gamedata = game;
  }
  return _gamedata;
}

export default function useWdingleGame() {
  const today = new Date();
  const todayString =
    today.getUTCFullYear() +
    "/" +
    (today.getUTCMonth() + 1).toString().padStart(2, "0") +
    "/" +
    today.getUTCDate().toString().padStart(2, "0");

  // Debug override: id url param
  const params = new URLSearchParams(window.location.search);
  const seed = new URLSearchParams(params).get("seed") ?? todayString;

  const gameData = useMemo(() => getRandomizedGameData(seed), []);
  const totalWords = gameData.filter((s) => s.isBlank).length;
  const maxMistakes = totalWords;

  const [gameSave, setGameSave] = useLocalStorage<GameSaveData>({
    key: "wdingle-game",
    defaultValue: { id: seed, found: [], missed: [], mistakes: 0, status: "new" },
  });
  if (gameSave!.id !== seed) {
    setGameSave({ id: seed, found: [], missed: [], mistakes: 0, status: "new" });
  }

  const correct = gameSave?.found.length ?? 0;
  const mistakes = gameSave?.mistakes ?? 0;
  const missed = gameSave?.missed.length ?? 0;
  const status = correct + missed === totalWords ? "ended" : gameSave?.status ?? "new";

  // number of stars if UNDER OR EQUAL this number of mistakes
  const starLevels = [
    Math.max(4, totalWords),
    Math.max(3, Math.ceil(totalWords * 0.5)),
    Math.max(2, Math.ceil(totalWords * 0.25)),
    Math.max(1, Math.ceil(totalWords * 0.1)),
    0,
  ];
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
    setGameSave({ ...gameSave!, status: "playing" });
  }

  function setEndGame() {
    setGameSave({ ...gameSave!, status: "ended" });
  }

  return {
    seed,
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

export type Game = ReturnType<typeof useWdingleGame>;