#!/usr/bin/env python3
"""
TriHexΦ Cause Profile Tool
真因プロファイルを生成するツール（最小MVP版）

作成: 2025-10-28
承認: GPT-5（統治将軍）

使用法:
  python cause_profile.py <spiral_scan_output.json>
"""

import sys
import json
from typing import Dict, List

# 真因タイプの定義
CAUSE_TYPES = {
    'autonomy_deficiency': {
        'name': '自律性の欠如',
        'description': 'コントロール感の喪失、他者依存',
        'recommendations': ['自己決定の機会を増やす', '小さな選択から始める']
    },
    'connection_deficiency': {
        'name': 'つながりの欠如',
        'description': '孤立感、理解されていない感覚',
        'recommendations': ['共感的な対話', 'コミュニティへの参加']
    },
    'growth_deficiency': {
        'name': '成長の停滞',
        'description': '学習機会の不足、進歩感の欠如',
        'recommendations': ['新しいスキル習得', '挑戦的な目標設定']
    },
    'purpose_deficiency': {
        'name': '目的の不明確さ',
        'description': '意味の喪失、方向性の欠如',
        'recommendations': ['価値観の明確化', '使命の探索']
    },
    'identity_deficiency': {
        'name': 'アイデンティティの混乱',
        'description': '自己理解の不足、らしさの喪失',
        'recommendations': ['自己探索', '強みの発見']
    },
    'liberation_deficiency': {
        'name': '束縛・制約',
        'description': '自由の制限、固定観念',
        'recommendations': ['制約の再定義', '新しい視点の獲得']
    }
}

def load_spiral_scan(file_path: str) -> Dict:
    """spiral_scan.pyの出力を読み込む"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}", file=sys.stderr)
        sys.exit(1)

def identify_cause_type(profile: Dict) -> str:
    """真因タイプを特定"""
    primary = profile['primary']
    phase = profile['phase']
    
    if phase == "deficiency":
        return f"{primary}_deficiency"
    else:
        # 欠乏以外の場合は、最も低いスコアを持つ螺旋を特定
        return None

def generate_detailed_profile(spiral_data: Dict, cause_type: str = None) -> Dict:
    """詳細な真因プロファイルを生成"""
    profile = spiral_data['cause_profile']
    scores = spiral_data['spiral_scores']
    
    # 真因タイプの特定
    if not cause_type:
        cause_type = identify_cause_type(profile)
    
    result = {
        'primary_spiral': profile['primary'],
        'phase': profile['phase'],
        'intensity': profile['intensity'],
        'secondary_spiral': profile.get('secondary'),
        'scores': scores
    }
    
    # 真因タイプの詳細
    if cause_type and cause_type in CAUSE_TYPES:
        cause_info = CAUSE_TYPES[cause_type]
        result['cause_type'] = {
            'id': cause_type,
            'name': cause_info['name'],
            'description': cause_info['description'],
            'recommendations': cause_info['recommendations']
        }
    
    # バランス分析
    score_values = list(scores.values())
    result['balance'] = {
        'max': max(score_values),
        'min': min(score_values),
        'range': max(score_values) - min(score_values),
        'balanced': max(score_values) - min(score_values) < 0.3
    }
    
    # 推奨する次のAI担当者
    result['recommended_reviewers'] = determine_reviewers(profile, scores)
    
    return result

def determine_reviewers(profile: Dict, scores: Dict) -> List[str]:
    """推奨レビュアーを決定"""
    reviewers = []
    
    primary = profile['primary']
    
    # 主要な螺旋に基づく専門家
    if primary in ['autonomy', 'liberation']:
        reviewers.append('Claude')  # 倫理・自律性
    
    if primary in ['connection', 'identity']:
        reviewers.append('Gemini')  # 体験・アイデンティティ
    
    if primary in ['purpose', 'growth']:
        reviewers.append('Grok')    # 戦略・目的
    
    if primary == 'growth':
        reviewers.append('DeepSeek')  # 技術・最適化
    
    # デフォルトで全員
    if not reviewers:
        reviewers = ['Claude', 'Gemini', 'Grok', 'DeepSeek']
    
    return list(set(reviewers))  # 重複削除

def main():
    if len(sys.argv) < 2:
        print("Usage: python cause_profile.py <spiral_scan_output.json>")
        sys.exit(1)
    
    input_file = sys.argv[1]
    
    # spiral_scan.pyの出力を読み込み
    spiral_data = load_spiral_scan(input_file)
    
    # 詳細プロファイルを生成
    profile = generate_detailed_profile(spiral_data)
    
    # 結果を構築
    result = {
        'input_file': input_file,
        'profile': profile,
        'metadata': {
            'tool': 'cause_profile.py',
            'version': '0.1.0-mvp',
            'date': '2025-10-28'
        }
    }
    
    # 出力
    print(json.dumps(result, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()

