async login({ request, auth, response }) {
  try {
    const { email, password } = request.only(['email', 'password'])

    console.log('🔐 Login attempt:', { email })  // <-- Logs the incoming email

    const token = await auth.attempt(email, password)

    console.log('✅ Login successful')  // <-- Confirms successful login

    return response.status(200).json({ token })
  } catch (error) {
    console.error('❌ Login failed:', error)  // <-- Logs the exact error
    return response.status(500).json({
      message: 'Login failed',
      error: error.message,
      stack: error.stack,
    })
  }
}
