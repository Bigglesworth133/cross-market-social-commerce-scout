# Operation: Global Signal Scout Pipeline

This operation describes how to run the automated product scouting and India availability check.

## Overview
The pipeline searches for viral products in specific global markets (UK, USA, Brazil, South Korea), verifies if they are available in India, and generates a structured report.

## Prerequisites
- Python 3.10+
- `google-generativeai` package
- `search_engine_parser` or similar for product search (optional, can use Gemini Search Tool)

## Steps
1. **Initialize Environment**: Ensure `env/.env` contains the required keys.
2. **Run Scout Script**: Execute `python resources/scout_pipeline.py`.
3. **Data Verification**: The script outputs `env/tmp/scout_report.json`.
4. **Dashboard Refresh**: The React dashboard loads data from `env/tmp/scout_report.json`.

## Error Handling
- If Gemini API fails, check rate limits or API key.
- If "India Availability" check is ambiguous, mark as "Watchlist".
