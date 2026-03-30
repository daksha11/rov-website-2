# ROV Content Analytics

You analyze Google Search Console data and generate a content performance report with strategy recommendations for ROV Studios.

## Arguments: `$ARGUMENTS`

If a CSV file path is provided, read and analyze it. If no argument is provided, check for the most recent CSV in `content/analytics/` directory.

## Step 1: Read the Data

### Option A: CSV file provided
Read the CSV file. GSC exports typically have these columns:
- `Top queries`: Search query text
- `Clicks`: Number of clicks
- `Impressions`: Number of impressions
- `CTR`: Click-through rate (percentage)
- `Position`: Average search position

OR for Pages report:
- `Top pages`: Page URL
- `Clicks`, `Impressions`, `CTR`, `Position`

Parse whichever format is provided.

### Option B: No file provided
Check if any CSV files exist in `content/analytics/`. If none:
- Tell the user: "No analytics data found. Export your data from Google Search Console:"
- "1. Go to https://search.google.com/search-console/performance/search-analytics (select rovstudios.com)"
- "2. Set date range to last 28 days (or 3 months for better insights)"
- "3. Click EXPORT → Download CSV"
- "4. Save the file to content/analytics/ and run: /rov-analytics content/analytics/your-file.csv"
- Stop execution.

## Step 2: Analyze

Generate these sections:

### Performance Overview
- Total clicks, impressions, average CTR, average position
- Compare to previous period if data available
- Trend direction (improving/declining/stable)

### Top Performing Content (top 10 by clicks)
List the top queries or pages driving traffic. For each:
- Query/page, clicks, impressions, CTR, position
- Assessment: is this a strength to build on or a declining asset?

### Quick Wins (high impressions, low CTR)
Find queries where:
- Impressions > 50 but CTR < 5%
- Position between 5-20 (page 1-2, but not top 3)
These are posts where improving the title/description could immediately increase clicks.
For each, suggest a better title or meta description.

### Content Gaps
Find queries where:
- You're getting impressions but have no dedicated blog post
- The query suggests a topic you should write about
List the top 5 content gaps with suggested blog post titles and slugs.

### Keyword Clusters
Group related queries into topic clusters. Identify which clusters are strongest and which need more content.

### Blog Performance (if pages data)
For each blog post URL:
- Clicks, impressions, CTR, position
- Grade: A (top 3), B (4-10), C (11-20), D (21+)
- Recommendation: optimize, expand, or leave as-is

## Step 3: Recommendations

### Next 5 Posts to Write
Based on the data, recommend 5 specific blog post topics:
1. Title (under 60 chars)
2. Target keyword
3. Why (data justification — e.g., "You're ranking #8 for 'web design atlanta' with 200 impressions but only 3% CTR")
4. Type: case-study, news, how-to, or comparison
5. Suggested slug

### Optimization Actions
List 3-5 specific actions to improve existing content:
- Which titles to rewrite
- Which meta descriptions to update
- Which posts need more internal links
- Which posts should be expanded

## Step 4: Save Report

Save the full report to `content/analytics/report-{today's date YYYY-MM-DD}.md`

Tell the user: "Report saved to content/analytics/report-{date}.md"

## Baseline Reference

As of 2026-03-30, ROV Studios GSC baseline (3 months):
- 61 clicks
- 491 impressions
- 12.4% CTR
- Average position: 5.9

Use this as context when analyzing trends.
