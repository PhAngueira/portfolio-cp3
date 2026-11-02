import { spawnSync } from 'node:child_process';

const result = spawnSync('git', ['config', 'core.hooksPath', '.githooks'], { stdio: 'inherit' });
if (result.status !== 0) {
  console.error('Inicialize ou clone o repositório antes de instalar os hooks.');
  process.exit(1);
}
console.log('Hooks instalados: lint e formatação antes do commit; padrão de mensagem verificado.');
