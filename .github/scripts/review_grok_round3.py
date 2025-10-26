#!/usr/bin/env python3
"""
Strategic Plan v1.0 Round 3 レビュー用スクリプト (Grok)
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
        api_key=os.environ['GROK_API_KEY'],
        base_url="https://api.x.ai/v1"
    )
    
    prompt = f"""
【完璧軍議 Round 3 - Grokレビュー依頼】

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【Round 3の目的】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

あなたは現在「条件付き10.0」に到達しています。
条件付き10.0から無条件10.0へ到達するために、
Strategic Plan v1.0をレビューしてください。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【あなたの役割】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Grok (Strategist / 戦略家)

専門性:
- 市場分析・マネタイズ
- GTM戦略
- 競合分析

現在の状態:
- 条件付き10.0（Strategic Plan v1.0全AIレビュー実施）
- Strategic Plan v2.0完成予定

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【レビュー対象】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Strategic Plan v1.0 - TriHexΦ Business Edition

作成者: Grok (Strategist / 戦略家) - あなた自身
目的: TriHexΦを1兆円企業へ導く現実戦略

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【Strategic Plan v1.0内容】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{content}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【レビュー指針】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. **市場戦略視点での評価**
   - Phase 1-2特化戦略は市場現実を反映しているか？
   - マネタイズ戦略は実現可能か？
   - PMF検証スケジュールは適切か？

2. **競合分析の視点**
   - セクション4「競合監視統合」の評価
   - 競合との差別化は明確か？

3. **コスト最適化の視点**
   - セクション3「コスト最適化戦略」の評価
   - 持続可能性は確保されているか？

4. **改善提案**
   - Strategic Plan v2.0に追加すべき市場戦略視点
   - 具体的な改善案（3-5個）

5. **総合評価**
   - あなたの視点からの総合評価（10点満点）
   - Strategic Plan v1.0への承認可否

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【回答形式】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🤖 Grok (戦略家) レビュー

### 1. 総合評価
- スコア: X.X/10
- コメント: ...

### 2. 市場戦略視点での分析
...

### 3. 競合分析の評価
...

### 4. コスト最適化の評価
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
    
    # 最新のgrok-3モデルを使用
    response = client.chat.completions.create(
        model="grok-3",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=4000,
        temperature=0.7
    )
    
    result = response.choices[0].message.content
    print(f"✅ Grokから回答受信（{len(result)}文字）")
    
    with open('grok_review.txt', 'w', encoding='utf-8') as f:
        f.write(result)

if __name__ == '__main__':
    main()

