'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const User = use('App/Models/User')
const Database = use('Database')

Route.post('/register', async ({ request, response }) => {
  try {
    const data = request.only([
      'username',
      'email',
      'password',
      'department',
      'gender',
      'address',
      'city',
      'mobile',
      'key_responsibility',
      'documents',
      'is_active',
      'birth_date',
      'blood_group',
      'secondary_contact'
    ])

    // Log incoming data for debugging
    console.log('Registration data:', data)

    const user = await User.create(data)
    return response.status(201).json(user)
  } catch (error) {
    console.error('Registration error:', error)
    return response.status(500).json({
      message: 'Registration failed',
      error: error.message
    })
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

Route.get('/dashboard', async ({ auth }) => {
  const user = await auth.getUser()
  return { message: `Welcome, ${user.username}` }
}).middleware(['auth'])


Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})
Route.get('/hello', () => {
  return { message: 'Hello from AdonisJS v4!' }
})

Route.get('/users', async () => {
  const users = await Database.from('users').select(
    'id',
    'username',
    'email',
    'gender',
    'department',
    'city',
    'address',
    'mobile',
  'key_responsibility',
  'is_active',
  'birth_date',
  'blood_group',
  'secondary_contact'

  )
  return users
})

Route.post('/logout', 'AuthController.logout').middleware('auth')

// For inserting a new employee
Route.post('/employee', 'EmployeeController.store')

// For getting all employees
Route.get('/employee', 'EmployeeController.index')

Route.put('/users/:id', async ({ params, request, response }) => {
  const data = request.only([
    'username',
    'email',
    'password',
    'department',
    'gender',
    'address',
    'city',
    'mobile',
    'key_responsibility',
    'is_active',
  'birth_date',
  'blood_group',
  'secondary_contact'
  ])

  const user = await Database.from('users').where('id', params.id).first()

  if (!user) {
    return response.status(404).json({ error: 'User not found' })
  }

  await Database.table('users').where('id', params.id).update(data)
  return { message: 'User updated successfully' }
})

Route.delete('/users/:id', async ({ params, response }) => {
  const deleted = await Database.table('users').where('id', params.id).delete()
  
  if (!deleted) {
    return response.status(404).json({ error: 'User not found' })
  }

  return { message: 'User deleted successfully' }
})

Route.delete('/users/:email', async ({ params, response }) => {
  // Decode the encoded email (e.g., h%40gmail.com => h@gmail.com)
  const decodedEmail = decodeURIComponent(params.email)

  const user = await User.findBy('email', decodedEmail)

  if (!user) {
    return response.status(404).json({ message: 'User not found' })
  }

  await user.delete()
  return response.status(200).json({ message: 'User deleted successfully' })
})
Route.put('/users/:email', async ({ params, request, response }) => {
  const user = await User.findBy('email', params.email)
  if (!user) {
    return response.status(404).json({ message: 'User not found' })
  }

  const data = request.only([
    'empId',
    'username',
    'gender',
    'department',
    'city',
    'address',
    'mobile',
    'keyResponsibility',
    'is_active',
  'birth_date',
  'blood_group',
  'secondary_contact'
  ])

  user.merge(data)
  await user.save()
  return user
})

Route.get('/api/total-employees', async ({ response }) => {
  const User = use('App/Models/User')
  const totalEmployees = await User.query().count('* as count')
  return response.json({ count: totalEmployees[0].count })
})

Route.post('/api/report', 'ReportController.store')
Route.get('/api/reports', 'ReportController.index')



