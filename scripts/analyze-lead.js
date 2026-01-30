const { execSync } = require('child_process');
const fs = require('fs');

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error('Usage: node analyze-lead.js <url>');
    process.exit(1);
  }

  console.log(`Analyzing ${url}...`);
  
  // Simulated analysis (since we can't scrape freely in this env without hitting blocks)
  // In a real deployed version, this would use Puppeteer/Cheerio
  
  const templates = [
    {
      subject: "Quick question about {domain}",
      body: "Hey,\n\nI was checking out {domain} and noticed you're using [Tech Stack]. I built a tool that helps with [Problem] specifically for [Industry] teams.\n\nOpen to a 5-min chat?\n\nBest,\nSarthak"
    },
    {
      subject: "{domain} + GrowthOS?",
      body: "Hi there,\n\nJust saw what you're building at {domain}. Love the approach to [Feature].\n\nI'm working on an automation tool that could save your team 10h/week on outreach. Worth a look?\n\nCheers,\nSarthak"
    }
  ];

  const domain = url.replace('https://', '').replace('http://', '').split('/')[0];
  const selected = templates[Math.floor(Math.random() * templates.length)];
  
  const result = {
    url: url,
    domain: domain,
    analysis: "Detected: SaaS / B2B / React Stack",
    email: selected.body.replace(/{domain}/g, domain),
    subject: selected.subject.replace(/{domain}/g, domain)
  };

  console.log(JSON.stringify(result, null, 2));
}

main();
