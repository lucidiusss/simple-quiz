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
  const [streak, setStreak] = useState<number>(0);
  const [retries, setRetries] = useState<number>(3);

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
    } else {
      setRetries(retries - 1);
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

  useEffect(() => {
    if (quizes.length === 0) {
      fetchQuizes()  
    }
  }, [quizes]);

  useEffect(() => {
    if (retries === 0) {
      toast.error("you have failed!")
    }
  }, [retries])


  const retryFn = () => {
    setRetries(3);
    fetchQuizes();
  }

  return (
    <div className="w-full h-screen flex flex-col items-center">
      <div className="mt-36">
        <p className="font-bold text-xl">Current score <span className="text-[#4c4c50]">{streak}</span></p>
        <p className="font-bold text-xl">Total questions <span className="text-[#4c4c50]">{quizes.length}</span></p>
        <p className="font-bold text-xl">Retries left <span className={`${retries === 3 ? "text-[#4c4c50]" : retries === 2 ? "text-orange-600" : "text-red-600"}`}>{retries}</span></p>
      </div>
        <h1 className="text-3xl font-bold mt-32">{quiz?.question}</h1>
      <div className="flex flex-col gap-5 items-center w-[1280px] mt-16">
        {
          retries > 0 && answers && answers.map((answer) => <div>
            <Button variant={"outline"} onClick={() => setNewQuiz(answer)} className="">{answer}</Button>
          </div>)
        }
        {
          retries === 0 && 
          <div className="mx-auto">
          <Button variant="default" className="bg-[#3a3a3a] font-bold" onClick={retryFn}>Try again</Button>
          </div>
        }
      </div>
    </div>
  );
}

export default App;
