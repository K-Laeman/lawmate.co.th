import { cn } from '@/lib/utils'
import BackgroundPattern from '@/components/ui/BackgroundPattern'
import AnimationWrapper from '@/components/ui/AnimationWrapper'
import { GridPattern } from '@/components/ui/grid-pattern'
import { RichTextRenderer } from '@/components/ui/rich-text-renderer'
import { getIconWithFallback } from '@/lib/utils/icon-mapper'

interface LegalSection {
  heading: string
  content: unknown // Rich text content from Lexical editor
}

interface LegalPageContentProps {
  title: string
  subtitle?: string
  lastUpdated: string
  icon?: string
  alertBox?: {
    enabled?: boolean
    content?: string
  }
  sections: LegalSection[]
  fallbackContent?: React.ReactNode
  alertVariant?: 'blue' | 'green'
}

export function LegalPageContent({
  title,
  subtitle,
  lastUpdated,
  icon = 'FileText',
  alertBox,
  sections,
  fallbackContent,
  alertVariant = 'blue',
}: LegalPageContentProps) {
  const Icon = getIconWithFallback(icon, 'FileText')
  const hasCMSContent = sections.length > 0

  const alertColors = {
    blue: {
      bg: 'bg-blue-50/50',
      border: 'border-blue-100',
      accent: 'bg-blue-500',
      text: 'text-blue-800',
    },
    green: {
      bg: 'bg-green-50/50',
      border: 'border-green-100',
      accent: 'bg-green-500',
      text: 'text-green-800',
    },
  }
  const colors = alertColors[alertVariant]

  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16 lg:pt-44 lg:pb-24 text-white">
          <BackgroundPattern variant="navy" />
          <GridPattern
            width={40}
            height={40}
            x={-1}
            y={-1}
            className={cn(
              'absolute inset-0 h-full w-full stroke-white/5 fill-white/5',
              '[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]'
            )}
          />
          <div className="container mx-auto px-4 text-center relative z-10">
            <AnimationWrapper animation="fade-in-up" className="max-w-4xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-6">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-display">
                {title}
              </h1>
              {subtitle && (
                <p className="text-blue-200 text-lg mb-4">{subtitle}</p>
              )}
              <p className="text-blue-200 text-lg font-medium inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                อัปเดตล่าสุด: {lastUpdated}
              </p>
            </AnimationWrapper>
          </div>
        </section>

        {/* Content */}
        <section className="py-20 bg-slate-50 relative min-h-screen">
          <GridPattern
            width={30}
            height={30}
            x={-1}
            y={-1}
            className={cn(
              'absolute inset-0 h-full w-full stroke-slate-200/50 fill-white/50',
              '[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]'
            )}
          />
          <div className="container mx-auto px-4 relative z-10 -mt-20">
            <AnimationWrapper animation="fade-in-up" delay={0.2} className="max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-8 lg:p-12">
                <div className="prose prose-lg max-w-none text-gray-600 prose-headings:font-display prose-headings:text-navy-dark prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-navy-dark prose-a:text-primary hover:prose-a:text-primary-dark">
                  {/* Alert Box */}
                  {alertBox?.enabled && alertBox?.content && (
                    <div
                      className={cn(
                        colors.bg,
                        colors.border,
                        'border rounded-2xl p-6 mb-8 flex gap-4'
                      )}
                    >
                      <div className={cn('min-w-[4px] rounded-full', colors.accent)} />
                      <p className={cn(colors.text, 'm-0 font-medium')}>{alertBox.content}</p>
                    </div>
                  )}

                  {/* CMS Content or Fallback */}
                  {hasCMSContent ? (
                    sections.map((section, index) => (
                      <div key={section.heading || index}>
                        <h2 className="text-2xl font-bold text-navy-dark mt-12 first:mt-0 mb-4 border-b border-slate-100 pb-2">
                          {section.heading}
                        </h2>
                        <RichTextRenderer content={section.content} />
                      </div>
                    ))
                  ) : (
                    fallbackContent
                  )}
                </div>
              </div>
            </AnimationWrapper>
          </div>
        </section>
    </main>
  )
}

export default LegalPageContent
