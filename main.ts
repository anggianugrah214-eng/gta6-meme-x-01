// gta6-meme-x-01 entry (Node 22, standard library only).
//
// The entry itself is the X post: this program only hands the grader the
// post's address. It first validates POST.json — parsing it as JSON and
// checking that its "url" field is an X/Twitter status URL — then copies
// POST.json from the repository root into the output directory, where the
// house reads it and fetches the post from X
// (first picture, then text) for the judge.
//
// Run the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });

let postUrl: string;
try {
  const post = JSON.parse(readFileSync(join(botDir, 'POST.json'), 'utf8'));
  postUrl = post?.url;
} catch (error) {
  console.error(`could not parse POST.json in ${botDir} as JSON: ${(error as Error).message}`);
  process.exit(1);
}

if (typeof postUrl !== 'string' || !/^https:\/\/(x\.com|twitter\.com)\/[^/]+\/status\/\d+$/.test(postUrl)) {
  console.error(`invalid "url" in POST.json: expected an X/Twitter status URL like https://x.com/<handle>/status/<digits>, got ${JSON.stringify(postUrl)}`);
  process.exit(1);
}

try {
  copyFileSync(join(botDir, 'POST.json'), join(outputDir, 'POST.json'));
} catch (error) {
  console.error(`could not copy POST.json from ${botDir}: ${(error as Error).message}`);
  process.exit(1);
}

console.log(`handing over post: ${postUrl}`);
