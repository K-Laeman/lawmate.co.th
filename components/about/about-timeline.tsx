'use client'

import { motion } from 'framer-motion'
import AnimationWrapper, { StaggerContainer } from '@/components/ui/AnimationWrapper'
import BackgroundPattern from '@/components/ui/BackgroundPattern'

interface TimelineEvent {
  year: string
  title: string
  description: string
  icon?: string
}

interface SectionHeader {
  title: string
  description?: string
}

interface AboutTimelineProps {
  events: TimelineEvent[]
  sectionHeader?: SectionHeader
}

export function AboutTimeline({ events, sectionHeader }: AboutTimelineProps) {
  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      <BackgroundPattern variant="light" />
      <div className="container mx-auto px-4 relative z-10">
        <AnimationWrapper animation="fade-in-up" className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-navy-dark mb-4 font-display">
            {sectionHeader?.title || 'เส้นทางของเรา'}
          </h2>
          {sectionHeader?.description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {sectionHeader.description}
            </p>
          )}
        </AnimationWrapper>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/10 via-primary/40 to-primary/10" />

            <StaggerContainer delayChildren={0.2}>
              {events.map((event, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className="relative pl-24 pb-12 last:pb-0 group"
                >
                  {/* Year bubble */}
                  <div className="absolute left-0 w-16 h-16 rounded-2xl bg-white border-2 border-primary/20 group-hover:border-primary text-primary flex items-center justify-center font-bold shadow-sm z-10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                    {event.year}
                  </div>
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 group-hover:shadow-lg group-hover:border-primary/20 transition-all duration-300 relative">
                    {/* Triangle arrow */}
                    <div className="absolute left-[-8px] top-6 w-4 h-4 bg-white border-l border-b border-slate-100 transform rotate-45 group-hover:border-primary/20 transition-colors duration-300" />

                    <h3 className="text-xl font-bold text-navy-dark mb-2 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-gray-600">{event.description}</p>
                  </div>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutTimeline
