import { fetchFromCMS } from './client'

export interface LawyerPageSettingsData {
  verificationBadgeText: string
  licenseVerifiedText: string
  confidentialityText: string
  moneyBackGuaranteeText: string
}

const defaultLawyerPageSettings: LawyerPageSettingsData = {
  verificationBadgeText: 'แนะนำโดย lawmate.co.th',
  licenseVerifiedText: 'ใบอนุญาตผ่านการรับรอง',
  confidentialityText: 'ข้อมูลเป็นความลับ',
  moneyBackGuaranteeText: 'การันตีคืนเงิน 7 วัน',
}

export async function getLawyerPageSettings(): Promise<LawyerPageSettingsData> {
  const data = await fetchFromCMS<LawyerPageSettingsData>(
    '/globals/lawyer-page-settings',
    { next: { revalidate: 60, tags: ['cms', 'lawyer-page-settings'] } }
  )
  if (!data) return defaultLawyerPageSettings
  return {
    verificationBadgeText: data.verificationBadgeText || defaultLawyerPageSettings.verificationBadgeText,
    licenseVerifiedText: data.licenseVerifiedText || defaultLawyerPageSettings.licenseVerifiedText,
    confidentialityText: data.confidentialityText || defaultLawyerPageSettings.confidentialityText,
    moneyBackGuaranteeText: data.moneyBackGuaranteeText || defaultLawyerPageSettings.moneyBackGuaranteeText,
  }
}
