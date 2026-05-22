import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCatechizer } from "../state/CatechizerContext";
import { formatDuration } from "../utils/time";

export function StatsScreen() {
  const navigate = useNavigate();
  const { clearProgress, currentProfile, getSessionElapsedMillis } = useCatechizer();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const scoreRows = useMemo(() => (
    Object.entries(currentProfile?.stats.lastAttemptScores ?? {})
      .map(([questionNumber, score]) => [Number(questionNumber), score] as const)
      .filter(([, score]) => score > 0)
      .sort(([left], [right]) => left - right)
  ), [currentProfile, now]);

  if (!currentProfile) {
    return (
      <main className="stats-screen empty-stats">
        <h1>Statistics</h1>
        <p>No active profile. Select or create one first.</p>
        <button className="native-button" onClick={() => navigate("/profiles")} type="button">
          Switch Profile
        </button>
      </main>
    );
  }

  return (
    <main className="stats-screen">
      <div className="secondary-actions stats-actions">
        <button className="text-action" onClick={() => navigate("/")} type="button">Questions</button>
      </div>
      <h1>Statistics</h1>
      <p>Grand Total Time: {formatDuration(currentProfile.stats.totalTimeSpent)}</p>
      <p>Session Time: {formatDuration(getSessionElapsedMillis(currentProfile.id))}</p>
      <p>Questions Memorized: {currentProfile.stats.questionsMemorized}</p>
      <button className="native-button clear-progress" onClick={() => clearProgress(currentProfile.id)} type="button">
        Clear Progress
      </button>
      <h2>Question Progress</h2>
      <div className="question-stats-list">
        {scoreRows.length === 0 && <p className="empty-progress">No question progress yet</p>}
        {scoreRows.map(([questionNumber, score]) => (
          <p key={questionNumber}>
            <span>Question {questionNumber}</span>
            <span>{score}%</span>
          </p>
        ))}
      </div>
    </main>
  );
}
