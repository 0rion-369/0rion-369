M.O.C

### Independent Research — Recursive Systems & Entropic Dynamics

**Focus:** Empirical investigation into the stability properties, semantic drift, and structural persistence of closed-loop optimization in Large Language Models (LLMs).

---

## 🔬 Core Research

### [Closed-Loop Optimization Risks (CLOR)](https://github.com/0rion-369/closed-loop-optimization-risks)
**Paper:** *Structural Persistence Does Not Prevent Semantic Drift in Large Language Models* (Feb 2026)

An empirical evaluation of recursive stability using **GPT-5 Standard** under high-entropy regimes (T=1.0).
* **Key Finding:** Demonstrated a dissociation between structural coherence and semantic stability. Structural metrics (length, TTR, CV) remained stable while semantic drift consistently exceeded **0.90** across all prompt classes.
* **Methodology:** 50-step closed-loop generation, N=23 trajectories, embedding-based drift analysis.
* **Status:** Preprint available. Datasets open for reproduction.

### [The Entropic Zoo Protocol](https://github.com/0rion-369/The-Entropic-Zoo-Protocol)
**Framework:** *Ecosystem Dynamics of Optimization Loops*

Theoretical companion to CLOR. Defines the structural role of exogenous entropy sources in preventing model collapse.
* Establishes the distinction between **prophylactic** injection (preventing collapse) and **therapeutic** intervention (post-collapse recovery).
* Models the "Canonical Drift" phenomenon where outputs maintain formal fluency but lose semantic grounding.

---

## ⚡ Methodology & Approach

My work prioritizes **run-level validation** over aggregated metrics to avoid Simpson's Paradox in recursive analysis.

* **Empirical First:** Hypotheses are tested via controlled recursive feedback loops (50+ iterations).
* **Multi-Metric Assessment:** Simultaneous monitoring of structural (Length, CV), lexical (TTR), and semantic (Embedding Cosine Distance) stability.
* **Open Science:** All scripts, raw datasets, and visualization tools are open-source.

---

### 🔗 Context
* **For conceptual and experimental art:** [MOC-G3C](https://github.com/MOC-G3C)
