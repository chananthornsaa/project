import { ListGroup, Dropdown, Image } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const location = useLocation()

  const menus = [
    { path: '/', label: 'Myjob ', icon: 'bi bi-grid', thai: 'หน้าหลัก' },
    { path: '/jobmanagement', label: 'Job Management', icon: 'bi bi-briefcase', thai: 'จัดการงาน' },
    { path: '/jobhistory', label: 'Job History', icon: 'bi bi-clock-history', thai: 'ประวัติงาน' }
  ]

  return (
    <div className="sidebar vh-100 position-fixed" style={{ width: '280px' }}>
      {/* Header */}
      <div className="p-4 border-bottom">
        <h4 className="fw-bold text-primary mb-1">Tech Job System</h4>
        <small className="text-muted">ระบบจัดการงานช่าง</small>
      </div>

      {/* Menu */}
      <ListGroup variant="flush" className="px-3">
        {menus.map(item => (
          <ListGroup.Item
            key={item.path}
            as={Link}
            to={item.path}
            action
            className={`border-0 rounded-3 my-2 ${
              location.pathname === item.path ? 'bg-primary text-white' : 'text-dark'
            }`}
          >
            <div className="d-flex align-items-center">
              <i className={`${item.icon} me-3 fs-5`}></i>
              <div>
                <div className="fw-bold small">{item.label}</div>
                <small className="opacity-75">{item.thai}</small>
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* User Profile */}
      <div className="position-absolute bottom-0 w-100 p-3 border-top">
        <div className="d-flex align-items-center">
          <Image src="https://via.placeholder.com/40" roundedCircle className="me-3" style={{ width: 40, height: 40 }} />
          <div>
            <div className="fw-bold small">สมชาย ใจดี</div>
            <small className="text-muted">ช่างแอร์</small>
          </div>
          <i className="bi bi-gear ms-auto text-muted"></i>
        </div>
      </div>
    </div>
  )
}