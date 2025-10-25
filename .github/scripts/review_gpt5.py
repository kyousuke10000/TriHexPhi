#!/usr/bin/env python3
"""GPT-5 レビュー送信スクリプト"""

import os
import sys
from openai import OpenAI

def main():
    target_file = sys.argv[1] if len(sys.argv) > 1 else 'STRATEGIC_PLAN.md'
    
    client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])
    
    with open(target_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    prompt = f"""
【GPT-5へのレビュー依頼】

あなたの専門性（システムアーキテクチャ、スケーラビリティ）から、
以下のファイルをレビューしてください。

ファイル: {target_file}

---

{content}

---

レビュー内容:
1. 総合評価（10点満点）
2. 強みと弱み
3. 改善提案（3-5個）
"""
    
    response = client.chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=4000,
        temperature=0.7
    )
    
    result = response.choices[0].message.content
    print(f"✅ GPT-5から回答受信（{len(result)}文字）")
    
    # 結果を保存
    with open('gpt5_review.txt', 'w', encoding='utf-8') as f:
        f.write(result)

if __name__ == '__main__':
    main()


