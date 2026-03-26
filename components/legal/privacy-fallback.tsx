import Link from 'next/link'

export function PrivacyFallbackContent() {
  return (
    <>
      <div className="bg-green-50/50 border border-green-100 rounded-2xl p-6 mb-8 flex gap-4">
        <div className="min-w-[4px] bg-green-500 rounded-full" />
        <p className="text-green-800 m-0 font-medium">
          เพื่อนทนายให้ความสำคัญกับความเป็นส่วนตัวของคุณ นโยบายนี้อธิบายวิธีที่เราเก็บรวบรวม ใช้
          และปกป้องข้อมูลของคุณอย่างโปร่งใสและปลอดภัย
        </p>
      </div>

      <h2 className="text-2xl font-bold text-navy-dark mt-8 mb-4 border-b border-slate-100 pb-2">
        1. ข้อมูลที่เราเก็บรวบรวม
      </h2>
      <h3 className="text-xl font-semibold text-navy-dark mt-6 mb-3">1.1 ข้อมูลที่คุณให้กับเรา</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6 marker:text-primary">
        <li>
          <strong>ข้อมูลบัญชี:</strong> ชื่อ-นามสกุล, อีเมล, เบอร์โทรศัพท์
        </li>
        <li>
          <strong>ข้อมูลการยืนยันตัวตน:</strong> บัตรประชาชน (สำหรับทนายความ)
        </li>
        <li>
          <strong>ข้อมูลการชำระเงิน:</strong> ข้อมูลบัตรเครดิต, บัญชีธนาคาร
        </li>
        <li>
          <strong>ข้อมูลการปรึกษา:</strong> รายละเอียดคดี, เอกสารที่อัปโหลด
        </li>
      </ul>

      <h3 className="text-xl font-semibold text-navy-dark mt-6 mb-3">
        1.2 ข้อมูลที่เก็บโดยอัตโนมัติ
      </h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6 marker:text-primary">
        <li>
          <strong>ข้อมูลอุปกรณ์:</strong> ประเภทอุปกรณ์, ระบบปฏิบัติการ, เบราว์เซอร์
        </li>
        <li>
          <strong>ข้อมูลการใช้งาน:</strong> หน้าที่เข้าชม, เวลาที่ใช้งาน, การคลิก
        </li>
        <li>
          <strong>ข้อมูลตำแหน่ง:</strong> IP Address, ตำแหน่งโดยประมาณ
        </li>
        <li>
          <strong>คุกกี้:</strong> ข้อมูลเซสชันและการตั้งค่า
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-navy-dark mt-12 mb-4 border-b border-slate-100 pb-2">
        2. วิธีที่เราใช้ข้อมูล
      </h2>
      <p className="text-gray-700 mb-4">เราใช้ข้อมูลของคุณเพื่อ:</p>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6 marker:text-primary">
        <li>ให้บริการและจัดการบัญชีของคุณ</li>
        <li>ประมวลผลการชำระเงินและออกใบเสร็จ</li>
        <li>เชื่อมต่อคุณกับทนายความที่เหมาะสม</li>
        <li>ส่งการแจ้งเตือนและอัปเดตการนัดหมาย</li>
        <li>ปรับปรุงและพัฒนาบริการ</li>
        <li>ป้องกันการฉ้อโกงและรักษาความปลอดภัย</li>
        <li>ปฏิบัติตามกฎหมายและข้อบังคับ</li>
      </ul>

      <h2 className="text-2xl font-bold text-navy-dark mt-12 mb-4 border-b border-slate-100 pb-2">
        3. การแบ่งปันข้อมูล
      </h2>
      <p className="text-gray-700 mb-4">เราจะไม่ขายข้อมูลของคุณ แต่อาจแบ่งปันกับ:</p>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6 marker:text-primary">
        <li>
          <strong>ทนายความ:</strong> ข้อมูลที่จำเป็นสำหรับการปรึกษา
        </li>
        <li>
          <strong>ผู้ให้บริการชำระเงิน:</strong> สำหรับการประมวลผลธุรกรรม
        </li>
        <li>
          <strong>ผู้ให้บริการเทคโนโลยี:</strong> Cloud hosting, วิเคราะห์ข้อมูล
        </li>
        <li>
          <strong>หน่วยงานราชการ:</strong> เมื่อกฎหมายกำหนด
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-navy-dark mt-12 mb-4 border-b border-slate-100 pb-2">
        4. การรักษาความปลอดภัย
      </h2>
      <p className="text-gray-700 mb-4">เราใช้มาตรการรักษาความปลอดภัยที่เข้มงวด:</p>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6 marker:text-primary">
        <li>การเข้ารหัส SSL/TLS สำหรับข้อมูลทั้งหมด</li>
        <li>การเข้ารหัสข้อมูลสำคัญแบบ End-to-End</li>
        <li>การยืนยันตัวตนแบบหลายขั้นตอน</li>
        <li>การตรวจสอบความปลอดภัยเป็นประจำ</li>
        <li>การจำกัดการเข้าถึงข้อมูลภายในองค์กร</li>
      </ul>

      <h2 className="text-2xl font-bold text-navy-dark mt-12 mb-4 border-b border-slate-100 pb-2">
        5. สิทธิของคุณ
      </h2>
      <p className="text-gray-700 mb-4">ตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) คุณมีสิทธิ:</p>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6 marker:text-primary">
        <li>
          <strong>เข้าถึง:</strong> ขอสำเนาข้อมูลส่วนบุคคลของคุณ
        </li>
        <li>
          <strong>แก้ไข:</strong> ขอแก้ไขข้อมูลที่ไม่ถูกต้อง
        </li>
        <li>
          <strong>ลบ:</strong> ขอลบข้อมูลของคุณ
        </li>
        <li>
          <strong>จำกัด:</strong> ขอจำกัดการประมวลผลข้อมูล
        </li>
        <li>
          <strong>คัดค้าน:</strong> คัดค้านการใช้ข้อมูลบางประเภท
        </li>
        <li>
          <strong>โอนย้าย:</strong> ขอรับข้อมูลในรูปแบบที่อ่านได้
        </li>
        <li>
          <strong>ถอนความยินยอม:</strong> ถอนความยินยอมเมื่อใดก็ได้
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-navy-dark mt-12 mb-4 border-b border-slate-100 pb-2">
        6. คุกกี้
      </h2>
      <p className="text-gray-700 mb-4">เราใช้คุกกี้เพื่อ:</p>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6 marker:text-primary">
        <li>
          <strong>คุกกี้ที่จำเป็น:</strong> สำหรับการทำงานพื้นฐาน
        </li>
        <li>
          <strong>คุกกี้การวิเคราะห์:</strong> เพื่อเข้าใจการใช้งาน
        </li>
        <li>
          <strong>คุกกี้การตั้งค่า:</strong> เพื่อจดจำความชอบของคุณ
        </li>
      </ul>
      <p className="text-gray-700 mb-4">คุณสามารถจัดการคุกกี้ได้ในการตั้งค่าเบราว์เซอร์</p>

      <h2 className="text-2xl font-bold text-navy-dark mt-12 mb-4 border-b border-slate-100 pb-2">
        7. การเก็บรักษาข้อมูล
      </h2>
      <p className="text-gray-700 mb-4">เราเก็บรักษาข้อมูลของคุณตามระยะเวลาที่จำเป็น:</p>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6 marker:text-primary">
        <li>ข้อมูลบัญชี: ตลอดระยะเวลาที่ใช้บริการ + 5 ปี</li>
        <li>ข้อมูลการปรึกษา: 10 ปีตามกฎหมาย</li>
        <li>ข้อมูลการชำระเงิน: 7 ปีตามกฎหมายภาษี</li>
        <li>บันทึกการใช้งาน: 1 ปี</li>
      </ul>

      <h2 className="text-2xl font-bold text-navy-dark mt-12 mb-4 border-b border-slate-100 pb-2">
        8. การโอนข้อมูลระหว่างประเทศ
      </h2>
      <p className="text-gray-700 mb-4">
        ข้อมูลของคุณอาจถูกโอนและประมวลผลในประเทศอื่น
        เราจะมั่นใจว่าข้อมูลได้รับการคุ้มครองอย่างเหมาะสมตามมาตรฐานสากล
      </p>

      <h2 className="text-2xl font-bold text-navy-dark mt-12 mb-4 border-b border-slate-100 pb-2">
        9. เด็กและเยาวชน
      </h2>
      <p className="text-gray-700 mb-4">
        บริการของเราไม่ได้ออกแบบสำหรับผู้ที่อายุต่ำกว่า 18 ปี
        หากเราพบว่ามีการเก็บข้อมูลของเด็กโดยไม่ได้รับความยินยอมจากผู้ปกครอง
        เราจะลบข้อมูลนั้นทันที
      </p>

      <h2 className="text-2xl font-bold text-navy-dark mt-12 mb-4 border-b border-slate-100 pb-2">
        10. การเปลี่ยนแปลงนโยบาย
      </h2>
      <p className="text-gray-700 mb-4">
        เราอาจปรับปรุงนโยบายนี้เป็นระยะ
        การเปลี่ยนแปลงที่สำคัญจะแจ้งให้คุณทราบผ่านอีเมลหรือการแจ้งเตือนบนแพลตฟอร์ม
      </p>

      <h2 className="text-2xl font-bold text-navy-dark mt-12 mb-4 border-b border-slate-100 pb-2">
        11. ติดต่อเจ้าหน้าที่คุ้มครองข้อมูล
      </h2>
      <p className="text-gray-700 mb-4">
        หากมีคำถามหรือต้องการใช้สิทธิเกี่ยวกับข้อมูลส่วนบุคคล:
      </p>
      <ul className="list-none text-gray-700 space-y-2 mb-6">
        <li>เจ้าหน้าที่คุ้มครองข้อมูล (DPO)</li>
        <li>อีเมล: dpo@lawmate.co.th</li>
        <li>โทรศัพท์: 02-123-4567</li>
        <li>ที่อยู่: 123 อาคารเพื่อนทนาย ชั้น 15 ถนนสาทร กรุงเทพฯ 10500</li>
      </ul>

      <div className="border-t border-slate-200 pt-8 mt-12">
        <p className="text-gray-500 text-center font-medium">
          ดูเพิ่มเติม:{' '}
          <Link
            href="/terms"
            className="text-primary hover:text-primary-dark transition-colors font-semibold"
          >
            ข้อกำหนดการใช้บริการ
          </Link>
        </p>
      </div>
    </>
  )
}

export default PrivacyFallbackContent
