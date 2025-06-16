'use strict'

const Model = use('Model')

class Attendance extends Model {
  employee() {
    return this.belongsTo('App/Models/Employee')
  }
}

module.exports = Attendance
