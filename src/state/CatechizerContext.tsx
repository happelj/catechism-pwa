import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  CatechizerSettings,
  Profile,
  ProfileStats,
} from "../types/profile";

type StoredState = {
  profiles: Profile[];
  settings: CatechizerSettings;
};

type CatechizerContextValue = StoredState & {
  clearProgress: (profileId: string) => void;
  createProfile: (name: string) => Profile | null;
  currentProfile: Profile | null;
  deleteProfile: (profileId: string) => void;
  getSessionElapsedMillis: (profileId: string) => number;
  markProofHelpSeen: () => void;
  recordAttempt: (questionNumber: number, score: number, timeSpentMillis: number) => void;
  switchProfile: (profileId: string) => void;
  toggleTheme: () => void;
};

const STORAGE_KEY = "westminster-catechizer-state-v1";
const CatechizerContext = createContext<CatechizerContextValue | null>(null);

function createStats(): ProfileStats {
  return {
    lastAttemptScores: {},
    memorizedQuestions: [],
    questionStats: {},
    questionsMemorized: 0,
    sessionStartTime: 0,
    totalTimeSpent: 0,
  };
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `profile-${Date.now()}`;
}

function defaultState(): StoredState {
  return {
    profiles: [],
    settings: {
      currentProfileId: null,
      hasSeenProofHelp: false,
      theme: "light",
    },
  };
}

function normalizeStoredState(value: unknown): StoredState {
  const fallback = defaultState();

  if (!value || typeof value !== "object") {
    return fallback;
  }

  const parsed = value as Partial<StoredState>;
  const profiles = Array.isArray(parsed.profiles) ? parsed.profiles.map((profile) => ({
    id: profile.id || createId(),
    name: profile.name,
    stats: {
      ...createStats(),
      ...profile.stats,
      lastAttemptScores: profile.stats?.lastAttemptScores ?? {},
      memorizedQuestions: profile.stats?.memorizedQuestions ?? [],
      questionStats: profile.stats?.questionStats ?? {},
      sessionStartTime: 0,
    },
  })) : [];

  return {
    profiles,
    settings: {
      currentProfileId: parsed.settings?.currentProfileId ?? fallback.settings.currentProfileId,
      hasSeenProofHelp: parsed.settings?.hasSeenProofHelp ?? fallback.settings.hasSeenProofHelp,
      theme: parsed.settings?.theme === "dark" ? "dark" : fallback.settings.theme,
    },
  };
}

function loadState() {
  try {
    return normalizeStoredState(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null"));
  } catch {
    return defaultState();
  }
}

function pauseProfileSession(profile: Profile, now: number) {
  if (profile.stats.sessionStartTime <= 0) {
    return profile;
  }

  return {
    ...profile,
    stats: {
      ...profile.stats,
      sessionStartTime: 0,
      totalTimeSpent: profile.stats.totalTimeSpent + Math.max(0, now - profile.stats.sessionStartTime),
    },
  };
}

function resumeProfileSession(profile: Profile, now: number) {
  if (profile.stats.sessionStartTime > 0) {
    return profile;
  }

  return {
    ...profile,
    stats: {
      ...profile.stats,
      sessionStartTime: now,
    },
  };
}

function updateProfile(profiles: Profile[], profileId: string, update: (profile: Profile) => Profile) {
  return profiles.map((profile) => (profile.id === profileId ? update(profile) : profile));
}

export function CatechizerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(loadState);
  const currentProfile = state.profiles.find((profile) => profile.id === state.settings.currentProfileId) ?? null;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    document.documentElement.dataset.theme = state.settings.theme;
  }, [state]);

  useEffect(() => {
    if (!state.settings.currentProfileId) {
      return;
    }

    setState((current) => ({
      ...current,
      profiles: updateProfile(
        current.profiles,
        state.settings.currentProfileId!,
        (profile) => resumeProfileSession(profile, Date.now()),
      ),
    }));
  }, [state.settings.currentProfileId]);

  useEffect(() => {
    function syncSessionVisibility() {
      setState((current) => {
        const activeId = current.settings.currentProfileId;
        if (!activeId) {
          return current;
        }

        return {
          ...current,
          profiles: updateProfile(current.profiles, activeId, (profile) => (
            document.visibilityState === "hidden"
              ? pauseProfileSession(profile, Date.now())
              : resumeProfileSession(profile, Date.now())
          )),
        };
      });
    }

    document.addEventListener("visibilitychange", syncSessionVisibility);
    return () => document.removeEventListener("visibilitychange", syncSessionVisibility);
  }, []);

  const createProfile = useCallback((name: string) => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return null;
    }

    const normalizedName = trimmedName[0].toUpperCase() + trimmedName.slice(1);
    const duplicate = state.profiles.some((profile) => profile.name.toLowerCase() === normalizedName.toLowerCase());

    if (duplicate) {
      return null;
    }

    const createdProfile: Profile = {
      id: createId(),
      name: normalizedName,
      stats: createStats(),
    };

    setState((current) => {
      if (current.profiles.some((profile) => profile.name.toLowerCase() === normalizedName.toLowerCase())) {
        return current;
      }

      const now = Date.now();
      return {
        profiles: [
          ...current.profiles.map((profile) => (
            profile.id === current.settings.currentProfileId ? pauseProfileSession(profile, now) : profile
          )),
          resumeProfileSession(createdProfile, now),
        ],
        settings: {
          ...current.settings,
          currentProfileId: createdProfile.id,
        },
      };
    });

    return createdProfile;
  }, [state.profiles]);

  const switchProfile = useCallback((profileId: string) => {
    setState((current) => {
      if (current.settings.currentProfileId === profileId) {
        return current;
      }

      const now = Date.now();
      const profiles = current.profiles.map((profile) => {
        if (profile.id === current.settings.currentProfileId) {
          return pauseProfileSession(profile, now);
        }

        if (profile.id === profileId) {
          return resumeProfileSession(profile, now);
        }

        return profile;
      });

      return {
        profiles,
        settings: {
          ...current.settings,
          currentProfileId: profiles.some((profile) => profile.id === profileId) ? profileId : null,
        },
      };
    });
  }, []);

  const deleteProfile = useCallback((profileId: string) => {
    setState((current) => ({
      profiles: current.profiles.filter((profile) => profile.id !== profileId),
      settings: {
        ...current.settings,
        currentProfileId: current.settings.currentProfileId === profileId ? null : current.settings.currentProfileId,
      },
    }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState((current) => ({
      ...current,
      settings: {
        ...current.settings,
        theme: current.settings.theme === "dark" ? "light" : "dark",
      },
    }));
  }, []);

  const recordAttempt = useCallback((questionNumber: number, score: number, timeSpentMillis: number) => {
    setState((current) => {
      const profileId = current.settings.currentProfileId;
      if (!profileId) {
        return current;
      }

      return {
        ...current,
        profiles: updateProfile(current.profiles, profileId, (profile) => {
          const existingScore = profile.stats.lastAttemptScores[questionNumber] ?? 0;
          const highestScore = Math.max(existingScore, score);
          const questionStats = profile.stats.questionStats[questionNumber] ?? { attempts: [] };
          const nextScores = {
            ...profile.stats.lastAttemptScores,
            [questionNumber]: highestScore,
          };
          const memorizedQuestions = Object.entries(nextScores)
            .filter(([, percent]) => percent >= 100)
            .map(([number]) => Number(number));

          return {
            ...profile,
            stats: {
              ...profile.stats,
              lastAttemptScores: nextScores,
              memorizedQuestions,
              questionStats: {
                ...profile.stats.questionStats,
                [questionNumber]: {
                  attempts: [
                    ...questionStats.attempts,
                    {
                      score,
                      timeSpentMillis,
                      timestamp: Date.now(),
                    },
                  ],
                },
              },
              questionsMemorized: memorizedQuestions.length,
            },
          };
        }),
      };
    });
  }, []);

  const clearProgress = useCallback((profileId: string) => {
    setState((current) => ({
      ...current,
      profiles: updateProfile(current.profiles, profileId, (profile) => ({
        ...profile,
        stats: {
          ...createStats(),
          sessionStartTime: Date.now(),
        },
      })),
    }));
  }, []);

  const getSessionElapsedMillis = useCallback((profileId: string) => {
    const profile = state.profiles.find((item) => item.id === profileId);
    return profile?.stats.sessionStartTime ? Math.max(0, Date.now() - profile.stats.sessionStartTime) : 0;
  }, [state.profiles]);

  const markProofHelpSeen = useCallback(() => {
    setState((current) => ({
      ...current,
      settings: {
        ...current.settings,
        hasSeenProofHelp: true,
      },
    }));
  }, []);

  const value = useMemo<CatechizerContextValue>(() => ({
    ...state,
    clearProgress,
    createProfile,
    currentProfile,
    deleteProfile,
    getSessionElapsedMillis,
    markProofHelpSeen,
    recordAttempt,
    switchProfile,
    toggleTheme,
  }), [
    clearProgress,
    createProfile,
    currentProfile,
    deleteProfile,
    getSessionElapsedMillis,
    markProofHelpSeen,
    recordAttempt,
    state,
    switchProfile,
    toggleTheme,
  ]);

  return <CatechizerContext.Provider value={value}>{children}</CatechizerContext.Provider>;
}

export function useCatechizer() {
  const value = useContext(CatechizerContext);

  if (!value) {
    throw new Error("useCatechizer must be used inside CatechizerProvider.");
  }

  return value;
}
