'use client'

import { motion } from 'framer-motion'
import { StaggerContainer } from '@/components/ui/AnimationWrapper'
import { getIconWithFallback } from '@/lib/utils/icon-mapper'

interface Stat {
  value: string
  label: string
  icon?: string
}

interface AboutStatsProps {
  stats: Stat[]
}

export function AboutStats({ stats }: AboutStatsProps) {
  return (
    <section className="py-16 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4">
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-8" delayChildren={0.2}>
          {stats.map((stat, index) => {
            const Icon = stat.icon ? getIconWithFallback(stat.icon, 'TrendingUp') : null
            return (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors duration-300"
              >
                {Icon && (
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                )}
                <p className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 mb-2 font-display">
                  {stat.value}
                </p>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}

export default AboutStats
