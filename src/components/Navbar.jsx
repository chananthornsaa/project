// ========================================
// Navbar.jsx - Component แถบเมนูด้านบน
// ========================================

import React, { useState } from 'react';
import { Bell, Menu, X, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // (1) เพิ่ม useNavigate

// ========================================
// Navbar Component
// Props:
// - userRole: บทบาทผู้ใช้ ('admin' หรือ 'supervisor')
// - onToggleSidebar: ฟังก์ชันเปิด/ปิด Sidebar
// - sidebarOpen: สถานะการเปิด/ปิด Sidebar
// ========================================
function Navbar({ userRole, onToggleSidebar, sidebarOpen }) {
  // State สำหรับควบคุมเมนู Profile Dropdown
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate(); // (2) ประกาศใช้งาน useNavigate

  // (3) Handler สำหรับออกจากระบบ
  const handleLogout = () => {
    // ในการใช้งานจริง จะต้องมีการลบ Token/Session ออกจาก Local Storage ด้วย
    setShowProfileMenu(false);
    navigate('/login', { replace: true }); // นำกลับไปหน้า Login
  };

  return (
    <div className="navbar">
      {/* ส่วนซ้ายของ Navbar */}
      <div className="navbar-left">
        {/* ปุ่มเปิด/ปิด Sidebar */}
        <button 
          onClick={onToggleSidebar} 
          className="menu-toggle-btn"
          aria-label="Toggle Sidebar"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* โลโก้ระบบ */}
        <div className="logo">⚙️ ระบบจ่ายงานช่าง</div>
      </div>
      
      {/* ส่วนขวาของ Navbar */}
      <div className="navbar-right">
        {/* ปุ่มแจ้งเตือน - มี Badge แสดงการแจ้งเตือนใหม่ */}
        <button 
          className="notification-btn"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {/* Notification Dot - จุดแดงบอกว่ามีการแจ้งเตือนใหม่ */}
          <span className="notification-dot"></span>
        </button>
        
        {/* Profile Menu - เมนูโปรไฟล์ผู้ใช้ */}
        <div className="profile-menu-container">
          {/* ปุ่มเปิด/ปิดเมนูโปรไฟล์ */}
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="profile-btn"
            aria-label="Profile Menu"
          >
            {/* รูปโปรไฟล์ */}
            <div className="profile-avatar">
              <User size={20} />
            </div>

            {/* ชื่อผู้ใช้ - แสดงตามบทบาท */}
            <span className="profile-name">
              {userRole === 'admin' ? 'ผู้ดูแลระบบ' : 'หัวหน้าช่าง'}
            </span>
          </button>
          
          {/* Dropdown Menu - เมนูดรอปดาวน์ */}
          {showProfileMenu && (
            <div className="profile-dropdown">
              {/* เมนูโปรไฟล์ */}
              <button className="dropdown-item">
                <User size={16} /> โปรไฟล์
              </button>

              {/* เมนูออกจากระบบ - (4) ผูก Handler */}
              <button className="dropdown-item" onClick={handleLogout}>
                <LogOut size={16} /> ออกจากระบบ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;