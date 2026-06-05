import { catechismQuestions } from "../data/catechism";

type QuestionIndexRailProps = {
  onSelect: (questionNumber: number) => void;
  onToggleTheme: () => void;
  theme: "light" | "dark";
};

const indexNumbers = [
  1,
  ...catechismQuestions
    .map((question) => question.number)
    .filter((questionNumber) => questionNumber % 10 === 0),
];

function LightModeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M9 21h6" />
      <path d="M10 17h4" />
      <path d="M12 3a7 7 0 0 0-4.1 12.7c.7.5 1.1 1.2 1.1 2.1V18h6v-.2c0-.9.4-1.6 1.1-2.1A7 7 0 0 0 12 3Z" />
    </svg>
  );
}

function DarkModeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M9 21h6" />
      <path d="M10 17h4" />
      <path d="M12 3a7 7 0 0 0-3.2 13.2" />
      <path d="M15 14.9c.3-.3.6-.5.9-.8A7 7 0 0 0 14.1 3.4" />
      <path d="m3 3 18 18" />
    </svg>
  );
}

export function QuestionIndexRail({ onSelect, onToggleTheme, theme }: QuestionIndexRailProps) {
  const nextThemeLabel = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <nav aria-label="Question index" className="question-index-rail">
      <div className="question-index-links">
        {indexNumbers.map((questionNumber) => (
          <button key={questionNumber} onClick={() => onSelect(questionNumber)} type="button">
            {questionNumber}
          </button>
        ))}
      </div>
      <button
        aria-label={nextThemeLabel}
        className="theme-rail-toggle"
        onClick={onToggleTheme}
        title={nextThemeLabel}
        type="button"
      >
        {theme === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
      </button>
    </nav>
  );
}
