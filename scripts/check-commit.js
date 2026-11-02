import { readFileSync } from 'node:fs';

const firstLine = readFileSync(process.argv[2], 'utf8').split('\n')[0];
if (
  !/^(feat|fix|test|docs|chore|style|refactor|perf|build|ci)(\([\w-]+\))?!?: .+/.test(firstLine) &&
  !firstLine.startsWith('Merge ')
) {
  console.error('Use uma mensagem como: feat: adiciona página de projetos');
  process.exit(1);
}
