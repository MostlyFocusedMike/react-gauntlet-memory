import { useState } from "react";

type Card = {
  id: string;
  val: number;
  isMatched: boolean;
  isVisible: boolean;
};

const scrambleNums = (totalPairs: number, isLiveMode = true) => {
  const nums: number[] = [];
  for (let i = 1; i <= totalPairs; i++) {
    nums.push(i, i);
  }

  if (isLiveMode) nums.sort(() => Math.random() - 0.5);

  return nums.map((num, idx) => ({
    id: `${num}-${idx}`,
    val: num,
    isMatched: false,
    isVisible: false,
  }));
};

export default function App() {
  const [numOfPairs] = useState(8);
  const [score, setScore] = useState(0);
  const [firstGuess, setFirstGuess] = useState<Card | null>(null);
  const [cards, setCards] = useState(scrambleNums(numOfPairs));
  const [remainingPairs, setRemainingPairs] = useState(numOfPairs);

  const checkGuess = (id: string, guess: Card) => {
    if (!firstGuess) {
      setFirstGuess(guess);
      return setCards(cards.map((c) => ({ ...c, isVisible: c.id === id })));
    }

    const isMatch = guess.val === firstGuess.val;
    const hasIds = (cId: string) => cId === firstGuess.id || cId === guess.id;
    const match = (c: Card) => hasIds(c.id) ? { ...c, isMatched: true } : c;
    const noMatch = (c: Card) => c.id === guess.id ? { ...c, isVisible: true } : c;

    if (isMatch) setRemainingPairs(remainingPairs - 1);
    setCards(cards.map(isMatch ? match : noMatch));
    setFirstGuess(null);
    setScore(score + 1);
  };

  const reset = () => {
    setScore(0)
    setCards(scrambleNums(numOfPairs))
    setRemainingPairs(numOfPairs);
  }

  return (
    <main>
      <h1 className="text-4xl p-2 font-bold">Memory Game</h1>
      <p>Paris Left: {remainingPairs !== 0 ? remainingPairs : 'Victory!'}</p>
      <p>Score: {score}</p>
      <ul className="grid grid-cols-4 w-fit m-auto">
        {cards.map((guess) => {
          const { id, val, isMatched, isVisible } = guess;

          return (
            <li key={id}>
              <button
                className={`border px-2 w-10 h-10 rounded  ${isVisible ? 'bg-slate-100' : 'bg-slate-300'} data-matched:bg-emerald-400`}
                data-matched={isMatched || undefined}
                onClick={() => checkGuess(id, guess)}
                disabled={isVisible || isMatched}
              >
                {isVisible || isMatched ? val : "?"}
              </button>
            </li>
          );
        })}
      </ul>

      <button
        className="border rounded px-2 my-2 m-auto hover:bg-slate-100 active:bg-slate-300"
        onClick={reset}
      >Reset</button>
    </main>
  );
}
