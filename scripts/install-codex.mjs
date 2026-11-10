import { access, lstat, mkdir, readdir, readlink, symlink } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = fileURLToPath(new URL('../', import.meta.url));

try {
  if (process.argv.length > 3 || process.argv[2]?.startsWith('-')) {
    throw new Error('Usage: node scripts/install-codex.mjs [skills-directory]');
  }
  const destination = resolve(process.argv[2] ?? join(homedir(), '.agents', 'skills'));
  const entries = await readdir(join(packageRoot, 'skills'), { withFileTypes: true });
  const missing = [];

  // Check every destination before linking so a known collision leaves the install untouched.
  for (const entry of entries.filter(entry => entry.isDirectory())) {
    const source = join(packageRoot, 'skills', entry.name);
    await access(join(source, 'SKILL.md'));
    const target = join(destination, entry.name);
    let existing;
    try {
      existing = await lstat(target);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    if (!existing) {
      missing.push({ source, target });
    } else if (!existing.isSymbolicLink() || resolve(dirname(target), await readlink(target)) !== source) {
      throw new Error(`Refusing to overwrite ${target}. Choose a different skills-directory or resolve the conflict.`);
    }
  }

  await mkdir(destination, { recursive: true });
  for (const { source, target } of missing) {
    await symlink(source, target, 'dir');
  }
  console.log(`Linked ${missing.length} skills; skyeval skills are available in ${destination}.`);
  console.log('Keep this checkout in place. Open the target repo in Codex and invoke $agent-eval.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
