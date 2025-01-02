import { useEffect, useState } from "react";
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

  const fetchQuizes = async () => {
    try {
      const { data } = await axios.get(
        "https://the-trivia-api.com/api/questions?categories=arts_and_literature,film_and_tv,general_knowledge,food_and_drink,geography,history,music,science,society_and_culture,sport_and_leisure&limit=50"
      );
      if (data) {
        setQuizes(data);
        setQuiz(data[0]);
        setAnswers(data[0].incorrectAnswers.concat([data[0].correctAnswer]));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const setNewQuiz = (answer: string) => {
    setTimeout(() => {
      if (answer === quiz?.correctAnswer) {
        const filteredQuizes = quizes.filter(
          (q) => q.question !== quiz.question
        );
        setQuizes(filteredQuizes);
        const randomIndex = Math.floor(Math.random() * quizes.length);
        setQuiz(quizes[randomIndex]);
        const newAnswers = quizes[randomIndex].incorrectAnswers.concat([
          quizes[randomIndex].correctAnswer,
        ]);
        setAnswers(newAnswers);
        toast.success("Well done!");
      }
    }, 500);
    if (answer !== quiz?.correctAnswer) {
      toast.error("Your answer is wrong.");
    }
  };

  useEffect(() => {
    fetchQuizes();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
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
  );
}

export default App;
