const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const LOVABLE_URL = 'https://lovable.dev/projects/e480bda7-d68b-4555-b924-01f8fe2a77f7';

axios.get(LOVABLE_URL).then(res => {
  const $ = cheerio.load(res.data);
  const title = $('h1').first().text().trim() || 'Porteria';
  const description = $('meta[name="description"]').attr('content') || $('p').first().text().trim();
  let markdown = `# ${title}\n\n${description}\n\nFuente: [lovable.dev](${LOVABLE_URL})\n`;
  fs.writeFileSync('README.md', markdown, 'utf8');
  console.log("README.md actualizado con datos de lovable.dev");
}).catch(err => {
  console.error("Error obteniendo datos de lovable.dev:", err.message);
});
