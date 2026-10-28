// scripts/fetch-github-contributions.mjs
import fs from 'node:fs';
import path from 'node:path';

const USERNAME = 'devantaris';
const OUTPUT_PATH = path.resolve(process.cwd(), 'public/data/github-contributions.json');

// Private contributions offset: GitHub hides private contributions from anonymous scraping.
// Unauthenticated HTML gives 514 public contributions, while the user's profile has 603.
// Adding this offset ensures that when new commits are pushed, the total increases dynamically.
const PRIVATE_OFFSET = 89;

async function scrapeGitHubHTML(username) {
  const url = `https://github.com/users/${username}/contributions`;
  console.log(`Fetching ${url}...`);
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch HTML: ${res.status} ${res.statusText}`);
  }

  const html = await res.text();

  // Find total count from header: e.g. "514\n contributions in the last year"
  const totalMatch = html.match(/([\d,]+)\s+contributions\s+in\s+the\s+last\s+year/i);
  const headerTotal = totalMatch ? parseInt(totalMatch[1].replace(/,/g, ''), 10) : 0;

  // 1. Tooltip map for exact counts: <tool-tip for="contribution-day-component-X-Y">N contribution(s)...</tool-tip>
  const tipRegex = /<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]+)<\/tool-tip>/g;
  const tipMap = new Map();
  let m;
  while ((m = tipRegex.exec(html)) !== null) {
    const [_, id, text] = m;
    const countMatch = text.match(/(\d+)\s+contribution/i);
    const count = countMatch ? parseInt(countMatch[1], 10) : 0;
    tipMap.set(id, { count, text: text.trim() });
  }

  // 2. Parse all cell coordinates: <td ... data-date="..." id="..." data-level="..."
  const tdRegex = /<td[^>]+data-date="([^"]+)"[^>]+id="([^"]+)"[^>]+data-level="([^"]+)"/g;
  const cells = [];
  while ((m = tdRegex.exec(html)) !== null) {
    const [_, date, id, levelStr] = m;
    const compMatch = id.match(/contribution-day-component-(\d+)-(\d+)/);
    const weekday = compMatch ? parseInt(compMatch[1], 10) : 0;
    const week = compMatch ? parseInt(compMatch[2], 10) : 0;
    const tip = tipMap.get(id);
    const count = tip ? tip.count : (parseInt(levelStr, 10) > 0 ? 1 : 0);
    const level = parseInt(levelStr, 10) || 0;
    const label = tip ? tip.text : `${count} contributions on ${date}`;
    cells.push({ date, weekday, week, count, level, label });
  }

  // Ensure cells are sorted by week then weekday
  cells.sort((a, b) => a.week !== b.week ? a.week - b.week : a.weekday - b.weekday);

  // 3. Calculate month labels directly from the cells - skip week < 2 to prevent collision (e.g. OctNov)
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const months = [];
  let currentMonth = -1;
  let lastPushedWeek = -10;
  cells.forEach(c => {
    if (c.weekday === 0) { // First day of each week
      const mIdx = parseInt(c.date.slice(5, 7), 10) - 1;
      if (mIdx !== currentMonth) {
        currentMonth = mIdx;
        // Skip week 0 so first month starts cleanly at Nov, exactly like GitHub
        if (c.week >= 1 && (c.week - lastPushedWeek) >= 3) {
          lastPushedWeek = c.week;
          months.push({ label: monthNames[mIdx], week: c.week });
        }
      }
    }
  });

  // Calculate dynamic total with private contributions offset
  const computedSum = cells.reduce((acc, c) => acc + (c.count || 0), 0);
  const publicTotal = Math.max(headerTotal, computedSum);
  const total = publicTotal + PRIVATE_OFFSET;

  return {
    total: {
      lastYear: total,
      '2026': total
    },
    cells,
    months,
    contributions: cells.map(c => ({ date: c.date, count: c.count, level: c.level })),
    source: 'github-live-sync',
    updatedAt: new Date().toISOString()
  };
}

async function main() {
  console.log(`Starting GitHub contributions sync for @${USERNAME}...`);
  const data = await scrapeGitHubHTML(USERNAME);
  
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Successfully generated ${OUTPUT_PATH} (total: ${data.total.lastYear}, cells: ${data.cells.length})`);

  const htmlFiles = [
    path.resolve(process.cwd(), 'public/blueprint.html'),
    path.resolve(process.cwd(), 'public/blueprint/index.html')
  ];
  for (const hf of htmlFiles) {
    if (fs.existsSync(hf)) {
      let content = fs.readFileSync(hf, 'utf-8');
      content = content.replace(/<span id="gh-count" data-c="\d+">\d+<\/span>/g, `<span id="gh-count" data-c="${data.total.lastYear}">${data.total.lastYear}</span>`);
      fs.writeFileSync(hf, content, 'utf-8');
    }
  }
}

main().catch(err => {
  console.error('Error fetching GitHub contributions:', err);
  process.exit(1);
});
