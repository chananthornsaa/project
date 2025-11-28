// ========================================
// Checkwork.jsx - ฉบับพร้อมโหลด PDF ภาษาไทย
// ========================================

import React, { useState } from 'react';
import { CheckSquare, Download, Send, UserX, CheckCircle } from 'lucide-react';
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';

const MY_DEPARTMENT = 'ช่างไฟฟ้า';

const Checkwork = ({ pendingJobs = [], approveJob, rejectJob, jobs = [], setJobs = () => { } }) => {
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectComment, setRejectComment] = useState('');
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [returnToAdminModalOpen, setReturnToAdminModalOpen] = useState(false);
    const [returnToAdminComment, setReturnToAdminComment] = useState('');

    // กรองเฉพาะงานรอตรวจสอบของแผนกเรา
    const myPendingJobs = pendingJobs.filter(job =>
        job.department === MY_DEPARTMENT && job.status === 'รอตรวจสอบ'
    );

    // ==========================================
    // ฟังก์ชันโหลด PDF (รองรับไทย 100%)
    // ==========================================
    const downloadPDF = async (job) => {
        const input = document.getElementById(`job-card-${job.id}`); // อ้างอิง ID ของการ์ด

        if (!input) return alert("ไม่พบข้อมูลสำหรับการสร้าง PDF");

        try {
            // ใช้ html2canvas จับภาพส่วนการ์ดงาน
            const canvas = await html2canvas(input, {
                scale: 2, // เพิ่มความชัด
                useCORS: true, // อนุญาตให้ดึงรูปข้าม domain (เช่น picsum)
                logging: false,
                backgroundColor: '#ffffff' // พื้นหลังขาว
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            // คำนวณขนาดให้พอดี A4
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            // เพิ่มรูปการ์ดลง PDF
            pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
            
            // บันทึกไฟล์
            pdf.save(`${job.id}_รายงานแจ้งซ่อม.pdf`);

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("เกิดข้อผิดพลาดในการสร้าง PDF (อาจเกิดจากรูปภาพโหลดไม่ทัน)");
        }
    };

    // ==========================================
    // Helper Functions
    // ==========================================
    const openRejectModal = (jobId) => {
        setSelectedJobId(jobId);
        setRejectComment('');
        setRejectModalOpen(true);
    };

    const confirmReject = () => {
        if (!rejectComment.trim()) return alert('กรุณาระบุเหตุผล');
        rejectJob(selectedJobId, rejectComment);
        setRejectModalOpen(false);
    };

    const openReturnToAdminModal = (jobId) => {
        setSelectedJobId(jobId);
        setReturnToAdminComment('');
        setReturnToAdminModalOpen(true);
    };

    const confirmReturnToAdmin = () => {
        if (!returnToAdminComment.trim()) return alert('กรุณาระบุเหตุผล');
        const updatedJobs = jobs.map(job => {
            if (job.id === selectedJobId) {
                return { ...job, status: 'รออนุมัติ', technician: null, comment: returnToAdminComment };
            }
            return job;
        });
        setJobs(updatedJobs);
        setReturnToAdminModalOpen(false);
        alert(`ส่งงาน ${selectedJobId} กลับให้ Admin แล้ว`);
    };

    const getImageUrls = (job) => {
        if (job.imageUrls && job.imageUrls.length > 0) {
            return job.imageUrls;
        }
        const count = job.images || 0;
        if (count === 0) return [];
        return Array.from({ length: count }, (_, i) =>
            `https://picsum.photos/800/800?random=${job.id}-${i}`
        );
    };

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <CheckSquare size={28} color="#2563eb" />
                    <h1 style={{ margin: 0, fontSize: '32px', color: '#1f2937', fontWeight: 'bold' }}>ตรวจงาน</h1>
                </div>
                <p style={{ margin: '0', color: '#6b7280', fontSize: '16px' }}>แผนก {MY_DEPARTMENT} • รอตรวจสอบ {myPendingJobs.length} รายการ</p>
            </div>

            <div style={{ marginBottom: '24px', padding: '16px', background: '#dbeafe', borderRadius: '12px', color: '#1e40af', fontWeight: 'bold', textAlign: 'center', fontSize: '18px' }}>
                กำลังแสดงงานรอตรวจสอบของแผนก: {MY_DEPARTMENT}
            </div>

            {myPendingJobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px 20px', color: '#6b7280' }}>
                    <CheckCircle size={90} color="#10b981" style={{ marginBottom: '24px' }} />
                    <h2 style={{ color: '#10b981' }}>ไม่มีงานรอตรวจสอบ</h2>
                    <p style={{ fontSize: '18px' }}>เยี่ยมมาก! ทุกงานได้รับการตรวจสอบเรียบร้อยแล้ว</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(520px, 1fr))', gap: '28px' }}>
                    {myPendingJobs.map(job => {
                        const imageUrls = getImageUrls(job);
                        const imageCount = imageUrls.length;

                        return (
                            // ✅ เพิ่ม ID เพื่อให้อ้างอิงตอน Print PDF ได้
                            <div 
                                id={`job-card-${job.id}`} 
                                key={job.id} 
                                style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#1f2937' }}>
                                            {job.id} - {job.name}
                                        </h3>
                                        <p style={{ margin: '8px 0 0', color: '#6b7280' }}>ส่งเมื่อ: {job.sentAt || '-'}</p>
                                    </div>
                                    <span style={{ padding: '8px 16px', background: '#fef08a', color: '#713f12', borderRadius: '999px', fontWeight: 'bold', fontSize: '14px' }}>
                                        รอตรวจสอบ
                                    </span>
                                </div>

                                <div style={{ marginBottom: '24px', lineHeight: '1.8', color: '#374151' }}>
                                    <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
                                        <p><strong>ช่างผู้ดำเนินการ:</strong> {job.technician}</p>
                                        <p><strong>แผนก:</strong> {job.department}</p>
                                        <p><strong>ความสำคัญ:</strong> <span style={{ color: job.priority === 'สูง' ? '#dc2626' : job.priority === 'ปานกลาง' ? '#f59e0b' : '#10b981', fontWeight: 'bold' }}>{job.priority || '-'}</span></p>
                                        <p><strong>ประเภทงาน:</strong> {job.jobType || '-'}</p>
                                        <p><strong>วันที่รับงาน:</strong> {job.date || '-'}</p>
                                        <p><strong>สถานที่:</strong> {job.location || '-'}</p>
                                    </div>
                                    {job.detail && (
                                        <div style={{ marginBottom: '16px', padding: '16px', background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                                            <p style={{ margin: 0, fontWeight: 'bold', color: '#1e40af', marginBottom: '8px' }}>📋 รายละเอียดงาน:</p>
                                            <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{job.detail}</p>
                                        </div>
                                    )}
                                    {(job.customerName || job.phone || job.email) && (
                                        <div style={{ marginBottom: '16px', padding: '16px', background: '#fef3c7', borderRadius: '12px', border: '1px solid #fde68a' }}>
                                            <p style={{ margin: 0, fontWeight: 'bold', color: '#92400e', marginBottom: '8px' }}>👤 ข้อมูลผู้ติดต่อ:</p>
                                            {job.customerName && <p style={{ margin: '4px 0' }}><strong>ชื่อ:</strong> {job.customerName}</p>}
                                            {job.phone && <p style={{ margin: '4px 0' }}><strong>เบอร์โทร:</strong> {job.phone}</p>}
                                            {job.email && <p style={{ margin: '4px 0' }}><strong>อีเมล:</strong> {job.email}</p>}
                                        </div>
                                    )}
                                    {job.note && (
                                        <div style={{ marginBottom: '16px', padding: '16px', background: '#fef9e7', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
                                            <p style={{ margin: 0, fontWeight: 'bold', color: '#92400e', marginBottom: '8px' }}>📝 หมายเหตุ:</p>
                                            <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{job.note}</p>
                                        </div>
                                    )}
                                    {job.technicianReport && (
                                        <div style={{ marginTop: '12px', padding: '16px', background: '#f0fdf4', borderLeft: '4px solid #10b981', borderRadius: '12px' }}>
                                            <p style={{ margin: 0, fontWeight: 'bold', color: '#065f46', marginBottom: '8px' }}>✅ รายงานจากช่าง:</p>
                                            <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{job.technicianReport}</p>
                                        </div>
                                    )}
                                </div>

                                {/* แสดงรูปที่ช่างอัพโหลด */}
                                {job.reportImages && job.reportImages.length > 0 && (
                                    <div style={{ margin: '20px 0' }}>
                                        <p style={{ fontWeight: 'bold', marginBottom: '12px', color: '#1f2937' }}>📸 รูปภาพจากช่าง ({job.reportImages.length})</p>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', maxWidth: '600px' }}>
                                            {job.reportImages.map((url, i) => (
                                                <div key={i} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer' }} onClick={() => window.open(url, '_blank')}>
                                                    <img 
                                                        src={url} 
                                                        alt={`รูปที่ ${i + 1}`} 
                                                        crossOrigin="anonymous"
                                                        style={{ width: '100%', height: '120px', objectFit: 'cover' }} 
                                                    />
                                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', color: 'white', padding: '12px 4px 4px', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                                                        รูปที่ {i + 1}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* รูปตัวอย่างเก่า (ถ้ามี) */}
                                {imageCount > 0 && (
                                    <div style={{ margin: '20px 0' }}>
                                        <p style={{ fontWeight: 'bold', marginBottom: '12px', color: '#1f2937' }}>รูปที่ช่างส่งมา</p>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', maxWidth: '600px' }}>
                                            {imageUrls.map((url, i) => (
                                                <div key={i} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer' }} onClick={() => window.open(url, '_blank')}>
                                                    {/* crossOrigin="anonymous" สำคัญมากสำหรับการโหลดรูปไปทำ PDF */}
                                                    <img 
                                                        src={url} 
                                                        alt={`รูปที่ ${i + 1}`} 
                                                        crossOrigin="anonymous"
                                                        style={{ width: '100%', height: '120px', objectFit: 'cover' }} 
                                                    />
                                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', color: 'white', padding: '12px 4px 4px', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                                                        รูปที่ {i + 1}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ✅ ใส่ attribute data-html2canvas-ignore เพื่อไม่ให้ปุ่มติดไปใน PDF */}
                                <div data-html2canvas-ignore="true" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
                                    <button onClick={() => approveJob(job.id)}
                                        style={{ flex: '1 1 200px', padding: '14px', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <CheckCircle size={20} /> อนุมัติงานเสร็จ
                                    </button>

                                    <button onClick={() => openRejectModal(job.id)}
                                        style={{ flex: '1 1 180px', padding: '14px', background: '#f97316', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <UserX size={20} /> ตีกลับแก้ไข
                                    </button>

                                    <button onClick={() => openReturnToAdminModal(job.id)}
                                        style={{ padding: '14px 20px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <Send size={18} /> ส่งกลับ Admin
                                    </button>

                                    <button onClick={() => downloadPDF(job)}
                                        style={{ padding: '14px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <Download size={18} /> PDF
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modals ... (ส่วน Modal ตีกลับงานเหมือนเดิม ไม่ได้เปลี่ยนแปลง) */}
            {rejectModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={() => setRejectModalOpen(false)}>
                    <div style={{ background: 'white', padding: '32px', borderRadius: '20px', width: '90%', maxWidth: '520px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ margin: '0 0 20px', color: '#f97316', fontSize: '24px', fontWeight: 'bold' }}>ตีกลับงาน {selectedJobId}</h3>
                        <p style={{ marginBottom: '20px', color: '#374151', fontSize: '16px' }}>กรุณาระบุเหตุผลให้ช่างทราบ</p>
                        <textarea value={rejectComment} onChange={e => setRejectComment(e.target.value)} style={{ width: '100%', minHeight: '140px', padding: '16px', borderRadius: '12px', border: '2px solid #e5e7eb', fontSize: '16px' }} placeholder="เช่น ท่อน้ำยังรั่วอยู่, เก็บสายไฟไม่เรียบร้อย" />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '24px' }}>
                            <button onClick={() => setRejectModalOpen(false)} style={{ padding: '12px 28px', background: '#e5e7eb', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>ยกเลิก</button>
                            <button onClick={confirmReject} style={{ padding: '12px 32px', background: '#f97316', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>ส่งกลับให้ช่าง</button>
                        </div>
                    </div>
                </div>
            )}

            {returnToAdminModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={() => setReturnToAdminModalOpen(false)}>
                    <div style={{ background: 'white', padding: '32px', borderRadius: '20px', width: '90%', maxWidth: '540px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ margin: '0 0 20px', color: '#dc2626', fontSize: '24px', fontWeight: 'bold' }}>ส่งกลับให้ Admin แก้ไข</h3>
                        <p style={{ marginBottom: '20px', color: '#374151', fontSize: '16px' }}>กรุณาระบุปัญหาที่พบในข้อมูลใบงาน</p>
                        <textarea value={returnToAdminComment} onChange={e => setReturnToAdminComment(e.target.value)} placeholder="เช่น ชื่อลูกค้าผิด, รหัสงานซ้ำ" style={{ width: '100%', minHeight: '160px', padding: '16px', borderRadius: '12px', border: '2px solid #e5e7eb', fontSize: '16px' }} />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '24px' }}>
                            <button onClick={() => setReturnToAdminModalOpen(false)} style={{ padding: '12px 28px', background: '#e5e7eb', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>ยกเลิก</button>
                            <button onClick={confirmReturnToAdmin} style={{ padding: '12px 32px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>ส่งให้ Admin</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkwork;