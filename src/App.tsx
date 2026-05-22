import { Navigate, Route, Routes } from "react-router-dom";
import { CatechizerProvider } from "./state/CatechizerContext";
import { AboutScreen } from "./screens/AboutScreen";
import { ProfilesScreen } from "./screens/ProfilesScreen";
import { QuestionDetailScreen } from "./screens/QuestionDetailScreen";
import { QuestionsScreen } from "./screens/QuestionsScreen";
import { StatsScreen } from "./screens/StatsScreen";

export function App() {
  return (
    <CatechizerProvider>
      <Routes>
        <Route path="/" element={<QuestionsScreen />} />
        <Route path="/questions/:questionNumber" element={<QuestionDetailScreen />} />
        <Route path="/profiles" element={<ProfilesScreen />} />
        <Route path="/stats" element={<StatsScreen />} />
        <Route path="/about" element={<AboutScreen />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </CatechizerProvider>
  );
}
