async login({ request, auth, response }) {
  try {
    const { email, password } = request.only(['email', 'password'])

    if (!email || !password) {
      return response.status(400).json({ error: 'Email and password are required' })
    }

    const token = await auth.attempt(email, password)

    return response.status(200).json({ token })
  } catch (error) {
    console.error('❌ Login Error:', error)
    return response.status(500).json({ error: error.message, stack: error.stack })
  }
}
