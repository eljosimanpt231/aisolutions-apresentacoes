@echo off
rem Instala/atualiza a skill criar-apresentacao no Claude Code desta maquina.
rem Correr a partir da raiz do clone: scripts\instalar-skill.cmd
set ORIGEM=%~dp0..\skill\criar-apresentacao
set DESTINO=%USERPROFILE%\.claude\skills\criar-apresentacao
if not exist "%ORIGEM%\SKILL.md" (
  echo ERRO: nao encontro %ORIGEM%. Corre este script a partir do clone do repo.
  exit /b 1
)
robocopy "%ORIGEM%" "%DESTINO%" /E /PURGE /NFL /NDL /NJH /NJS
if %ERRORLEVEL% GEQ 8 (
  echo ERRO ao copiar a skill.
  exit /b 1
)
echo OK: skill criar-apresentacao instalada em %DESTINO%
echo Reinicia o Claude Code para a skill aparecer.
exit /b 0
