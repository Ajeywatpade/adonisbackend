async login({ request, auth, response }) {
  try {
    const { email, password } = request.only(['email', 'password'])

    console.log('📥 Login request received:', { email, password })

    const token = await auth.attempt(email, password)

    console.log('✅ Auth successful!')

    return response.status(200).json({ token })
  } catch (error) {
    console.error('❌ Login Error:', {
      message: error.message,
      stack: error.stack,
    })

    return response.status(500).json({
      message: 'Login failed',
      error: error.message,
    })
  }
}
