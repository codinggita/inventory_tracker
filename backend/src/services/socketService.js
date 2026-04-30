let io;

const init = (socketIo) => {
  io = socketIo;
  
  io.on('connection', (socket) => {
    console.log('Client connected to SocketService:', socket.id);
    
    socket.on('disconnect', () => {
      console.log('Client disconnected from SocketService:', socket.id);
    });
  });
};

const emitStockUpdate = (productId, storeId, newStock) => {
  if (io) {
    io.emit('stockUpdate', { productId, storeId, newStock });
  }
};

const emitNotification = (userId, message, type = 'info') => {
  if (io) {
    io.emit('notification', { userId, message, type });
  }
};

module.exports = {
  init,
  emitStockUpdate,
  emitNotification
};
