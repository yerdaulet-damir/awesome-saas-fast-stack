#!/usr/bin/env node

/**
 * Validate tools.json - sanity check URLs and structure
 * Usage: node scripts/validate-tools.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const toolsPath = path.join(__dirname, '..', 'data', 'tools.json');

async function validateUrl(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'HEAD' }, (res) => {
      resolve({ url, status: res.statusCode, ok: res.statusCode < 400 });
    });
    
    req.on('error', () => {
      resolve({ url, status: 'ERROR', ok: false });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ url, status: 'TIMEOUT', ok: false });
    });
    
    req.end();
  });
}

async function validateTools() {
  console.log('🔍 Validating tools.json...\n');
  
  if (!fs.existsSync(toolsPath)) {
    console.error('❌ tools.json not found');
    process.exit(1);
  }
  
  const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));
  const results = [];
  
  for (const [category, toolsList] of Object.entries(tools)) {
    console.log(`📂 ${category}:`);
    
    for (const tool of toolsList) {
      if (!tool.name || !tool.url) {
        console.log(`  ❌ ${tool.name || 'Unknown'}: Missing name or URL`);
        results.push({ category, tool: tool.name, status: 'INVALID', ok: false });
        continue;
      }
      
      const result = await validateUrl(tool.url);
      const status = result.ok ? '✅' : '❌';
      console.log(`  ${status} ${tool.name}: ${result.status}`);
      results.push({ category, tool: tool.name, ...result });
    }
    console.log('');
  }
  
  const failed = results.filter(r => !r.ok);
  const total = results.length;
  const passed = total - failed.length;
  
  console.log(`📊 Summary: ${passed}/${total} URLs valid`);
  
  if (failed.length > 0) {
    console.log('\n❌ Failed URLs:');
    failed.forEach(f => {
      console.log(`  - ${f.tool}: ${f.url} (${f.status})`);
    });
    process.exit(1);
  } else {
    console.log('\n✅ All URLs are valid!');
  }
}

validateTools().catch(console.error);
