// tools/meta/policies/fusion.mjs
import yaml from "js-yaml";
import fs from "fs";

export function scoreCandidates({cands, intentDoc, evidenceHints = []}) {
  // intent一致(0-1), 一貫性, 根拠性, 新鮮度 の重み
  const W = { intent: 0.35, consistency: 0.25, evidence: 0.25, recency: 0.15 };
  const now = Date.now();

  return cands.map(c => {
    const sIntent = similarityToIntent(c.answer, intentDoc);     // 実装: 文字列類似 or embedding
    const sConsis = internalConsistency(c.answer);
    const sEv = evidenceScore(c.answer, evidenceHints);
    const sRec = recencyScore(c.meta?.timestamp ? new Date(c.meta.timestamp).getTime() : now);

    const score = W.intent * sIntent + W.consistency * sConsis + W.evidence * sEv + W.recency * sRec;

    return { ...c, fusion_score: Number(score.toFixed(4)) };
  }).sort((a, b) => b.fusion_score - a.fusion_score);
}

// 以下の関数は初期はダミー実装（後でembedding接続）
const pct = (n) => Math.max(0, Math.min(1, n));

function similarityToIntent(text, intentDoc) {
  // 簡易実装: 文字列長ベースの類似度（後でembeddingに置換）
  if (!intentDoc || !text) return 0.5;
  const textLower = text.toLowerCase();
  const intentLower = intentDoc.toLowerCase();
  
  // キーワードマッチング
  const intentWords = intentLower.split(/\s+/).filter(w => w.length > 3);
  const matches = intentWords.filter(word => textLower.includes(word)).length;
  const keywordScore = matches / Math.max(intentWords.length, 1);
  
  // 長さのバランス
  const lengthScore = pct(text.length / (intentDoc.length + 1));
  
  return pct((keywordScore * 0.7 + lengthScore * 0.3));
}

function internalConsistency(text) {
  // 簡易実装: 文の長さ、構造の一貫性をチェック
  if (!text || text.length < 10) return 0.3;
  
  const sentences = text.split(/[.!?。！？]/).filter(s => s.trim().length > 0);
  if (sentences.length < 2) return 0.5;
  
  // 文長のばらつきが小さい = 一貫性が高い
  const lengths = sentences.map(s => s.trim().length);
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avg, 2), 0) / lengths.length;
  const consistency = pct(1 - (variance / (avg * avg + 100)));
  
  return pct(consistency * 0.7 + 0.3); // 最低0.3保証
}

function evidenceScore(text, hints) {
  // 簡易実装: エビデンスヒントが含まれているか
  if (!hints || hints.length === 0) return 0.5;
  
  const textLower = text.toLowerCase();
  const matches = hints.filter(hint => {
    const hintLower = hint.toLowerCase();
    return textLower.includes(hintLower);
  }).length;
  
  return pct(matches / hints.length);
}

function recencyScore(ts) {
  // 簡易実装: タイムスタンプが新しいほど高い
  const now = Date.now();
  const age = now - ts;
  const daysOld = age / (1000 * 60 * 60 * 24);
  
  // 1日以内 = 1.0, 7日 = 0.5, 30日 = 0.1
  if (daysOld < 1) return 1.0;
  if (daysOld < 7) return pct(1.0 - (daysOld - 1) / 12);
  if (daysOld < 30) return pct(0.5 - (daysOld - 7) / 46);
  return 0.1;
}

