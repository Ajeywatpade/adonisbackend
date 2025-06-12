'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')

class AuthController {
  async login({ request, auth, response }) {
    const { username, password } = request.all()

    try {
      const user = await User.query().where('username', username).first()

      if (!user) {
        return response.status(400).json({ message: 'User not found' })
      }

      const isValid = await Hash.verify(password, user.password)

      if (!isValid) {
        return response.status(400).json({ message: 'Invalid password' })
      }

      const token = await auth.generate(user)
      return response.json({ token })

    } catch (error) {
      console.error(error)
      return response.status(500).json({ message: 'Login error' })
    }
  }
}

module.exports = AuthController
