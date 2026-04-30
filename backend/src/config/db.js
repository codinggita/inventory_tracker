const { products, stores, inventory: initialInventory } = require('../data');

// In-memory state
let inventory = [...initialInventory];
let reservations = [];
let users = [
  { 
    id: 1, 
    email: 'admin@scout.com', 
    password: 'admin', 
    name: 'Pandya', 
    role: 'dealer', 
    shopName: 'Apex Digital Hub - Gandhinagar',
    licenseNo: 'LIC-778899',
    ownerName: 'Pandya',
    verified: true
  }
];
let searchHistory = [];
let lostDemand = [];

module.exports = {
  products,
  stores,
  inventory,
  reservations,
  users,
  searchHistory,
  lostDemand
};
