import React, { useEffect, useState } from "react";
import "./index.css";
import axios from "axios";
import { Button } from "./components/ui/button";
import toast from "react-hot-toast";

interface QuizProps {
  category: string;
  correctAnswer: string;
  difficulty: string;
  id: string;
  incorrectAnswers: string[];
  isNiche: boolean;
  question: string;
  regions: string[];
  tags: string[];
  type: string;
}

function App() {
  const [quizes, setQuizes] = useState<QuizProps[]>([]);
  const [quiz, setQuiz] = useState<QuizProps>();
  const [answers, setAnswers] = useState<string[]>([]);
  const [streak, setStreak] = useState<number>(0);

  const fetchQuizes = async () => {
    try {
      const { data } = await axios.get(
        "https://the-trivia-api.com/api/questions?categories=arts_and_literature,film_and_tv,general_knowledge,food_and_drink,geography,history,music,science,society_and_culture,sport_and_leisure&limit=50"
      );
      if (data) {
        setQuizes(data);
        setQuiz(data[0]);
        const allAnswers: string[] = data[0].incorrectAnswers.concat([
          data[0].correctAnswer,
        ]);
        setAnswers(shuffleArray(allAnswers));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const setNewQuiz = (answer: string) => {
    if (answer === quiz?.correctAnswer) {
      const filteredQuizes = quizes.filter((q) => q.question !== quiz.question);
      setQuizes(filteredQuizes);
      const randomIndex: number = Math.floor(Math.random() * quizes.length);
      setQuiz(quizes[randomIndex]);
      const newAnswers: string[] = quizes[randomIndex].incorrectAnswers.concat([
        quizes[randomIndex].correctAnswer,
      ]);
      setAnswers(shuffleArray(newAnswers));
      setStreak(streak + 1);
      toast.success("Well done!");
    } else {
      toast.error("Your answer is wrong.");
      setStreak(0);
    }
  };

  const shuffleArray = (arr: string[]) => {
    const shuffledArray: string[] = [...arr];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  useEffect(() => {
    fetchQuizes();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div className="flex items-center justify-center">
        Streak: {streak} 🔥 guessed in a row
      </div>
      <div className="w-full h-full flex items-center justify-center">
        {quiz && (
          <div className="w-1/2 h-1/2 flex flex-col items-center shadow-xl border-2 p-4 border-[#e9e9e9] bg-[#f4f4f5] rounded-xl">
            <h1 className="text-2xl text-[#111]">{quiz.question}</h1>
            <div className="flex flex-col items-center gap-5 h-full w-full justify-center">
              {answers.map((answer) => (
                <Button
                  onClick={() => setNewQuiz(answer)}
                  key={answer}
                  className="text-xl rounded-xl"
                  variant={"outline"}
                >
                  {answer}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
