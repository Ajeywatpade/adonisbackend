'use strict'

const Database = use('Database')

class ReportController {
  async store({ request, response }) {
    const data = request.only(['date', 'name', 'status', 'department', 'summary'])

    try {
      await Database.table('daily_task_report').insert(data)
      return response.status(200).json({ message: 'Report submitted successfully' })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ message: 'Failed to submit report' })
    }
  }
  async index({ response }) {
  try {
    const reports = await Database.table('daily_task_report').orderBy('date', 'desc')
    return response.status(200).json(reports)
  } catch (error) {
    console.error(error)
    return response.status(500).json({ message: 'Failed to fetch reports' })
  }
}

}


module.exports = ReportController
