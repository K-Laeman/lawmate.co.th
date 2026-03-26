/**
 * Extract plain text from Lexical rich text content (PayloadCMS format).
 * Recursively traverses the node tree and concatenates all text nodes.
 */
export function extractTextFromLexical(content: unknown): string {
  if (typeof content === 'string') return content
  if (!content || typeof content !== 'object') return ''

  const root = content as { root?: { children?: unknown[] } }
  if (!root.root?.children) return ''

  const extractText = (nodes: unknown[]): string => {
    return nodes
      .map((node) => {
        const n = node as { type?: string; text?: string; children?: unknown[] }
        if (n.type === 'text' && n.text) return n.text
        if (n.children) return extractText(n.children)
        return ''
      })
      .join(' ')
  }

  return extractText(root.root.children)
}
