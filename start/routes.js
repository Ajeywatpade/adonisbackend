'use strict'

const Route = use('Route')
const User = use('App/Models/User')
const Database = use('Database')
const Helpers = use('Helpers')

// Auth & Registration
Route.post('/register', async ({ request, response }) => {
  try {
    const data = request.only([
      'username', 'email', 'password', 'department', 'gender', 'address', 'city', 'mobile',
      'key_responsibility', 'documents', 'is_active', 'birth_date', 'blood_group', 'secondary_contact'
    ])
    console.log('Registration data:', data)
    const user = await User.create(data)
    return response.status(201).json(user)
  } catch (error) {
    console.error('Registration error:', error)
    return response.status(500).json({ message: 'Registration failed', error: error.message })
  }
})

Route.post('/login', async ({ auth, request, response }) => {
  const { username, password } = request.all()
  try {
    const token = await auth.attempt(username, password)
    return token
  } catch (error) {
    return response.status(401).send({ error: 'Invalid credentials' })
  }
})

Route.post('/logout', 'AuthController.logout').middleware('auth')

// Dashboard
Route.get('/dashboard', async ({ auth }) => {
  const user = await auth.getUser()
  return { message: `Welcome, ${user.username}` }
}).middleware(['auth'])

// Base
Route.get('/', () => ({ greeting: 'Hello world in JSON' }))
Route.get('/hello', () => ({ message: 'Hello from AdonisJS v4!' }))

// Users
Route.get('/users', async () => {
  return await Database.from('users').select(
    'id', 'username', 'email', 'gender', 'department', 'city', 'address', 'mobile',
    'key_responsibility', 'is_active', 'birth_date', 'blood_group', 'secondary_contact'
  )
})

Route.put('/users/:id', async ({ params, request, response }) => {
  const data = request.only([
    'username', 'email', 'password', 'department', 'gender', 'address', 'city', 'mobile',
    'key_responsibility', 'is_active', 'birth_date', 'blood_group', 'secondary_contact'
  ])
  const user = await Database.from('users').where('id', params.id).first()
  if (!user) return response.status(404).json({ error: 'User not found' })
  await Database.table('users').where('id', params.id).update(data)
  return { message: 'User updated successfully' }
})

Route.delete('/users/:id', async ({ params, response }) => {
  const deleted = await Database.table('users').where('id', params.id).delete()
  if (!deleted) return response.status(404).json({ error: 'User not found' })
  return { message: 'User deleted successfully' }
})

Route.put('/users/:email', async ({ params, request, response }) => {
  const user = await User.findBy('email', params.email)
  if (!user) return response.status(404).json({ message: 'User not found' })
  const data = request.only([
    'empId', 'username', 'gender', 'department', 'city', 'address', 'mobile',
    'keyResponsibility', 'is_active', 'birth_date', 'blood_group', 'secondary_contact'
  ])
  user.merge(data)
  await user.save()
  return user
})

Route.delete('/users/:email', async ({ params, response }) => {
  const decodedEmail = decodeURIComponent(params.email)
  const user = await User.findBy('email', decodedEmail)
  if (!user) return response.status(404).json({ message: 'User not found' })
  await user.delete()
  return response.status(200).json({ message: 'User deleted successfully' })
})

Route.get('/api/total-employees', async ({ response }) => {
  const totalEmployees = await User.query().count('* as count')
  return response.json({ count: totalEmployees[0].count })
})

// Debug/Test
Route.get('/test-db', async () => {
  try {
    const users = await Database.from('users').select('*')
    return { success: true, count: users.length, users }
  } catch (error) {
    return {
      success: false,
      name: error.name,
      code: error.code,
      message: error.message,
      stack: error.stack,
    }
  }
})

// Report Routes
Route.post('/api/report', 'ReportController.store')
Route.get('/api/reports', 'ReportController.index')

// Leave Type Routes
Route.get('/api/leave-types', 'LeaveTypeController.index')
Route.post('/api/leave-types', 'LeaveTypeController.store')
Route.put('/leave-types/:id', 'LeaveTypeController.update')
Route.delete('/leave-types/:id', 'LeaveTypeController.destroy')

// Department Routes
Route.post('/departments', 'DepartmentController.store')
Route.get('/departments', 'DepartmentController.index')
Route.put('/departments/:id', 'DepartmentController.update')
Route.delete('/departments/:id', 'DepartmentController.destroy')

// Announcement Routes
Route.post('/announcements', 'AnnouncementController.store')
Route.get('/announcements', 'AnnouncementController.index')

// Attendance Routes
Route.post('/attendances', 'AttendanceController.store')

// Employee Routes
Route.post('/employee', 'EmployeeController.store')
Route.get('/employee', 'EmployeeController.index')
Route.get('/employees', 'EmployeeController.index')


Route.any('*', ({ response }) => {
  return response.download(Helpers.publicPath('index.html'))
})
