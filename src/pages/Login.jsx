import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // ADDED
import './Login.css';

export default function Login() {
    const navigate = useNavigate(); // ADDED

    const [currentPage, setCurrentPage] = useState('login');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

// ==============================
    // Mock Users
    // ==============================
    const mockUsers = {
        technician1: { password: '1234', role: 'Technician', name: 'สมชาย ใจดี', id: 'tech1' },
        super1: { password: '1234', role: 'Supervisor', name: 'หัวหน้า วิชัย', id: 'super1' },
        admin1: { password: '1234', role: 'Administrator', name: 'Admin ระบบ', id: 'admin1' },
    };

    const getMockUserRole = (username, password) => {
        if (mockUsers[username] && mockUsers[username].password === password) {
            return mockUsers[username];
        }
        return null;
    };

    // ==============================
    // Handlers
    // ==============================
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        setTimeout(() => {
            if (formData.username && formData.password) {
                const userData = getMockUserRole(formData.username, formData.password);
                if (userData) {
                    
                    setUserRole(userData.role);
                    setMessage(`✓ เข้าสู่ระบบสำเร็จ | บทบาท: ${userData.role}`);
                    
                    // ✅ รองรับทั้ง Admin, Supervisor และ Technician
                    if (userData.role === 'Administrator' || userData.role === 'Supervisor' || userData.role === 'Technician') {
                         let formattedRole;
                         if (userData.role === 'Administrator') formattedRole = 'admin';
                         else if (userData.role === 'Supervisor') formattedRole = 'supervisor';
                         else if (userData.role === 'Technician') formattedRole = 'technician';
                         
                         setTimeout(() => {
                            navigate('/dashboard', { 
                                state: { 
                                    userRole: formattedRole,
                                    userId: userData.id,
                                    userName: userData.name,
                                    username: formData.username
                                } 
                            });
                         }, 1000); 
                    }

                } else {
                    setMessage('✗ ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
                }
            } else {
                setMessage('✗ กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
            }
            setIsLoading(false);
        }, 800);
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        setTimeout(() => {
            if (formData.email) {
                setMessage('✓ ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลแล้ว');
                setCurrentPage('resetPassword');
            } else {
                setMessage('✗ กรุณากรอกอีเมล');
            }
            setIsLoading(false);
        }, 800);
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        setTimeout(() => {
            if (formData.newPassword && formData.confirmPassword) {
                if (formData.newPassword === formData.confirmPassword) {
                    if (formData.newPassword.length >= 6) {
                        setMessage('✓ เปลี่ยนรหัสผ่านสำเร็จ');
                        setTimeout(() => {
                            setCurrentPage('login');
                            setFormData({ username: '', password: '', email: '', newPassword: '', confirmPassword: '' });
                        }, 2000);
                    } else {
                        setMessage('✗ รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
                    }
                } else {
                    setMessage('✗ รหัสผ่านไม่ตรงกัน');
                }
            } else {
                setMessage('✗ กรุณากรอกรหัสผ่านใหม่');
            }
            setIsLoading(false);
        }, 800);
    };

    // ==============================
    // RENDER
    // ==============================
    return (
        <div className="login-container">
            <div className="login-wrapper">
                {/* HEADER */}
                <div className="login-header">
                    <div className="login-icon-box">
                        <User color="white" size={32} />
                    </div>
                    <h1 className="login-title">Tech Job</h1>
                </div>

                {/* LOGIN FORM */}
                {currentPage === 'login' && (
                    <form onSubmit={handleLogin} className="login-form">
                        <h2 className="login-form-title">เข้าสู่ระบบ</h2>

                        {/* Username */}
                        <div className="login-form-group">
                            <label className="login-label">ชื่อผู้ใช้</label>
                            <div className="login-input-wrapper">
                                <div className="login-icon">
                                    <User size={20} />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    placeholder="กรอกชื่อผู้ใช้"
                                    className="login-input"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="login-form-group last">
                            <label className="login-label">รหัสผ่าน</label>
                            <div className="login-input-wrapper">
                                <div className="login-icon">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="กรอกรหัสผ่าน"
                                    className="login-input with-right-icon"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="login-icon-button"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Role Display */}
                        {userRole && (
                            <div className="login-role-display">
                                <p className="login-role-text">
                                    <span style={{ fontWeight: 'bold' }}>บทบาท (ระบบกำหนด):</span>
                                    <span className="login-role-badge">{userRole}</span>
                                </p>
                            </div>
                        )}

                        {/* Message */}
                        {message && (
                            <div className={`login-message ${message.startsWith('✓') ? 'success' : 'error'}`}>
                                {message}
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="login-button"
                        >
                            {isLoading ? 'กำลังประมวลผล...' : 'เข้าสู่ระบบ'}
                        </button>

                        {/* Forgot Password Link */}
                        <button
                            type="button"
                            onClick={() => {
                                setCurrentPage('forgotPassword');
                                setMessage('');
                                setUserRole('');
                            }}
                            className="login-link-button"
                        >
                            ลืมรหัสผ่าน?
                        </button>

                        {/* Demo Credentials */}
                        <div className="login-demo-box">
                            <div className="login-demo-title">🔑 ทดสอบด้วย:</div>
                            <p>technician1 / 1234 (Technician)</p>
                            <p>super1 / 1234 (Supervisor)</p>
                            <p>admin1 / 1234 (Administrator)</p>
                        </div>
                    </form>
                )}

                {/* FORGOT PASSWORD FORM */}
                {currentPage === 'forgotPassword' && (
                    <form onSubmit={handleForgotPassword} className="login-form">
                        <h2 className="login-form-title">ลืมรหัสผ่าน</h2>

                        {/* Email */}
                        <div className="login-form-group last">
                            <label className="login-label">อีเมล</label>
                            <div className="login-input-wrapper">
                                <div className="login-icon">
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="กรอกอีเมลของคุณ"
                                    className="login-input"
                                />
                            </div>
                        </div>

                        {/* Message */}
                        {message && (
                            <div className={`login-message ${message.startsWith('✓') ? 'success' : 'error'}`}>
                                {message}
                            </div>
                        )}

                        {/* Send Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="login-button"
                        >
                            {isLoading ? 'กำลังส่ง...' : 'ส่งลิงก์รีเซ็ต'}
                        </button>

                        {/* Back Button */}
                        <button
                            type="button"
                            onClick={() => {
                                setCurrentPage('login');
                                setMessage('');
                                setFormData({ ...formData, email: '' });
                            }}
                            className="login-link-button"
                        >
                            ← กลับไปหน้าเข้าสู่ระบบ
                        </button>
                    </form>
                )}

                {/* RESET PASSWORD FORM */}
                {currentPage === 'resetPassword' && (
                    <form onSubmit={handleResetPassword} className="login-form">
                        <h2 className="login-form-title">เปลี่ยนรหัสผ่าน</h2>

                        {/* New Password */}
                        <div className="login-form-group">
                            <label className="login-label">รหัสผ่านใหม่</label>
                            <div className="login-input-wrapper">
                                <div className="login-icon">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    placeholder="กรอกรหัสผ่านใหม่"
                                    className="login-input"
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="login-form-group last">
                            <label className="login-label">ยืนยันรหัสผ่าน</label>
                            <div className="login-input-wrapper">
                                <div className="login-icon">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="กรอกรหัสผ่านอีกครั้ง"
                                    className="login-input"
                                />
                            </div>
                        </div>

                        {/* Message */}
                        {message && (
                            <div className={`login-message ${message.startsWith('✓') ? 'success' : 'error'}`}>
                                {message}
                            </div>
                        )}

                        {/* Reset Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="login-button"
                        >
                            {isLoading ? 'กำลังประมวลผล...' : 'เปลี่ยนรหัสผ่าน'}
                        </button>

                        {/* Back Button */}
                        <button
                            type="button"
                            onClick={() => {
                                setCurrentPage('login');
                                setMessage('');
                                setFormData({ ...formData, newPassword: '', confirmPassword: '' });
                            }}
                            className="login-link-button"
                        >
                            ← กลับไปหน้าเข้าสู่ระบบ
                        </button>
                    </form>
                )}

                {/* FOOTER */}
                <p className="login-footer">
                    © 2024 Technician Management System
                </p>
            </div>
        </div>
    );
}