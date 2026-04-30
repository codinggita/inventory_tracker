const db = require('../config/db');

exports.signup = (req, res) => {
  const { email, password, name, role, shopName, licenseNo, ownerName, verified } = req.body;
  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const newUser = { 
    id: Date.now(), 
    email, 
    password, 
    name, 
    role: role || 'user',
    shopName,
    licenseNo,
    ownerName,
    verified: verified || false
  };
  db.users.push(newUser);
  const { password: _, ...userWithoutPassword } = newUser;
  res.json({ user: userWithoutPassword, token: 'mock-jwt-' + newUser.id });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword, token: 'mock-jwt-' + user.id });
};
