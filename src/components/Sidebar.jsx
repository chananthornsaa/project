// ========================================
// Sidebar.jsx - Component เมนูด้านซ้าย
// ========================================

import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  CheckSquare, 
  BarChart3, 
  Settings 
} from 'lucide-react';

// ========================================
// Sidebar Component
// Props:
// - userRole: บทบาทผู้ใช้ ('admin' หรือ 'supervisor')
// - currentPage: หน้าปัจจุบันที่เลือก
// - onPageChange: ฟังก์ชันเปลี่ยนหน้า
// - onRoleChange: ฟังก์ชันเปลี่ยนบทบาท (สำหรับทดสอบ)
// ========================================
function Sidebar({ userRole, currentPage, onPageChange, onRoleChange }) {
  return (
    <div className="sidebar">
      {/* ========================================
          Navigation Menu - เมนูนำทาง
          ======================================== */}
      <nav className="sidebar-nav">
        
        {/* ========================================
            เมนู Dashboard - แสดงสำหรับทุก Role
            ======================================== */}
        <button 
          className={currentPage === 'dashboard' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => onPageChange('dashboard')}
        >
          <LayoutDashboard size={18} />
          <span>แดชบอร์ด</span>
        </button>

        {/* ========================================
            เมนูจัดการใบงาน - แสดงสำหรับทุก Role
            ======================================== */}
        <button 
          className={currentPage === 'jobs' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => onPageChange('jobs')}
        >
          <ClipboardList size={18} />
          <span>จัดการใบงาน</span>
        </button>

        {/* ========================================
            เมนูจัดการช่าง - แสดงเฉพาะ Admin
            ======================================== */}
        {userRole === 'admin' && (
          <button 
            className={currentPage === 'technicians' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => onPageChange('technicians')}
          >
            <Users size={18} />
            <span>จัดการช่าง</span>
          </button>
        )}

        {/* ========================================
            เมนูตรวจงาน - แสดงเฉพาะหัวหน้าช่าง
            ======================================== */}
        {userRole === 'supervisor' && (
          <button 
            className={currentPage === 'review' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => onPageChange('review')}
          >
            <CheckSquare size={18} />
            <span>ตรวจงาน</span>
          </button>
        )}

        {/* ========================================
            เมนูรายงานสรุป - แสดงสำหรับทุก Role
            ======================================== */}
        <button 
          className={currentPage === 'reports' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => onPageChange('reports')}
        >
          <BarChart3 size={18} />
          <span>รายงานสรุป</span>
        </button>

        {/* ========================================
            เมนูตั้งค่า - แสดงสำหรับทุก Role
            ======================================== */}
        <button 
          className={currentPage === 'settings' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => onPageChange('settings')}
        >
          <Settings size={18} />
          <span>ตั้งค่า</span>
        </button>
      </nav>
      
      {/* ========================================
          Role Switcher - สลับบทบาท (สำหรับทดสอบ)
          ในการใช้งานจริงไม่ควรมีส่วนนี้
          ======================================== */}
      <div className="role-switcher">
        <p className="role-label">ทดสอบสิทธิ์:</p>
        <select 
          value={userRole} 
          onChange={(e) => onRoleChange(e.target.value)}
          className="role-select"
        >
          <option value="admin">Admin</option>
          <option value="supervisor">หัวหน้าช่าง</option>
        </select>
      </div>
    </div>
  );
}

export default Sidebar;