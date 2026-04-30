/**
 * Reservation Model Shape
 * 
 * {
 *   id: Number (Date.now()),
 *   productId: Number,
 *   storeId: Number,
 *   userId: Number,
 *   status: 'active' | 'confirmed' | 'rejected' | 'expired',
 *   createdAt: ISOString,
 *   expiresAt: ISOString
 * }
 */

class Reservation {
  static create(productId, storeId, userId) {
    const now = new Date();
    return {
      id: Date.now(),
      productId: parseInt(productId),
      storeId: parseInt(storeId),
      userId,
      status: 'active',
      createdAt: now.toISOString(),
      expiryTime: new Date(now.getTime() + 10 * 60 * 1000).toISOString()
    };
  }
}

module.exports = Reservation;
