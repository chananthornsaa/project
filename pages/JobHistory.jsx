// src/pages/JobHistory.jsx
import { useState, useEffect } from 'react'
import {
  Container, Row, Col, Card, Badge, Button,
  Form, InputGroup, Dropdown, Modal, Carousel, Alert
} from 'react-bootstrap'
import Sidebar from '../components/Layout/Sidebar'
import { loadCompletedJobs } from '../data/storage'

export default function JobHistory() {
  const [completedJobs, setCompletedJobs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDept, setFilterDept] = useState('all')
  const [filterMonth, setFilterMonth] = useState('all')
  const [selectedJob, setSelectedJob] = useState(null)
  const [showImageModal, setShowImageModal] = useState(false)

  useEffect(() => {
    const jobs = loadCompletedJobs()
    setCompletedJobs(jobs)
  }, [])

  // คำนวณสถิติ
  const stats = {
    total: completedJobs.length,
    thisMonth: completedJobs.filter(j => {
      const jobMonth = j.completedAt.split('/')[1]
      const currentMonth = new Date().toLocaleDateString('th-TH', { month: 'numeric' })
      return jobMonth === currentMonth
    }).length,
    avgRating: completedJobs.length > 0
      ? (completedJobs.reduce((acc, j) => acc + (j.rating || 5), 0) / completedJobs.length).toFixed(1)
      : 0,
    topTechnician: (() => {
      const count = {}
      completedJobs.forEach(j => {
        const name = j.assigneeName || 'ไม่ระบุ'
        count[name] = (count[name] || 0) + 1
      })
      return Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] || '-'
    })()
  }

  // กรองงาน
  const filteredJobs = completedJobs.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.report.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.id.includes(searchTerm)

    const matchesDept = filterDept === 'all' || job.dept === filterDept
    const matchesMonth = filterMonth === 'all' || job.completedAt.includes(filterMonth)

    return matchesSearch && matchesDept && matchesMonth
  })

  const openImageModal = (job) => {
    setSelectedJob(job)
    setShowImageModal(true)
  }

  return (
    <>
      <Sidebar />
      <div style={{ marginLeft: '280px', background: '#f4f6f9', minHeight: '100vh', padding: '2rem' }}>
        <Container fluid>

          {/* Header */}
          <Row className="mb-4">
            <Col>
              <h1 className="fw-bold text-primary mb-1">ประวัติงานที่เสร็จแล้ว</h1>
              <p className="text-muted">ติดตามผลงานช่าง • ดูรูปก่อน-หลัง • สถิติประจำเดือน</p>
            </Col>
          </Row>

          {/* Stats Cards */}
          <Row className="g-4 mb-5">
            <Col md={3}>
              <Card className="border-0 shadow-sm text-center p-4 bg-white">
                <i className="bi bi-check-circle-fill text-success fs-1 mb-3"></i>
                <h3 className="fw-bold text-success">{stats.total}</h3>
                <small className="text-muted">งานเสร็จทั้งหมด</small>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm text-center p-4 bg-white">
                <i className="bi bi-calendar-check text-primary fs-1 mb-3"></i>
                <h3 className="fw-bold text-primary">{stats.thisMonth}</h3>
                <small className="text-muted">งานเดือนนี้</small>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm text-center p-4 bg-white">
                <i className="bi bi-star-fill text-warning fs-1 mb-3"></i>
                <h3 className="fw-bold text-warning">{stats.avgRating} / 5.0</h3>
                <small className="text-muted">คะแนนเฉลี่ย</small>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm text-center p-4 bg-white">
                <i className="bi bi-trophy-fill text-info fs-1 mb-3"></i>
                <h3 className="fw-bold text-info">{stats.topTechnician}</h3>
                <small className="text-muted">ช่างยอดเยี่ยม</small>
              </Card>
            </Col>
          </Row>

          {/* Filters */}
          <Row className="mb-4 g-3 align-items-center">
            <Col md={5}>
              <InputGroup>
                <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
                <Form.Control
                  placeholder="ค้นหาชื่องาน, สถานที่, รายงาน, รหัสงาน..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" className="w-100">
                  แผนก: {filterDept === 'all' ? 'ทั้งหมด' : filterDept}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setFilterDept('all')}>ทุกแผนก</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterDept('แอร์')}>แอร์</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterDept('ไฟฟ้า')}>ไฟฟ้า</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterDept('ประปา')}>ประปา</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterDept('IT')}>IT</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col md={3}>
              <Form.Select value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
                <option value="all">ทุกเดือน</option>
                <option value="01">มกราคม</option>
                <option value="02">กุมภาพันธ์</option>
                <option value="03">มีนาคม</option>
                <option value="04">เมษายน</option>
                <option value="05">พฤษภาคม</option>
                <option value="06">มิถุนายน</option>
                <option value="07">กรกฎาคม</option>
                <option value="08">สิงหาคม</option>
                <option value="09">กันยายน</option>
                <option value="10">ตุลาคม</option>
                <option value="11">พฤศจิกายน</option>
                <option value="12">ธันวาคม</option>
              </Form.Select>
            </Col>
          </Row>

          {/* Job List */}
          {filteredJobs.length === 0 ? (
            <Alert variant="light" className="text-center py-5">
              <i className="bi bi-emoji-neutral display-1 text-muted"></i>
              <h4 className="mt-3">ไม่พบประวัติงานที่ตรงกัน</h4>
            </Alert>
          ) : (
            <Row className="g-4">
              {filteredJobs.map(job => (
                <Col lg={6} xl={4} key={job.id}>
                  <Card className="h-100 shadow-sm border-0 overflow-hidden">
                    <Card.Header className="bg-success text-white py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <Badge bg="light" text="dark" className="me-2">เสร็จแล้ว</Badge>
                          <strong>#{job.id}</strong>
                        </div>
                        <small>{job.completedAt}</small>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <h5 className="fw-bold text-primary">{job.title}</h5>
                      <div className="text-muted small mb-3">
                        <i className="bi bi-geo-alt-fill me-1"></i>{job.location}<br/>
                        <i className="bi bi-person-fill me-1"></i>โดย {job.assigneeName || 'ไม่ระบุ'}
                      </div>

                      <div className="bg-light rounded p-3 mb-3">
                        <strong className="text-success">รายงานจากช่าง:</strong>
                        <p className="mt-2 mb-0 small text-dark">{job.report || 'ไม่มีรายงาน'}</p>
                      </div>

                      {job.images && job.images.length > 0 && (
                        <div className="text-center">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => openImageModal(job)}
                          >
                            <i className="bi bi-images me-1"></i>
                            ดูรูปก่อน-หลัง ({job.images.length} รูป)
                          </Button>
                        </div>
                      )}

                      <div className="mt-3 text-warning">
                        ★★★★★ <small className="text-muted">(5.0)</small>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </div>

      {/* Modal แสดงรูปภาพ */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} size="xl" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <i className="bi bi-images me-2"></i>
            รูปภาพงาน: #{selectedJob?.id} {selectedJob?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark">
          {selectedJob?.images && selectedJob.images.length > 0 ? (
            <Carousel indicators={false} interval={null}>
              {selectedJob.images.map((src, i) => (
                <Carousel.Item key={i}>
                  <img
                    src={src}
                    alt={`รูปที่ ${i + 1}`}
                    className="d-block w-100 rounded"
                    style={{ maxHeight: '70vh', objectFit: 'contain' }}
                  />
                  <Carousel.Caption className="bg-dark bg-opacity-75 rounded">
                    <p>รูปที่ {i + 1} จาก {selectedJob.images.length}</p>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <div className="text-center py-5 text-white">
              <i className="bi bi-image fs-1"></i>
              <p>ไม่มีรูปภาพ</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}