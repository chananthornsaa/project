// src/pages/MyJobs.jsx
import { useState, useEffect } from 'react'
import { Container, Card, Badge, Button, Row, Col, Modal, Form, Alert } from 'react-bootstrap'
import Sidebar from '../components/Layout/Sidebar'
import { loadActiveJobs, saveActiveJobs, loadCompletedJobs, saveCompletedJobs } from '../data/storage'

export default function MyJobs() {
  const [activeJobs, setActiveJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [detailModal, setDetailModal] = useState(false)
  const [completeModal, setCompleteModal] = useState(false)
  const [report, setReport] = useState('')
  const [imagePreviews, setImagePreviews] = useState([])

  const technicianId = 1
  const technicianName = "สมชาย ใจดี"

  useEffect(() => {
    const active = loadActiveJobs()
    if (active.length === 0) {
      // ถ้ายังไม่มีข้อมูล ให้เริ่มจาก jobs.js แล้วบันทึก
      import('../data/jobs').then(module => {
        const initial = module.jobs.map(job => ({
          ...job,
          receivedAt: job.assigneeId === technicianId ? new Date().toLocaleString('th-TH') : null
        }))
        setActiveJobs(initial)
        saveActiveJobs(initial)
      })
    } else {
      setActiveJobs(active)
    }
  }, [])

  useEffect(() => {
    if (activeJobs.length > 0) saveActiveJobs(activeJobs)
  }, [activeJobs])

  // รับงาน
  const handleAcceptJob = (job) => {
    const updated = {
      ...job,
      assigneeId: technicianId,
      assigneeName: technicianName,
      status: 'inprogress',
      receivedAt: new Date().toLocaleString('th-TH') // เพิ่มเวลารับงาน
    }
    setActiveJobs(prev => prev.map(j => j.id === job.id ? updated : j))
    alert(`รับงาน "${job.title}" แล้ว!`)
  }

  // เปิด Modal เสร็จงาน
  const handleOpenComplete = (job) => {
    setSelectedJob(job)
    setReport('')
    setImagePreviews([])
    setCompleteModal(true)
  }

  // ส่งงานเสร็จ
  const handleCompleteJob = () => {
    if (!report.trim()) {
      alert('กรุณากรอกรายงานผลการซ่อม')
      return
    }

    const completedJob = {
      ...selectedJob,
      status: 'completed',
      completedAt: new Date().toLocaleDateString('th-TH'),
      report,
      images: imagePreviews.length > 0 ? imagePreviews : (selectedJob.images || [])
    }

    const currentCompleted = loadCompletedJobs()
    saveCompletedJobs([...currentCompleted, completedJob])
    setActiveJobs(prev => prev.filter(j => j.id !== selectedJob.id))

    setCompleteModal(false)
    alert('ส่งงานเสร็จเรียบร้อย!')
  }

  // งานของฉัน (รับแล้ว + ยังไม่รับแต่เป็นแผนกแอร์)
  const myJobs = activeJobs.filter(j =>
    j.assigneeId === technicianId || (!j.assigneeId && j.dept === "แอร์")
  )

  // คำนวณเวลานับถอยหลัง (ถ้าเป็นงานด่วน)
  const getDueTime = (job) => {
    if (job.status !== 'urgent') return null
    const received = new Date(job.receivedAt || new Date())
    const due = new Date(received.getTime() + 2 * 60 * 60 * 1000) // 2 ชั่วโมง
    const diff = due - new Date()
    if (diff <= 0) return { text: "เกินกำหนด!", color: "danger" }
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return { 
      text: `เหลือ ${hours} ชม. ${minutes} นาที`, 
      color: hours === 0 ? "danger" : "warning" 
    }
  }

  return (
    <>
      <Sidebar />
      <div style={{ marginLeft: '280px', background: '#f4f6f9', minHeight: '100vh', padding: '2rem' }}>
        <Container fluid>
          <div className="bg-white rounded-4 shadow-sm p-4 mb-5">
            <h2 className="fw-bold text-primary mb-2">งานของฉัน</h2>
            <p className="text-muted mb-0">
              สวัสดี {technicianName} • มีงานทั้งหมด <strong className="text-primary">{myJobs.length}</strong> รายการ
            </p>
          </div>

          <Row className="g-4">
            {myJobs.length === 0 ? (
              <Col md={8} className="mx-auto">
                <Card className="text-center p-5 border-0 shadow">
                  <i className="bi bi-emoji-smile display-1 text-success mb-4"></i>
                  <h3 className="text-success">ไม่มีงานค้าง!</h3>
                  <p className="text-muted">คุณเคลียร์งานทั้งหมดแล้ว</p>
                </Card>
              </Col>
            ) : (
              myJobs.map(job => {
                const isAccepted = job.assigneeId === technicianId
                const due = getDueTime(job)
                return (
                  <Col md={6} lg={4} key={job.id}>
                    <Card className="h-100 shadow-sm border-0 position-relative overflow-hidden">
                      {/* Badge สถานะด้านบน */}
                      <div className={`text-white text-center py-2 fw-bold fs-6 ${
                        job.status === 'urgent' ? 'bg-danger' :
                        job.status === 'inprogress' ? 'bg-warning' : 'bg-secondary'
                      }`}>
                        {job.status === 'urgent' ? 'ด่วนที่สุด!' :
                         job.status === 'inprogress' ? 'กำลังดำเนินการ' : 'รอดำเนินการ'}
                      </div>

                      <Card.Body className="p-4">
                        {/* ด่วน → แสดงนับถอยหลัง */}
                        {due && (
                          <Alert variant={due.color} className="py-2 px-3 small mb-3 text-center">
                            <i className="bi bi-clock-history me-1"></i>
                            <strong>{due.text}</strong>
                          </Alert>
                        )}

                        <h5 className="fw-bold text-dark">{job.title}</h5>
                        <p className="text-muted small">{job.description || 'ไม่มีรายละเอียด'}</p>

                        <div className="text-muted small mb-3">
                          <div><i className="bi bi-geo-alt-fill text-primary me-1"></i>{job.location}</div>
                          <div><i className="bi bi-calendar3 me-1"></i>{job.createdAt}</div>
                          {isAccepted && job.receivedAt && (
                            <div className="text-success mt-2">
                              <i className="bi bi-check-circle-fill me-1"></i>
                              รับงานเมื่อ: {new Date(job.receivedAt).toLocaleString('th-TH')}
                            </div>
                          )}
                        </div>

                        {/* แสดงจำนวนรูป (ถ้ามี) */}
                        {job.images?.length > 0 && (
                          <Badge bg="info" className="mb-3">
                            <i className="bi bi-images me-1"></i>
                            มีรูปแนบ {job.images.length} รูป
                          </Badge>
                        )}

                        <div className="mt-auto d-grid gap-2">
                          <Button
                            variant="outline-primary"
                            onClick={() => { setSelectedJob(job); setDetailModal(true) }}
                          >
                            ดูรายละเอียด
                          </Button>

                          {!isAccepted ? (
                            <Button
                              variant="success"
                              className="fw-bold"
                              onClick={() => handleAcceptJob(job)}
                            >
                              รับงานนี้เลย
                            </Button>
                          ) : (
                            <Button
                              variant="primary"
                              className="fw-bold"
                              onClick={() => handleOpenComplete(job)}
                            >
                              อัปเดตงานเสร็จ
                            </Button>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                )
              })
            )}
          </Row>
        </Container>
      </div>

      {/* Modal รายละเอียด */}
      <Modal show={detailModal} onHide={() => setDetailModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>#{selectedJob?.id} {selectedJob?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <p><strong>แผนก:</strong> {selectedJob?.dept}</p>
          <p><strong>สถานที่:</strong> {selectedJob?.location}</p>
          <p><strong>สร้างเมื่อ:</strong> {selectedJob?.createdAt}</p>
          {selectedJob?.receivedAt && (
            <p className="text-success"><strong>รับงานเมื่อ:</strong> {new Date(selectedJob.receivedAt).toLocaleString('th-TH')}</p>
          )}
          <hr />
          <p><strong>รายละเอียดงาน:</strong></p>
          <p className="fs-5">{selectedJob?.description || 'ไม่มี'}</p>
        </Modal.Body>
      </Modal>

      {/* Modal ส่งงานเสร็จ */}
      <Modal show={completeModal} onHide={() => setCompleteModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>อัปเดตงานเสร็จ: #{selectedJob?.id} {selectedJob?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold fs-5">รายงานผลการซ่อม</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              value={report}
              onChange={e => setReport(e.target.value)}
              placeholder="เช่น เปลี่ยนคาปาซิเตอร์ 35μF, ล้างคอยล์, ตรวจเช็คกระแสไฟฟ้าปกติ ทำงาน 100%"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">แนบรูปภาพ (ก่อน-หลัง)</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              onChange={e => {
                const files = Array.from(e.target.files)
                setImagePreviews(files.map(f => URL.createObjectURL(f)))
              }}
            />
          </Form.Group>

          {imagePreviews.length > 0 && (
            <Row className="g-3 mt-2">
              {imagePreviews.map((src, i) => (
                <Col xs={6} md={4} key={i}>
                  <img src={src} alt="" className="img-fluid rounded shadow" style={{ height: '180px', objectFit: 'cover' }} />
                </Col>
              ))}
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setCompleteModal(false)}>ยกเลิก</Button>
          <Button
            variant="success"
            size="lg"
            className="px-5 fw-bold"
            onClick={handleCompleteJob}
            disabled={!report.trim()}
          >
            ส่งงานเสร็จ
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}