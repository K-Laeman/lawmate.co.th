import Link from 'next/link'

export function TermsFallbackContent() {
  return (
    <>
      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 mb-8 flex gap-4">
        <div className="min-w-[4px] bg-blue-500 rounded-full" />
        <p className="text-blue-800 m-0 font-medium">
          กรุณาอ่านข้อกำหนดการใช้บริการอย่างละเอียด โดยการเข้าถึงหรือใช้บริการของเรา
          คุณตกลงที่จะผูกพันตามข้อกำหนดเหล่านี้
        </p>
      </div>

      <h2 className="text-2xl font-bold text-navy-dark mt-8 mb-4 border-b border-slate-100 pb-2">
        1. คำนิยาม
      </h2>
      <p className="text-gray-700 mb-4">ในข้อกำหนดนี้:</p>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6 marker:text-primary">
        <li>
          <strong>&quot;เพื่อนทนาย&quot;</strong> หรือ <strong>&quot;LawMate&quot;</strong> หมายถึง
          แพลตฟอร์มให้บริการปรึกษาทนายความออนไลน์
        </li>
        <li>
          <strong>&quot;ผู้ใช้บริการ&quot;</strong> หมายถึง บุคคลที่ลงทะเบียนและใช้บริการบนแพลตฟอร์ม
        </li>
        <li>
          <strong>&quot;ทนายความ&quot;</strong> หมายถึง ทนายความที่ผ่านการรับรองและให้บริการผ่านแพลตฟอร์ม
        </li>
        <li>
          <strong>&quot;การปรึกษา&quot;</strong> หมายถึง การให้คำปรึกษาทางกฎหมายผ่านวิดีโอคอลหรือแชท
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-navy-dark mt-12 mb-4 border-b border-slate-100 pb-2">
        2. การใช้บริการ
      </h2>
      <h3 className="text-xl font-semibold text-navy-dark mt-6 mb-3">2.1 คุณสมบัติผู้ใช้บริการ</h3>
      <p className="text-gray-700 mb-4">ผู้ใช้บริการต้องมีคุณสมบัติดังนี้:</p>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6 marker:text-primary">
        <li>มีอายุครบ 18 ปีบริบูรณ์</li>
        <li>มีความสามารถทำนิติกรรมตามกฎหมาย</li>
        <li>ให้ข้อมูลที่ถูกต้องและเป็นจริงในการลงทะเบียน</li>
      </ul>

      <h3 className="text-xl font-semibold text-navy-dark mt-6 mb-3">2.2 บัญชีผู้ใช้</h3>
      <p className="text-gray-700 mb-4">
        ผู้ใช้บริการมีหน้าที่รักษาความปลอดภัยของบัญชี รวมถึงรหัสผ่าน
        และต้องแจ้งเราทันทีหากพบการใช้บัญชีโดยไม่ได้รับอนุญาต
      </p>

      <h2 className="text-2xl font-bold text-navy-dark mt-12 mb-4 border-b border-slate-100 pb-2">
        3. บริการปรึกษาทนายความ
      </h2>
      <h3 className="text-xl font-semibold text-navy-dark mt-6 mb-3">3.1 ลักษณะของบริการ</h3>
      <p className="text-gray-700 mb-4">
        เพื่อนทนายเป็นแพลตฟอร์มที่เชื่อมต่อผู้ใช้บริการกับทนายความ โดย:
      </p>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6 marker:text-primary">
        <li>ทนายความทุกคนเป็นผู้ประกอบอาชีพอิสระ ไม่ใช่พนักงานของเพื่อนทนาย</li>
        <li>เราไม่รับประกันผลลัพธ์ของการปรึกษาหรือคดีความใดๆ</li>
        <li>การปรึกษาเป็นการให้ข้อมูลทางกฎหมายเบื้องต้น ไม่ใช่การว่าความ</li>
      </ul>

      <h3 className="text-xl font-semibold text-navy-dark mt-6 mb-3">3.2 การจองและยกเลิก</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6 marker:text-primary">
        <li>การจองต้องชำระเงินล่วงหน้า</li>
        <li>ยกเลิกก่อน 24 ชั่วโมง: คืนเงินเต็มจำนวน</li>
        <li>ยกเลิกก่อน 12 ชั่วโมง: คืนเงิน 50%</li>
        <li>ยกเลิกน้อยกว่า 12 ชั่วโมง: ไม่คืนเงิน</li>
      </ul>

      <h2 className="text-2xl font-bold text-navy-dark mt-12 mb-4 border-b border-slate-100 pb-2">
        4. ค่าบริการและการชำระเงิน
      </h2>
      <p className="text-gray-700 mb-4">
        ค่าบริการแสดงบนแพลตฟอร์มรวมภาษีมูลค่าเพิ่มแล้ว
        การชำระเงินต้องกระทำผ่านช่องทางที่กำหนดไว้บนแพลตฟอร์มเท่านั้น
      </p>

      <h2 className="text-2xl font-bold text-navy-dark mt-12 mb-4 border-b border-slate-100 pb-2">
        5. ความลับและความเป็นส่วนตัว
      </h2>
      <p className="text-gray-700 mb-4">เราให้ความสำคัญกับความเป็นส่วนตัวของคุณ:</p>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6 marker:text-primary">
        <li>ข้อมูลการปรึกษาถูกเก็บรักษาเป็นความลับ</li>
        <li>การบันทึกวิดีโอต้องได้รับความยินยอมจากทั้งสองฝ่าย</li>
        <li>เราไม่เปิดเผยข้อมูลต่อบุคคลที่สาม ยกเว้นตามที่กฎหมายกำหนด</li>
      </ul>
      <p className="text-gray-700 mb-4">
        ดูรายละเอียดเพิ่มเติมใน{' '}
        <Link href="/privacy" className="text-primary hover:underline">
          นโยบายความเป็นส่วนตัว
        </Link>
      </p>

      <h2 className="text-2xl font-bold text-navy-dark mt-12 mb-4 border-b border-slate-100 pb-2">
        6. ข้อห้ามในการใช้บริการ
      </h2>
      <p className="text-gray-700 mb-4">ผู้ใช้บริการต้องไม่:</p>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6 marker:text-primary">
        <li>ใช้บริการเพื่อวัตถุประสงค์ที่ผิดกฎหมาย</li>
        <li>แอบอ้างตัวเป็นบุคคลอื่น</li>
        <li>รบกวนหรือขัดขวางการทำงานของระบบ</li>
        <li>เผยแพร่เนื้อหาที่ไม่เหมาะสมหรือผิดกฎหมาย</li>
        <li>พยายามเข้าถึงบัญชีของผู้อื่นโดยไม่ได้รับอนุญาต</li>
      </ul>

      <h2 className="text-2xl font-bold text-navy-dark mt-12 mb-4 border-b border-slate-100 pb-2">
        7. การจำกัดความรับผิดชอบ
      </h2>
      <p className="text-gray-700 mb-4">เพื่อนทนายจะไม่รับผิดชอบต่อ:</p>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6 marker:text-primary">
        <li>ความเสียหายที่เกิดจากการกระทำของทนายความ</li>
        <li>ผลลัพธ์ของคดีหรือข้อพิพาททางกฎหมาย</li>
        <li>ความล่าช้าหรือขัดข้องทางเทคนิค</li>
        <li>ข้อมูลที่ไม่ถูกต้องจากผู้ใช้บริการ</li>
      </ul>

      <h2 className="text-2xl font-bold text-navy-dark mt-12 mb-4 border-b border-slate-100 pb-2">
        8. ทรัพย์สินทางปัญญา
      </h2>
      <p className="text-gray-700 mb-4">
        เนื้อหา โลโก้ และองค์ประกอบทั้งหมดบนแพลตฟอร์มเป็นทรัพย์สินของเพื่อนทนาย
        ห้ามทำซ้ำหรือใช้โดยไม่ได้รับอนุญาต
      </p>

      <h2 className="text-2xl font-bold text-navy-dark mt-12 mb-4 border-b border-slate-100 pb-2">
        9. การแก้ไขข้อกำหนด
      </h2>
      <p className="text-gray-700 mb-4">
        เราขอสงวนสิทธิ์ในการแก้ไขข้อกำหนดนี้ได้ตลอดเวลา
        โดยจะแจ้งให้ผู้ใช้บริการทราบล่วงหน้าผ่านทางอีเมลหรือบนแพลตฟอร์ม
      </p>

      <h2 className="text-2xl font-bold text-navy-dark mt-12 mb-4 border-b border-slate-100 pb-2">
        10. กฎหมายที่ใช้บังคับ
      </h2>
      <p className="text-gray-700 mb-4">
        ข้อกำหนดนี้อยู่ภายใต้กฎหมายของราชอาณาจักรไทย ข้อพิพาทใดๆ
        จะถูกพิจารณาโดยศาลไทยที่มีเขตอำนาจ
      </p>

      <h2 className="text-2xl font-bold text-navy-dark mt-12 mb-4 border-b border-slate-100 pb-2">
        11. การติดต่อ
      </h2>
      <p className="text-gray-700 mb-4">หากมีคำถามเกี่ยวกับข้อกำหนดนี้ สามารถติดต่อได้ที่:</p>
      <ul className="list-none text-gray-700 space-y-2 mb-6">
        <li>อีเมล: lawmatesolutions@gmail.com</li>
        <li>โทรศัพท์: 062-4134665</li>
        <li>ที่อยู่: 129/176 หมู่บ้านพฤกษา 3 ซอย 1 บางคูรัด บางบัวทอง นนทบุรี 11110</li>
      </ul>

      <div className="border-t border-slate-200 pt-8 mt-12">
        <p className="text-gray-500 text-center font-medium">
          การใช้บริการของเราถือว่าคุณได้อ่านและยอมรับ{' '}
          <span className="text-primary font-semibold">ข้อตกลงและเงื่อนไข</span> นี้แล้ว
        </p>
      </div>
    </>
  )
}

export default TermsFallbackContent
