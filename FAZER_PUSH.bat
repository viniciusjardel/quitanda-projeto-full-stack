@echo off
REM Script para fazer push automático para GitHub
REM Autor: Quitanda Villa Natal

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║   🚀 Script de Upload para GitHub                     ║
echo ║   Quitanda Villa Natal - Backend PIX                  ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Verificar se Git está instalado
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git não encontrado! Instale em: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ✅ Git detectado
echo.

REM Inicializar Git
echo 1️⃣ Inicializando repositório Git...
git init

REM Adicionar todos os arquivos
echo.
echo 2️⃣ Adicionando arquivos...
git add .

REM Fazer commit
echo.
echo 3️⃣ Fazendo commit...
git commit -m "Quitanda Villa Natal - Backend PIX"

REM Configurar branch main
echo.
echo 4️⃣ Configurando branch main...
git branch -M main

REM Adicionar remote
echo.
echo 5️⃣ Conectando ao repositório GitHub...
echo.
echo Seu username GitHub: viniciusjardel
set /p repo_name="Nome do repositório (padrão: quitanda-backend): "
if "%repo_name%"=="" set repo_name=quitanda-backend

git remote add origin https://github.com/viniciusjardel/%repo_name%.git

REM Fazer push
echo.
echo 6️⃣ Enviando para GitHub...
echo.
echo ⚠️ IMPORTANTE: Será solicitado seu GitHub Token
echo.
echo 📝 Para gerar token:
echo    1. Acesse: https://github.com/settings/tokens/new
echo    2. Marque: ✓ repo  e  ✓ workflow
echo    3. Clique "Generate token"
echo    4. Copie o token gerado
echo    5. Cole aqui quando solicitado
echo.
pause

git push -u origin main

if errorlevel 0 (
    echo.
    echo ╔════════════════════════════════════════════════════════╗
    echo ║   ✅ Sucesso! Arquivos enviados para GitHub!          ║
    echo ║   Acesse: https://github.com/viniciusjardel/%repo_name% ║
    echo ║   Agora conecte no Render.com!                        ║
    echo ╚════════════════════════════════════════════════════════╝
    echo.
) else (
    echo.
    echo ❌ Erro ao fazer push!
    echo.
)

pause
