# The Claude Code Cheatsheet

From CTRL-A by Range of View Studios. The moves we actually use, on one page.
Keep it next to your keyboard.

---

## Pick the right model

- **Sonnet 5** · the daily driver. Start here for almost everything.
- **Opus 4.8** · the heavy lifter. Hard architecture, subtle debugging, big planning.
- **Haiku 4.5** · the fast one. Bulk edits, quick lookups, high volume subagent work.
- Switch any time with `/model`. `/fast` gives you Opus with quicker output.

Rule of thumb: default to Sonnet, drop to Haiku for volume, step up to Opus for the hard parts.

---

## The commands worth memorizing

- `/compact` · trade history for a summary at the seam between tasks. Add a focus,
  like `/compact keep the auth work`, to steer what stays.
- `/clear` · wipe the slate when the next task shares nothing with the last.
- `/model` · switch models mid session without restarting.
- `/plan` · research and propose, no edits, until you approve.
- `/init` · draft a CLAUDE.md from your project.

---

## Save money on tokens

1. **Be specific up front.** Most wasted tokens are corrections, and corrections
   come from a vague first ask.
2. **Send search to subagents.** The noisy reading happens elsewhere, only the
   answer comes back.
3. **Plan before you build.** Refine the plan once instead of iterating live on edits.
4. **Load skills on demand.** Instructions arrive only when they are needed.
5. **Compact at the seams,** never mid task.

---

## Context and memory

- **CLAUDE.md** · standing instructions loaded every session and kept through a
  compact. Keep it tight. Draft one with `/init`.
- **Memory** · notes Claude keeps for itself across sessions on a project.
- **Compact vs clear** · compact when the next task builds on the last, clear when
  it does not.

---

## Systems that scale you

- **Skills** · reusable context you hand it once, so it works the way you work.
- **Slash commands** · your repeatable moves saved as one word.
- **Subagents** · hand a whole task to a focused worker, run several at once.
- **Workflows** · script many agents for work at scale, in the background.
- **MCP tools** · wire Claude into the apps you already use, so it can act, not just talk.

---

Want the interactive version, with the model picker, command palette, and token
optimizer you can actually play with? It lives at rovstudios.com/ctrla/claude-code.

More drops every month. You are on the list.
