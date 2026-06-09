# Model promotion gate

A **machine-readable checklist** for promoting model changes in customer-facing systems—where the failure mode is not “bad UX,” it is **silent wrongness** compounded by scale.

This repo is not a model registry. It is a **release contract** between product, eng, and operations: what must be true before traffic moves.

---

## Problem

Model updates look like “flip a flag,” but the real work is staged evaluation, shadow traffic, rollback posture, and explicit ownership. Without a shared artifact, teams debate past each other using different definitions of “safe enough.”

---

## What you get

- `checklists/example.promotion.yaml` — example promotion definition (synthetic).
- `src/validate.ts` — validates checklist shape (Zod) so you can enforce structure in CI.

---

## Tradeoffs

| Decision | Upside | Cost |
|----------|--------|------|
| YAML checklist vs. database | auditable diffs in PRs | not a live workflow engine |
| Threshold gates vs. qualitative sign-off | clearer exit criteria | metrics must exist and be trusted |
| Required vs optional stages | reflects messy reality | optional stages can be abused if culture is weak |

---

## Quickstart

```bash
npm install
npx tsx src/validate.ts checklists/example.promotion.yaml
```

---

## Roadmap

1. JSON Schema export alongside Zod (for polyglot services).
2. GitHub Action: block merges when checklist version bumps without approvals metadata.
3. Template for “rollback decision” section (time-bounded rollback windows).

---

## License

MIT.
