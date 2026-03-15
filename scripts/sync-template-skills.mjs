import { cp, mkdir, readdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const skillsDir = path.join(repoRoot, 'skills');
const templateSkillsDir = path.join(repoRoot, 'template', 'skills');

async function copyDir(source, destination) {
  await cp(source, destination, { recursive: true, force: true });
}

async function main() {
  await rm(templateSkillsDir, { recursive: true, force: true });
  await mkdir(templateSkillsDir, { recursive: true });

  const entries = await readdir(skillsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const source = path.join(skillsDir, entry.name);
    const destination = path.join(templateSkillsDir, entry.name);
    const sourceStat = await stat(source);
    if (!sourceStat.isDirectory()) {
      continue;
    }

    await copyDir(source, destination);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
