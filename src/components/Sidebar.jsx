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

function Sidebar({ userRole, currentPage, onPageChange }) {
  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        
        {/* เมนู Dashboard */}
        <button 
          className={currentPage === 'dashboard' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => onPageChange('dashboard')}
        >
          <LayoutDashboard size={18} />
          <span>แดชบอร์ด</span>
        </button>

        {/* เมนูจัดการช่าง - แสดงเฉพาะ Admin */}
        {userRole === 'admin' && (
          <button 
            className={currentPage === 'technicians' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => onPageChange('technicians')}
          >
            <Users size={18} />
            <span>จัดการช่าง</span>
          </button>
        )}

        {/* เมนูตรวจงาน - แสดงเฉพาะหัวหน้าช่าง */}
        {userRole === 'supervisor' && (
          <button 
            className={currentPage === 'review' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => onPageChange('review')}
          >
            <CheckSquare size={18} />
            <span>ตรวจงาน</span>
          </button>
        )}

        {/* เมนูตั้งค่า */}
        <button 
          className={currentPage === 'settings' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => onPageChange('settings')}
        >
          <Settings size={18} />
          <span>ตั้งค่า</span>
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;