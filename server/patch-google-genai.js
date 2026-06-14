/**
 * Post-install patch for @langchain/google-genai
 * The SDK throws "Unknown content type thinking" when Gemma 4 returns thinking content.
 * This patch makes it silently skip thinking parts instead of throwing.
 */
const fs = require('fs');
const path = require('path');

const targetFile = path.join(
  __dirname,
  'node_modules',
  '@langchain',
  'google-genai',
  'dist',
  'utils',
  'common.cjs'
);

const oldCode = `	else if ("functionCall" in content) return;
	else if ("type" in content) throw new Error(\`Unknown content type \${content.type}\`);`;

const newCode = `	else if ("functionCall" in content) return;
	else if ("type" in content) {
		if (content.type === "thinking") return;
		throw new Error(\`Unknown content type \${content.type}\`);
	}`;

try {
  if (fs.existsSync(targetFile)) {
    let content = fs.readFileSync(targetFile, 'utf8');
    if (content.includes(oldCode)) {
      content = content.replace(oldCode, newCode);
      fs.writeFileSync(targetFile, content, 'utf8');
      console.log('[patch] Patched @langchain/google-genai to handle thinking content');
    } else if (content.includes('if (content.type === "thinking") return;')) {
      console.log('[patch] Already patched');
    } else {
      console.log('[patch] Could not find code to patch - manual intervention needed');
    }
  }
} catch (err) {
  console.error('[patch] Failed to patch:', err.message);
}
