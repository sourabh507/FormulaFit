import {
    UserProfile,
    CalorieResults,
    MacroResults,
    DailyLog,
    WorkoutPlan,
    WorkoutSession,
} from './types';

const STORAGE_KEYS = {
    USER_PROFILE: 'formulafit_user_profile',
    CALORIE_RESULTS: 'formulafit_calorie_results',
    MACRO_RESULTS: 'formulafit_macro_results',
    WORKOUT_PLAN: 'formulafit_workout_plan',
    DAILY_LOGS: 'formulafit_daily_logs',
    WORKOUT_SESSIONS: 'formulafit_workout_sessions',
} as const;

// Check if we're in the browser
const isBrowser = typeof window !== 'undefined';

// Generic getter with type safety
function getItem<T>(key: string): T | null {
    if (!isBrowser) return null;
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        return null;
    }
}

// Generic setter
function setItem<T>(key: string, value: T): void {
    if (!isBrowser) return;
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing ${key} to localStorage:`, error);
    }
}

// Generic remover
function removeItem(key: string): void {
    if (!isBrowser) return;
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing ${key} from localStorage:`, error);
    }
}

// User Profile
export function getUserProfile(): UserProfile | null {
    return getItem<UserProfile>(STORAGE_KEYS.USER_PROFILE);
}

export function saveUserProfile(profile: UserProfile): void {
    setItem(STORAGE_KEYS.USER_PROFILE, profile);
}

export function clearUserProfile(): void {
    removeItem(STORAGE_KEYS.USER_PROFILE);
}

// Calorie Results
export function getCalorieResults(): CalorieResults | null {
    return getItem<CalorieResults>(STORAGE_KEYS.CALORIE_RESULTS);
}

export function saveCalorieResults(results: CalorieResults): void {
    setItem(STORAGE_KEYS.CALORIE_RESULTS, results);
}

// Macro Results
export function getMacroResults(): MacroResults | null {
    return getItem<MacroResults>(STORAGE_KEYS.MACRO_RESULTS);
}

export function saveMacroResults(results: MacroResults): void {
    setItem(STORAGE_KEYS.MACRO_RESULTS, results);
}

// Workout Plan
export function getWorkoutPlan(): WorkoutPlan | null {
    return getItem<WorkoutPlan>(STORAGE_KEYS.WORKOUT_PLAN);
}

export function saveWorkoutPlan(plan: WorkoutPlan): void {
    setItem(STORAGE_KEYS.WORKOUT_PLAN, plan);
}

export function clearWorkoutPlan(): void {
    removeItem(STORAGE_KEYS.WORKOUT_PLAN);
}

// Daily Logs
export function getDailyLogs(): DailyLog[] {
    return getItem<DailyLog[]>(STORAGE_KEYS.DAILY_LOGS) || [];
}

export function saveDailyLogs(logs: DailyLog[]): void {
    setItem(STORAGE_KEYS.DAILY_LOGS, logs);
}

export function getTodayLog(): DailyLog | null {
    const today = new Date().toISOString().split('T')[0];
    const logs = getDailyLogs();
    return logs.find(log => log.date === today) || null;
}

export function saveTodayLog(log: DailyLog): void {
    const logs = getDailyLogs();
    const todayIndex = logs.findIndex(l => l.date === log.date);

    if (todayIndex >= 0) {
        logs[todayIndex] = log;
    } else {
        logs.push(log);
    }

    // Keep only last 30 days
    const sortedLogs = logs
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 30);

    saveDailyLogs(sortedLogs);
}

export function resetTodayLog(): void {
    const today = new Date().toISOString().split('T')[0];
    const logs = getDailyLogs().filter(log => log.date !== today);
    saveDailyLogs(logs);
}

// Workout Sessions
export function getWorkoutSessions(): WorkoutSession[] {
    return getItem<WorkoutSession[]>(STORAGE_KEYS.WORKOUT_SESSIONS) || [];
}

export function saveWorkoutSessions(sessions: WorkoutSession[]): void {
    setItem(STORAGE_KEYS.WORKOUT_SESSIONS, sessions);
}

export function saveWorkoutSession(session: WorkoutSession): void {
    const sessions = getWorkoutSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);

    if (existingIndex >= 0) {
        sessions[existingIndex] = session;
    } else {
        sessions.push(session);
    }

    // Sort by timestamp descending
    const sortedSessions = sessions.sort((a, b) => b.timestamp - a.timestamp);
    saveWorkoutSessions(sortedSessions);
}

export function deleteWorkoutSession(sessionId: string): void {
    const sessions = getWorkoutSessions().filter(s => s.id !== sessionId);
    saveWorkoutSessions(sessions);
}

export function getWorkoutSessionsByDate(date: string): WorkoutSession[] {
    return getWorkoutSessions().filter(s => s.date === date);
}

export function getWorkoutSessionsByDateRange(startDate: string, endDate: string): WorkoutSession[] {
    return getWorkoutSessions().filter(s => s.date >= startDate && s.date <= endDate);
}

// Clear all data
export function clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
        removeItem(key);
    });
}

// Check if user has completed profile
export function hasUserProfile(): boolean {
    return getUserProfile() !== null;
}
