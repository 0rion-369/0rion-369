# CLAUDE.md — AI Assistant Guide for 0rion-369

## Repository Overview

This is a **research documentation repository** for independent academic work on Large Language Model (LLM) stability, semantic drift, and closed-loop optimization risks. It is not a software application — it contains no runnable code, build system, or deployment infrastructure.

**Primary author:** Marko-369 (marco.corbin@gmail.com)
**Repository remote:** `origin http://local_proxy@127.0.0.1:43447/git/0rion-369/0rion-369`
**Active development branch:** `claude/claude-md-mmft89mgmgcdwdnq-8b2YS`

---

## Repository Structure

```
0rion-369/
├── README.md      # Primary content: research portfolio and index
└── CLAUDE.md      # This file
```

The repository is intentionally minimal. All substantive research artifacts (scripts, datasets, analysis tools) live in the linked companion repositories referenced in the README.

---

## Content & Purpose

The README serves as a **research portfolio index** covering:

1. **Closed-Loop Optimization Risks (CLOR)** — Empirical paper demonstrating dissociation between structural coherence and semantic stability in LLMs under recursive generation. Key finding: semantic drift exceeded 0.90 across all prompt classes even when structural metrics (length, TTR, coefficient of variation) remained stable.

2. **The Entropic Zoo Protocol** — Theoretical framework defining the role of exogenous entropy in preventing model collapse. Distinguishes *prophylactic* entropy injection (preventing collapse) from *therapeutic* intervention (post-collapse recovery).

3. **MOC-G3C** — Companion organization for conceptual and experimental art projects.

---

## Companion Repositories

| Repository | Description |
|---|---|
| [`0rion-369/closed-loop-optimization-risks`](https://github.com/0rion-369/closed-loop-optimization-risks) | CLOR paper, datasets, reproduction scripts |
| [`0rion-369/The-Entropic-Zoo-Protocol`](https://github.com/0rion-369/The-Entropic-Zoo-Protocol) | Entropic Zoo theoretical framework |
| [`MOC-G3C`](https://github.com/MOC-G3C) | Conceptual and experimental art projects |

---

## Development Conventions

### Markdown Style
- Use `###` headings for major sections within the README
- Separate sections with `---` horizontal rules
- Use bold (`**text**`) for key terms, findings, and named entities
- Use bullet points for methodology, findings, and status items
- Keep the README concise — it is an index, not a full paper

### Git Workflow
- Default working branch for Claude: `claude/claude-md-mmft89mgmgcdwdnq-8b2YS`
- The `master` branch holds the canonical public state
- Commit messages follow the convention: `Update README.md` (descriptive but minimal for documentation-only changes)
- Push using: `git push -u origin <branch-name>`

### Branch Naming
- Claude-created branches must start with `claude/` and end with the matching session ID
- Example: `claude/claude-md-mmft89mgmgcdwdnq-8b2YS`

---

## What AI Assistants Should and Should Not Do

### Do
- Update the README to reflect new research publications, status changes, or methodology additions
- Maintain the academic, concise tone of the existing content
- Preserve the structure: Core Research → Methodology → Context links
- Keep section headers and formatting consistent with the existing style

### Do Not
- Add build systems, CI/CD, or application scaffolding — this is a documentation-only repository
- Create source code files unless explicitly requested by the author
- Change the research framing or reinterpret findings — report them as stated by the author
- Alter external GitHub links without explicit instruction
- Push to `master` directly; use the designated Claude branch

---

## Key Research Terms (Glossary)

| Term | Definition |
|---|---|
| Closed-loop optimization | Recursive feedback loops where model output is fed back as input |
| Semantic drift | Divergence of output meaning from the original semantic context, measured via embedding cosine distance |
| Structural persistence | Stability of surface-level features (length, TTR, CV) independent of semantic content |
| Entropic injection | Introduction of external randomness to disrupt collapse in recursive systems |
| Prophylactic injection | Entropy added before collapse to prevent it |
| Therapeutic intervention | Entropy added after collapse to recover stability |
| Canonical Drift | Outputs that maintain formal fluency but lose semantic grounding |
| TTR | Type-Token Ratio — a lexical diversity metric |
| CV | Coefficient of Variation — measures relative dispersion in output length |
| Run-level validation | Analyzing each trajectory independently to avoid Simpson's Paradox in aggregated metrics |
