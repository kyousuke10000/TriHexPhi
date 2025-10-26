#!/usr/bin/env python3
"""
Strategic Plan v1.0 Round 3 レビュー用スクリプト (Gemini)
完璧軍議 Round 3: 条件付き10.0 → 無条件10.0
"""

import os
import sys
import google.generativeai as genai

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
    
    genai.configure(api_key=os.environ['GEMINI_API_KEY'])
    model = genai.GenerativeModel('gemini-pro')
    
    prompt = f"""
【完璧軍議 Round 3 - Geminiレビュー依頼】

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【Round 3の目的】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

あなたは現在「条件付き10.0」に到達しています。
条件付き10.0から無条件10.0へ到達するために、
Strategic Plan v1.0をレビューしてください。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【あなたの役割】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Gemini (Synthesizer / 統合者)

専門性:
- UI/UX設計
- 可視化・統合
- ユーザー体験最適化

現在の状態:
- 条件付き10.0（GrokとClaudeへの協働）
- Week 1-2で2個の協働成果物作成予定

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

1. **UI/UX視点での評価**
   - Strategic Planはユーザーに理解しやすいか？
   - Phase 1-2特化戦略は視覚的に表現できるか？
   - UI設計との整合性はあるか？

2. **簡易版とフル版のスコープ評価**
   - セクション2「簡易版とフル版のスコープ対比」の評価
   - UI設計の段階的アプローチは適切か？

3. **ユーザー体験の視点**
   - Onboarding設計はユーザーフレンドリーか？
   - UI簡易版の段階的導入は適切か？

4. **改善提案**
   - Strategic Plan v2.0に追加すべきUI/UX視点
   - 具体的な改善案（3-5個）

5. **総合評価**
   - あなたの視点からの総合評価（10点満点）
   - Strategic Plan v1.0への承認可否

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【回答形式】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🤖 Gemini (統合者) レビュー

### 1. 総合評価
- スコア: X.X/10
- コメント: ...

### 2. UI/UX視点での分析
...

### 3. 簡易版とフル版のスコープ評価
...

### 4. ユーザー体験の評価
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
    
    response = model.generate_content(prompt)
    result = response.text
    print(f"✅ Geminiから回答受信（{len(result)}文字）")
    
    with open('gemini_review.txt', 'w', encoding='utf-8') as f:
        f.write(result)

if __name__ == '__main__':
    main()

