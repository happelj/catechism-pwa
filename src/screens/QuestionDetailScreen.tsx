import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { catechismQuestions } from "../data/catechism";
import { Dialog } from "../components/Dialog";
import { ProofDialog } from "../components/ProofDialog";
import { useCatechizer } from "../state/CatechizerContext";
import { acceptedTypedChar } from "../utils/answerScoring";

type AnswerWord = {
  correct: boolean;
  text: string;
};

function displayProofReference(reference: string) {
  return reference === "Ps. 92 title" ? "Ps. 92:1-2" : reference;
}

export function QuestionDetailScreen() {
  const navigate = useNavigate();
  const { questionNumber } = useParams();
  const { currentProfile, recordAttempt, settings, markProofHelpSeen } = useCatechizer();
  const parsedQuestionNumber = Number(questionNumber);
  const questionIndex = catechismQuestions.findIndex((item) => item.number === parsedQuestionNumber);
  const question = catechismQuestions[questionIndex];
  const nextQuestion = catechismQuestions[questionIndex + 1];
  const captureRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const attemptStartedAt = useRef(Date.now());
  const recordedAttempt = useRef<number | null>(null);
  const answerWords = useMemo(() => question?.answer.split(/\s+/) ?? [], [question]);
  const [typedWords, setTypedWords] = useState<AnswerWord[]>([]);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [areProofsVisible, setAreProofsVisible] = useState(false);
  const [activeProof, setActiveProof] = useState<string | null>(null);
  const [isProofHelpOpen, setIsProofHelpOpen] = useState(false);
  const completed = typedWords.length === answerWords.length && answerWords.length > 0;
  const wrongWords = typedWords.filter((word) => !word.correct).length;
  const correctWordCount = answerWords.length - wrongWords;
  const score = completed ? (correctWordCount / answerWords.length) * 100 : null;
  const savedScore = currentProfile?.stats.lastAttemptScores[parsedQuestionNumber] ?? 0;

  useEffect(() => {
    attemptStartedAt.current = Date.now();
    recordedAttempt.current = null;
    setActiveProof(null);
    setAreProofsVisible(false);
    setIsAnswerVisible(false);
    setIsProofHelpOpen(false);
    setTypedWords([]);
    requestAnimationFrame(() => captureRef.current?.focus());
  }, [parsedQuestionNumber]);

  useEffect(() => {
    if (!question?.proofs.length || settings.hasSeenProofHelp) {
      return;
    }

    setIsProofHelpOpen(true);
    requestAnimationFrame(() => captureRef.current?.blur());
  }, [question, settings.hasSeenProofHelp]);

  useEffect(() => {
    contentRef.current?.scrollTo({ behavior: "smooth", top: contentRef.current.scrollHeight });
  }, [activeProof, areProofsVisible, completed, isAnswerVisible, typedWords.length]);

  useEffect(() => {
    if (!question || !completed || recordedAttempt.current === question.number) {
      return;
    }

    recordedAttempt.current = question.number;
    recordAttempt(
      question.number,
      Math.round(((answerWords.length - wrongWords) / answerWords.length) * 100),
      Date.now() - attemptStartedAt.current,
    );
  }, [answerWords.length, completed, question, recordAttempt, wrongWords]);

  if (!question) {
    return (
      <main className="missing-question">
        <p>Question not found.</p>
        <button className="native-button" onClick={() => navigate("/")} type="button">
          Back to Questions
        </button>
      </main>
    );
  }

  function focusCapture() {
    if (!isAnswerVisible && !completed) {
      captureRef.current?.focus();
    }
  }

  function typeNextWords(value: string) {
    const typedChars = [...value].filter((typedChar) => typedChar.trim());

    if (typedChars.length === 0 || completed) {
      return;
    }

    setTypedWords((currentWords) => {
      const nextWords = [...currentWords];

      for (const typedChar of typedChars) {
        const expectedWord = answerWords[nextWords.length];

        if (!expectedWord) {
          break;
        }

        nextWords.push({
          correct: acceptedTypedChar(expectedWord[0], typedChar.toLowerCase()),
          text: expectedWord,
        });
      }

      return nextWords;
    });
  }

  function retryQuestion() {
    attemptStartedAt.current = Date.now();
    recordedAttempt.current = null;
    setAreProofsVisible(false);
    setIsAnswerVisible(false);
    setTypedWords([]);
    requestAnimationFrame(() => captureRef.current?.focus());
  }

  function toggleProofs() {
    setAreProofsVisible((value) => !value);
  }

  function dismissProofHelp() {
    setIsProofHelpOpen(false);
    markProofHelpSeen();
    requestAnimationFrame(() => captureRef.current?.focus());
  }

  return (
    <main className="question-detail-screen" onClick={focusCapture}>
      <header className="detail-toolbar">Question {question.number} - {savedScore}%</header>
      <div className="question-detail-scroll" ref={contentRef}>
        <h1>{question.question}</h1>
        {typedWords.length > 0 && !isAnswerVisible && (
          <p className="typed-answer">
            {typedWords.map((word, index) => (
              <span className={word.correct ? "correct" : "incorrect"} key={`${word.text}-${index}`}>
                {word.text}{" "}
              </span>
            ))}
          </p>
        )}
        {score !== null && <p className="score-line">Score: {score.toFixed(2)}%</p>}
        {isAnswerVisible && <p className="full-answer">{question.answer}</p>}
        {!completed && (
          <button
            className="native-button detail-button"
            onClick={(event) => {
              event.stopPropagation();
              setIsAnswerVisible((value) => !value);
              requestAnimationFrame(() => {
                if (isAnswerVisible) {
                  captureRef.current?.focus();
                } else {
                  captureRef.current?.blur();
                }
              });
            }}
            type="button"
          >
            {isAnswerVisible ? "Hide Answer" : "Show Answer"}
          </button>
        )}
        <button
          className="native-button detail-button"
          onClick={(event) => {
            event.stopPropagation();
            toggleProofs();
          }}
          type="button"
        >
          {areProofsVisible ? "Hide Proofs" : "Show Proofs"}
        </button>
        {areProofsVisible && (
          <div className="proof-list">
            {question.proofs.length === 0 && <p>No proofs listed yet for this question.</p>}
            {question.proofs.map((proof) => (
              <button
                key={proof}
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveProof(displayProofReference(proof));
                }}
                type="button"
              >
                {displayProofReference(proof)}
              </button>
            ))}
          </div>
        )}
        <input
          aria-label="Type the first letter of each answer word"
          autoCapitalize="none"
          autoComplete="off"
          className="answer-capture"
          disabled={isAnswerVisible || completed}
          onChange={(event) => {
            const value = event.currentTarget.value;
            event.currentTarget.value = "";
            typeNextWords(value);
          }}
          ref={captureRef}
          spellCheck="false"
        />
        {completed && (
          <div className="attempt-actions">
            <button className="native-button" onClick={retryQuestion} type="button">Retry</button>
            {nextQuestion && (
              <button
                className="native-button"
                onClick={() => navigate(`/questions/${nextQuestion.number}`)}
                type="button"
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
      <footer className="detail-footer">
        <button className="native-button" onClick={() => navigate("/")} type="button">
          Back to Questions
        </button>
      </footer>
      {activeProof && <ProofDialog onDismiss={() => setActiveProof(null)} reference={activeProof} />}
      {isProofHelpOpen && (
        <Dialog onDismiss={dismissProofHelp} title="Using Scripture Proofs">
          <p className="dialog-copy">
            Tap Show Proofs, then tap any scripture reference to open the full KJV passage.
          </p>
          <div className="dialog-actions">
            <button onClick={dismissProofHelp} type="button">Continue</button>
          </div>
        </Dialog>
      )}
    </main>
  );
}
