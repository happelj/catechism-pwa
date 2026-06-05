import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppToolbar } from "../components/AppToolbar";
import { Dialog } from "../components/Dialog";
import { DrawerMenu } from "../components/DrawerMenu";
import { QuestionIndexRail } from "../components/QuestionIndexRail";
import { catechismQuestions } from "../data/catechism";
import { useCatechizer } from "../state/CatechizerContext";

type IntroDialog = "create-profile" | "theme-toggle" | null;

function ThemeHelpIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M9 21h6" />
      <path d="M10 17h4" />
      <path d="M12 3a7 7 0 0 0-4.1 12.7c.7.5 1.1 1.2 1.1 2.1V18h6v-.2c0-.9.4-1.6 1.1-2.1A7 7 0 0 0 12 3Z" />
    </svg>
  );
}

export function QuestionsScreen() {
  const navigate = useNavigate();
  const {
    currentProfile,
    markCreateProfileHelpSeen,
    markThemeToggleHelpSeen,
    settings,
    toggleTheme,
  } = useCatechizer();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [introDialog, setIntroDialog] = useState<IntroDialog>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (introDialog) {
      return;
    }

    if (!currentProfile && !settings.hasSeenCreateProfileHelp) {
      setIntroDialog("create-profile");
      return;
    }

    if (!settings.hasSeenThemeToggleHelp && (currentProfile || settings.hasSeenCreateProfileHelp)) {
      setIntroDialog("theme-toggle");
    }
  }, [
    currentProfile,
    introDialog,
    settings.hasSeenCreateProfileHelp,
    settings.hasSeenThemeToggleHelp,
  ]);

  function scrollToQuestion(questionNumber: number) {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-question-number="${questionNumber}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function dismissCreateProfileHelp() {
    markCreateProfileHelpSeen();
    setIntroDialog(null);
  }

  function dismissThemeToggleHelp() {
    markThemeToggleHelpSeen();
    setIntroDialog(null);
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
        <QuestionIndexRail onSelect={scrollToQuestion} onToggleTheme={toggleTheme} theme={settings.theme} />
      </section>
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      {introDialog === "create-profile" && (
        <Dialog onDismiss={dismissCreateProfileHelp} title="Create a Profile">
          <p className="dialog-copy">Progress tracking requires a profile.</p>
          <p className="dialog-copy">To create one:</p>
          <p className="dialog-copy">Menu → Switch Profile → Create Profile</p>
          <p className="dialog-copy">
            Without a profile, question progress percentages will remain at 0%.
          </p>
          <div className="dialog-actions">
            <button onClick={dismissCreateProfileHelp} type="button">Don't Show Again</button>
            <button onClick={dismissCreateProfileHelp} type="button">OK</button>
          </div>
        </Dialog>
      )}
      {introDialog === "theme-toggle" && (
        <Dialog onDismiss={dismissThemeToggleHelp} title="Theme Toggle">
          <p className="dialog-copy">
            You can switch between light mode and dark mode using the light bulb button in the
            bottom-right corner.
          </p>
          <div className="theme-help-visual">
            <ThemeHelpIcon />
            <span>Look here ↓</span>
          </div>
          <div className="dialog-actions">
            <button onClick={dismissThemeToggleHelp} type="button">OK</button>
          </div>
        </Dialog>
      )}
    </main>
  );
}
