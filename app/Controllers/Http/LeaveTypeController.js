'use strict'

const LeaveType = use('App/Models/LeaveType')

class LeaveTypeController {
  async index() {
    const leaveTypes = await LeaveType.all()
    return leaveTypes
  }

  async store({ request, response }) {
    try {
      const data = request.only(['leaveName', 'totalLeaves', 'description'])

      const leaveType = new LeaveType()
      leaveType.leave_name = data.leaveName
      leaveType.total_leaves = data.totalLeaves
      leaveType.description = data.description

      await leaveType.save()

      return response.status(201).json({
        success: true,
        message: 'Leave Type created successfully!',
        data: leaveType
      })
    } catch (error) {
      console.error('❌ Error inserting leave type:', error)
      return response.status(500).json({
        success: false,
        message: 'Failed to create leave type.',
        error: error.message
      })
    }
  }

  async update({ params, request, response }) {
  const leaveType = await LeaveType.find(params.id)
  if (!leaveType) {
    return response.status(404).json({ message: 'Not found' })
  }

  const data = request.only(['leaveName', 'totalLeaves', 'description'])
  leaveType.leave_name = data.leaveName
  leaveType.total_leaves = data.totalLeaves
  leaveType.description = data.description

  await leaveType.save()

  return response.json({
    success: true,
    message: 'Updated successfully',
    data: leaveType
  })
}


  async destroy({ params, response }) {
    try {
      const leaveType = await LeaveType.find(params.id)
      if (!leaveType) {
        return response.status(404).json({
          success: false,
          message: 'Leave type not found.'
        })
      }

      await leaveType.delete()

      return response.json({
        success: true,
        message: 'Leave Type deleted successfully!'
      })
    } catch (error) {
      console.error('❌ Error deleting leave type:', error)
      return response.status(500).json({
        success: false,
        message: 'Failed to delete leave type.',
        error: error.message
      })
    }
  }
}

module.exports = LeaveTypeController
