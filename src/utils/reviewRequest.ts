import * as StoreReview from 'expo-store-review';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REVIEW_STORAGE_KEY = 'app-review-state';
const MIN_CLINICS = 3;
const MIN_APP_OPENS = 5;
const COOLDOWN_DAYS = 30;

interface ReviewState {
  appOpenCount: number;
  lastReviewRequestDate: string | null;
  hasRequestedReview: boolean;
}

async function getReviewState(): Promise<ReviewState> {
  try {
    const data = await AsyncStorage.getItem(REVIEW_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return { appOpenCount: 0, lastReviewRequestDate: null, hasRequestedReview: false };
}

async function saveReviewState(state: ReviewState): Promise<void> {
  await AsyncStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(state));
}

/** ホーム画面表示時に呼ぶ。条件を満たせばレビューダイアログを表示 */
export async function maybeRequestReview(clinicCount: number): Promise<void> {
  const state = await getReviewState();

  // アプリ起動回数をインクリメント
  state.appOpenCount += 1;
  await saveReviewState(state);

  // クールダウン期間チェック
  if (state.lastReviewRequestDate) {
    const lastDate = new Date(state.lastReviewRequestDate);
    const daysSince = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince < COOLDOWN_DAYS) return;
  }

  // 条件チェック: 診察券3枚以上 AND アプリ起動5回以上
  if (clinicCount < MIN_CLINICS || state.appOpenCount < MIN_APP_OPENS) return;

  // StoreReview APIが利用可能か確認
  const isAvailable = await StoreReview.isAvailableAsync();
  if (!isAvailable) return;

  // レビューリクエスト表示
  await StoreReview.requestReview();
  state.lastReviewRequestDate = new Date().toISOString();
  state.hasRequestedReview = true;
  await saveReviewState(state);
}
