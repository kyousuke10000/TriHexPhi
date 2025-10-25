#!/usr/bin/env python3
"""Grok レビュー送信スクリプト"""

import os
import sys
from openai import OpenAI

def main():
    target_file = sys.argv[1] if len(sys.argv) > 1 else 'STRATEGIC_PLAN.md'
    
    client = OpenAI(
        api_key=os.environ['GROK_API_KEY'],
        base_url="https://api.x.ai/v1"
    )
    
    with open(target_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    prompt = f"""
【Grokへのレビュー依頼】

あなたの専門性（市場分析、マネタイズ、GTM戦略）から、
以下のファイルをレビューしてください。

ファイル: {target_file}

---

{content}

---

レビュー内容:
1. 総合評価（10点満点）
2. 市場性分析
3. マネタイズ戦略の評価
4. 改善提案（3-5個）
"""
    
    response = client.chat.completions.create(
        model="grok-4-fast-reasoning",
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

