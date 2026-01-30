const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SEARCH_SCRIPT = '/root/.openclaw/workspace/skills/reddit-cli/scripts/reddit-search.js';
const OUTPUT_FILE = path.join(__dirname, '../public/trends.json');

const TOPICS = [
  { name: 'SaaS Pain Points', query: 'pain point', subreddit: 'SaaS' },
  { name: 'WebDev Trends', query: 'trends', subreddit: 'webdev' },
  { name: 'AI Discussions', query: 'AI', subreddit: 'ArtificialInteligence' },
  { name: 'Startup Ideas', query: 'idea', subreddit: 'Startup_Ideas' }
];

async function main() {
  const data = [];

  for (const topic of TOPICS) {
    console.log(`Searching: ${topic.name}...`);
    try {
      const cmd = `node ${SEARCH_SCRIPT} "${topic.query}" --subreddit ${topic.subreddit} --limit 5 --sort hot --json`;
      // Use inherited env for cookies
      const output = execSync(cmd, { 
        env: process.env,
        maxBuffer: 1024 * 1024 * 10 
      }).toString();
      
      const results = JSON.parse(output);
      data.push({
        category: topic.name,
        items: results
      });
    } catch (e) {
      console.error(`Error fetching ${topic.name}:`, e.message);
      data.push({ category: topic.name, items: [] });
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  console.log(`Saved trends to ${OUTPUT_FILE}`);
}

main();
