const STORAGE_KEY_ACTIVE = 'techjob_active_jobs'
const STORAGE_KEY_COMPLETED = 'techjob_completed_jobs'

export const loadActiveJobs = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_ACTIVE)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export const saveActiveJobs = (jobs) => {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE, JSON.stringify(jobs))
  } catch (e) {
    console.error('Save active jobs failed', e)
  }
}

export const loadCompletedJobs = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_COMPLETED)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export const saveCompletedJobs = (jobs) => {
  try {
    localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(jobs))
  } catch (e) {
    console.error('Save completed jobs failed', e)
  }
}