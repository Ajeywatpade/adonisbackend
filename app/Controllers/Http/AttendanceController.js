'use strict'

const Attendance = use('App/Models/Attendance')

class AttendanceController {
  async store({ request, response }) {
    const { attendances, date } = request.all()

    try {
      const insertData = attendances.map(item => ({
        employee_id: item.employee_id,
        status: item.status,
        date: date
      }))

      await Attendance.createMany(insertData)

      return response.status(201).json({ success: true, message: 'Attendance saved.' })
    } catch (err) {
      return response.status(500).json({ success: false, message: err.message })
    }
  }
}

module.exports = AttendanceController

