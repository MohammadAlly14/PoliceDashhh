let ioInstance = null;

function initializeRealtime(io) {
  ioInstance = io;

  io.on('connection', (socket) => {
    socket.emit('telemetry:welcome', {
      message: 'Connected to PoliceDash real-time service',
      connectedAt: new Date().toISOString(),
    });
  });
}

function emitRealtimeEvent(eventName, payload) {
  if (!ioInstance) {
    return;
  }

  ioInstance.emit(eventName, {
    ...payload,
    emittedAt: new Date().toISOString(),
  });
}

module.exports = {
  initializeRealtime,
  emitRealtimeEvent,
};
