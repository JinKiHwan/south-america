# Design System: The Missionary Journey

## Overview

Vision Thru the Bible Ministries의 디자인 언어는 따뜻한 크림색 캔버스와 엇갈리게 배치된 유기적인 형태의 사진들로 시작됩니다. 차갑고 기술적인 그레디언트와 짙은 네이비 대신, 남미의 토양과 여정을 상징하는 웜 크림(Warm Cream), 테라코타(Terracotta), 그리고 둥근 모서리가 화면 전체를 감쌉니다. 메인 페이지의 상단은 대륙을 횡단하는 듯한 점선(Dotted path) 모티프와 지그재그로 배치된 큰 반경(24px)의 사역 사진들이 장식합니다.

색상 시스템은 두 가지 주요 역할을 합니다. **Terracotta** (`{colors.primary}` — `#E87A5D`)는 사역의 열정과 생명력을 상징하는 브랜드 시그니처 색상으로, 알약 형태의 메인 CTA 버튼과 텍스트 하이라이트(밑줄)에 제한적으로 사용됩니다. **Warm Cream** (`{colors.canvas}` — `#f3e6da`)은 순백색의 피로감을 줄여주며 페이지의 기본 배경으로 깔리고, 그 위로 개별 소식지나 사진 카드들이 순백색(`{colors.canvas-card}`) 폼으로 떠오릅니다.

타이포그래피는 **Outfit** (또는 Lora)을 헤딩으로 사용하여 친근하면서도 감성적인 여행기(Journal)의 느낌을 주며, 본문은 가독성이 뛰어난 **Inter**(또는 Pretendard)를 사용합니다. 금융 데이터에 쓰이던 극단적인 마이너스 자간과 얇은 굵기를 버리고, 여유 있는 자간과 행간을 통해 편안한 독서 경험을 제공합니다.

**Key Characteristics:**

- Warm-canvas backdrop on every surface — pure white is reserved strictly for elevated cards, making the background a comforting `{colors.canvas}` cream.
- Single-terracotta CTA hierarchy: filled `{colors.primary}` pill is the only filled button on marketing surfaces.
- Organic Geometry: Sharp edges are completely removed. Cards use `{rounded.2xl}` (16px) and hero images use `{rounded.3xl}` (24px) for a soft, approachable feel.
- Staggered Image Cluster: Photography is never placed in rigid, perfectly aligned boxes. Images overlap and stagger vertically to feel like a dynamic travel album.
- Flight Path Decorator: Dotted SVG lines connect text and image clusters, tracing the missionary's journey across South America.
- Text Highlighter: Key words in large headings (e.g., "Hidden Wonders") are emphasized with `{colors.primary}` or a stylized brush-stroke underline.

## Colors

> **Source pages:** home (`/`), newsletter archive, youtube gallery.

### Brand & Accent

- **Terracotta** (`{colors.primary}` — `#E87A5D`): The brand's signature CTA color. Filled-pill button, link emphasis, text highlighter.
- **Terracotta Deep** (`{colors.primary-deep}` — `#C45A3E`): A deeper terracotta used in hover states.
- **Terracotta Press** (`{colors.primary-press}` — `#A54128`): Pressed-state lift of the primary.
- **Terracotta Soft** (`{colors.primary-soft}` — `#F5A894`): A pale terracotta used for background map graphics or soft path decorators.
- **Sand Subdued** (`{colors.primary-bg-subdued}` — `#F0E8DD`): Pale earth tone used as a soft tag background.
- **Forest Green** (`{colors.accent-green}` — `#4A6B53`): Secondary accent color for specific regional tags or nature-focused highlights (optional).

### Surface

- **Canvas** (`{colors.canvas}` — `#f3e6da`): Default page background. A warm cream that removes the harshness of pure white.
- **Canvas Card** (`{colors.canvas-card}` — `#FFFFFF`): Pure white, used exclusively for cards and containers that sit on top of the cream canvas.
- **Canvas Soft** (`{colors.canvas-soft}` — `#F2EFE9`): Slightly darker cream for secondary sections or footers.
- **Hairline** (`{colors.hairline}` — `#E8E3DD`): 1px borders on outline buttons and cards.

### Text

- **Ink** (`{colors.ink}` — `#171717`): Default body text color across the brand. Deep charcoal, never pure black.
- **Ink Secondary** (`{colors.ink-secondary}` — `#524E4A`): Secondary text for subtitles or less important descriptions.
- **Ink Mute** (`{colors.ink-mute}` — `#7A7571`): Helper text, dates, author names, tags.
- **On Primary** (`{colors.on-primary}` — `#FFFFFF`): Text on terracotta / dark surfaces.

### Semantic

The brand relies on organic storytelling rather than strict semantic states.

## Typography

### Font Family

The display tier is **Outfit** (open-source via Google Fonts) at weights 400 (regular) and 500 (medium). It provides a clean, geometric but very friendly and approachable tone.
The body tier uses **Inter** (or Pretendard for Korean) at weight 400, providing maximum legibility for long mission updates.

### Hierarchy

| Token                      | Size | Weight | Line Height | Letter Spacing | Use                         |
| -------------------------- | ---- | ------ | ----------- | -------------- | --------------------------- |
| `{typography.display-xxl}` | 56px | 500    | 1.1         | -0.02em        | Hero headline               |
| `{typography.display-xl}`  | 44px | 500    | 1.2         | -0.01em        | Section opener              |
| `{typography.display-lg}`  | 32px | 500    | 1.3         | 0              | Card title / sub-section    |
| `{typography.display-md}`  | 24px | 500    | 1.3         | 0              | Article card title          |
| `{typography.heading-sm}`  | 18px | 500    | 1.4         | 0              | Mini-section label          |
| `{typography.body-lg}`     | 18px | 400    | 1.6         | 0              | Marketing body lead         |
| `{typography.body-md}`     | 16px | 400    | 1.6         | 0              | Default UI body             |
| `{typography.button-md}`   | 16px | 500    | 1.0         | 0              | Pill button label           |
| `{typography.caption}`     | 14px | 400    | 1.5         | 0              | Helper, date, region labels |
| `{typography.micro-cap}`   | 12px | 500    | 1.2         | 0.05em         | All-caps eyebrow, tag       |

### Principles

- **Readability over Density.** Line heights are set to `1.6` for body text to ensure long mission letters are comfortable to read.
- **Friendly Display.** Display fonts use standard or very slightly negative tracking, abandoning the highly-compressed tech look.
- **Color Emphasis.** Use `{colors.primary}` to highlight specific words in headlines to draw attention organically.

## Layout

### Spacing System

- **Base unit**: 8px.
- **Tokens**: `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.huge}` 80px.
- **Section padding**: 96–120px on main surfaces to create an airy, unhurried feel.
- **Card internal padding**: 24px.

### Grid & Container

- Pages center in a ~1200px container.
- **Staggered Grid:** Image galleries and hero sections avoid perfect horizontal alignment. Elements are vertically offset (masonry style) to simulate a dynamic scrapbook or travel journal.

### Whitespace Philosophy

Whitespace (or rather, Cream-space) is generous. The canvas represents the open journey. Sections should not feel boxed in or overly segmented by harsh lines.

## Elevation & Depth

| Level | Treatment                                        | Use                                             |
| ----- | ------------------------------------------------ | ----------------------------------------------- |
| 0     | Flat                                             | Default cream surface                           |
| 1     | `box-shadow: rgba(45, 42, 38, 0.04) 0 4px 12px`  | Card lift on cream canvas (Newsletters, Videos) |
| 2     | `box-shadow: rgba(45, 42, 38, 0.08) 0 12px 32px` | Floating hero images, active states             |

### Decorative Depth

Depth is created through overlapping elements. A photograph might slightly overlap a text box, or a dotted SVG line might weave behind an image and in front of a card, emphasizing the "journey" concept.

## Shapes

### Border Radius Scale

Radii are significantly increased to create an organic, friendly aesthetic.

| Token            | Value  | Use                            |
| ---------------- | ------ | ------------------------------ |
| `{rounded.sm}`   | 8px    | Form inputs, small UI elements |
| `{rounded.md}`   | 12px   | Compact thumbnails             |
| `{rounded.2xl}`  | 16px   | Article cards, standard images |
| `{rounded.3xl}`  | 24px   | Hero section large images      |
| `{rounded.pill}` | 9999px | All buttons, tag pills         |

## Components

### Buttons

**`button-primary-pill`** — the dominant CTA.

- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button-md}`, padding `{spacing.md} {spacing.lg}` (12px 24px), rounded `{rounded.pill}` 9999px.
- Pressed state shifts background to `{colors.primary-press}`.

**`button-outline-pill`** — category tags or secondary actions.

- Background transparent, text `{colors.ink}`, 1px solid `{colors.ink-mute}`, same pill geometry.

### Cards & Containers

**`card-story-light`** — feature explanation / newsletter card.

- Background `{colors.canvas-card}` (pure white), padding `{spacing.lg}` (24px), rounded `{rounded.2xl}` (16px), Level 1 shadow. Image sits inside or spans the top with matching border radius.

**`card-thumbnail-list`** — compact layout for past stories.

- Background transparent. Image thumbnail on left (80px width, `{rounded.md}`), text content on right. No borders or shadows, relying on whitespace for separation.

### Signature Components

**Staggered Image Cluster** — Instead of a flat hero image, use 3-4 images of varying dimensions (e.g., one portrait, two squares) placed in a masonry-style arrangement. Applied with `{rounded.3xl}` and Level 2 shadows.

**Flight Path Decorator** — A dotted or dashed SVG line (using `{colors.primary-soft}`) that visually connects different sections or images, mimicking an airplane's path on a map. Best animated with GSAP `DrawSVG` on scroll.

**Text Highlighter** — Instead of bolding text, use `{colors.primary}` for specific words in a headline, or place a stylized brush-stroke SVG directly underneath the word to draw attention.

## Do's and Don'ts

### Do

- Use `{colors.canvas}` (Warm Cream) as the base background to ensure a soft, inviting atmosphere.
- Reserve pure white (`{colors.canvas-card}`) only for elevated cards.
- Use generous border radii (`16px` to `24px`) on all images and cards.
- Overlap elements slightly (images over backgrounds, paths through images) to create an organic, scrap-book feel.
- Use dotted paths to guide the user's eye down the page.

### Don't

- Don't use pure black for text. Always use `{colors.ink}` (Charcoal).
- Don't align photo galleries into perfect, rigid grids. Always offset them slightly to keep the layout dynamic.
- Don't use cold grays or harsh borders. Rely on soft shadows and warm earth tones for separation.

## Responsive Behavior

### Breakpoints

| Name    | Width      | Key Changes                                                      |
| ------- | ---------- | ---------------------------------------------------------------- |
| Desktop | 1024px+    | Full staggered image cluster, visible flight path decorators     |
| Tablet  | 768–1023px | Image cluster simplifies to 2 images, path decorators simplified |
| Mobile  | < 768px    | Images stack vertically, text highlighter remains, paths hidden  |

### Collapsing Strategy

- The Staggered Image Cluster flattens on mobile. Images stack sequentially with generous padding between them.
- Display typography scales down gracefully (e.g., 56px -> 36px).
- Flight path decorators are generally hidden on mobile to prevent visual clutter, focusing purely on content and large `{rounded.2xl}` cards.

## Iteration Guide

1. Focus on ONE component at a time.
2. Reference component names and tokens directly (`{colors.primary}`, `{colors.canvas}`, `{rounded.3xl}`).
3. Ensure every image feels like a photograph placed on a desk, not a rigid box in a database.
4. The Warm Cream background is non-negotiable — bare-white backgrounds break the brand's warmth.
