'use strict'

const Department = use('App/Models/Department')

class DepartmentController {
  async index({ response }) {
    try {
      const departments = await Department.all()
      return response.json(departments)
    } catch (error) {
      console.error('Error fetching departments:', error)  // 👈 Check what prints in terminal
      return response.status(500).json({ success: false, message: 'Server Error', error: error.message })
    }
  }

  async store({ request, response }) {
    try {
      const data = request.only(['name', 'code'])
      const department = await Department.create(data)
      return response.status(201).json({ success: true, department })
    } catch (error) {
      console.error('Error saving department:', error)  // 👈 Check what prints in terminal
      return response.status(500).json({ success: false, message: 'Creation failed', error: error.message })
    }
  }
  // 🔄 Update Department
  async update({ params, request, response }) {
    try {
      const department = await Department.find(params.id)
      if (!department) {
        return response.status(404).json({ message: 'Department not found' })
      }

      const data = request.only(['name', 'code'])
      department.merge(data)
      await department.save()

      return response.json({ message: 'Updated successfully', department })
    } catch (error) {
      console.error('Update Error:', error)
      return response.status(500).json({ message: 'Update failed', error: error.message })
    }
  }

  // ❌ Delete Department
  async destroy({ params, response }) {
    try {
      const department = await Department.find(params.id)
      if (!department) {
        return response.status(404).json({ message: 'Department not found' })
      }

      await department.delete()
      return response.json({ message: 'Deleted successfully' })
    } catch (error) {
      console.error('Delete Error:', error)
      return response.status(500).json({ message: 'Delete failed', error: error.message })
    }
  }
}

module.exports = DepartmentController
