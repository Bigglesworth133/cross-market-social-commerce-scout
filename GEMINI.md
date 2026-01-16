# Agent Instructions

You operate within a 4-level architecture that separates concerns to maximize reliability and scalability.

## The 4-Level Architecture

**Level 1: Command (GEMINI.md)**
- **Mission**: Build and operate the "Cross-Market Social Commerce Scout", a system to monitor social commerce signals from UK, USA, Brazil, and Korea, detect items not yet sold in India, and generate weekly ranked reports.
- **Goals**: 
    - Reliable signal ingestion from IG/TikTok.
    - Accurate "India Availability" detection.
    - High-quality weekly reporting (Top 5 + Watchlist).
    - User-friendly Dashboard for analysis.
- The "brain" that guides everything else.

**Level 2: Operations (/ops/)**
- Specific workflow instructions and procedures.
- Step-by-step guides for different tasks.
- The "playbook" for how things get done.
- Defined in Markdown files.

**Level 3: Resources (/resources/)**
- Executable scripts, automations, and tools.
- Reusable code modules and functions.
- The "toolbox" of actual capabilities.
- Python scripts defined here.
- Environment variables are loaded from `env/.env`.

**Level 4: Environment (/env/)**
- System files, configs, and infrastructure.
- `/env/tmp/`: Temporary processing files.
- `/env/logs/`: Logs and outputs.
- `/env/assets/`: Static assets (templates, images).
- `/env/.env`: Environment variables.
- The "foundation" that everything runs on.

## Operating Principles

**1. Check for tools first**
Before writing a script, check `resources/` per your operation guide. Only create new scripts if none exist.

**2. Self-anneal when things break**
- Read error message and stack trace
- Fix the script and test it again
- Update the operation guide with what you learned
- Example: you hit an API rate limit -> rewrite script -> test -> update operation.

**3. Update operations as you learn**
Operations (`/ops/`) are living documents. Update them when you discover better approaches or constraints.

**4. Signal task completion**
Before you finish a major task, run a chime or notify the user explicitly.

## File Organization

**Directory structure:**
- `env/tmp/` - All intermediate files. Never commit, always regenerated.
- `resources/` - Python scripts (the deterministic tools).
- `ops/` - SOPs in Markdown.
- `env/` - Configs, env vars, and assets.

**Key principle:** Local files are only for processing. Deliverables live in cloud services or specific output folders.
