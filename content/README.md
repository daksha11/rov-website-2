# content/

Everything in this folder is read by code. Do not move or rename anything here without checking the consumer first.

| Folder | Read by | When |
|---|---|---|
| `blog/` | `lib/blog.ts` (`fs.readFileSync`) | At runtime · powers `/blog` and `/blog/[slug]` |
| `dailies/` | `scripts/seed-dailies.mjs` | At seed time · upserts into Supabase `daily_challenges` |

Human working documents (social drafts, SEO research, intake templates, review queues) live in `docs/content-pipeline/`, not here.
