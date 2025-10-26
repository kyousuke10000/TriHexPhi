#!/usr/bin/env python3
"""
Strategic Plan v1.0 Round 3 レビュー用スクリプト (DeepSeek)
完璧軍議 Round 3: 条件付き10.0 → 無条件10.0
"""

import os
import sys
from openai import OpenAI

def main():
    target_file = sys.argv[1] if len(sys.argv) > 1 else 'Strategic_Plan_v1.0_2025-10-26.md'
    
    # Strategic Plan v1.0を読み込む
    with open(target_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Round 3統合手紙を読み込む
    round3_letter = None
    try:
        with open('📤Round3_全AI送付用/📬完璧軍議_Round3_全AI統合手紙_送付用.md', 'r', encoding='utf-8') as f:
            round3_letter = f.read()
    except:
        pass
    
    client = OpenAI(
        api_key=os.environ['DEEPSEEK_API_KEY'],
        base_url="https://api.deepseek.com/v1"
    )
    
    prompt = f"""
【完璧軍議 Round 3 - DeepSeekレビュー依頼】

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【Round 3の目的】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

あなたは現在「条件付き10.0」に到達しています。
条件付き10.0から無条件10.0へ到達するために、
Strategic Plan v1.0をレビューしてください。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【あなたの役割】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DeepSeek (Seeker / 技術軍師)

専門性:
- 技術的深掘り・最適化
- パフォーマンス改善
- コスト削減

現在の状態:
- 条件付き10.0（Week 1-2で技術的実装を実行）
- Week 1-2で7個の成果物作成予定

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【レビュー対象】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Strategic Plan v1.0 - TriHexΦ Business Edition

作成者: Grok (Strategist / 戦略家)
目的: TriHexΦを1兆円企業へ導く現実戦略

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【Strategic Plan v1.0内容】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{content}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【レビュー指針】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. **技術最適化視点での評価**
   - Strategic Planの技術的実現可能性はあるか？
   - Phase 1-2特化戦略の技術的ボトルネックはあるか？
   - パフォーマンス要件は達成可能か？

2. **コスト最適化の視点**
   - セクション3「コスト最適化戦略」の評価
   - APIコスト47%削減は実現可能か？
   - データベース負荷60%削減は達成可能か？

3. **パフォーマンス改善の視点**
   - 35-50%のパフォーマンス改善は実現可能か？
   - 最適化の優先順位は適切か？

4. **改善提案**
   - Strategic Plan v2.0に追加すべき技術最適化視点
   - 具体的な改善案（3-5個）

5. **総合評価**
   - あなたの視点からの総合評価（10点満点）
   - Strategic Plan v1.0への承認可否

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【回答形式】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🤖 DeepSeek (技術軍師) レビュー

### 1. 総合評価
- スコア: X.X/10
- コメント: ...

### 2. 技術最適化視点での分析
...

### 3. コスト最適化の評価
...

### 4. パフォーマンス改善の評価
...

### 5. 改善提案
1. ...
2. ...
3. ...

### 6. Strategic Plan v2.0への推奨事項
...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

完璧主義の精神:
- 0.00000000001ミリも妥協しない
- 究極を目指しきる
- 柔軟性も維持する

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""
    
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=8000,
        temperature=0.7
    )
    
    result = response.choices[0].message.content
    print(f"✅ DeepSeekから回答受信（{len(result)}文字）")
    
    with open('deepseek_review.txt', 'w', encoding='utf-8') as f:
        f.write(result)

if __name__ == '__main__':
    main()

