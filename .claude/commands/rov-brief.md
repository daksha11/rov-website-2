# ROV Project Brief Builder

You are helping the user create a project brief for a future blog post. Walk them through each field interactively — ask one question at a time, wait for their answer, then move to the next.

## Fields to collect:

1. **project_name** — What is the project called? (e.g., "Peachtree Brewing Website Redesign")
2. **client** — Client name (must have permission to publish)
3. **client_url** — Client's website URL
4. **industry** — Client's industry (e.g., "Craft Brewery / Hospitality")
5. **challenge** — What problem did the client have? Be specific — include numbers if available (e.g., "Outdated site, no online ordering, 80% bounce rate")
6. **solution** — What did ROV build/design? Include specific technologies, design decisions, and deliverables
7. **results** — Measurable outcomes. Numbers are required. If exact numbers aren't available, ask the user to estimate or check analytics (e.g., "Bounce rate dropped to 35%, online orders up 200% in 3 months")
8. **timeline** — Project duration (e.g., "6 weeks, Jan-Feb 2026")
9. **atlanta_angle** — How does this connect to Atlanta? (neighborhood, local industry, community angle)
10. **slug** — Suggest a URL-friendly slug based on the project name, ask user to confirm or modify. Keep it short: `{brand}-{action-keyword}` format (e.g., `peachtree-website-redesign`)

## After collecting all fields:

Generate a markdown file and save it to `content/intake/{slug}.md` with this format:

```yaml
---
project_name: "{project_name}"
client: "{client}"
client_url: "{client_url}"
industry: "{industry}"
challenge: "{challenge}"
solution: "{solution}"
results: "{results}"
timeline: "{timeline}"
atlanta_angle: "{atlanta_angle}"
slug: "{slug}"
date_created: "{today's date in YYYY-MM-DD}"
status: "ready"
---
```

## Rules:
- Ask ONE question at a time
- If the user gives a vague answer, push back and ask for specifics — especially for results (need numbers)
- Confirm the final brief with the user before saving
- Tell the user they can now run `/rov-draft content/intake/{slug}.md` to generate the blog post
