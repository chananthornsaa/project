// ========================================
// Dashboard.jsx - Main Router
// (UPDATED: ปรับปรุงสิทธิ์การเข้าถึงหน้ารายงานสรุป)
// ========================================
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/Sidebar';
import './Dashboard.css';

// Import Pages
import AdminDashboard from './AdminDashboard';
import SupervisorDashboard from './SupervisorDashboard';
import TechnicianDashboard from '../Technician/TechnicianDashboard';
import TechnicianSettings from '../Technician/TechnicianSettings';
import AdminSettings from '../Admin/AdminSettings';
import SupervisorSettings from '../Supervisor/SupervisorSettings';
import JobManagement from '../Admin/JobManagement';
import TechnicianManagement from '../Admin/TechnicianManagement';
import ReportManagement from '../Admin/ReportManagement';
import Checkwork from '../Supervisor/Checkwork.jsx';

// Import mock data
import mockData from '../../data/Techsample.jsx';
const { sampleJobs } = mockData;

function Dashboard({ jobs, setJobs, pendingJobsCount, assignJob: assignJobFromParent, approveJob, rejectJob, activityLog = [], addActivity }) {
  const location = useLocation();
  const userRole = location.state?.userRole || 'admin';
  const username = location.state?.username || 'admin1';
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Map username ไปหาข้อมูลช่างจริง
  const technicianMap = {
    'technician1': { id: 'tech1', name: 'สมชาย ใจดี', phone: '081-234-5678', email: 'somchai@example.com', department: 'ช่างไฟฟ้า' },
  };
  
  const currentTechnician = technicianMap[username] || { id: 'tech1', name: 'สมชาย ใจดี' };

  console.log('🏠 Dashboard re-rendered, jobs count:', jobs.length);
  const j004 = jobs.find(j => j.id === 'J004');
  console.log('🏠 J004 state:', j004 ? { dept: j004.department, tech: j004.technician, status: j004.status } : 'not found');

  const handlePageChange = (page) => setCurrentPage(page);

  // ✅ ฟังก์ชันมอบหมายงาน (ใช้จาก props หรือสร้างใหม่ถ้าไม่มี)
  const assignJob = assignJobFromParent || ((jobId, technicianName) => {
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === jobId 
          ? { ...job, technician: technicianName, status: 'กำลังดำเนินการ' } 
          : job
      )
    );
  });

  // นับงานรอตรวจสอบ (ใช้จาก props ถ้ามี ไม่งั้นคำนวณใหม่)
  const finalPendingJobsCount = pendingJobsCount !== undefined ? pendingJobsCount : jobs.filter(job => job.status === 'รอตรวจสอบ').length;

  // นับงานรอมอบหมายสำหรับ Supervisor (งานที่ Admin ส่งมาแล้ว แต่ยังไม่ได้มอบหมายช่าง)
  const pendingAssignJobsCount = jobs.filter(job => 
    job.department === 'ช่างไฟฟ้า' &&
    job.status === 'รอดำเนินการ' &&
    (!job.technician || job.technician === 'ไม่มีช่าง')
  ).length;

  // นับงานสำหรับ Technician
  const technicianJobs = jobs.filter(job => 
    job.technicianId === currentTechnician.id ||
    job.technician === currentTechnician.name
  );
  
  const newJobsCount = technicianJobs.filter(job => 
    job.status === 'รอดำเนินการ' && !job.rejected
  ).length;
  
  const rejectedJobsCount = technicianJobs.filter(job => 
    job.status === 'รอดำเนินการ' && job.rejected === true
  ).length;

  // นับงานสำหรับ Admin
  const unassignedJobsCount = jobs.filter(job => 
    (!job.department || job.department === 'แผนกอื่น') &&
    job.status === 'รอดำเนินการ'
  ).length;
  
  const completedJobsCount = jobs.filter(job => 
    job.status === 'เสร็จสิ้น'
  ).length;

  const renderContent = () => {
    switch(currentPage) {
        case 'dashboard':
            if (userRole === 'admin') return <AdminDashboard jobs={jobs} handlePageChange={handlePageChange} activityLog={activityLog} />;
            
            if (userRole === 'supervisor') {
                return (
                    <SupervisorDashboard 
                        jobs={jobs}
                        assignJob={assignJob}
                        pendingJobsCount={finalPendingJobsCount}
                        handlePageChange={handlePageChange} 
                    />
                );
            }
            
            if (userRole === 'technician') {
                return (
                    <TechnicianDashboard 
                        jobs={jobs}
                        setJobs={setJobs}
                        currentTechnician={currentTechnician}
                        updateJobStatus={(jobId, newStatus, reportData = {}) => {
                            console.log(`🔄 Updating job ${jobId} to status: ${newStatus}`);
                            setJobs(prevJobs => 
                                prevJobs.map(job => {
                                    if (job.id === jobId) {
                                        return {
                                            ...job, 
                                            status: newStatus,
                                            technicianReport: reportData.comment || job.technicianReport,
                                            reportImages: reportData.images || job.reportImages,
                                            reportedAt: newStatus === 'รอตรวจสอบ' ? new Date().toISOString() : job.reportedAt
                                        };
                                    }
                                    return job;
                                })
                            );
                        }}
                        acceptJob={(jobId) => {
                            console.log(`✅ Technician accepting job ${jobId}`);
                            setJobs(prevJobs => 
                                prevJobs.map(job => 
                                    job.id === jobId ? { 
                                        ...job, 
                                        status: 'กำลังดำเนินการ',
                                        rejected: false,
                                        rejectionReason: null
                                    } : job
                                )
                            );
                        }}
                    />
                );
            }
            
            return <div>Unauthorized</div>;
        
        case 'jobs': 
            // Admin: เห็นหน้าจัดการงานตัวเต็ม (JobManagement)
            if (userRole === 'admin') {
                return <JobManagement jobs={jobs} setJobs={setJobs} addActivity={addActivity} />;
            } 
            // Supervisor: เห็นหน้า Placeholder (ไว้สำหรับจัดการใบงาน)
            if (userRole === 'supervisor') {
                return (
                    <div className="page-content">
                        <h2>📋 จัดการใบงาน (หัวหน้าช่าง)</h2>
                        <p>พื้นที่สำหรับจัดการใบงานในส่วนของหัวหน้าช่าง (รอการออกแบบ)</p>
                    </div>
                );
            }
            // Technician: ไม่มีสิทธิ์เข้าถึง
            return <div>Unauthorized</div>;

        case 'technicians': 
             if (userRole === 'admin') return <TechnicianManagement />;
             return <div>Unauthorized</div>;

        case 'reports': 
             // Admin: เห็นหน้ารายงานตัวเต็ม
             if (userRole === 'admin') {
                return <ReportManagement />; 
             }
             // Supervisor: เห็นหน้า Placeholder (ไว้สำหรับดูรายงาน)
             if (userRole === 'supervisor') {
                return (
                    <div className="page-content">
                        <h2>📈 รายงานสรุป (หัวหน้าช่าง)</h2>
                        <p>พื้นที่สำหรับดูรายงานสรุปในส่วนของหัวหน้าช่าง (รอการออกแบบ)</p>
                    </div>
                );
             }
             return <div>Unauthorized</div>;

        case 'settings': 
            if (userRole === 'technician') {
                return <TechnicianSettings currentTechnician={currentTechnician} />;
            }
            if (userRole === 'supervisor') {
                const currentSupervisor = {
                    id: 'sup1',
                    name: 'หัวหน้างาน',
                    phone: '081-234-5678',
                    email: 'supervisor@example.com',
                    department: 'แผนกไฟฟ้า'
                };
                return <SupervisorSettings currentSupervisor={currentSupervisor} />;
            }
            if (userRole === 'admin') {
                const currentAdmin = {
                    id: 'admin1',
                    name: 'ผู้ดูแลระบบ',
                    phone: '082-345-6789',
                    email: 'admin@example.com'
                };
                return <AdminSettings currentAdmin={currentAdmin} />;
            }
            return <div className="page-content"><h2>⚙️ ตั้งค่า</h2><p>หน้าตั้งค่าระบบ</p></div>;
        
        case 'review':
             if (userRole === 'supervisor') {
                return <Checkwork 
                  pendingJobs={jobs}
                  jobs={jobs}
                  setJobs={setJobs}
                  approveJob={(jobId) => {
                    console.log(`✅ Supervisor approving job ${jobId}`);
                    setJobs(prevJobs => 
                      prevJobs.map(job => 
                        job.id === jobId ? { 
                          ...job, 
                          status: 'เสร็จสิ้น',
                          approvedAt: new Date().toISOString(),
                          approvedBy: 'หัวหน้าช่าง'
                        } : job
                      )
                    );
                  }} 
                  rejectJob={(jobId, reason) => {
                    console.log(`⚠️ Supervisor rejecting job ${jobId}`, reason);
                    setJobs(prevJobs => 
                      prevJobs.map(job => 
                        job.id === jobId ? { 
                          ...job, 
                          status: 'รอดำเนินการ',
                          rejected: true,
                          rejectionReason: reason,
                          rejectedAt: new Date().toISOString()
                        } : job
                      )
                    );
                  }} 
                  pendingJobsCount={finalPendingJobsCount}
                />;
             }
             return <div>Unauthorized</div>;

        default: 
            return <div className="page-content"><h2>404 Not Found</h2></div>;
    }
  };

  return (
    <div className="app-container">
      <Navbar 
        userRole={userRole} 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        sidebarOpen={sidebarOpen}
        pendingJobsCount={userRole === 'supervisor' ? finalPendingJobsCount : 0}
        pendingAssignJobsCount={userRole === 'supervisor' ? pendingAssignJobsCount : 0}
        newJobsCount={userRole === 'technician' ? newJobsCount : 0}
        rejectedJobsCount={userRole === 'technician' ? rejectedJobsCount : 0}
        unassignedJobsCount={userRole === 'admin' ? unassignedJobsCount : 0}
        completedJobsCount={userRole === 'admin' ? completedJobsCount : 0}
      />
      <div className="main-layout">
        {sidebarOpen && <Sidebar userRole={userRole} currentPage={currentPage} onPageChange={handlePageChange} />}
        <div className="content-area">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;