#!/usr/bin/env python3
"""Gemini レビュー送信スクリプト"""

import os
import sys
import google.generativeai as genai

def main():
    target_file = sys.argv[1] if len(sys.argv) > 1 else 'STRATEGIC_PLAN.md'
    
    genai.configure(api_key=os.environ['GOOGLE_AI_API_KEY'])
    model = genai.GenerativeModel('gemini-2.0-flash-exp')
    
    with open(target_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    prompt = f"""
【Geminiへのレビュー依頼】

あなたの専門性（UI/UX、可視化、ユーザー体験）から、
以下のファイルをレビューしてください。

ファイル: {target_file}

---

{content}

---

レビュー内容:
1. 総合評価（10点満点）
2. UI/UX視点での分析
3. 可視化の提案
4. 改善提案（3-5個）
"""
    
    response = model.generate_content(
        prompt,
        generation_config=genai.types.GenerationConfig(
            temperature=0.7,
            max_output_tokens=4000,
        )
    )
    
    result = response.text
    print(f"✅ Geminiから回答受信（{len(result)}文字）")
    
    with open('gemini_review.txt', 'w', encoding='utf-8') as f:
        f.write(result)

if __name__ == '__main__':
    main()


