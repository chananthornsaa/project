import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MyJobs from './pages/MyJobs'
import JobManagement from './pages/JobManagement'
import JobHistory from './pages/JobHistory'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MyJobs />} />
        <Route path="/jobmanagement" element={<JobManagement />} />
        <Route path="/jobhistory" element={<JobHistory />} />
      </Routes>
    </BrowserRouter>
  )
}