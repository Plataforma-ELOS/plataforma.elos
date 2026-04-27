# Guia de Estilo Visual - Plataforma E.L.O.S

Este documento detalha a identidade visual da Plataforma E.L.O.S, incluindo códigos de cores, efeitos de interface e comportamento dos temas.

## 🎨 Paleta de Cores (HSL)

A aplicação utiliza o formato HSL para permitir transparências dinâmicas e transições suaves.

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

### 🌙 Tema Escuro (Dark Mode)

| Variável | Código HSL | Cor Visual | Uso Principal |
| :--- | :--- | :--- | :--- |
| `--background` | `257 30% 12%` | Roxo Noturno | Fundo principal (conforto visual). |
| `--foreground` | `258 80% 98%` | Lavanda Claro | Texto principal para alto contraste. |
| `--primary` | `257 80% 80%` | Lavanda Vivo | Destaques vibrantes no fundo escuro. |
| `--secondary` | `215 50% 35%` | Azul Noturno | Elementos secundários menos invasivos. |
| `--accent` | `215 70% 70%` | Azul Pastel | Interação e foco. |
| `--card` | `257 20% 17%` | Roxo Cinza | Superfície de cards integrada ao fundo. |

---

## ✨ Efeitos e Interações

### 1. Sombras (Shadows)
- **Padrão:** `shadow-sm` para separação leve de elementos.
- **Destaque (Cards):** `shadow-lg` com cor adaptativa:
  - Claro: `shadow-primary/10`
  - Escuro: `shadow-black/40`
- **Hover:** Transição para `shadow-primary/20` com elevação.

### 2. Transições e Animações
- **Velocidade:** `duration-300` ou `duration-500` para mudanças de estado.
- **Curva:** `ease-in-out` para suavidade.
- **Hover Scale:** Botões e Cards utilizam `hover:scale-[1.03]` ou `hover:-translate-y-2` para feedback tátil.

### 3. Gradientes Específicos
- **Glow de IA:** `from-pink-400 via-purple-500 to-blue-500` (Usado em sombras de foco e botões de IA).
- **Branding Logo:** `from-blue-500 via-purple-500 to-pink-500` (Aplicado no texto "E.L.O.S").

---

## 📐 Estrutura de Layout
- **Bordas:** `border-border` (Roxo acinzentado muito claro).
- **Arredondamento:** `radius: 0.8rem` (Bordas generosas para transmitir acolhimento).
- **Espaçamento:** Escala padrão Tailwind baseada em `rem` para responsividade perfeita.

---
*Este guia deve ser seguido rigorosamente para garantir que a Plataforma E.L.O.S mantenha seu caráter acolhedor e profissional.*