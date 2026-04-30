/**
 * User Model Shape
 * 
 * {
 *   id: Number (Date.now()),
 *   email: String,
 *   password: String,
 *   name: String,
 *   role: 'user' | 'dealer'
 * }
 */

class User {
  static create(data) {
    return {
      id: Date.now(),
      ...data,
      role: data.role || 'user'
    };
  }
}

module.exports = User;
