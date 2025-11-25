// ========================================
// src/data/Techsample.jsx
// (รวมฟิลด์: creator, priority, location, updatedAt, dueDate)
// ========================================

const ACTIVITIES = [
  { id: 1, text: 'ช่างสมชาย ใจดี เปลี่ยนสถานะ J002 เป็น กำลังทำ', timestamp: '2025-11-21 14:30', department: 'ไฟฟ้า' },
  { id: 2, text: 'หัวหน้าช่างสมหญิง ตรวจสอบและอนุมัติงาน J003', timestamp: '2025-11-21 10:15', department: 'ไฟฟ้า' },
  { id: 3, text: 'Admin สร้างใบงานใหม่ J006', timestamp: '2025-11-20 09:00', department: 'ไฟฟ้า' },
  { id: 4, text: 'ใบงาน J004 ถูกมอบหมายให้แผนกประปา', timestamp: '2025-11-19 16:20', department: 'ประปา' },
];

const sampleJobs = [
  { 
    id: 'J001', name: 'ซ่อมแอร์ห้อง 301', date: '2024-11-15', 
    technician: 'สมชาย ใจดี', technicianId: 'tech1', creator: 'Admin',
    status: 'รอดำเนินการ', department: 'ไฟฟ้า', location: 'อาคาร A ชั้น 3',
    updatedAt: '2025-11-20 12:00', priority: 'ปานกลาง', dueDate: '2024-11-22'
  },
  { 
    id: 'J002', name: 'เปลี่ยนหลอดไฟ', date: '2024-11-14', 
    technician: 'สมชาย ใจดี', technicianId: 'tech1', creator: 'Admin',
    status: 'กำลังทำ', department: 'ไฟฟ้า', location: 'อาคาร B ชั้น 1',
    updatedAt: '2025-11-21 14:30', priority: 'ปานกลาง', dueDate: '2024-11-20' 
  },
  { 
    id: 'J003', name: 'ตรวจเช็คระบบไฟฟ้า', date: '2024-11-13', 
    technician: 'สมศักดิ์ ขยัน', technicianId: 'tech2', creator: 'System',
    status: 'เสร็จสิ้น', department: 'ไฟฟ้า', location: 'อาคาร C',
    updatedAt: '2025-11-21 10:15', priority: 'สูง', dueDate: '2024-11-15'
  },
  { 
    id: 'J004', name: 'ซ่อมท่อประปา', date: '2024-11-16', 
    technician: 'สมศักดิ์ ขยัน', technicianId: 'tech2', creator: 'Admin',
    status: 'รอตรวจสอบ', department: 'ประปา', location: 'ห้องน้ำชาย ชั้น 2',
    updatedAt: '2025-11-19 16:20', priority: 'ด่วนมาก', dueDate: '2024-11-18'
  },
  { 
    id: 'J005', name: 'ทาสีผนัง', date: '2024-11-15', 
    technician: 'สมหญิง รักงาน', technicianId: 'tech3', 
    status: 'กำลังทำ', department: 'โครงสร้าง', location: 'โซนสำนักงาน',
    updatedAt: '2025-11-20 10:00', priority: 'ปานกลาง', dueDate: '2024-11-24'
  },
  { 
    id: 'J006', name: 'ติดตั้งปลั๊กไฟใหม่', date: '2024-11-20', 
    technician: 'ไม่มีช่าง', technicianId: null, creator: 'Admin',
    status: 'รออนุมัติ', department: 'ไฟฟ้า', location: 'ห้องประชุม 1',
    updatedAt: '2025-11-20 09:00', priority: 'ต่ำ', dueDate: '2024-11-25'
  },
  { 
    id: 'J007', name: 'เครื่องปรับอากาศเสีย', date: '2024-11-21', 
    technician: 'ไม่มีช่าง', technicianId: null, creator: 'Admin',
    status: 'รออนุมัติ', department: 'ไฟฟ้า', location: 'อาคาร A ชั้น 5',
    updatedAt: '2025-11-21 15:00', priority: 'ปานกลาง', dueDate: '2024-11-27'
  },
  { 
    id: 'J099', name: 'งานซ่อมบำรุงทั่วไป', date: '2024-11-10', 
    technician: 'ไม่มีช่าง', technicianId: null, creator: 'User',
    status: 'รออนุมัติ', department: '', location: 'ไม่ระบุ', // Error: Missing Dept
    updatedAt: '2025-11-10 09:00', priority: '', dueDate: '2024-11-12' // Error: Missing Priority + Overdue
  },
  { 
    id: 'J100', name: 'ทาสีกำแพง', date: '2024-11-18', 
    technician: 'ไม่มีช่าง', technicianId: null, creator: 'Admin',
    status: 'กำลังทำ', department: 'โครงสร้าง', location: 'โรงอาหาร', // Error: Logic Error (In Progress, No Tech)
    updatedAt: '2025-11-19 08:00', priority: 'สูง', dueDate: '2024-11-25'
  },
];

export default { sampleJobs, ACTIVITIES };