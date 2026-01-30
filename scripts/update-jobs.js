const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SEARCH_SCRIPT = '/root/.openclaw/workspace/skills/reddit-cli/scripts/reddit-search.js';
const OUTPUT_FILE = path.join(__dirname, '../public/jobs.json');

const JOB_SOURCES = [
  { name: 'React Jobs', query: 'hiring react', subreddit: 'reactjs' },
  { name: 'Node.js Jobs', query: 'hiring node', subreddit: 'node' },
  { name: 'Remote Leads', query: '[Hiring] Remote', subreddit: 'RemoteJobs' },
  { name: 'Freelance Gigs', query: '[Hiring] Web', subreddit: 'forhire' },
  { name: 'SaaS Hiring', query: 'hiring developer', subreddit: 'SaaS' }
];

async function main() {
  const data = [];

  for (const source of JOB_SOURCES) {
    console.log(`Searching: ${source.name}...`);
    try {
      const cmd = `node ${SEARCH_SCRIPT} "${source.query}" --subreddit ${source.subreddit} --limit 5 --sort new --json`;
      const output = execSync(cmd, { 
        env: process.env,
        maxBuffer: 1024 * 1024 * 10 
      }).toString();
      
      const results = JSON.parse(output);
      // Filter out [For Hire] posts, keep [Hiring]
      const leads = results.filter(post => 
        post.title.toLowerCase().includes('hiring') || 
        post.title.toLowerCase().includes('looking for')
      ).map(post => ({
        ...post,
        // Simple heuristic to extract potential email? (Too complex for grep, just link to post)
        source: source.name
      }));

      data.push({
        category: source.name,
        items: leads
      });
    } catch (e) {
      console.error(`Error fetching ${source.name}:`, e.message);
      data.push({ category: source.name, items: [] });
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  console.log(`Saved jobs to ${OUTPUT_FILE}`);
}

main();
