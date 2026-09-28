# Zé do Ó · Restaurante

Site institucional responsivo do Zé do Ó Cozinha Ancestral, em Porto de Galinhas. Astro gera HTML estático. A galeria AccordionGallery usa uma ilha React carregada quando se aproxima da área visível. GSAP anima as entradas durante a rolagem e a expansão dos painéis, preservando o scroll nativo.

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

## Galeria e movimento

- AccordionGallery adaptado do código React Bits fornecido pelo cliente, com cinco fotos reais da fachada e do interior.
- Desktop: expansão por hover, foco ou clique; setas, Home e End movem também o foco do teclado.
- Mobile: disposição vertical com altura definida e expansão por toque, sem comprimir as fotos em faixas horizontais estreitas.
- Suporte dinâmico a `prefers-reduced-motion`, inclusive quando a preferência muda com a página aberta.
- Entradas suaves, sequência dos cards e encaixe da foto/galeria por ScrollTrigger. Todo conteúdo permanece visível sem JavaScript.
- Componente e CSS em `src/components/AccordionGallery.*`; animações da página em `src/scripts/motion.ts`.
- Fonte do componente: React Bits (https://reactbits.dev), código enviado pelo cliente. Ajustes locais de responsividade, acessibilidade e limpeza de efeitos.

Conteúdo principal: `src/pages/index.astro`. Estilos: `src/styles/global.css`. Fotos: `public/images/`.

## Publicação

Projeto preparado para hospedagem estática. O deploy deve ser executado somente após autorização do responsável.
