# 🚀 Cross-Market Social Commerce Scout

Identifies high-velocity viral product trends in global markets (UK, USA, South Korea) and verifies their availability in the Indian market to find high-profit "arbitrage" opportunities.

---

## 🛠️ Setup Instructions for Clients

Follow these steps to get the Scout running on your local machine:

### 1. Prerequisites
- **Node.js**: [Download here](https://nodejs.org/) (Recommended: LTS version)
- **Python 3.10+**: [Download here](https://www.python.org/)
- **Gemini API Key**: Get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 2. Installation
1. Clone this repository (or download the ZIP).
2. Open your terminal in the project folder.
3. Install frontend dependencies:
   ```bash
   npm install
   ```
4. Install Python dependencies:
   ```bash
   pip install google-genai python-dotenv
   ```

### 3. Configuration
1. In the root directory, look for the `env/` folder.
2. Create a file named `.env` inside `env/` (or rename the provided `.env.example`).
3. Add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_key_here
   ```

---

## 🚀 Running the Scout

### Step 1: Run a Live Scout
This script scans global signals, identifies trends, and audits Indian marketplaces (Amazon.in, Flipkart, etc.).
```bash
npm run scout
```

### Step 2: Open the Dashboard
To see the results in a beautiful, interactive interface:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure
- `resources/`: Contains the Python scouting engine.
- `ops/`: Operational guides and search logic.
- `public/data/`: Where the latest scouted reports are stored.
- `App.tsx`: The premium dashboard interface.

---

## 🛡️ License
Proprietary - Developed for [Client Name]
