// ========================================
// ข้อมูลตัวอย่าง - Mock Data
// (อัปเดต: เปลี่ยน 'รอมอบหมาย' เป็น 'รออนุมัติ')
// ========================================
const ACTIVITIES = [
  { id: 1, text: 'ช่างสมชาย ใจดี เปลี่ยนสถานะ J002 เป็น กำลังทำ', timestamp: '2025-11-21 14:30' },
  { id: 2, text: 'หัวหน้าช่างสมหญิง ตรวจสอบและอนุมัติงาน J003', timestamp: '2025-11-21 10:15' },
  { id: 3, text: 'Admin สร้างใบงานใหม่ J006', timestamp: '2025-11-20 09:00' },
  { id: 4, text: 'ใบงาน J004 ถูกมอบหมายให้แผนกประปา', timestamp: '2025-11-19 16:20' },
];

const sampleJobs = [
  { id: 'J001', name: 'ซ่อมแอร์ห้อง 301', date: '2024-11-15', technician: 'สมชาย ใจดี', technicianId: 'tech1', status: 'รอดำเนินการ', department: 'ไฟฟ้า', updatedAt: '2025-11-20 12:00' },
  { id: 'J002', name: 'เปลี่ยนหลอดไฟ', date: '2024-11-14', technician: 'สมชาย ใจดี', technicianId: 'tech1', status: 'กำลังทำ', department: 'ไฟฟ้า', updatedAt: '2025-11-21 14:30' },
  { id: 'J003', name: 'ตรวจเช็คระบบไฟฟ้า', date: '2024-11-13', technician: 'สมศักดิ์ ขยัน', technicianId: 'tech2', status: 'ผ่านการตรวจสอบ', department: 'ไฟฟ้า', updatedAt: '2025-11-21 10:15' },
  { id: 'J004', name: 'ซ่อมท่อประปา', date: '2024-11-16', technician: 'สมศักดิ์ ขยัน', technicianId: 'tech2', status: 'รอตรวจสอบ', department: 'ประปา', updatedAt: '2025-11-19 16:20' },
  { id: 'J005', name: 'ทาสีผนัง', date: '2024-11-15', technician: 'สมหญิง รักงาน', technicianId: 'tech3', status: 'กำลังทำ', department: 'โครงสร้าง', updatedAt: '2025-11-20 10:00' },
  { id: 'J006', name: 'ติดตั้งปลั๊กไฟใหม่', date: '2024-11-20', technician: 'ไม่มีช่าง', technicianId: null, status: 'รออนุมัติ', department: 'ไฟฟ้า', updatedAt: '2025-11-20 09:00' }, // UPDATED
  { id: 'J007', name: 'เครื่องปรับอากาศเสีย', date: '2024-11-21', technician: 'ไม่มีช่าง', technicianId: null, status: 'รออนุมัติ', department: 'ไฟฟ้า', updatedAt: '2025-11-21 15:00' }, // UPDATED
  { id: 'J008', name: 'เปลี่ยนก๊อกน้ำห้องครัว', date: '2024-11-21', technician: 'สมศักดิ์ ขยัน', technicianId: 'tech2', status: 'รอดำเนินการ', department: 'ประปา', updatedAt: '2025-11-21 11:30' },
  { id: 'J009', name: 'ซ่อมรอยร้าวที่กำแพง', date: '2024-11-18', technician: 'สมหญิง รักงาน', technicianId: 'tech3', status: 'กำลังทำ', department: 'โครงสร้าง', updatedAt: '2025-11-19 08:00' },
];

export default { sampleJobs, ACTIVITIES };