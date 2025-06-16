'use strict'

const Announcement = use('App/Models/Announcement') // ✅ Fix this line

class AnnouncementController {
  async store({ request, response }) {
    try {
      const data = request.only(['title', 'message'])
      console.log('📥 Incoming Data:', data)

      const announcement = await Announcement.create(data)

      return response.status(201).json({
        success: true,
        message: 'Announcement created successfully',
        data: announcement,
      })
    } catch (error) {
      console.error('🔥 Error in store():', error)
      return response.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      })
    }
  }
  async index({ response }) {
  try {
    const announcements = await Announcement.query().orderBy('created_at', 'desc').fetch()

    return response.status(200).json({
      success: true,
      data: announcements
    })
  } catch (error) {
    console.error('🔥 Error in index():', error)
    return response.status(500).json({
      success: false,
      message: 'Failed to fetch announcements',
      error: error.message
    })
  }
}

}

module.exports = AnnouncementController
