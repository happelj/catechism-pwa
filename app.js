const QUESTIONS = [
  {
    id: "wsc-001",
    question: "What is the chief end of man?",
    answer: "Man's chief end is to glorify God, and to enjoy him forever.",
  },
  {
    id: "wsc-002",
    question: "What rule hath God given to direct us how we may glorify and enjoy him?",
    answer: "The Word of God, which is contained in the Scriptures of the Old and New Testaments, is the only rule to direct us how we may glorify and enjoy him.",
  },
  {
    id: "wsc-003",
    question: "What do the Scriptures principally teach?",
    answer: "The Scriptures principally teach what man is to believe concerning God, and what duty God requires of man.",
  },
];

const STORAGE_KEY = "westminster-catechizer-progress";

const state = {
  currentIndex: 0,
  revealed: false,
  progress: loadProgress(),
};

const elements = {
  answerText: document.querySelector("#answer-text"),
  answerWrap: document.querySelector("#answer-wrap"),
  markKnown: document.querySelector("#mark-known"),
  meterFill: document.querySelector("#meter-fill"),
  progressLabel: document.querySelector("#progress-label"),
  questionIndex: document.querySelector("#question-index"),
  questionList: document.querySelector("#question-list"),
  questionText: document.querySelector("#question-text"),
  ratingActions: document.querySelector("#rating-actions"),
  resetProgress: document.querySelector("#reset-progress"),
  revealAnswer: document.querySelector("#reveal-answer"),
  reviewAgain: document.querySelector("#review-again"),
  summaryText: document.querySelector("#summary-text"),
};

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
}

function getKnownCount() {
  return QUESTIONS.filter((question) => state.progress[question.id] === "known").length;
}

function findNextIndex() {
  const nextReview = QUESTIONS.findIndex((question, index) => (
    index > state.currentIndex && state.progress[question.id] !== "known"
  ));

  if (nextReview >= 0) {
    return nextReview;
  }

  const firstReview = QUESTIONS.findIndex((question) => state.progress[question.id] !== "known");
  return firstReview >= 0 ? firstReview : 0;
}

function rateCurrent(status) {
  const question = QUESTIONS[state.currentIndex];
  state.progress[question.id] = status;
  state.currentIndex = findNextIndex();
  state.revealed = false;
  saveProgress();
  render();
}

function renderQuestionList() {
  elements.questionList.innerHTML = "";

  QUESTIONS.forEach((question, index) => {
    const status = state.progress[question.id] ?? "new";
    const item = document.createElement("li");
    const label = document.createElement("span");
    const badge = document.createElement("span");

    label.textContent = `${index + 1}. ${question.question}`;
    badge.textContent = status;
    badge.className = `status ${status}`;

    item.append(label, badge);
    elements.questionList.append(item);
  });
}

function render() {
  const question = QUESTIONS[state.currentIndex];
  const knownCount = getKnownCount();
  const percentKnown = Math.round((knownCount / QUESTIONS.length) * 100);

  elements.questionIndex.textContent = `Question ${state.currentIndex + 1} of ${QUESTIONS.length}`;
  elements.progressLabel.textContent = `${percentKnown}% known`;
  elements.questionText.textContent = question.question;
  elements.answerText.textContent = question.answer;
  elements.answerWrap.hidden = !state.revealed;
  elements.revealAnswer.hidden = state.revealed;
  elements.ratingActions.hidden = !state.revealed;
  elements.summaryText.textContent = `${knownCount} of ${QUESTIONS.length} marked known`;
  elements.meterFill.style.width = `${percentKnown}%`;

  renderQuestionList();
}

elements.revealAnswer.addEventListener("click", () => {
  state.revealed = true;
  render();
});

elements.markKnown.addEventListener("click", () => {
  rateCurrent("known");
});

elements.reviewAgain.addEventListener("click", () => {
  rateCurrent("review");
});

elements.resetProgress.addEventListener("click", () => {
  state.progress = {};
  state.currentIndex = 0;
  state.revealed = false;
  saveProgress();
  render();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js");
  });
}

render();

