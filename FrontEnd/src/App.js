import logo from "./logo.svg";
import "./App.css";
import { useCallback, useEffect, useState } from "react";
import { useStore } from "./store/store";
import actions from "./store/actions";
import { motion, useCycle } from "framer-motion";
import "./app.scss";
import { Button } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

function App() {
  //refactor using custom hooks after everything works
  const setQuestions = useStore((state) => state.setQuestions);
  const questions = useStore((state) => state.questions);
  const currentQuestion = useStore((state) => state.currentQuestion);
  const setCurrentQuestion = useStore((state) => state.setCurrentQuestion);
  const money = useStore((state) => state.money);
  const setMoney = useStore((state) => state.setMoney);
  const [loadingAnimation, setLoadingAnimation] = useState(true);
  const [fetchedQuestions, setFetchedQuestions] = useState(true);
  const [counter, setCounter] = useState(0);
  const [answerSelected, setAnswerSelected] = useState({});
  const [onError, setOntError] = useState(false);
  const [onSuccess, setOnSuccess] = useState(false);
  const customSetState = useStore((state) => state.customSetState);
  const isCorrectAnswer = useStore((state) => state.isCorrectAnswer);

  useEffect(() => {
    //iffee
    (async function () {
      const questions = await actions.fetchQuestions();
      setQuestions(questions);
      setCurrentQuestion(questions[0]);
      setTimeout(() => {
        setFetchedQuestions(false);
      }, [2000]);
    })();
  }, []);

  const triggerEffects = () => {
    setLoadingAnimation(false);
    fetchedQuestions &&
      setInterval(() => {
        setLoadingAnimation(true);
      }, [50]);
  };

  useEffect(() => {
    setInterval(() => {
      triggerEffects();
    }, [1000]);
  }, []);

  const resetResult = () => {
    setOntError(false); 
  };

  const nextQuestionGeneric = () => {
    const questionsCount = questions.length;
    if (counter === questionsCount - 1) {
      alert("finish, terminar con el final despues")
    }
    setCounter(counter + 1);
    if (questions?.length > 0) setCurrentQuestion(questions[counter + 1]);
    setFetchedQuestions(true);
    setTimeout(() => {
      setFetchedQuestions(false);
    }, [500]);
    resetResult();
  };

  const setIsCorrectAnswer = ({isCorrect}) => {
    const key = 'isCorrectAnswer';
    const value = isCorrect;
    customSetState({key,value}) 
  }
  //refactor  change  name
  const submitQuestion = ({ name, isCorrect }) => {
    if (!isCorrect) {
      let booSound = new Audio("./statics/boo.mp3");
      setOntError(true);
      setIsCorrectAnswer({isCorrect : false})   
      booSound.play();
      return console.log("La cagaste");
    }
    setAnswerSelected({ name, isCorrect });
    if (isCorrect) {
      setIsCorrectAnswer({isCorrect : true}) 
      setOnSuccess(true);
      setMoney(money + 1);
      let cashSound = new Audio("./statics/cash.mp3");
      cashSound.play();
    }
    nextQuestionGeneric();
  };

  const computedSelectedAnswer = useCallback(
    (answer) => {
      const { isCorrect, name } = answer;
      return {
        backgroundColor: isCorrect && onError && "red",
      };
    },
    [answerSelected, onError]
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.325,
      },
    },
  };

  const item = {
    hidden: { x: -1000 },
    show: { x: 0 },
    asperito: { scale: [1, 1.2, 1.2, 1, 1] },
  };

  const moneyContainer = {
    nice: { scale: [1, 1.2, 1.2, 1, 1] },
    wrong: {x: 0}
  };

  return (
    <div className="App">     
      <motion.div
        className="money-calculator"
        variants={moneyContainer}
        animate={isCorrectAnswer ? "nice" : "wrong"}
      >
        <AttachMoneyIcon />
        <span>{money}</span>
      </motion.div>
      {!fetchedQuestions && (
        <>
          {currentQuestion && Object.keys(currentQuestion).length > 0 && (
            <>
              <h1 style={{ textTransform: "capitalize" }}>
                {currentQuestion.title}
              </h1>
              <br />
              <motion.ul
                className="answer-list"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {currentQuestion.answers &&
                  currentQuestion.answers.length > 0 &&
                  currentQuestion.answers.map((answer, index) => (
                    <motion.li
                      key={index}
                      variants={item}
                      animate={
                        answer.isCorrect && onError ? "asperito" : "show"
                      }
                      onClick={() => submitQuestion(answer)}
                      style={computedSelectedAnswer(answer)}
                    >
                      {" "}
                      {answer.name}
                    </motion.li>
                  ))}
              </motion.ul>
              <br />
            </>
          )}
        </>
      )}

      {fetchedQuestions && (
        <div className="loading-container">
          <motion.div
            className="loading-animate"
            animate={{
              scale: [1, 2, 2, 1, 1],
              rotate: [0, 0, 270, 270, 0],
              borderRadius: ["20%", "20%", "50%", "50%", "20%"],
            }}
          >
            <motion.div
              className="loading-text"
              animate={{
                scale: [1, 2, 2, 1, 1],
                rotate: [0, 0, 270, 270, 0],
                borderRadius: ["20%", "20%", "50%", "50%", "20%"],
              }}
            >
              {" "}
              Loading..{" "}
            </motion.div>
          </motion.div>
        </div>
      )}
      {currentQuestion && Object.keys(currentQuestion).length > 0 && (
        <>
          {!fetchedQuestions && (
            <div className="category-information">
              <div>
                <span>categoria = </span>
                <span className="cat-information">
                  {currentQuestion.category.name}
                </span>
              </div>
              <div>
                <span>dificultad = </span>
                <span className="cat-information">
                  {currentQuestion.category.difficulty}
                </span>
              </div>
            </div>
          )}
          {onError && (
            <div className="on-error-answer">
              <span> La cagaste,</span>
              <Button variant="contained" onClick={nextQuestionGeneric}>
                Siguiente Pregunta
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
