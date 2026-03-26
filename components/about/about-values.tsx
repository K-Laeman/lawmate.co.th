'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import AnimationWrapper, { StaggerContainer } from '@/components/ui/AnimationWrapper'
import { getIconWithFallback } from '@/lib/utils/icon-mapper'

interface Value {
  title: string
  description: string
  icon: string
}

interface SectionHeader {
  label?: string
  title: string
  description?: string
}

interface AboutValuesProps {
  values: Value[]
  sectionHeader?: SectionHeader
}

export function AboutValues({ values, sectionHeader }: AboutValuesProps) {
  return (
    <section className="py-20 bg-white relative">
      <div className="container mx-auto px-4">
        <AnimationWrapper animation="fade-in-up" className="text-center mb-16">
          {sectionHeader?.label && (
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-2">
              {sectionHeader.label}
            </span>
          )}
          <h2 className="text-3xl lg:text-4xl font-bold text-navy-dark mb-4 font-display">
            {sectionHeader?.title || 'คุณค่าที่เรายึดมั่น'}
          </h2>
          {sectionHeader?.description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {sectionHeader.description}
            </p>
          )}
        </AnimationWrapper>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" delayChildren={0.1}>
          {values.map((value, index) => {
            const Icon = getIconWithFallback(value.icon, 'Star')
            return (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -5 }}
              >
                <Card className="text-center h-full border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 rounded-2xl bg-primary/5 group-hover:bg-primary group-hover:rotate-6 transition-all duration-300 flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-navy-dark mb-3 group-hover:text-primary transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}

export default AboutValues
