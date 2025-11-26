// src/data/jobs.js
export const jobs = [
  { id: "JOB-001", title: "แอร์ไม่เย็น ห้องผู้บริหาร", dept: "แอร์", location: "อาคาร A ชั้น 10", createdAt: "2025-11-25", status: "urgent", description: "แอร์ไม่เย็นเลย ผู้บริหารร้อนมาก" },
  { id: "JOB-002", title: "ล้างแอร์ใหญ่ ห้องประชุม", dept: "แอร์", location: "อาคาร B ชั้น 5", createdAt: "2025-11-24", status: "pending", description: "ล้างใหญ่ประจำไตรมาส" },
  { id: "JOB-003", title: "แอร์มีเสียงดัง ร้านกาแฟ", dept: "แอร์", location: "อาคาร B ชั้น 1", createdAt: "2025-11-25", status: "pending", description: "เสียงดังกึกกึก ลูกค้าร้องเรียน" },
  { id: "JOB-004", title: "ติดตั้งแอร์ใหม่ ห้องทำงานใหม่", dept: "แอร์", location: "อาคาร C ชั้น 4", createdAt: "2025-11-23", status: "pending", description: "ติดตั้ง Daikin 12,000 BTU" },
  { id: "JOB-005", title: "แอร์หยดน้ำ ห้อง 301", dept: "แอร์", location: "อาคาร A ชั้น 3", createdAt: "2025-11-22", status: "inprogress", assigneeId: 1, assigneeName: "สมชาย ใจดี", description: "หยดน้ำหนักมาก" },
  { id: "JOB-006", title: "เติมน้ำยาแอร์ Server Room", dept: "แอร์", location: "Server Room ชั้น 7", createdAt: "2025-11-21", status: "pending", description: "อุณหภูมิสูงเกิน" },
  { id: "JOB-007", title: "ซ่อมแอร์ตู้ตั้ง โถงล็อบบี้", dept: "แอร์", location: "ล็อบบี้ อาคาร A", createdAt: "2025-11-25", status: "urgent", description: "ไม่ทำงานเลย" },
  { id: "JOB-008", title: "ตรวจเช็คแอร์ประจำเดือน", dept: "แอร์", location: "ทุกชั้น อาคาร A", createdAt: "2025-11-20", status: "pending", description: "ตรวจเช็คตามแผน PM" },
  { id: "JOB-009", title: "เปลี่ยนคอมเพรสเซอร์ แอร์เก่า", dept: "แอร์", location: "ห้องเครื่อง ชั้นดาดฟ้า", createdAt: "2025-11-19", status: "pending", description: "คอมเพรสเซอร์เสีย" },
  { id: "JOB-010", title: "แอร์มีกลิ่นอับ ห้อง 502", dept: "แอร์", location: "อาคาร B ชั้น 5", createdAt: "2025-11-24", status: "pending", description: "กลิ่นอับแรงมาก" },
  { id: "JOB-011", title: "ล้างแอร์ 18,000 BTU ห้อง 405", dept: "แอร์", location: "อาคาร C ชั้น 4", createdAt: "2025-11-23", status: "pending", description: "ล้างแอร์ตามกำหนด" },
  { id: "JOB-012", title: "แอร์รั่วน้ำยา ห้อง Lab", dept: "แอร์", location: "Lab ชั้น 6", createdAt: "2025-11-25", status: "urgent", description: "รั่วหนัก" },
  { id: "JOB-013", title: "เปลี่ยนรีโมทแอร์ ห้อง 201", dept: "แอร์", location: "อาคาร A ชั้น 2", createdAt: "2025-11-22", status: "pending", description: "รีโมทหาย" },
  { id: "JOB-014", title: "ตรวจสอบระบบแอร์รวม", dept: "แอร์", location: "ดาดฟ้า อาคาร B", createdAt: "2025-11-21", status: "pending", description: "ตรวจสอบตามแผน" },
  { id: "JOB-015", title: "แอร์ไม่ตัด ห้อง 708", dept: "แอร์", location: "อาคาร D ชั้น 7", createdAt: "2025-11-25", status: "inprogress", assigneeId: 1, assigneeName: "สมชาย ใจดี", description: "ไม่ตัดคอมเพรสเซอร์" },
  { id: "JOB-016", title: "ติดตั้งแอร์เพิ่ม ห้องใหม่", dept: "แอร์", location: "อาคาร E ชั้น 3", createdAt: "2025-11-20", status: "pending", description: "ห้องใหม่" },
  { id: "JOB-017", title: "แอร์มีน้ำแข็งเกาะ", dept: "แอร์", location: "ห้องเย็น ชั้น 1", createdAt: "2025-11-24", status: "urgent", description: "น้ำแข็งเกาะหนา" },
  { id: "JOB-018", title: "เปลี่ยนแผ่นกรองอากาศ", dept: "แอร์", location: "ทุกเครื่อง อาคาร A", createdAt: "2025-11-19", status: "pending", description: "เปลี่ยนตามกำหนด" },
  { id: "JOB-019", title: "ซ่อมพัดลมแอร์ไม่หมุน", dept: "แอร์", location: "ห้อง 609", createdAt: "2025-11-23", status: "pending", description: "พัดลมในเครื่องไม่หมุน" },
  { id: "JOB-020", title: "ตรวจเช็คแอร์ก่อนฤดูร้อน", dept: "แอร์", location: "ทุกอาคาร", createdAt: "2025-11-18", status: "pending", description: "เตรียมรับหน้าร้อน" }
]