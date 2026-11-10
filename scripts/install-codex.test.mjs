import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, readdir, realpath, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const installer = fileURLToPath(new URL('./install-codex.mjs', import.meta.url));
const packageRoot = fileURLToPath(new URL('../', import.meta.url));

async function temporaryDirectory(t) {
  const directory = await mkdtemp(join(tmpdir(), 'skyeval install '));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

test('installs every shared skill, resolves workflow references, and can run twice', async t => {
  const destination = join(await temporaryDirectory(t), '.agents', 'skills');
  execFileSync(process.execPath, [installer, destination]);
  execFileSync(process.execPath, [installer, destination]);

  const expected = (await readdir(join(packageRoot, 'skills'), { withFileTypes: true }))
    .filter(entry => entry.isDirectory()).map(entry => entry.name).sort();
  assert.deepEqual((await readdir(destination)).sort(), expected);
  for (const name of expected) {
    assert.equal(await realpath(join(destination, name)), join(packageRoot, 'skills', name));
    await readFile(join(destination, name, 'SKILL.md'), 'utf8');
  }
  const physicalSkill = dirname(await realpath(join(destination, 'agent-eval', 'SKILL.md')));
  for (const reference of ['../../loop.md', '../../vendors/pi-agent.md', '../../vendors/codex.md']) {
    await readFile(join(physicalSkill, reference), 'utf8');
  }
});

for (const kind of ['file', 'directory', 'broken symlink']) {
  test(`refuses a conflicting ${kind} before creating any links`, async t => {
    const destination = await temporaryDirectory(t);
    const conflict = join(destination, 'why');
    if (kind === 'file') await writeFile(conflict, 'user-owned');
    if (kind === 'directory') await mkdir(conflict);
    if (kind === 'broken symlink') await symlink(join(destination, 'missing'), conflict);

    const result = spawnSync(process.execPath, [installer, destination], { encoding: 'utf8' });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Refusing to overwrite/);
    assert.deepEqual(await readdir(destination), ['why']);
    if (kind === 'file') assert.equal(await readFile(conflict, 'utf8'), 'user-owned');
  });
}

test('defaults to user skill discovery under HOME', async t => {
  const homeDirectory = await temporaryDirectory(t);
  execFileSync(process.execPath, [installer], { env: { ...process.env, HOME: homeDirectory } });
  assert.equal(await realpath(join(homeDirectory, '.agents', 'skills', 'agent-eval')),
    join(packageRoot, 'skills', 'agent-eval'));
});

test('rejects extra arguments without installing', async t => {
  const destination = await temporaryDirectory(t);
  const result = spawnSync(process.execPath, [installer, destination, 'extra'], { encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Usage:/);
  assert.deepEqual(await readdir(destination), []);
});
