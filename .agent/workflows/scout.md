---
description: Run the Cross-Market Social Commerce Scout pipeline
---

This workflow runs the Python script that scouts for viral products and verifies their availability in India.

1. Ensure your Gemini API key is set in `env/.env` or `.env.local`.
// turbo
2. Run the scout command:
```powershell
npm run scout
```
3. Once finished, the results will be available in `env/tmp/scout_report.json`.
4. The dashboard will automatically reflect the latest scouted data (if implemented).
