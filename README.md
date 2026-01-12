# SpaceHub / AquaticHub

Uma plataforma moderna de gerenciamento de e-commerce com tema dual (espacial/aquático).

## Tecnologias

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **Radix UI** para componentes acessíveis
- **React Query** para gerenciamento de estado do servidor
- **React Router** para navegação
- **Recharts** para visualização de dados
- **Framer Motion patterns** para animações

## Arquitetura

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (design system)
│   ├── layout/         # Layout principal (Header, Sidebar)
│   ├── charts/         # Gráficos e visualizações
│   ├── inbox/          # Componentes de email
│   └── transition/     # Sistema de transições animadas
├── pages/              # Páginas da aplicação
├── hooks/              # Custom hooks
├── lib/                # Utilitários
└── data/               # Mock data
```

## Funcionalidades

- **Dashboard** com métricas em tempo real
- **Inbox** para gerenciamento de emails de clientes
- **Pedidos** com busca, filtros e detalhes
- **Reembolsos** com workflow de aprovação
- **Configurações** do sistema
- **Tema dual** com transições animadas entre modo escuro (espacial) e claro (aquático)

## Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## Scripts

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## Design System

O projeto utiliza um design system baseado em CSS variables com suporte a temas:

- **Dark Mode (SpaceHub)**: Tema espacial com estrelas, nebulosas e transições cósmicas
- **Light Mode (AquaticHub)**: Tema aquático com ondas, bolhas e efeito liquid glass

## Licença

MIT
