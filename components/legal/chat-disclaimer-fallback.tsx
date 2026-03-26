import Link from 'next/link'

export function ChatDisclaimerFallbackContent() {
  return (
    <>
      <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6 mb-8 flex gap-4">
        <div className="min-w-[4px] bg-amber-500 rounded-full" />
        <p className="text-amber-800 m-0 font-medium">
          การสนทนานี้เป็นเพียงการสื่อสารเบื้องต้นเพื่อประเมินปัญหาและแนวทางเท่านั้น
          ไม่ถือเป็นคำปรึกษาทางกฎหมายอย่างเป็นทางการ
          และยังไม่ก่อให้เกิดความสัมพันธ์ระหว่างทนายความและลูกความ
        </p>
      </div>

      <h2 className="text-2xl font-bold text-navy-dark mt-8 mb-4 border-b border-slate-100 pb-2">
        ข้อมูลที่ท่านส่งมา
      </h2>
      <p className="text-gray-700 mb-2">
        ข้อมูลที่ท่านส่งมาในช่องทางนี้ (รวมถึงข้อความและเอกสารแนบ) จะถูกนำไปใช้เพื่อ
      </p>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6 marker:text-primary">
        <li>ประเมินความต้องการของท่าน</li>
        <li>อำนวยความสะดวกในการให้บริการและการจับคู่ทนายความ</li>
        <li>ปรับปรุงคุณภาพของแพลตฟอร์ม</li>
      </ul>

      <h2 className="text-2xl font-bold text-navy-dark mt-12 mb-4 border-b border-slate-100 pb-2">
        ข้อจำกัดของการสนทนาเบื้องต้น
      </h2>
      <p className="text-gray-700 mb-4">
        การสนทนาในช่องทางนี้ไม่ถือเป็นคำปรึกษาทางกฎหมายอย่างเป็นทางการ
        หากท่านต้องการคำปรึกษาทางกฎหมายอย่างเต็มรูปแบบ
        กรุณาทำการนัดหมายและชำระค่าบริการผ่านระบบของแพลตฟอร์ม
      </p>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6 marker:text-primary">
        <li>ข้อมูลที่ได้รับในการสนทนาเบื้องต้นไม่ครอบคลุมทุกแง่มุมทางกฎหมาย</li>
        <li>ทนายความสงวนสิทธิ์ในการรับหรือปฏิเสธการให้บริการ</li>
        <li>ผลลัพธ์ทางกฎหมายใดๆ ขึ้นอยู่กับข้อเท็จจริงและสถานการณ์ของแต่ละกรณี</li>
      </ul>

      <h2 className="text-2xl font-bold text-navy-dark mt-12 mb-4 border-b border-slate-100 pb-2">
        การคุ้มครองข้อมูลส่วนบุคคล
      </h2>
      <p className="text-gray-700 mb-4">
        ข้อมูลที่ท่านส่งมาจะถูกจัดเก็บและใช้งานตาม{' '}
        <Link href="/privacy" className="text-primary hover:underline">
          นโยบายความเป็นส่วนตัว
        </Link>{' '}
        ของแพลตฟอร์ม บริษัทจะไม่เปิดเผยข้อมูลดังกล่าวต่อบุคคลที่สาม
        ยกเว้นตามที่กฎหมายกำหนดหรือได้รับความยินยอมจากท่าน
      </p>

      <div className="border-t border-slate-200 pt-8 mt-12">
        <p className="text-gray-500 text-center font-medium">
          การเริ่มต้นสนทนา ถือว่าท่านได้อ่านและรับทราบ{' '}
          <span className="text-primary font-semibold">นโยบายความเป็นส่วนตัวและข้อจำกัดความรับผิดชอบ</span>{' '}
          ก่อนเริ่มแชทแล้ว
        </p>
      </div>
    </>
  )
}

export default ChatDisclaimerFallbackContent
