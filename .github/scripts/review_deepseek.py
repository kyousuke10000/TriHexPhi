#!/usr/bin/env python3
"""DeepSeek レビュー送信スクリプト"""

import os
import sys
from openai import OpenAI

def main():
    target_file = sys.argv[1] if len(sys.argv) > 1 else 'STRATEGIC_PLAN.md'
    
    client = OpenAI(
        api_key=os.environ['DEEPSEEK_API_KEY'],
        base_url="https://api.deepseek.com/v1"
    )
    
    with open(target_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    prompt = f"""
【DeepSeekへのレビュー依頼】

あなたの専門性（技術的深掘り、パフォーマンス、最適化）から、
以下のファイルをレビューしてください。

ファイル: {target_file}

---

{content}

---

レビュー内容:
1. 総合評価（10点満点）
2. 技術的完璧性の分析
3. パフォーマンス最適化の提案
4. 改善提案（3-5個）
"""
    
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=4000,
        temperature=0.7
    )
    
    result = response.choices[0].message.content
    print(f"✅ DeepSeekから回答受信（{len(result)}文字）")
    
    with open('deepseek_review.txt', 'w', encoding='utf-8') as f:
        f.write(result)

if __name__ == '__main__':
    main()

