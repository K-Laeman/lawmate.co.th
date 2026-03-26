import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// Lexical node types from Payload CMS
interface UploadValue {
  url?: string
  alt?: string
  caption?: string
  width?: number
  height?: number
  filename?: string
}

interface LexicalNode {
  type: string
  version: number
  children?: LexicalNode[]
  text?: string
  format?: number | string
  tag?: string
  listType?: 'number' | 'bullet' | 'check'
  value?: number | UploadValue
  relationTo?: string
  direction?: 'ltr' | 'rtl' | null
  indent?: number
  url?: string
  newTab?: boolean
  rel?: string
  fields?: {
    linkType?: 'internal' | 'custom'
    url?: string
    newTab?: boolean
    doc?: {
      value?: string
      relationTo?: string
    }
  }
}

interface LexicalRoot {
  root: {
    type: string
    children: LexicalNode[]
    direction: 'ltr' | 'rtl' | null
    format: string
    indent: number
    version: number
  }
}

// Format flags for text formatting
const IS_BOLD = 1
const IS_ITALIC = 2
const IS_STRIKETHROUGH = 4
const IS_UNDERLINE = 8
const IS_CODE = 16
const IS_SUBSCRIPT = 32
const IS_SUPERSCRIPT = 64

interface RichTextRendererProps {
  content: LexicalRoot | unknown
  className?: string
}

/**
 * Renders Lexical JSON content from Payload CMS
 * Supports headings, paragraphs, lists, links, and text formatting
 */
export function RichTextRenderer({ content, className }: RichTextRendererProps) {
  if (!content || typeof content !== 'object') {
    return null
  }

  const lexicalContent = content as LexicalRoot
  const root = lexicalContent?.root

  if (!root?.children) {
    return null
  }

  return (
    <div className={cn('max-w-none', className)}>
      {root.children.map((node, index) => (
        <RenderNode key={index} node={node} />
      ))}
    </div>
  )
}

function RenderNode({ node }: { node: LexicalNode }): React.ReactNode {
  if (!node) return null
  switch (node.type) {
    case 'paragraph':
      return <RenderParagraph node={node} />

    case 'heading':
      return <RenderHeading node={node} />

    case 'list':
      return <RenderList node={node} />

    case 'listitem':
      return <RenderListItem node={node} />

    case 'link':
    case 'autolink':
      return <RenderLink node={node} />

    case 'text':
      return <RenderText node={node} />

    case 'linebreak':
      return <br />

    case 'quote':
      return <RenderBlockquote node={node} />

    case 'upload':
      return <RenderUpload node={node} />

    case 'horizontalrule':
      return <hr className="my-6 border-slate-200" />

    default:
      // For unknown nodes with children, render children only
      if (node.children) {
        return (
          <>
            {node.children.map((child, index) => (
              <RenderNode key={index} node={child} />
            ))}
          </>
        )
      }
      return null
  }
}

function RenderParagraph({ node }: { node: LexicalNode }) {
  if (!node.children || node.children.length === 0) {
    return <p className="mb-4 last:mb-0">&nbsp;</p>
  }

  return (
    <p className="mb-4 last:mb-0 leading-relaxed text-gray-600">
      {node.children.map((child, index) => (
        <RenderNode key={index} node={child} />
      ))}
    </p>
  )
}

export function getNodeText(node: LexicalNode): string {
  if (node.text) return node.text
  return node.children?.map(getNodeText).join('') ?? ''
}

export function slugifyText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u0E00-\u0E7F\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function RenderHeading({ node }: { node: LexicalNode }) {
  const HeadingTag = (node.tag || 'h2') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  const text = getNodeText(node)
  const id = slugifyText(text)

  const headingClasses: Record<string, string> = {
    h1: 'text-3xl lg:text-4xl font-bold text-navy-dark mb-6 font-display',
    h2: 'text-2xl lg:text-3xl font-bold text-navy-dark mb-4 mt-8 first:mt-0 font-display',
    h3: 'text-xl lg:text-2xl font-bold text-navy-dark mb-3 mt-6 first:mt-0',
    h4: 'text-lg font-bold text-navy-dark mb-2 mt-4 first:mt-0',
    h5: 'text-base font-bold text-navy-dark mb-2 mt-4 first:mt-0',
    h6: 'text-sm font-bold text-navy-dark mb-2 mt-4 first:mt-0 uppercase tracking-wide',
  }

  return (
    <HeadingTag id={id} className={headingClasses[HeadingTag] || headingClasses.h2}>
      {node.children?.map((child, index) => (
        <RenderNode key={index} node={child} />
      ))}
    </HeadingTag>
  )
}

function RenderList({ node, nested = false }: { node: LexicalNode; nested?: boolean }) {
  const isOrdered = node.listType === 'number'
  const ListTag = isOrdered ? 'ol' : 'ul'
  const children = node.children || []

  // Payload Lexical places nested lists as direct siblings of listitem nodes
  // (e.g. listitem → list → listitem → list...). Group each listitem with its
  // immediately following sibling list so they render inside the same <li>,
  // producing correct HTML and eliminating double-bullet markers.
  type Group = { listitem: LexicalNode; nestedList?: LexicalNode }
  const groups: Group[] = []
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (child.type === 'listitem') {
      const next = children[i + 1]
      if (next?.type === 'list') {
        groups.push({ listitem: child, nestedList: next })
        i++ // consume the sibling nested list
      } else {
        groups.push({ listitem: child })
      }
    }
    // standalone 'list' with no preceding listitem — shouldn't occur, skip
  }

  return (
    <ListTag
      className={cn(
        nested ? 'mt-1 mb-0' : 'mb-4',
        'pl-6',
        nested ? 'space-y-1' : 'space-y-2',
        isOrdered ? 'list-decimal' : 'list-disc',
        '[&>li]:marker:text-primary'
      )}
    >
      {groups.map(({ listitem, nestedList }, index) => {
        const children = listitem.children || []
        const isWrapperItem = children.length > 0 && children.every(c => c.type === 'list')
        return (
        <li key={index} className={cn("text-gray-600 leading-relaxed", isWrapperItem && "list-none")}>
          {listitem.children?.map((child, i) => {
            if (child.type === 'list') {
              return <RenderList key={i} node={child} nested={true} />
            }
            return <RenderNode key={i} node={child} />
          })}
          {nestedList && <RenderList node={nestedList} nested={true} />}
        </li>
        )
      })}
    </ListTag>
  )
}

function RenderListItem({ node }: { node: LexicalNode }) {
  // Fallback: called only when a listitem appears outside RenderList context
  return (
    <li className="text-gray-600 leading-relaxed">
      {node.children?.map((child, index) => {
        if (child.type === 'list') {
          return <RenderList key={index} node={child} nested={true} />
        }
        return <RenderNode key={index} node={child} />
      })}
    </li>
  )
}

function RenderLink({ node }: { node: LexicalNode }) {
  // Get URL from node or fields
  const url = node.url || node.fields?.url || '#'
  const isExternal = url.startsWith('http') || node.fields?.newTab || node.newTab

  const linkProps = {
    className: 'text-primary hover:text-primary/80 underline underline-offset-2 transition-colors',
    ...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
  }

  if (isExternal || url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('tel:')) {
    return (
      <a href={url} {...linkProps}>
        {node.children?.map((child, index) => (
          <RenderNode key={index} node={child} />
        ))}
      </a>
    )
  }

  return (
    <Link href={url} {...linkProps}>
      {node.children?.map((child, index) => (
        <RenderNode key={index} node={child} />
      ))}
    </Link>
  )
}

function RenderText({ node }: { node: LexicalNode }) {
  if (!node.text) return null

  let text: React.ReactNode = node.text

  // Apply formatting based on format flags
  const format = typeof node.format === 'number' ? node.format : 0

  if (format & IS_CODE) {
    text = (
      <code className="bg-slate-100 text-primary px-1.5 py-0.5 rounded text-sm font-mono">
        {text}
      </code>
    )
  }

  if (format & IS_BOLD) {
    text = <strong className="font-semibold text-navy-dark">{text}</strong>
  }

  if (format & IS_ITALIC) {
    text = <em>{text}</em>
  }

  if (format & IS_UNDERLINE) {
    text = <span className="underline">{text}</span>
  }

  if (format & IS_STRIKETHROUGH) {
    text = <span className="line-through">{text}</span>
  }

  if (format & IS_SUBSCRIPT) {
    text = <sub>{text}</sub>
  }

  if (format & IS_SUPERSCRIPT) {
    text = <sup>{text}</sup>
  }

  return <>{text}</>
}

function RenderUpload({ node }: { node: LexicalNode }) {
  const media = node.value as UploadValue | undefined
  if (!media?.url) return null

  const alt = media.alt || media.caption || media.filename || ''
  const width = media.width || 800
  const height = media.height || 600

  return (
    <figure className="my-8">
      <div className="relative w-full overflow-hidden rounded-xl bg-gray-100">
        <Image
          src={media.url}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>
      {media.caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-500 italic">
          {media.caption}
        </figcaption>
      )}
    </figure>
  )
}

function RenderBlockquote({ node }: { node: LexicalNode }) {
  return (
    <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 italic text-gray-600 bg-slate-50 rounded-r-lg">
      {node.children?.map((child, index) => (
        <RenderNode key={index} node={child} />
      ))}
    </blockquote>
  )
}

export default RichTextRenderer
