'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Send, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import BackgroundPattern from '@/components/ui/BackgroundPattern'
import AnimationWrapper, { StaggerContainer } from '@/components/ui/AnimationWrapper'
import { GridPattern } from '@/components/ui/grid-pattern'
import { getIconWithFallback } from '@/lib/utils/icon-mapper'

interface Hero {
  badge?: string
  headline: string
  subheadline: string
}

interface ContactInfo {
  icon: string
  title: string
  content: string
}

interface InquiryType {
  value: string
  label: string
}

interface QuickLink {
  title: string
  description: string
  icon: string
  href: string
}

interface FormConfig {
  title: string
  labels: {
    name?: string
    email?: string
    phone?: string
    inquiryType?: string
    subject?: string
    message?: string
  }
  placeholders: {
    name?: string
    email?: string
    phone?: string
    inquiryType?: string
    subject?: string
    message?: string
  }
  submitButtonText?: string
  successTitle?: string
  successMessage?: string
  resetButtonText?: string
}

interface SectionHeaders {
  contactInfoTitle?: string
  contactInfoDescription?: string
  quickLinksTitle?: string
  mapComingSoonText?: string
}

interface ContactPageClientProps {
  hero: Hero
  contactInfo: ContactInfo[]
  inquiryTypes: InquiryType[]
  quickLinks: QuickLink[]
  formConfig: FormConfig
  sectionHeaders: SectionHeaders
}

export function ContactPageClient({
  hero,
  contactInfo,
  inquiryTypes,
  quickLinks,
  formConfig,
  sectionHeaders,
}: ContactPageClientProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
    subject: '',
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
        body: JSON.stringify(formData),
      })
      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error?.message || 'ส่งข้อความไม่สำเร็จ')
      }
      setIsSubmitted(true)
    } catch (err) {
      console.error('Contact form error:', err)
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-32 text-white">
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
          <AnimationWrapper animation="fade-in-up" className="max-w-3xl mx-auto">
            {hero.badge && (
              <span className="inline-block text-blue-400 font-semibold text-sm uppercase tracking-wider mb-4">
                {hero.badge}
              </span>
            )}
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-display">
              {hero.headline}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {hero.subheadline}
            </p>
          </AnimationWrapper>
        </div>
      </section>

      {/* Quick Links */}
      {quickLinks.length > 0 && (
        <section className="py-12 bg-white border-b relative z-20 -mt-8">
          <div className="container mx-auto px-4">
            <StaggerContainer
              className="grid sm:grid-cols-3 gap-6"
              delayChildren={0.2}
            >
              {quickLinks
                .filter((link) => link.href) // Filter out links with null/undefined href
                .map((link, index) => {
                  const Icon = getIconWithFallback(link.icon, 'HelpCircle')
                  return (
                    <motion.div
                      key={index}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      whileHover={{ y: -5 }}
                    >
                      <Link href={link.href}>
                        <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-slate-200 bg-white/80 backdrop-blur-sm">
                          <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                              <Icon className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-navy-dark text-lg mb-1">
                                {link.title}
                              </h3>
                              <p className="text-sm text-gray-600">{link.description}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  )
                })}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* Contact Form & Info */}
      <section className="py-20 lg:py-24 bg-slate-50 relative overflow-hidden">
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
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <AnimationWrapper animation="fade-in-up">
                <div>
                  <h2 className="text-3xl font-bold text-navy-dark mb-4 font-display">
                    {sectionHeaders.contactInfoTitle || 'ข้อมูลติดต่อ'}
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-8">
                    {sectionHeaders.contactInfoDescription ||
                      'ติดต่อเราได้หลายช่องทาง เราพร้อมตอบทุกคำถามและให้ความช่วยเหลือคุณอย่างเต็มที่'}
                  </p>
                </div>

                <div className="space-y-4">
                  {contactInfo.map((info, index) => {
                    const Icon = getIconWithFallback(info.icon, 'MapPin')
                    return (
                      <Card
                        key={index}
                        className="border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4 flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-navy-dark mb-1">{info.title}</h3>
                            <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                              {info.content}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </AnimationWrapper>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <AnimationWrapper animation="fade-in-up" delay={0.2}>
                <Card className="shadow-xl border-slate-200 overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-primary to-blue-400" />
                  <CardHeader className="bg-white border-b border-slate-100">
                    <CardTitle className="text-2xl text-navy-dark font-display">
                      {formConfig.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 md:p-8 bg-white">
                    {isSubmitted ? (
                      <div className="text-center py-12">
                        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
                          <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-navy-dark mb-2">
                          {formConfig.successTitle || 'ส่งข้อความสำเร็จ!'}
                        </h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                          {formConfig.successMessage ||
                            'ขอบคุณที่ติดต่อเรา เราได้รับข้อความของคุณแล้วและจะรีบติดต่อกลับภายใน 24 ชั่วโมง'}
                        </p>
                        <Button
                          onClick={() => setIsSubmitted(false)}
                          variant="outline"
                          className="rounded-xl"
                        >
                          {formConfig.resetButtonText || 'ส่งข้อความใหม่'}
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-700 font-medium">
                              {formConfig.labels.name || 'ชื่อ-นามสกุล'}{' '}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder={formConfig.placeholders.name || 'กรอกชื่อ-นามสกุล'}
                              required
                              className="bg-slate-50 border-slate-200 focus:bg-white transition-colors h-11"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700 font-medium">
                              {formConfig.labels.email || 'อีเมล'}{' '}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder={formConfig.placeholders.email || 'example@email.com'}
                              required
                              className="bg-slate-50 border-slate-200 focus:bg-white transition-colors h-11"
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-gray-700 font-medium">
                              {formConfig.labels.phone || 'เบอร์โทรศัพท์'}
                            </Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder={formConfig.placeholders.phone || '08X-XXX-XXXX'}
                              className="bg-slate-50 border-slate-200 focus:bg-white transition-colors h-11"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="inquiryType" className="text-gray-700 font-medium">
                              {formConfig.labels.inquiryType || 'ประเภทการติดต่อ'}{' '}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              value={formData.inquiryType}
                              onValueChange={value =>
                                setFormData({ ...formData, inquiryType: value })
                              }
                            >
                              <SelectTrigger className="bg-slate-50 border-slate-200 focus:bg-white transition-colors h-11">
                                <SelectValue
                                  placeholder={formConfig.placeholders.inquiryType || 'เลือกประเภท'}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {inquiryTypes.map(type => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="subject" className="text-gray-700 font-medium">
                            {formConfig.labels.subject || 'หัวข้อ'}{' '}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder={
                              formConfig.placeholders.subject || 'หัวข้อที่ต้องการติดต่อ'
                            }
                            required
                            className="bg-slate-50 border-slate-200 focus:bg-white transition-colors h-11"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message" className="text-gray-700 font-medium">
                            {formConfig.labels.message || 'ข้อความ'}{' '}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder={
                              formConfig.placeholders.message || 'รายละเอียดที่ต้องการสอบถาม...'
                            }
                            rows={6}
                            required
                            className="bg-slate-50 border-slate-200 focus:bg-white transition-colors resize-none"
                          />
                        </div>

                        <Button
                          type="submit"
                          size="lg"
                          className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <Send className="w-5 h-5 mr-2" />
                              {formConfig.submitButtonText || 'ส่งข้อความ'}
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </AnimationWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-96 bg-slate-200 relative">
        <div className="absolute inset-0 flex items-center justify-center bg-slate-200/50">
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mx-auto mb-4">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <p className="text-gray-500 font-medium">Coming Soon</p>
            <p className="text-sm text-gray-400">
              {sectionHeaders.mapComingSoonText || 'Google Maps Embed Integration'}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default ContactPageClient
