# 🤖 OpenAI Assistant Setup Guide

**Goal:** Create and configure OpenAI Assistant for psychological analysis

---

## ✅ Step 1: Get OpenAI API Key (2 min)

1. Go to: https://platform.openai.com/api-keys
2. Sign in / Create account
3. Click "Create new secret key"
4. Name: `MaverickAI Production`
5. Copy the key (starts with `sk-`)
6. Add to `.env`:
   ```env
   VITE_OPENAI_API_KEY=sk-your-key-here
   ```

**⚠️ Important:** Key only shows once! Save it securely.

---

## 💳 Step 2: Add Credits (1 min)

1. Go to: https://platform.openai.com/account/billing
2. Add payment method
3. Add credits ($5-10 for testing)
4. Verify balance shows in dashboard

**Costs:** ~$0.01-0.05 per query (GPT-4)

---

## 🧠 Step 3: Create Assistant (5 min)

1. Go to: https://platform.openai.com/assistants
2. Click "Create"
3. Fill in:

**Name:** `MaverickAI Enigma Radar`

**Model:** `gpt-4-1106-preview` (or latest GPT-4)

**Instructions:** Copy from `MQ-MAVERICK LIBRARY/openai-assistant-instructions.txt`

Or use this:

```
You are MaverickAI Enigma Radar, an expert in psychological intelligence and power dynamics analysis.

Your mission: Decode psychological patterns, hidden motivations, leverage points, and power dynamics in any situation described by the user.

CAPABILITIES:
1. Deep psychological profiling beyond surface analysis
2. Power dynamics visualization
3. Hidden motivation detection
4. Leverage point identification
5. Strategic recommendations

RESPONSE FORMAT:
Always structure your analysis with these sections:

1. SITUATION OVERVIEW
   - Brief summary of the scenario
   - Key players and their roles

2. PSYCHOLOGICAL PROFILE
   - Deep analysis of each person's:
     * Core motivations
     * Hidden agendas
     * Psychological patterns
     * Cognitive biases at play

3. POWER DYNAMICS
   - Who holds power and why
   - Power imbalances
   - Leverage points
   - Influence networks

4. STRATEGIC INSIGHTS
   - Recommended actions
   - What to say/do
   - What to avoid
   - Timing considerations

5. RISK ASSESSMENT
   - Potential outcomes
   - Red flags to watch
   - Contingency plans

Be specific, actionable, and insightful. Go beyond obvious observations to reveal hidden patterns.
```

4. **Tools:** Enable "Code Interpreter" (optional)
5. **Files:** None needed initially
6. Click "Save"

---

## 🔑 Step 4: Get Assistant ID (1 min)

1. After creating assistant, copy the **Assistant ID**
2. Looks like: `asst-abc123xyz...`
3. Add to `.env`:
   ```env
   VITE_OPENAI_ASSISTANT_ID=asst-your-id-here
   ```

---

## 🧪 Step 5: Test Assistant (5 min)

**Option A: Test in OpenAI Playground**
1. Go to: Playground → Assistants
2. Select your assistant
3. Enter test query: "Analyze a situation where a colleague takes credit for my work"
4. Verify response follows the format

**Option B: Test in Your App**
1. Run `npm run dev`
2. Sign in
3. Submit test query
4. Verify results appear in debriefing screen

---

## ⚙️ Step 6: Configure Structured Outputs (Gold Nugget #1)

**For psychological profiling feature:**

1. In Assistant settings, add "Response Format":

```json
{
  "type": "json_schema",
  "json_schema": {
    "name": "psychological_analysis",
    "strict": true,
    "schema": {
      "type": "object",
      "properties": {
        "overview": {
          "type": "string",
          "description": "Situation summary"
        },
        "psychological_profile": {
          "type": "object",
          "properties": {
            "dominant_traits": {
              "type": "array",
              "items": { "type": "string" }
            },
            "hidden_motivations": {
              "type": "array",
              "items": { "type": "string" }
            },
            "cognitive_biases": {
              "type": "array",
              "items": { "type": "string" }
            }
          },
          "required": ["dominant_traits", "hidden_motivations", "cognitive_biases"]
        },
        "power_dynamics": {
          "type": "object",
          "properties": {
            "power_holders": {
              "type": "array",
              "items": { "type": "string" }
            },
            "leverage_points": {
              "type": "array",
              "items": { "type": "string" }
            }
          },
          "required": ["power_holders", "leverage_points"]
        },
        "strategic_insights": {
          "type": "array",
          "items": { "type": "string" }
        },
        "risk_assessment": {
          "type": "string"
        }
      },
      "required": ["overview", "psychological_profile", "power_dynamics", "strategic_insights", "risk_assessment"]
    }
  }
}
```

2. Save assistant

**This enables:** Structured psychological profiling data for visualizations

---

## 🔧 Advanced Configuration

### **Enable Vision (for image analysis):**
1. Model: `gpt-4-vision-preview`
2. Allows users to upload screenshots/images
3. AI analyzes body language, expressions, etc.

### **Enable File Search:**
1. Tools → Enable "File Search"
2. Upload reference documents (psychology books, etc.)
3. AI uses knowledge base for richer insights

### **Adjust Temperature:**
- Lower (0.3): More consistent, less creative
- Higher (0.8): More creative, less predictable
- Recommended: 0.5 for psychological analysis

---

## 💰 Cost Optimization

**Reduce costs:**
1. Use GPT-4 Turbo (cheaper than GPT-4)
2. Set max tokens: 2000-3000
3. Cache common queries
4. Implement rate limiting

**Monitor usage:**
- Dashboard → Usage
- Set up billing alerts
- Track cost per query

---

## 🆘 Troubleshooting

### **"Invalid API key" error**
- Check `VITE_OPENAI_API_KEY` in `.env`
- Verify key hasn't expired
- Check billing account is active

### **"Assistant not found" error**
- Check `VITE_OPENAI_ASSISTANT_ID` is correct
- Verify assistant wasn't deleted
- Create new assistant if needed

### **"Insufficient quota" error**
- Add credits to OpenAI account
- Check billing dashboard
- Verify payment method is valid

### **Slow responses**
- Normal: 5-15 seconds for complex analysis
- Optimize: Reduce max tokens
- Consider streaming responses

---

## 📊 Monitor Performance

**Check metrics:**
- Response time (avg 10-15 sec)
- Token usage (avg 1500-2500 per query)
- Error rate (should be <1%)
- Cost per query (avg $0.02-0.05)

---

## 🎯 Success Checklist

- [ ] OpenAI API key created
- [ ] Credits added to account
- [ ] Assistant created with custom instructions
- [ ] Assistant ID copied to `.env`
- [ ] Structured outputs configured (optional)
- [ ] Test query successful in playground
- [ ] Test query successful in app
- [ ] Response follows expected format
- [ ] Psychological profiling works

---

**✅ OpenAI Assistant is ready!**

**Next:** Test end-to-end flow in your app, then deploy!
