// src/pages/JobManagement.jsx
import { useState, useEffect } from 'react'
import {
  Container, Row, Col, Card, Badge, Button,
  InputGroup, Form, Dropdown, Pagination
} from 'react-bootstrap'
import Sidebar from '../components/Layout/Sidebar'
import { loadActiveJobs, saveActiveJobs } from '../data/storage'
import { technicians } from '../data/technicians'

const ITEMS_PER_PAGE = 9   // แสดง 9 ตัวพอดี = 3x3

export default function JobManagement() {
  const [jobs, setJobs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const loaded = loadActiveJobs()
    setJobs(loaded.length > 0 ? loaded : [])
  }, [])

  useEffect(() => {
    if (jobs.length > 0) saveActiveJobs(jobs)
  }, [jobs])

  // กรองงาน
  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      (job.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'all' || job.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentJobs = filteredJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // สร้างเลขหน้า (แสดงสูงสุด 5 หน้า เพื่อไม่ยาวเกินไป)
  const getPaginationItems = () => {
    const items = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - 2)
    let end = Math.min(totalPages, start + maxVisible - 1)
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1)

    for (let i = start; i <= end; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Pagination.Item>
      )
    }
    return items
  }

  const handleAssign = (jobId, technician) => {
    setJobs(prev => prev.map(job =>
      job.id === jobId
        ? { ...job, assigneeId: technician.id, assigneeName: technician.name, status: 'inprogress' }
        : job
    ))
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'urgent': return { text: 'ด่วน!', bg: 'danger' }
      case 'inprogress': return { text: 'กำลังดำเนินการ', bg: 'warning' }
      default: return { text: 'รอดำเนินการ', bg: 'secondary' }
    }
  }

  return (
    <>
      <Sidebar />
      <div style={{ marginLeft: '280px', padding: '2rem', background: '#f8f9fa', minHeight: '100vh' }}>
        <Container fluid>

          {/* Header */}
          <Row className="align-items-center mb-4">
            <Col>
              <h1 className="fw-bold text-primary mb-1">จัดการงานทั้งหมด</h1>
              <p className="text-muted">
                ทั้งหมด <strong>{jobs.length}</strong> รายการ • 
                แสดง <strong>{filteredJobs.length}</strong> รายการ
              </p>
            </Col>
          </Row>

          {/* Search & Filter */}
          <Row className="mb-4 g-3">
            <Col lg={5}>
              <InputGroup>
                <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
                <Form.Control
                  placeholder="ค้นหาชื่องาน, รหัส, สถานที่..."
                  value={searchTerm}
                  onChange={e => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </InputGroup>
            </Col>
            <Col lg={4}>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" className="w-100">
                  {filterStatus === 'all' ? 'ทุกสถานะ' :
                   filterStatus === 'urgent' ? 'ด่วน!' :
                   filterStatus === 'inprogress' ? 'กำลังดำเนินการ' : 'รอดำเนินการ'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => { setFilterStatus('all'); setCurrentPage(1) }}>ทุกสถานะ</Dropdown.Item>
                  <Dropdown.Item onClick={() => { setFilterStatus('urgent'); setCurrentPage(1) }}>ด่วน!</Dropdown.Item>
                  <Dropdown.Item onClick={() => { setFilterStatus('pending'); setCurrentPage(1) }}>รอดำเนินการ</Dropdown.Item>
                  <Dropdown.Item onClick={() => { setFilterStatus('inprogress'); setCurrentPage(1) }}>กำลังดำเนินการ</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>

          {/* Job Cards – แสดง 9 ตัวพอดี */}
          <Row className="g-4">
            {currentJobs.length === 0 ? (
              <Col>
                <Card className="text-center p-5 border-0 shadow-sm bg-white">
                  <i className="bi bi-emoji-smile display-1 text-success mb-4"></i>
                  <h4 className="text-success">ไม่พบงานที่ตรงกัน</h4>
                  <p className="text-muted">ลองเปลี่ยนคำค้นหาหรือตัวกรองดูครับ</p>
                </Card>
              </Col>
            ) : (
              currentJobs.map(job => {
                const status = getStatusBadge(job.status)
                return (
                  <Col md={6} lg={4} key={job.id}>
                    {/* md=6 → มือถือ 2 คอลัมน์, lg=4 → คอม 3 คอลัมน์พอดี */}
                    <Card className="h-100 shadow-sm border-0">
                      <Card.Body className="d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <Badge bg={status.bg} className="fs-6 px-3">{status.text}</Badge>
                          <small className="text-muted">#{job.id}</small>
                        </div>

                        <h5 className="fw-bold">{job.title}</h5>
                        <p className="text-muted small flex-grow-1">{job.description || 'ไม่มีรายละเอียด'}</p>

                        <div className="text-muted small mb-3">
                          <i className="bi bi-geo-alt-fill text-primary me-1"></i>{job.location}<br/>
                          <i className="bi bi-calendar3 me-1"></i>{job.createdAt || 'ไม่ระบุ'}
                        </div>

                        {job.assigneeName && (
                          <div className="alert alert-success py-2 small mb-3">
                            มอบหมายแล้ว: <strong>{job.assigneeName}</strong>
                          </div>
                        )}

                        <div className="mt-auto d-flex gap-2">
                          <Button variant="outline-primary" size="sm" className="flex-fill">
                            ดูรายละเอียด
                          </Button>

                          {!job.assigneeId && (
                            <Dropdown>
                              <Dropdown.Toggle variant="success" size="sm" className="flex-fill">
                                มอบหมายช่าง
                              </Dropdown.Toggle>
                              <Dropdown.Menu align="end">
                                {technicians
                                  .filter(t => t.dept === job.dept)
                                  .map(tech => (
                                    <Dropdown.Item
                                      key={tech.id}
                                      onClick={() => handleAssign(job.id, tech)}
                                    >
                                      <div className="d-flex justify-content-between">
                                        <span>{tech.name}</span>
                                        <Badge bg={tech.status === 'ว่าง' ? 'success' : 'secondary'} className="ms-2">
                                          {tech.status}
                                        </Badge>
                                      </div>
                                    </Dropdown.Item>
                                  ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                )
              })
            )}
          </Row>

          {/* Pagination – อยู่กึ่งกลาง */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-5">
              <Pagination>
                <Pagination.Prev
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                />
                {getPaginationItems()}
                <Pagination.Next
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}

          {/* แสดงสรุปหน้าปัจจุบัน */}
          {totalPages > 1 && (
            <div className="text-center text-muted mt-3">
              หน้าที่ <strong>{currentPage}</strong> จาก <strong>{totalPages}</strong> • 
              แสดง {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredJobs.length)} จาก {filteredJobs.length} รายการ
            </div>
          )}
        </Container>
      </div>
    </>
  )
}