import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppToolbar } from "../components/AppToolbar";
import { DrawerMenu } from "../components/DrawerMenu";
import { QuestionIndexRail } from "../components/QuestionIndexRail";
import { catechismQuestions } from "../data/catechism";
import { useCatechizer } from "../state/CatechizerContext";

export function QuestionsScreen() {
  const navigate = useNavigate();
  const { currentProfile } = useCatechizer();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  function scrollToQuestion(questionNumber: number) {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-question-number="${questionNumber}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="questions-screen">
      <AppToolbar
        onOpenMenu={() => setIsDrawerOpen(true)}
        title={currentProfile?.name ?? "No Profile Selected"}
      />
      <section className="questions-body">
        <div className="question-list-scroll" ref={listRef}>
          {catechismQuestions.map((question) => (
            <button
              className="question-row"
              data-question-number={question.number}
              key={question.number}
              onClick={() => navigate(`/questions/${question.number}`)}
              type="button"
            >
              <span className="question-number">{question.number}</span>
              <span className="question-copy">{question.question}</span>
              <span className="question-score">
                {currentProfile?.stats.lastAttemptScores[question.number] ?? 0}%
              </span>
            </button>
          ))}
        </div>
        <QuestionIndexRail onSelect={scrollToQuestion} />
      </section>
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </main>
  );
}
