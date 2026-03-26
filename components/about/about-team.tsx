'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Users, Linkedin, Twitter, Mail } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import AnimationWrapper, { StaggerContainer } from '@/components/ui/AnimationWrapper'

interface TeamMember {
  name: string
  role: string
  bio?: string
  photo?: {
    url: string
    alt?: string
  } | null
  socialLinks?: {
    linkedin?: string
    twitter?: string
    email?: string
  }
}

interface SectionHeader {
  title: string
  description?: string
}

interface AboutTeamProps {
  members: TeamMember[]
  sectionHeader?: SectionHeader
}

export function AboutTeam({ members, sectionHeader }: AboutTeamProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <AnimationWrapper animation="fade-in-up" className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-navy-dark mb-4 font-display">
            {sectionHeader?.title || 'ทีมผู้บริหาร'}
          </h2>
          {sectionHeader?.description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {sectionHeader.description}
            </p>
          )}
        </AnimationWrapper>

        <StaggerContainer
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto"
          delayChildren={0.2}
        >
          {members.map((member, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -5 }}
            >
              <Card className="overflow-hidden border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="aspect-square bg-slate-100 relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                  {member.photo?.url ? (
                    <Image
                      src={member.photo.url}
                      alt={member.photo.alt || member.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200">
                      <Users className="w-20 h-20 text-slate-400" />
                    </div>
                  )}

                  {/* Social links on hover */}
                  {member.socialLinks && (
                    <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      {member.socialLinks.linkedin && (
                        <a
                          href={member.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <Linkedin className="w-5 h-5 text-primary" />
                        </a>
                      )}
                      {member.socialLinks.twitter && (
                        <a
                          href={member.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <Twitter className="w-5 h-5 text-primary" />
                        </a>
                      )}
                      {member.socialLinks.email && (
                        <a
                          href={`mailto:${member.socialLinks.email}`}
                          className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <Mail className="w-5 h-5 text-primary" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <CardContent className="p-6 text-center relative z-20 bg-white">
                  <h3 className="text-xl font-bold text-navy-dark mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  {member.bio && <p className="text-sm text-gray-500">{member.bio}</p>}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

export default AboutTeam
