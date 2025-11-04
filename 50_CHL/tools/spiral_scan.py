#!/usr/bin/env python3
"""
TriHexΦ Spiral Scan Tool
六螺旋スコアを計算するツール（最小MVP版）

作成: 2025-10-28
承認: GPT-5（統治将軍）

使用法:
  python spiral_scan.py <input_file>
  python spiral_scan.py <input_file> --output <output_file>
"""

import sys
import json
import re
from pathlib import Path
from typing import Dict, List

# 六螺旋キーワードマップ（簡易版）
SPIRAL_KEYWORDS = {
    'autonomy': [
        '自律', '独立', '自分で', '選択', '決定', '自由', 'コントロール',
        'autonomous', 'independent', 'choice', 'control', 'freedom'
    ],
    'connection': [
        'つながり', '関係', '共感', '理解', '協働', '仲間', 'チーム',
        'connection', 'relationship', 'empathy', 'understanding', 'collaboration', 'team'
    ],
    'growth': [
        '成長', '学習', '進化', '発展', '向上', '改善', 'スキル',
        'growth', 'learning', 'evolution', 'development', 'improvement', 'skill'
    ],
    'purpose': [
        '目的', '意味', '価値', '使命', '貢献', '意義', 'なぜ',
        'purpose', 'meaning', 'value', 'mission', 'contribution', 'why'
    ],
    'identity': [
        'アイデンティティ', '自己', '私', '自分', 'らしさ', '存在',
        'identity', 'self', 'who', 'authenticity', 'being'
    ],
    'liberation': [
        '解放', '自由', '開放', '脱却', '超越', '突破',
        'liberation', 'freedom', 'release', 'transcend', 'breakthrough'
    ]
}

def load_text(file_path: str) -> str:
    """テキストファイルを読み込む"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        print(f"Error loading file: {e}", file=sys.stderr)
        sys.exit(1)

def count_keywords(text: str, keywords: List[str]) -> int:
    """キーワードの出現回数をカウント"""
    text_lower = text.lower()
    count = 0
    for keyword in keywords:
        count += len(re.findall(r'\b' + re.escape(keyword.lower()) + r'\b', text_lower))
    return count

def calculate_spiral_scores(text: str) -> Dict[str, float]:
    """六螺旋スコアを計算（0.0-1.0）"""
    scores = {}
    total_counts = {}
    
    # 各螺旋のキーワード出現回数をカウント
    for spiral, keywords in SPIRAL_KEYWORDS.items():
        count = count_keywords(text, keywords)
        total_counts[spiral] = count
    
    # 最大値で正規化（0.0-1.0）
    max_count = max(total_counts.values()) if total_counts.values() else 1
    
    for spiral, count in total_counts.items():
        if max_count > 0:
            scores[spiral] = round(count / max_count, 2)
        else:
            scores[spiral] = 0.0
    
    return scores

def determine_primary_spiral(scores: Dict[str, float]) -> str:
    """主要な螺旋を特定"""
    return max(scores, key=scores.get)

def determine_phase(scores: Dict[str, float], primary: str) -> str:
    """位相を判定（簡易版）"""
    primary_score = scores[primary]
    
    if primary_score >= 0.8:
        return "fulfillment"  # 充足
    elif primary_score >= 0.5:
        return "search"       # 探索
    else:
        return "deficiency"   # 欠乏
    
def generate_cause_profile(scores: Dict[str, float]) -> Dict:
    """真因プロファイルを生成"""
    primary = determine_primary_spiral(scores)
    phase = determine_phase(scores, primary)
    intensity = scores[primary]
    
    return {
        'primary': primary,
        'phase': phase,
        'intensity': intensity,
        'secondary': sorted(scores.items(), key=lambda x: x[1], reverse=True)[1][0] if len(scores) > 1 else None
    }

def generate_insights(scores: Dict[str, float], profile: Dict) -> List[str]:
    """洞察を生成（簡易版）"""
    insights = []
    
    primary = profile['primary']
    phase = profile['phase']
    
    # 位相に基づく洞察
    if phase == "deficiency":
        insights.append(f"{primary.capitalize()}の欠乏が感じられます。")
    elif phase == "search":
        insights.append(f"{primary.capitalize()}を探索中です。")
    else:
        insights.append(f"{primary.capitalize()}が充足しています。")
    
    # バランスチェック
    score_values = list(scores.values())
    if max(score_values) - min(score_values) > 0.5:
        insights.append("六螺旋のバランスに偏りがあります。")
    else:
        insights.append("六螺旋のバランスが取れています。")
    
    return insights

def main():
    if len(sys.argv) < 2:
        print("Usage: python spiral_scan.py <input_file> [--output <output_file>]")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = None
    
    # --output オプションをチェック
    if '--output' in sys.argv:
        output_index = sys.argv.index('--output')
        if output_index + 1 < len(sys.argv):
            output_file = sys.argv[output_index + 1]
    
    # テキストを読み込み
    text = load_text(input_file)
    
    # 六螺旋スコアを計算
    scores = calculate_spiral_scores(text)
    
    # 真因プロファイルを生成
    profile = generate_cause_profile(scores)
    
    # 洞察を生成
    insights = generate_insights(scores, profile)
    
    # 結果を構築
    result = {
        'input_file': input_file,
        'spiral_scores': scores,
        'cause_profile': profile,
        'insights': insights,
        'metadata': {
            'tool': 'spiral_scan.py',
            'version': '0.1.0-mvp',
            'date': '2025-10-28'
        }
    }
    
    # 出力
    if output_file:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        print(f"✅ Scan complete. Output saved to: {output_file}")
    else:
        print(json.dumps(result, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()

