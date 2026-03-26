import Link from 'next/link'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Scale, CheckCircle, ArrowRight } from 'lucide-react'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { Button } from '@/components/ui/button'
import BackgroundPattern from '@/components/ui/BackgroundPattern'
import AnimationWrapper from '@/components/ui/AnimationWrapper'
import { GridPattern } from '@/components/ui/grid-pattern'
import { RichTextRenderer } from '@/components/ui/rich-text-renderer'
import { cn } from '@/lib/utils'

// CMS imports
import {
  getAboutPage,
  getCompanyValues,
  getCompanyTimeline,
  getTeamMembers,
} from '@/lib/cms'

// Client components for animated sections
import { AboutStats } from '@/components/about/about-stats'
import { AboutValues } from '@/components/about/about-values'
import { AboutTimeline } from '@/components/about/about-timeline'
import { AboutTeam } from '@/components/about/about-team'

// ISR revalidation interval (60 seconds)
export const revalidate = 3600

// Fallback data when CMS is unavailable
const FALLBACK_STATS = [
  { value: '500+', label: 'ทนายความที่ผ่านการรับรอง', icon: 'ShieldCheck' },
  { value: '10,000+', label: 'ลูกความที่ไว้วางใจ', icon: 'Users' },
  { value: '25,000+', label: 'การปรึกษาที่สำเร็จ', icon: 'MessageCircle' },
  { value: '4.8', label: 'คะแนนความพึงพอใจ', icon: 'Star' },
]

const FALLBACK_VALUES = [
  {
    icon: 'Shield',
    title: 'ความน่าเชื่อถือ',
    description: 'เราคัดเลือกทนายความที่มีใบอนุญาตและผ่านการตรวจสอบอย่างเข้มงวด',
  },
  {
    icon: 'Users',
    title: 'ความเข้าถึงได้',
    description: 'ทุกคนสามารถเข้าถึงบริการทางกฎหมายได้อย่างสะดวกและราคาเหมาะสม',
  },
  {
    icon: 'Heart',
    title: 'ความใส่ใจ',
    description: 'เราใส่ใจทุกปัญหาของลูกความเหมือนเป็นเรื่องของเราเอง',
  },
  {
    icon: 'Target',
    title: 'ความเชี่ยวชาญ',
    description: 'จับคู่ลูกความกับทนายที่เชี่ยวชาญตรงกับประเภทคดี',
  },
]

const FALLBACK_TEAM = [
  {
    name: 'คุณสมชาย ยุติธรรม',
    role: 'ผู้ก่อตั้งและ CEO',
    bio: 'อดีตทนายความกว่า 20 ปี ผู้เชี่ยวชาญด้านกฎหมายธุรกิจ',
  },
  {
    name: 'คุณสุดา เทคโนโลยี',
    role: 'CTO',
    bio: 'ผู้เชี่ยวชาญด้าน LegalTech และ AI',
  },
  {
    name: 'คุณวิชัย ดูแลลูกค้า',
    role: 'COO',
    bio: 'ประสบการณ์ด้านการบริการลูกค้ากว่า 15 ปี',
  },
]

const FALLBACK_TIMELINE = [
  { year: '2021', title: 'ก่อตั้งบริษัท', description: 'เริ่มต้นด้วยวิสัยทัศน์ให้ทุกคนเข้าถึงความยุติธรรม' },
  { year: '2022', title: 'เปิดตัวแพลตฟอร์ม', description: 'เปิดให้บริการปรึกษาทนายออนไลน์ครั้งแรก' },
  { year: '2023', title: '5,000 ลูกความ', description: 'ให้บริการลูกความครบ 5,000 รายแรก' },
  { year: '2024', title: 'ขยายทั่วประเทศ', description: 'ครอบคลุมทนายความทั่วประเทศ 77 จังหวัด' },
  { year: '2025', title: '10,000+ ลูกความ', description: 'ก้าวสู่การเป็นแพลตฟอร์มกฎหมายอันดับ 1' },
]

const FALLBACK_MISSION_POINTS = [
  'ทนายความที่ผ่านการตรวจสอบทุกคน',
  'ราคาโปร่งใส ไม่มีค่าใช้จ่ายแอบแฝง',
  'ปรึกษาผ่านวิดีโอคอลได้ทุกที่ทุกเวลา',
  'ข้อมูลปลอดภัยและเป็นความลับ',
]

export async function generateMetadata(): Promise<Metadata> {
  const aboutPage = await getAboutPage('th')

  return generatePageMetadata({
    title: aboutPage?.seo?.metaTitle || 'เกี่ยวกับเรา | เพื่อนทนาย',
    description:
      aboutPage?.seo?.metaDescription ||
      'เพื่อนทนายคือแพลตฟอร์มออนไลน์ที่เชื่อมต่อประชาชนกับทนายความมืออาชีพ เราเชื่อว่าทุกคนควรเข้าถึงความยุติธรรมได้อย่างเท่าเทียม',
    path: '/about',
    ogImage: aboutPage?.seo?.ogImage?.url,
  })
}

export default async function AboutPage() {
  // Fetch all CMS data in parallel
  const [aboutPage, cmsValues, cmsTimeline, cmsTeam] = await Promise.all([
    getAboutPage('th'),
    getCompanyValues('th'),
    getCompanyTimeline('th'),
    getTeamMembers('th', { limit: 12 }),
  ])

  // Use CMS data with fallbacks
  const stats = aboutPage?.stats?.length ? aboutPage.stats : FALLBACK_STATS
  const values = (cmsValues?.length ?? 0) > 0 ? cmsValues : FALLBACK_VALUES
  const timeline = (cmsTimeline?.length ?? 0) > 0 ? cmsTimeline : FALLBACK_TIMELINE
  const team = (cmsTeam?.length ?? 0) > 0
    ? cmsTeam.map(m => ({
        name: m.name || '',
        role: m.role || '',
        bio: m.bio || '',
        photo: m.photo,
        socialLinks: m.socialLinks,
      }))
    : FALLBACK_TEAM

  // Get section headers from CMS or use defaults
  const valuesHeader = aboutPage?.sectionHeaders?.values ?? {
    label: 'Core Values',
    title: 'คุณค่าที่เรายึดมั่น',
    description: 'หลักการที่เราใช้ในการให้บริการลูกความทุกคน เพื่อสร้างมาตรฐานใหม่ให้กับวงการกฎหมาย',
  }
  const timelineHeader = aboutPage?.sectionHeaders?.timeline ?? {
    title: 'เส้นทางของเรา',
    description: 'จากจุดเริ่มต้นสู่การเป็นแพลตฟอร์มกฎหมายชั้นนำของประเทศไทย',
  }
  const teamHeader = aboutPage?.sectionHeaders?.team ?? {
    title: 'ทีมผู้บริหาร',
    description: 'ทีมงานมืออาชีพที่มุ่งมั่นสร้างบริการที่ดีที่สุดให้กับคุณ',
  }

  // Section visibility - default to true if not set
  const visibility = aboutPage?.sectionVisibility ?? {}
  const show = {
    stats: visibility.showStats !== false,
    mission: visibility.showMission !== false,
    values: visibility.showValues !== false,
    timeline: visibility.showTimeline !== false,
    team: visibility.showTeam !== false,
    cta: visibility.showCta !== false,
  }

  // Hero content
  const hero = aboutPage?.hero ?? {
    badge: 'เกี่ยวกับเรา',
    headline: 'เกี่ยวกับเพื่อนทนาย',
    subheadline:
      'เราเชื่อว่าทุกคนควรเข้าถึงความยุติธรรมได้อย่างเท่าเทียม เพื่อนทนายคือสะพานเชื่อมระหว่างประชาชนกับทนายความมืออาชีพ',
  }

  // Mission content
  const mission = aboutPage?.mission ?? {
    headline: 'พันธกิจของเรา',
    content: null,
    bulletPoints: FALLBACK_MISSION_POINTS.map(point => ({ point })),
  }
  const missionPoints =
    mission.bulletPoints?.map(bp => bp?.point).filter(Boolean) as string[] ?? FALLBACK_MISSION_POINTS

  // CTA content
  const cta = aboutPage?.cta ?? {
    headline: 'พร้อมเริ่มต้นใช้งานแล้วหรือยัง?',
    description: 'ค้นหาทนายความที่เหมาะสมกับคุณได้แล้ววันนี้ หรือสมัครสมาชิกเพื่อรับสิทธิประโยชน์มากมาย',
    primaryCta: { text: 'ค้นหาทนาย', url: '/lawyers' },
    secondaryCta: { text: 'สมัครสมาชิก', url: '/register' },
  }

  return (
    <main className="overflow-hidden">
        {/* Hero Section */}
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
          <div className="container mx-auto px-4 relative z-10">
            <AnimationWrapper animation="fade-in-up" className="max-w-3xl mx-auto text-center">
              {hero.badge && (
                <span className="inline-block text-blue-400 font-semibold text-sm uppercase tracking-wider mb-4">
                  {hero.badge}
                </span>
              )}
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-display">
                {hero.headline}
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">{hero.subheadline}</p>
              <div className="flex items-center justify-center gap-4">
                <Button size="lg" variant="secondary" asChild className="rounded-xl shadow-lg shadow-blue-900/20">
                  <a href="/lawyers">
                    ค้นหาทนาย
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white rounded-xl"
                  asChild
                >
                  <Link href="/contact">ติดต่อเรา</Link>
                </Button>
              </div>
            </AnimationWrapper>
          </div>
        </section>

        {/* Stats */}
        {show.stats && <AboutStats stats={stats} />}

        {/* Mission */}
        {show.mission && <section className="py-20 bg-slate-50 relative overflow-hidden">
          <GridPattern
            width={30}
            height={30}
            x={-1}
            y={-1}
            className={cn(
              'absolute inset-0 h-full w-full stroke-slate-200/50 fill-white/50',
              '[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]'
            )}
          />
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <AnimationWrapper animation="fade-in-up">
                <h2 className="text-3xl lg:text-4xl font-bold text-navy-dark mb-6 font-display">
                  {mission.headline}
                </h2>
                <div className="text-gray-600 mb-8">
                  {mission.content ? (
                    <RichTextRenderer content={mission.content} />
                  ) : (
                    <>
                      <p className="mb-4">
                        เพื่อนทนายก่อตั้งขึ้นด้วยความเชื่อที่ว่า
                        ทุกคนควรสามารถเข้าถึงบริการทางกฎหมายที่มีคุณภาพได้
                        ไม่ว่าจะอยู่ที่ไหนหรือมีงบประมาณเท่าไหร่
                      </p>
                      <p>
                        เราเชื่อมต่อประชาชนกับทนายความที่ผ่านการรับรอง ผ่านแพลตฟอร์มที่ใช้งานง่าย
                        โปร่งใส และปลอดภัย ทำให้การปรึกษาทนายเป็นเรื่องง่ายเหมือนนัดพบแพทย์
                      </p>
                    </>
                  )}
                </div>
                <ul className="space-y-4">
                  {missionPoints.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-slate-100"
                    >
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-navy-dark font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </AnimationWrapper>
              <AnimationWrapper animation="fade-in-up" className="relative" delay={0.2}>
                {mission.image?.url ? (
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                    <Image
                      src={mission.image.url}
                      alt={mission.image.alt || mission.headline}
                      width={600}
                      height={600}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-gradient-to-br from-primary via-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center relative shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10 mix-blend-overlay" />
                    <Scale className="w-32 h-32 text-white/90 relative z-10 drop-shadow-md" />

                    {/* Decorative blobs */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl transform -translate-x-10 translate-y-10" />
                  </div>
                )}
              </AnimationWrapper>
            </div>
          </div>
        </section>}

        {/* Values */}
        {show.values && <AboutValues values={values} sectionHeader={valuesHeader} />}

        {/* Timeline */}
        {show.timeline && <AboutTimeline events={timeline} sectionHeader={timelineHeader} />}

        {/* Team */}
        {show.team && <AboutTeam members={team} sectionHeader={teamHeader} />}

        {/* CTA */}
        {show.cta && (
          <section className="py-24 relative overflow-hidden text-white">
            <BackgroundPattern variant="hero" />
            <GridPattern
              width={30}
              height={30}
              x={-1}
              y={-1}
              className={cn(
                'absolute inset-0 h-full w-full stroke-white/10 fill-white/10',
                '[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]'
              )}
            />
            <div className="container mx-auto px-4 text-center relative z-10">
              <AnimationWrapper animation="scale-up" className="max-w-4xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 font-display">
                  {cta.headline}
                </h2>
                <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">{cta.description}</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {cta.primaryCta?.text && cta.primaryCta?.url && (
                    <Button
                      size="lg"
                      variant="secondary"
                      asChild
                      className="w-full sm:w-auto px-8 py-6 text-base font-bold shadow-lg shadow-blue-900/20"
                    >
                      <Link href={cta.primaryCta.url}>{cta.primaryCta.text}</Link>
                    </Button>
                  )}
                  {cta.secondaryCta?.text && cta.secondaryCta?.url && (
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto px-8 py-6 text-base bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm"
                      asChild
                    >
                      <Link href={cta.secondaryCta.url}>{cta.secondaryCta.text}</Link>
                    </Button>
                  )}
                </div>
              </AnimationWrapper>
            </div>
          </section>
        )}
    </main>
  )
}
