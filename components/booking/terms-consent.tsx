'use client';

import { useRef, useState, useEffect } from 'react';
import { FileText, ExternalLink, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

interface TermsConsentProps {
  accepted: boolean;
  onAcceptedChange: (accepted: boolean) => void;
}

export function TermsConsent({ accepted, onAcceptedChange }: TermsConsentProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el && el.scrollHeight <= el.clientHeight) {
      setHasScrolledToBottom(true);
    }
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
      setHasScrolledToBottom(true);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5" />
          ข้อกำหนดและเงื่อนไขการใช้งาน
        </CardTitle>
        <p className="text-sm text-gray-500">
          กรุณาอ่านและยอมรับข้อกำหนดก่อนดำเนินการชำระเงิน
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div ref={scrollRef} onScroll={handleScroll} className="h-[400px] overflow-y-auto rounded-md border p-4 relative">
          <div className="space-y-6 text-sm">
            {/* Header */}
            <div className="text-center space-y-1">
              <h2 className="text-lg font-bold">ข้อกำหนดและเงื่อนไขการใช้งาน (Terms of Use)</h2>
              <p className="text-gray-500">อัปเดตล่าสุด: 31 มกราคม 2569</p>
              <p className="text-gray-500">บริษัท: เพื่อนทนาย จำกัด</p>
            </div>

            <Separator />

            {/* Section 1 */}
            <section className="space-y-2">
              <h3 className="font-semibold text-base">1. การรับทราบข้อกำหนด (Acceptance of Terms)</h3>
              <p className="text-gray-700 leading-relaxed">
                1.1 การเข้าถึงหรือใช้งานแพลตฟอร์ม "เพื่อนทนาย" ถือว่าท่านได้รับทราบข้อกำหนดและเงื่อนไขนี้เป็นอย่างดีแล้ว
                รวมถึงนโยบายความเป็นส่วนตัว (Privacy Notice) และนโยบายอื่น ๆ ที่เกี่ยวข้องทั้งหมด
              </p>
              <p className="text-gray-700 leading-relaxed">
                1.2 ข้อกำหนดนี้ใช้กับผู้ใช้ทั่วไปที่ค้นหาทนายความ และทนายความที่ลงทะเบียน
              </p>
              <p className="text-gray-700 leading-relaxed">
                1.3 หากท่านไม่ตกลงผูกพันตามข้อกำหนดเหล่านี้ โปรดอย่าเข้าถึงหรือใช้แพลตฟอร์ม
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-2">
              <h3 className="font-semibold text-base">2. ขอบเขตและลักษณะของบริการ (Scope of Service)</h3>
              <p className="text-gray-700 leading-relaxed">
                2.1 <strong>"เพื่อนทนาย" เป็นแพลตฟอร์มจับคู่:</strong> "เพื่อนทนาย" ทำหน้าที่เป็นตัวกลางในการเชื่อมต่อผู้ใช้กับทนายความ
                โดยมีระบบค้นหา เปรียบเทียบโปรไฟล์ ระบบนัดหมาย/ปรึกษา และระบบชำระเงิน
              </p>
              <p className="text-gray-700 leading-relaxed">
                2.2 <strong>การดำเนินการในฐานะสำนักงานกฎหมาย:</strong> "เพื่อนทนาย" มีวัตถุประสงค์เพื่อ อำนวยความสะดวกในการเข้าถึงบริการคำปรึกษาทางกฎหมาย
                จากทนายความในเครือข่ายของสำนักงาน ข้อมูลความรู้กฎหมายในหน้าบทความ / ความรู้กฎหมาย (Knowledge Center)
                จัดทำขึ้นเพื่อสนับสนุนการเผยแพร่ข้อมูลและการตลาด (Content Marketing)
              </p>
              <p className="text-gray-700 leading-relaxed">
                2.3 <strong>ความสัมพันธ์ทนาย-ลูกความ:</strong> ความสัมพันธ์ทางกฎหมายจะเกิดขึ้นเมื่อมีการนัดหมาย ปรึกษา และจ่ายเงินผ่านระบบอย่างครบวงจร
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-2">
              <h3 className="font-semibold text-base">3. การใช้แพลตฟอร์มอย่างเหมาะสม (Appropriate Use)</h3>
              <p className="text-gray-700 leading-relaxed">
                3.1 ผู้ใช้และทนายความตกลงที่จะใช้แพลตฟอร์มตามวัตถุประสงค์ที่กำหนดและไม่ทำการละเมิดข้อตกลงการใช้งาน
              </p>
              <p className="text-gray-700 leading-relaxed">
                3.2 การใช้งานที่ไม่เหมาะสม รวมถึงแต่ไม่จำกัดเพียง การใช้ภาษาหยาบคาย หรือการเผยแพร่เนื้อหาที่ผิดกฎหมาย
              </p>
              <p className="text-gray-700 leading-relaxed">
                3.3 ผู้ใช้ตกลงที่จะให้ข้อมูลที่เป็นจริงและถูกต้องในการสมัครสมาชิกและการใช้บริการ
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-2">
              <h3 className="font-semibold text-base">4. การจัดการบัญชีผู้ใช้และทนายความ (Account Management)</h3>
              <p className="text-gray-700 leading-relaxed">
                4.1 <strong>การยืนยันตัวตน (KYC):</strong> ทนายความตกลงให้ "เพื่อนทนาย" ดำเนินการตรวจสอบและยืนยันตัวตน/คุณสมบัติ (KYC &amp; Verification) ก่อนเปิดใช้งานบัญชี
              </p>
              <p className="text-gray-700 leading-relaxed">
                4.2 <strong>สิทธิการเข้าถึงข้อมูล:</strong> ผู้ใช้ทั่วไปสามารถดู/แก้ไข/เพิกถอนคำยินยอมตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA)
                ได้ผ่านหน้าหลักผู้ใช้งาน (สามารถดูข้อมูลเพิ่มเติมได้ที่ "นโยบายความเป็นส่วนตัว (Privacy Notice)")
              </p>
              <p className="text-gray-700 leading-relaxed">
                4.3 <strong>การระงับบัญชี:</strong> "เพื่อนทนาย" สงวนสิทธิ์ในการระงับหรือยกเลิกบัญชีผู้ใช้หรือทนายความ หากพบการละเมิดข้อกำหนดนี้
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-2">
              <h3 className="font-semibold text-base">5. ระบบการนัดหมายและการชำระเงิน (Booking and Payment)</h3>
              <p className="text-gray-700 leading-relaxed">
                5.1 <strong>ค่าบริการ:</strong> อัตราค่าบริการถูกกำหนดโดยทนายความแต่ละท่าน และแสดงในหน้าโปรไฟล์ทนาย
              </p>
              <p className="text-gray-700 leading-relaxed">
                5.2 <strong>การชำระเงิน:</strong> การชำระเงินต้องดำเนินการผ่านระบบชำระเงินของ "เพื่อนทนาย" ที่รองรับหลายช่องทาง
              </p>
              <p className="text-gray-700 leading-relaxed">
                5.3 <strong>นโยบายยกเลิก/คืนเงิน:</strong> การยกเลิกหรือการขอคืนเงินจะเป็นไปตาม เงื่อนไขยกเลิก/คืนเงิน (Cancellation/Refund Policy)
                ซึ่งต้องจัดเตรียมไว้ สามารถอ่านข้อมูลเพิ่มเติมได้ที่ "นโยบายการยกเลิกและการคืนเงิน (Cancellation and Refund Policy)"
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-2">
              <h3 className="font-semibold text-base">6. ทรัพย์สินทางปัญญา (Intellectual Property)</h3>
              <p className="text-gray-700 leading-relaxed">
                6.1 เนื้อหาและองค์ประกอบทั้งหมดบนแพลตฟอร์ม "เพื่อนทนาย" ถือเป็นทรัพย์สินทางปัญญาของ "เพื่อนทนาย"
                การทำซ้ำหรือนำไปใช้ต้องได้รับอนุญาต
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-2">
              <h3 className="font-semibold text-base">7. ข้อจำกัดความรับผิดชอบและข้อยกเว้น (Limitation of Liability)</h3>
              <p className="text-gray-700 leading-relaxed">
                7.1 <strong>ความรับผิดจำกัด:</strong> "เพื่อนทนาย" จะรับผิดชอบเพียงในขอบเขตการให้บริการแพลตฟอร์มและระบบเท่านั้น
              </p>
              <p className="text-gray-700 leading-relaxed">
                7.2 <strong>ข้อยกเว้นความรับผิด:</strong> "เพื่อนทนาย" ไม่มีส่วนรับผิดชอบต่อความรับผิดที่เกินกว่าที่ข้อตกลงจำกัดไว้
              </p>
              <p className="text-gray-700 leading-relaxed">
                7.3 <strong>การรายงานปัญหา:</strong> หากพบการละเมิดข้อกำหนด ผู้ใช้สามารถรายงานปัญหาผ่านช่องทางแจ้งเตือนและการดำเนินการ
                (Notice &amp; Takedown) หรือ รายงานปัญหา (Report Abuse)
              </p>
            </section>

            {/* Section 8 */}
            <section className="space-y-2">
              <h3 className="font-semibold text-base">8. การแก้ไขข้อกำหนด (Modification)</h3>
              <p className="text-gray-700 leading-relaxed">
                "เพื่อนทนาย" สงวนสิทธิ์ในการแก้ไขหรือเปลี่ยนแปลงข้อกำหนดและเงื่อนไขนี้ได้ตลอดเวลา
                การเปลี่ยนแปลงจะมีผลทันทีเมื่อมีการเผยแพร่บนแพลตฟอร์ม
              </p>
            </section>

            {/* Links */}
            <Separator />
            <div className="space-y-2">
              <p className="text-gray-600">เอกสารที่เกี่ยวข้อง:</p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  นโยบายความเป็นส่วนตัว
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </Link>
                <Link
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  ข้อตกลงและเงื่อนไขฉบับเต็ม
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          {!hasScrolledToBottom && (
            <div className="sticky bottom-0 left-0 right-0 flex justify-center pb-2 pt-4 bg-gradient-to-t from-white to-transparent pointer-events-none">
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <ChevronDown className="w-4 h-4 animate-bounce" />
                เลื่อนลงเพื่ออ่านข้อกำหนดทั้งหมด
              </span>
            </div>
          )}
        </div>

        <Separator />

        {/* Acceptance Checkbox */}
        <div className="flex items-start gap-3 pt-2">
          <Checkbox
            id="terms-accepted"
            checked={accepted}
            onCheckedChange={(checked) => onAcceptedChange(checked === true)}
            disabled={!hasScrolledToBottom}
            className="mt-0.5"
          />
          <Label
            htmlFor="terms-accepted"
            className={`text-sm leading-relaxed cursor-pointer ${!hasScrolledToBottom ? 'opacity-50' : ''}`}
          >
            ข้าพเจ้าได้อ่านและยอมรับข้อกำหนดและเงื่อนไขการใช้งานทั้งหมดแล้ว
            รวมถึงนโยบายความเป็นส่วนตัวและนโยบายการยกเลิก/คืนเงิน
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
