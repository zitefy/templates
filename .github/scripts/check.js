const fs = require('fs');
const path = require('path');

function checkDirectories() {
  const directories = fs.readdirSync('.').filter(file => 
    fs.statSync(file).isDirectory() && file !== '.github'
  );

  for (const dir of directories) {
    const files = ['index.html', 'js/script.js', 'styles/styles.css', 'metadata.json'];
    for (const file of files) {
      if (!fs.existsSync(path.join(dir, file))) {
        throw new Error(`Directory ${dir} is missing file ${file}`);
      }
    }
  }
}

function checkMetadataSchema(dir) {
  const metadata = JSON.parse(fs.readFileSync(path.join(dir, 'metadata.json'), 'utf8'));
  
  const requiredFields = ['name', 'author', 'time', 'category', 'author_link', 'accepts_contributions'];
  for (const field of requiredFields) {
    if (!(field in metadata)) {
      throw new Error(`metadata.json in ${dir} is missing required field: ${field}`);
    }
  }

  // Check types and formats
  if (typeof metadata.name !== 'string' || metadata.name.trim() === '') {
    throw new Error(`metadata.json in ${dir}: 'name' must be a non-empty string`);
  }

  if (typeof metadata.author !== 'string' || metadata.author.trim() === '') {
    throw new Error(`metadata.json in ${dir}: 'author' must be a non-empty string`);
  }

  // Check if time is a valid ISO 8601 date
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{6}$/.test(metadata.time)) {
    throw new Error(`metadata.json in ${dir}: 'time' must be in ISO 8601 format (YYYY-MM-DDTHH:MM:SS.mmmmmm)`);
  }

  if (typeof metadata.category !== 'string' || metadata.category.trim() === '') {
    throw new Error(`metadata.json in ${dir}: 'category' must be a non-empty string`);
  }

  // Check author_link if present
  if ('author_link' in metadata) {
    if (typeof metadata.author_link !== 'string') {
      throw new Error(`metadata.json in ${dir}: 'author_link' must be a string`);
    }
  }
}

function checkHtmlElements(dir) {
  const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
  const requiredElements = ['image', 'instagram', 'twitter', 'github', 'linkedin', 'other', 'phone', 'name', 'username', 'pronouns', 'dob', 'bio', 'email'];
  
  for (const element of requiredElements) {
    if (!html.includes(id="${element}")) {
      throw new Error(`the html in ${dir} is missing required element: #${element}`);
    }
  }
}

try {
  checkDirectories();
  
  const directories = fs.readdirSync('.').filter(file => 
    fs.statSync(file).isDirectory() && file !== '.github'
  );

  for (const dir of directories) {
    checkMetadataSchema(dir);
    checkHtmlElements(dir);
  }

  console.log('All checks passed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}