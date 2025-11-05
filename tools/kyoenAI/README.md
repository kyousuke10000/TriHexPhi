# KYOEN AI Generator

響縁AI生成エンジン - 想いを言葉に

---

## Usage

### Old Mode (Compatible)

```bash
# 自己紹介文
node tools/kyoenAI/generator.mjs --mode intro --who "辻さん" --about "健康食品の想い" --tone "やわらか"

# 感謝文
node tools/kyoenAI/generator.mjs --mode thanks --who "知恵里さん" --about "今日のサポート"

# ピッチ
node tools/kyoenAI/generator.mjs --mode pitch --who "子竜" --about "響縁AIの紹介" --tone "温かく"
```

### New Preset Mode (Recommended)

```bash
# 辻モード/LINE用短文
node tools/kyoenAI/generator.mjs --preset tsuji --channel line --topic "ツクツク=分け合い/AI=想いの分配器"

# 辻モード/登壇90秒
node tools/kyoenAI/generator.mjs --preset tsuji --channel stage --topic "紹介→共鳴/ありがとうの循環"

# 知恵里モード/共感翻訳
node tools/kyoenAI/generator.mjs --preset chieri --channel line --topic "AI怖い→安心→ありがとう増加"
```

---

## Parameters

### Old Mode

| Parameter | Required | Values | Description |
|-----------|----------|--------|-------------|
| `--mode` | ✅ | intro, thanks, pitch | Generation mode |
| `--who` | No | Any | Author/target name |
| `--about` | No | Any | Context/content |
| `--tone` | No | やわらか, 温かく, etc. | Tone style |

### New Preset Mode

| Parameter | Required | Values | Description |
|-----------|----------|--------|-------------|
| `--preset` | ✅ | tsuji, chieri, plain | Preset style |
| `--topic` | ✅ | Any | Topic/content |
| `--channel` | No | line, tsukutsuku, stage | Channel format |

---

## Output

**Location:** `99_SYSTEM/Proofs/KyoenAI/{date}/{preset|mode}_{channel}_{timestamp}.md`

**Content:**
- Frontmatter (metadata with preset/channel)
- Topic/Context
- Generated text
- Timestamp

---

## Integration

- **CLI:** Uses TriHex CLI (gpt-5)
- **Encoding:** UTF-8 + NFC enforced
- **Storage:** Proofs with full traceability
- **Node:** Tokunoshima team

---

**Generated:** 2025-11-01 / Cursor (☿)  
**Brand:** KYOEN AI

---

*"想いが響けば、繋がりが生まれる。"*
