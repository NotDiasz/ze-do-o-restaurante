# Zé do Ó · Restaurante

Site institucional responsivo do Zé do Ó Cozinha Ancestral, em Porto de Galinhas. Astro gera HTML estático; a integração React fica disponível para novas ilhas interativas. A versão atual do restaurante não envia JavaScript de React ao visitante.

## Desenvolvimento

Requer Node.js 24 LTS (ou 22.19+).

```sh
npm ci
npm run dev
```

A prévia usa `http://127.0.0.1:4321`. Inicie também o projeto do cardápio na porta 4322 para testar os links entre os dois projetos.

```sh
npm run build
npm run preview
```

O resultado estático fica em `dist/`. Não é necessário servidor Node em produção.

## Configuração para deploy

Defina `PUBLIC_MENU_URL` com a URL final do cardápio **antes do build**. O fallback em produção aponta para o endereço reservado no Sites, ainda não publicado. `.openai/hosting.json` identifica essa reserva e configura `dist` como pasta pública; o arquivo não publica o site sozinho.

## Conteúdo e identidade

- Fotos e marca fornecidas pelo cliente. Letreiro original preservado como imagem, extraída do cardápio enviado.
- Laranja, terracota e creme seguem o material da marca.
- Geo Sans Light, identificada no PDF, é hospedada localmente. Títulos usam Georgia: a fonte Afterglow foi identificada no PDF, mas seu arquivo completo e licença web não foram fornecidos. Pode ser substituída por `@font-face` quando disponível.
- História baseada no texto do cardápio, de Patrícia Naia (@essanaia), reescrita para o site.
- Endereço e horário de terça a quinta fornecidos pelo cliente. Outros dias não foram presumidos.
- Nota 4,8 transcrita da captura do Google fornecida; não é uma integração em tempo real.
- Contato via Instagram. Nenhum telefone ou WhatsApp foi inventado.
- A seção de vídeo foi removida a pedido do cliente.

Conteúdo principal: `src/pages/index.astro`. Estilos: `src/styles/global.css`. Fotos: `public/images/`.

## Publicação

Projeto preparado para hospedagem estática. O deploy deve ser executado somente após autorização do responsável.
