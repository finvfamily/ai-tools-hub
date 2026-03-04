'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h1 className="text-xl font-bold text-white mt-6 mb-3">{children}</h1>,
        h2: ({ children }) => <h2 className="text-lg font-bold text-white mt-5 mb-2">{children}</h2>,
        h3: ({ children }) => <h3 className="text-base font-semibold text-white mt-4 mb-2">{children}</h3>,
        p:  ({ children }) => <p className="text-white/70 leading-relaxed mb-3">{children}</p>,
        a:  ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer"
            className="text-violet-400 hover:text-violet-300 underline underline-offset-2">
            {children}
          </a>
        ),
        code: ({ children, className }) => {
          const isBlock = className?.includes('language-')
          return isBlock ? (
            <code className="block bg-white/5 border border-white/10 rounded-xl p-4
              text-sm text-white/80 font-mono overflow-x-auto my-3">
              {children}
            </code>
          ) : (
            <code className="bg-white/8 text-violet-300 px-1.5 py-0.5 rounded text-sm font-mono">
              {children}
            </code>
          )
        },
        pre: ({ children }) => <>{children}</>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-violet-500/50 pl-4 text-white/50 italic my-3">
            {children}
          </blockquote>
        ),
        ul: ({ children }) => <ul className="list-disc list-inside text-white/70 space-y-1 mb-3 ml-2">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside text-white/70 space-y-1 mb-3 ml-2">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        img: ({ src, alt }) => (
          <img src={src} alt={alt}
            className="rounded-xl max-w-full my-3 border border-white/10" />
        ),
        hr: () => <hr className="border-white/10 my-6" />,
        strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
