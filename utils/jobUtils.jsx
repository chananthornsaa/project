// src/utils/jobUtils.js
export const acceptJob = (job, technicianId, technicianName) => ({
  ...job,
  assigneeId: technicianId,
  assigneeName: technicianName,
  status: 'inprogress'
})

export const completeJob = (job, report, images) => ({
  ...job,
  status: 'completed',
  completedAt: new Date().toLocaleDateString('th-TH'),
  report: report,
  images: images.length > 0 ? images : job.images
})