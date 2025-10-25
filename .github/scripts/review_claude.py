#!/usr/bin/env python3
"""Claude レビュー送信スクリプト"""

import os
import sys
import anthropic

def main():
    target_file = sys.argv[1] if len(sys.argv) > 1 else 'STRATEGIC_PLAN.md'
    
    client = anthropic.Anthropic(api_key=os.environ['ANTHROPIC_API_KEY'])
    
    with open(target_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    prompt = f"""
【Claudeへのレビュー依頼】

あなたの専門性（倫理、プライバシー、リスク管理）から、
以下のファイルをレビューしてください。

ファイル: {target_file}

---

{content}

---

レビュー内容:
1. 総合評価（10点満点）
2. リスク分析
3. 倫理的課題
4. 改善提案（3-5個）
"""
    
    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=4000,
        messages=[{"role": "user", "content": prompt}]
    )
    
    result = response.content[0].text
    print(f"✅ Claudeから回答受信（{len(result)}文字）")
    
    with open('claude_review.txt', 'w', encoding='utf-8') as f:
        f.write(result)

if __name__ == '__main__':
    main()

