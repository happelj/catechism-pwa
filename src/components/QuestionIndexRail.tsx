import { catechismQuestions } from "../data/catechism";

type QuestionIndexRailProps = {
  onSelect: (questionNumber: number) => void;
};

const indexNumbers = [
  1,
  ...catechismQuestions
    .map((question) => question.number)
    .filter((questionNumber) => questionNumber % 10 === 0),
];

export function QuestionIndexRail({ onSelect }: QuestionIndexRailProps) {
  return (
    <nav aria-label="Question index" className="question-index-rail">
      {indexNumbers.map((questionNumber) => (
        <button key={questionNumber} onClick={() => onSelect(questionNumber)} type="button">
          {questionNumber}
        </button>
      ))}
    </nav>
  );
}
