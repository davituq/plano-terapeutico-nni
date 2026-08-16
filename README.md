# Gerador de Plano Terapêutico NNI

Aplicação institucional do Núcleo de Neuroimunologia para estruturar o plano de cuidado dos próximos seis meses e gerar um documento visual para o paciente.

## Privacidade

- Utilize somente as iniciais do paciente.
- Não informe nome completo, número de prontuário, CPF ou outros identificadores diretos.
- O protótipo não possui banco de dados e mantém as informações apenas na sessão atual do navegador.
- Fechar ou atualizar a página apaga o formulário em preenchimento.

## Desenvolvimento local

Requisitos: Node.js 22.13 ou superior e npm.

```bash
npm ci
npm run dev
```

## Versão estática para GitHub Pages

```bash
npm ci
npm run build:github
```

O conteúdo pronto para publicação será criado em `dist-github/`.

## Publicação automática

O workflow `.github/workflows/deploy-pages.yml` compila e publica o site sempre que uma alteração é enviada para a branch `main`.

Depois de criar o repositório no GitHub:

1. Abra **Settings → Pages**.
2. Em **Build and deployment**, selecione **GitHub Actions** como origem.
3. Envie os arquivos para a branch `main` ou execute o workflow manualmente pela aba **Actions**.

## Identidade visual

A aplicação utiliza a marca oficial do NNI e as diretrizes de interface do manual Vysion. Não distorça, recolora ou acrescente ornamentos à logomarca.
