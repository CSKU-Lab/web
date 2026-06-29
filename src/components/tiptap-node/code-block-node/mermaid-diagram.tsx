"use client"

import * as React from "react"

import { cn } from "~/lib/utils"

// Theme overrides injected via mermaid's `themeCSS`. Mermaid wraps this inside
// the SVG's own `#<id>`-scoped <style>, so it matches mermaid's default rules on
// specificity but wins on cascade order. `var(...)` resolves because the SVG
// lives under `.mermaid-diagram`, which inherits the app's color tokens, so
// light and dark both follow the theme automatically with no JS color probing.
//
// IMPORTANT: this is only applied to diagrams that DON'T style themselves. When
// a diagram uses `classDef` / `class` / `style` / `:::`, mermaid emits the
// author's colors as inline `style="fill:… !important"` on the shapes, which no
// stylesheet can override. Forcing only the text color there (which we *can*
// override) produces unreadable text on the author's fills — so we leave
// authored diagrams entirely alone and let the author's palette stand.
// Edges and arrowheads are never emitted with inline `!important` (only shapes
// styled via classDef are), so a stylesheet rule reliably wins here. We theme
// these for EVERY diagram — including authored ones — so connectors stay visible
// on the dark canvas instead of rendering near-black.
const EDGE_CSS = `
  .edgePath .path, .flowchart-link, .relation { stroke: var(--muted-foreground); }
  .marker, .arrowMarkerPath, marker path, .arrowheadPath {
    fill: var(--muted-foreground); stroke: var(--muted-foreground);
  }
`

// Node fills, text and clusters — only applied to un-styled diagrams (see
// hasAuthorStyling). For authored diagrams these would half-apply against the
// author's inline `!important` colors and produce unreadable text.
const NODE_CSS = `
  .node rect, .node circle, .node ellipse, .node polygon, .node path {
    fill: var(--background); stroke: var(--border);
  }
  .cluster rect { fill: var(--muted); stroke: var(--border); }
  .nodeLabel, .edgeLabel, .label, .cluster-label, text, span, p {
    color: var(--foreground); fill: var(--foreground);
  }
  .edgeLabel rect, .label-container { fill: var(--background); }
`

// True when the diagram defines its own colors. Such styling lands as inline
// `!important` rules that win the cascade outright, so our themeCSS must stand
// down to avoid half-applying (e.g. recoloring text but not the box behind it).
function hasAuthorStyling(source: string): boolean {
  return (
    /\bclassDef\b/.test(source) ||
    /:::/.test(source) ||
    /(^|\n)\s*style\s+\S/.test(source) ||
    /(^|\n)\s*class\s+[\w,]+\s+\S/.test(source)
  )
}

// Unique id per render. mermaid.render() injects a temp element with this id and
// the output SVG carries it too; reusing an id that is still mounted in the DOM
// makes mermaid's internal lookup collide with our live SVG. A fresh id each call
// avoids that (it's what breaks a re-render otherwise).
let renderCounter = 0

// Mermaid is heavy (~500kb) and client-only. Lazy-import it so it never lands in
// the main bundle or runs during SSR. The neutral "base" theme plus themeCSS
// above keeps colors on the app palette for both light and dark.
async function renderMermaid(
  id: string,
  source: string
): Promise<{ svg: string } | { error: string }> {
  try {
    const mermaid = (await import("mermaid")).default
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: "base",
      // Always theme edges/arrows; only theme node fills + text when the
      // diagram doesn't style itself (respect the author's own palette).
      themeCSS: hasAuthorStyling(source) ? EDGE_CSS : EDGE_CSS + NODE_CSS,
    })
    const { svg } = await mermaid.render(id, source)
    return { svg }
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) }
  }
}

interface MermaidDiagramProps {
  source: string
  className?: string
}

export function MermaidDiagram({ source, className }: MermaidDiagramProps) {
  const [svg, setSvg] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  // No theme dependency: themeCSS injects `var(...)` into the SVG's <style>, so
  // the browser recolors the diagram live when the `.dark` class flips — no
  // re-render needed. Re-rendering on theme change is exactly what used to
  // break (frozen colors / id collision); we only re-render when the source
  // changes.
  React.useEffect(() => {
    let cancelled = false
    const trimmed = source.trim()
    if (!trimmed) {
      setSvg(null)
      setError(null)
      return
    }
    const id = `mermaid-${++renderCounter}`
    renderMermaid(id, trimmed).then((result) => {
      if (cancelled) return
      if ("svg" in result) {
        setSvg(result.svg)
        setError(null)
      } else {
        setSvg(null)
        setError(result.error)
      }
    })
    return () => {
      cancelled = true
    }
  }, [source])

  if (error) {
    return (
      <div className={cn("mermaid-diagram mermaid-diagram--error", className)}>
        <p className="text-destructive text-sm font-medium">
          Mermaid syntax error
        </p>
        <pre className="text-destructive/80 mt-1 overflow-x-auto text-xs whitespace-pre-wrap">
          {error}
        </pre>
      </div>
    )
  }

  if (!svg) {
    return (
      <div
        className={cn(
          "mermaid-diagram text-muted-foreground text-sm italic",
          className
        )}
      >
        Empty diagram
      </div>
    )
  }

  return (
    <div
      className={cn("mermaid-diagram flex justify-center", className)}
      // SVG comes from mermaid with securityLevel "strict" (sanitized).
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
