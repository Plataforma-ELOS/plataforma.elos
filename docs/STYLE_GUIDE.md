# Guia de Estilo Visual - Plataforma E.L.O.S

Este documento detalha a identidade visual da Plataforma E.L.O.S, incluindo códigos de cores exatos (HSL), efeitos de interface e comportamento dos temas.

## 🎨 Paleta de Cores (HSL)

A aplicação utiliza o formato HSL para permitir transparências dinâmicas e transições suaves através de variáveis CSS.

### ☀️ Tema Claro (Light Mode)

| Variável | Código HSL | Cor Visual | Uso Principal |
| :--- | :--- | :--- | :--- |
| `--background` | `257 100% 99%` | Branco Lavanda | Fundo principal da aplicação. |
| `--foreground` | `256 10% 20%` | Roxo Escuro | Texto principal e títulos. |
| `--primary` | `257 70% 75%` | Lavanda | Botões de ação, ícones de destaque. |
| `--secondary` | `215 68% 90%` | Azul Pálido | Badges, fundos de seções secundárias. |
| `--accent` | `215 77% 78%` | Azul Sereno | Estados de hover e acentos visuais. |
| `--card` | `0 0% 100%` | Branco Puro | Superfície de cards e diálogos. |
| `--muted` | `258 67% 96%` | Cinza Lavanda | Fundo de inputs e áreas de baixo contraste. |
| `--border` | `258 67% 92%` | Lavanda Suave | Linhas de divisão e bordas de componentes. |

### 🌙 Tema Escuro (Dark Mode)

| Variável | Código HSL | Cor Visual | Uso Principal |
| :--- | :--- | :--- | :--- |
| `--background` | `257 30% 12%` | Roxo Noturno | Fundo principal (conforto visual). |
| `--foreground` | `258 80% 98%` | Lavanda Claríssimo | Texto principal para alto contraste. |
| `--primary` | `257 80% 80%` | Lavanda Vivo | Destaques vibrantes no fundo escuro. |
| `--secondary` | `215 50% 35%` | Azul Noturno | Elementos secundários menos invasivos. |
| `--accent` | `215 70% 70%` | Azul Pastel | Interação e foco. |
| `--card` | `257 20% 17%` | Roxo Cinza | Superfície de cards integrada ao fundo. |
| `--border` | `257 20% 27%` | Roxo Linha | Divisórias em ambientes escuros. |

---

## ✨ Efeitos e Interações

### 1. Sombras (Shadows)
- **Padrão:** `shadow-sm` para separação leve de elementos.
- **Destaque (Cards):** `shadow-lg` com cor adaptativa:
  - Claro: `shadow-primary/10` (Lavanda translúcido)
  - Escuro: `shadow-black/40` (Sombra profunda)
- **Hover:** Transição para `shadow-primary/20` com leve elevação no eixo Y.

### 2. Transições e Animações
- **Velocidade:** `duration-300` para micro-interações e `duration-500` para carregamento de página.
- **Curva:** `ease-in-out` para suavidade orgânica.
- **Hover Scale:** Botões e Cards utilizam `hover:scale-[1.03]` ou `hover:-translate-y-2` para feedback tátil imediato.

### 3. Gradientes Específicos
- **Glow de IA:** `from-pink-400 via-purple-500 to-blue-500`
  - Utilizado em sombras de foco e contornos de componentes que possuem inteligência artificial.
- **Branding Logo:** `from-blue-500 via-purple-500 to-pink-500`
  - Aplicado exclusivamente no texto "E.L.O.S" para destaque da marca.

---

## 📐 Estrutura de Layout
- **Bordas:** `border-border` (Sempre amarrada à variável de borda do tema atual).
- **Arredondamento:** `radius: 0.8rem` (Bordas generosas para transmitir acolhimento e evitar ângulos agressivos).
- **Espaçamento:** Escala padrão Tailwind para manter a consistência aritmética entre os elementos.

---
*Este guia deve ser consultado em caso de criação de novos componentes para manter a integridade visual da plataforma.*