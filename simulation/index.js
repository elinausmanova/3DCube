const { ReadlineParser } = require('@serialport/parser-readline');
const { SerialPort } = require('serialport');
const express = require('express')
const socketIo = require('socket.io')
const http = require('http')


const PORT = process.env.PORT || 5000
const app = express()
const server = http.createServer(app)

// get list of devices
let portPaths = [];
SerialPort.list().then(ports => {
  ports.forEach(function (port) {
    // console.log(port.path);
    portPaths.push(port.path);
  })
})

// connection and cors
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000' //address of the frontend part
  }
})

// socket connection
io.on('connection', (socket) => {
  console.log('client connected: ', socket.id)

  // get parameters from frontend (client)
  socket.on('params', (params) => {
    let serialPort;
    socket.on('disconnectSerialPort', (msg) => {
      serialPort.close()
    })
    console.log('params are ', params);

    // connection to the device
    serialPort = new SerialPort({ path: params.device, baudRate: params.baud, })
    const parser = new ReadlineParser()
    serialPort.pipe(parser)

    // on connection closed
    serialPort.on('close', function () {
      console.log('device disconnected');
      io.emit('deviceState', { data: 'disconnected' })
    });

    // transfer data about the rotation angle
    parser.on('data', function (data) {
      console.log(data);
      io.emit('data', { data: parseInt(data) });
    });

  });

  // provide list of ports to the frontend (client)
  io.emit('ports', { ports: portPaths });

  // disconnect
  socket.on('disconnect', (reason) => {
    console.log(reason)
  })
})

server.listen(PORT, err => {
  if (err) console.log(err)
  console.log('Server running on Port ', PORT)
})