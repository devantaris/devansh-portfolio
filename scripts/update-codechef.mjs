/**
 * Fetches latest CodeChef stats for s24cseu0828 and writes to public/data/codechef.json
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const HANDLE = 's24cseu0828';
const URL = `https://www.codechef.com/users/${HANDLE}`;

async function fetchStats() {
  try {
    const res = await fetch(URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }

    const html = await res.text();

    // Parse current rating
    let rating = 1414;
    const ratingMatch = html.match(/class=["']rating-number["'][^>]*>\s*(\d+)/i);
    if (ratingMatch && ratingMatch[1]) {
      rating = parseInt(ratingMatch[1], 10);
    }

    // Parse highest rating
    let highestRating = 1425;
    const highestMatch = html.match(/\(Highest Rating\s+(\d+)\)/i);
    if (highestMatch && highestMatch[1]) {
      highestRating = parseInt(highestMatch[1], 10);
    }

    // Parse stars count
    let stars = 2;
    const starBlockMatch = html.match(/class=["']rating-star["'][^>]*>([\s\S]*?)<\/div>/i);
    if (starBlockMatch) {
      const starSpans = starBlockMatch[1].match(/<span/gi);
      if (starSpans && starSpans.length > 0) {
        stars = starSpans.length;
      }
    }

    // Parse global rank
    let globalRank = 1282;
    const rankMatch = html.match(/class=["']global-rank["'][^>]*>\s*(\d+)/i);
    if (rankMatch && rankMatch[1]) {
      globalRank = parseInt(rankMatch[1], 10);
    }

    const data = {
      handle: HANDLE,
      rating,
      highestRating,
      stars,
      starsStr: '★'.repeat(stars),
      division: stars <= 2 ? 'Div 3' : 'Div 2',
      globalRank,
      updatedAt: new Date().toISOString()
    };

    const outDir = join(process.cwd(), 'public', 'data');
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'codechef.json'), JSON.stringify(data, null, 2), 'utf8');

    console.log('Successfully updated CodeChef stats:', data);
  } catch (err) {
    console.error('Failed to fetch CodeChef stats:', err.message);
    process.exit(1);
  }
}

fetchStats();
