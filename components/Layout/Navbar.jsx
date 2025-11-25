import { Nav, Navbar, ListGroup } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const location = useLocation()

  return (
    <div className="bg-light border-end vh-100 position-fixed start-0 top-0" style={{ width: '300px' }}>
      <Navbar className="p-4 flex-column align-items-start">
        <div>
          <Navbar.Brand className="fw-bold fs-4">Tech Job System</Navbar.Brand>
          <small className="text-muted">ระบบจัดการงานช่าง</small>
        </div>
      </Navbar>

      <ListGroup variant="flush" className="w-100 px-3">
        <ListGroup.Item action as={Link} to="/" className={`rounded mb-2 ${location.pathname === '/' ? 'bg-primary text-white' : ''}`}>
          Myjob หน้าหลัก
        </ListGroup.Item>
        <ListGroup.Item action as={Link} to="/jobmanagement" className={`rounded mb-2 ${location.pathname === '/jobmanagement' ? 'bg-primary text-white' : ''}`}>
          Job Management จัดการงาน
        </ListGroup.Item>
        <ListGroup.Item action as={Link} to="/jobhistory" className={`rounded mb-2 ${location.pathname === '/jobhistory' ? 'bg-primary text-white' : ''}`}>
          Job History ประวัติงาน
        </ListGroup.Item>
      </ListGroup>

      <div className="position-absolute bottom-0 start-0 p-4 w-100">
        <div className="d-flex align-items-center">
          <div className="bg-primary rounded-circle me-3" style={{ width: 48, height: 48 }}></div>
          <div>
            <div className="fw-bold">สมชาย ใจดี</div>
            <small className="text-muted">ช่างเทคนิค - แผนกแอร์</small>
          </div>
        </div>
      </div>
    </div>
  )
}