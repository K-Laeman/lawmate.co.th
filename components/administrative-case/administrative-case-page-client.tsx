'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Building2,
  CheckCircle,
  Phone,
  Mail,
  Send,
  User,
  Shield,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import BackgroundPattern from '@/components/ui/BackgroundPattern'
import AnimationWrapper, { StaggerContainer } from '@/components/ui/AnimationWrapper'
import { GridPattern } from '@/components/ui/grid-pattern'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { getIconWithFallback } from '@/lib/utils/icon-mapper'

interface CorporateService {
  id: string
  title: string
  description: string
  icon: string
}

interface TrustPillar {
  icon: string
  title: string
  description: string
}

interface ProcessStep {
  step: number
  icon: string
  title: string
  description: string
}

interface Stat {
  value: string
  label: string
}

interface LeadFormConfig {
  title: string
  subtitle?: string
  successMessage?: string
  fields: {
    companyNameLabel?: string
    contactPersonLabel?: string
    emailLabel?: string
    phoneLabel?: string
    messageLabel?: string
    submitButtonText?: string
  }
}

interface SectionHeaders {
  services: {
    label?: string
    title: string
    description?: string
  }
  whyUs: {
    title: string
    description?: string
  }
  process: {
    title: string
    description?: string
  }
  contact: {
    title: string
    description?: string
  }
}

interface HeroData {
  badge?: string
  headline: string
  highlightedText?: string
  subheadline: string
  checkpoints?: Array<{ text: string }>
}

interface CTAData {
  headline: string
  description?: string
  primaryButton?: {
    text?: string
    url?: string
  }
  phoneNumber?: string
}

interface AdministrativeCasePageClientProps {
  hero: HeroData
  sectionHeaders: SectionHeaders
  services: CorporateService[]
  trustPillars: TrustPillar[]
  processSteps: ProcessStep[]
  stats: Stat[]
  leadForm: LeadFormConfig
  cta: CTAData
}

export function AdministrativeCasePageClient({
  hero,
  sectionHeaders,
  services,
  trustPillars,
  processSteps,
  stats,
  leadForm,
  cta,
}: AdministrativeCasePageClientProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL ?? ''
      const response = await fetch(`${dashboardUrl}/api/v1/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.contactName || formData.companyName,
          email: formData.email,
          phone: formData.phone,
          inquiryType: 'administrative-case',
          subject: `คดีปกครอง: ${formData.companyName || formData.contactName}`,
          message: formData.message,
        }),
      })
      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error?.message || 'ส่งข้อความไม่สำเร็จ')
      }
      setIsSubmitted(true)
    } catch (err) {
      console.error('Lead form error:', err)
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <main className="overflow-hidden">
      {/* Hero Section with Lead Form */}
      <section className="relative overflow-hidden py-20 lg:py-28 text-white">
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
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start lg:items-center">
            {/* Left: Hero Content */}
            <div className="text-center lg:text-left">
              <AnimationWrapper animation="fade-in-up">
                {hero.badge && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                    <Building2 className="w-4 h-4 text-white" />
                    <span className="text-sm text-white/90">{hero.badge}</span>
                  </div>
                )}
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-display leading-tight">
                  {hero.headline}
                  {hero.highlightedText && (
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200 mt-2">
                      {hero.highlightedText}
                    </span>
                  )}
                </h1>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {hero.subheadline}
                </p>
                {hero.checkpoints && hero.checkpoints.length > 0 && (
                  <div className="hidden lg:flex flex-col gap-4">
                    {hero.checkpoints.map((checkpoint, index) => (
                      <div key={index} className="flex items-center gap-3 text-white/90">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                        <span className="font-medium">{checkpoint.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </AnimationWrapper>
            </div>

            {/* Right: Lead Form */}
            <div className="lg:pl-8 w-full">
              <AnimationWrapper animation="fade-in-up" delay={0.2}>
                <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                  <div className="h-2 bg-gradient-to-r from-blue-400 to-primary" />
                  <CardContent className="p-6 lg:p-8">
                    {isSubmitted ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-300">
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-navy-dark mb-2">ส่งข้อมูลสำเร็จ</h3>
                        <p className="text-gray-600 mb-6">
                          {leadForm.successMessage || 'ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง'}
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsSubmitted(false)
                            setFormData({ companyName: '', contactName: '', email: '', phone: '', message: '' })
                          }}
                          className="rounded-xl"
                        >
                          ส่งอีกครั้ง
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="text-center mb-6">
                          <h2 className="text-2xl font-bold text-navy-dark mb-2 font-display">
                            {leadForm.title}
                          </h2>
                          {leadForm.subtitle && (
                            <p className="text-gray-600 text-sm">{leadForm.subtitle}</p>
                          )}
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="companyName" className="text-gray-700 font-medium">
                              {leadForm.fields.companyNameLabel || 'ชื่อบริษัท/หน่วยงาน'}
                            </Label>
                            <div className="relative">
                              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                id="companyName"
                                name="companyName"
                                placeholder="หน่วยงาน ABC"
                                value={formData.companyName}
                                onChange={handleChange}
                                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contactName" className="text-gray-700 font-medium">
                              {leadForm.fields.contactPersonLabel || 'ชื่อผู้ติดต่อ'}
                            </Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                id="contactName"
                                name="contactName"
                                placeholder="คุณสมชาย"
                                value={formData.contactName}
                                onChange={handleChange}
                                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="email" className="text-gray-700 font-medium">
                                {leadForm.fields.emailLabel || 'อีเมล'}
                              </Label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                  id="email"
                                  name="email"
                                  type="email"
                                  placeholder="email@example.com"
                                  value={formData.email}
                                  onChange={handleChange}
                                  className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                  required
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone" className="text-gray-700 font-medium">
                                {leadForm.fields.phoneLabel || 'เบอร์โทรศัพท์'}
                              </Label>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                  id="phone"
                                  name="phone"
                                  type="tel"
                                  placeholder="08X-XXX-XXXX"
                                  value={formData.phone}
                                  onChange={handleChange}
                                  className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="message" className="text-gray-700 font-medium">
                              {leadForm.fields.messageLabel || 'รายละเอียด'}
                            </Label>
                            <Textarea
                              id="message"
                              name="message"
                              placeholder="สิ่งที่ต้องการปรึกษา..."
                              value={formData.message}
                              onChange={handleChange}
                              rows={3}
                              className="bg-slate-50 border-slate-200 focus:bg-white transition-colors resize-none"
                            />
                          </div>
                          <Button
                            type="submit"
                            size="lg"
                            className="w-full h-11 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                {leadForm.fields.submitButtonText || 'ปรึกษาคดีปกครองฟรี'}
                              </>
                            )}
                          </Button>
                          <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
                            <Shield className="w-3 h-3" /> ข้อมูลของคุณจะถูกเก็บเป็นความลับ
                          </p>
                        </form>
                      </>
                    )}
                  </CardContent>
                </Card>
              </AnimationWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-slate-50 relative overflow-hidden">
        <GridPattern
          width={30}
          height={30}
          x={-1}
          y={-1}
          className={cn(
            'absolute inset-0 h-full w-full stroke-slate-200/50 fill-white/50',
            '[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]'
          )}
        />
        <div className="container mx-auto px-4 relative z-10">
          <AnimationWrapper animation="fade-in-up" className="text-center mb-16">
            {sectionHeaders.services.label && (
              <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-2">
                {sectionHeaders.services.label}
              </span>
            )}
            <h2 className="text-3xl lg:text-4xl font-bold text-navy-dark mb-4 font-display">
              {sectionHeaders.services.title}
            </h2>
            {sectionHeaders.services.description && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {sectionHeaders.services.description}
              </p>
            )}
          </AnimationWrapper>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" delayChildren={0.1}>
            {services.map((service, index) => {
              const Icon = getIconWithFallback(service.icon, 'FileText')
              return (
                <motion.div
                  key={service.id || index}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-slate-200 group">
                    <CardContent className="p-8">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                        <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="text-xl font-bold text-navy-dark mb-3 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">{service.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Trust Pillars Section */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4">
          <AnimationWrapper animation="fade-in-up" className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy-dark mb-4 font-display">
              {sectionHeaders.whyUs.title}
            </h2>
            {sectionHeaders.whyUs.description && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {sectionHeaders.whyUs.description}
              </p>
            )}
          </AnimationWrapper>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8" delayChildren={0.2}>
            {trustPillars.map((pillar, index) => {
              const Icon = getIconWithFallback(pillar.icon, 'CheckCircle')
              return (
                <motion.div
                  key={index}
                  className="text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors duration-300"
                  variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-navy-dark mb-3">{pillar.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{pillar.description}</p>
                </motion.div>
              )
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <BackgroundPattern variant="light" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimationWrapper animation="fade-in-up" className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy-dark mb-4 font-display">
              {sectionHeaders.process.title}
            </h2>
            {sectionHeaders.process.description && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {sectionHeaders.process.description}
              </p>
            )}
          </AnimationWrapper>

          <div className="relative max-w-5xl mx-auto">
            <div className="hidden lg:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-slate-200 via-blue-100 to-slate-200 z-0" />
            <StaggerContainer className="grid md:grid-cols-3 gap-12 relative z-10">
              {processSteps.map((step, index) => {
                const Icon = getIconWithFallback(step.icon, 'CircleDot')
                return (
                  <motion.div
                    key={index}
                    className="text-center group relative"
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  >
                    <div className="relative inline-block mb-8">
                      <div className="w-24 h-24 rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center justify-center relative z-10 group-hover:scale-105 group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-300 border border-slate-100/50">
                        <div className="w-20 h-20 rounded-full bg-slate-50/50 flex items-center justify-center group-hover:bg-blue-50/50 transition-colors duration-300">
                          <Icon
                            className={cn(
                              'w-8 h-8 text-primary/80 group-hover:text-primary transition-colors duration-300',
                              index === 1 ? 'w-9 h-9' : ''
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-navy-dark mb-3 group-hover:text-primary transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">{step.description}</p>
                  </motion.div>
                )
              })}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-navy-dark relative overflow-hidden">
        <BackgroundPattern variant="navy" />
        <div className="container mx-auto px-4 relative z-10">
          <StaggerContainer
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-x divide-white/10"
            delayChildren={0.1}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              >
                <p className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white mb-2 font-display">
                  {stat.value}
                </p>
                <p className="text-blue-200/80 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white relative">
        <div className="absolute inset-0 bg-primary/5 clip-path-slant" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <AnimationWrapper animation="scale-up" className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy-dark mb-6 font-display">
              {cta.headline}
            </h2>
            {cta.description && (
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">{cta.description}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-primary hover:bg-primary-dark text-white px-8 h-12 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all text-lg"
              >
                <Link href={cta.primaryButton?.url || '/contact'}>
                  <Mail className="w-5 h-5 mr-2" />
                  {cta.primaryButton?.text || 'ติดต่อเราวันนี้'}
                </Link>
              </Button>
              {cta.phoneNumber && (
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-primary text-primary hover:bg-primary/5 px-8 h-12 rounded-xl text-lg"
                >
                  <a href={`tel:${cta.phoneNumber.replace(/-/g, '')}`}>
                    <Phone className="w-5 h-5 mr-2" />
                    {cta.phoneNumber}
                  </a>
                </Button>
              )}
            </div>
          </AnimationWrapper>
        </div>
      </section>
    </main>
  )
}

export default AdministrativeCasePageClient
