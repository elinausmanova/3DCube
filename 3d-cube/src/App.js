import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';
import Cube from './Cube';
import Dropdown from './Dropdown';

function App() {

  const [socketIo, setSocket] = useState();
  const [baudRate, setBaudRate] = useState(9600);
  const [device, setDevice] = useState();
  const [ports, setPorts] = useState([]);
  const [deviceOptions, setDeviceOptions] = useState([]);
  const [angle, setRotationAngle] = useState(0);

  // update baud rate
  const updateBaudRate = (value) => {
    setBaudRate(value)
  };

  // update device name
  const updateDevice = (value) => {
    setDevice(value)
  };


  const onClick = () => {
    // check if user provided baud rate and device 
    if (!baudRate || !device) {
      alert('baud rate or device is missing')
      return;
    }

    // disconnect from previous port if there is one
    if (socketIo) {
      socketIo.disconnect()
    }

    // connect
    const socket = io('http://localhost:5000');
    setSocket(socket);
    socket.on('connect', () => console.log(socket.id))


    // transfer baud rate and device to serial port
    socket.emit('params', { baud: baudRate, device: device });
    socket.on('data', (data) => {
      // console.log(data);
      setRotationAngle(data.data);
    })
  }

  useEffect(() => {
    // initial connect to the socket
    const socket = io('http://localhost:5000');
    setSocket(socket);
    socket.on('connect', () => console.log(socket.id))

    // check for connection errors
    socket.on('connect_error', () => {
      console.log('connect error')
      setTimeout(() => socket.connect(), 5000)
    })

    // get list of all devices
    socket.on('ports', (ports) => {
      console.log(ports);
      setPorts(ports.ports);
      ports.ports.forEach(port => setDeviceOptions([...deviceOptions, ...[{ value: port, label: port }]]));
      console.log(deviceOptions)
    })

    // check device state
    socket.on('deviceState', (data) => {
      socket.disconnect()
      console.log(data);
      alert('Serial device was disconnected')
    })

    // disconnect when the app closed
    return function cleanup() {
      console.log('disconnect from socket')
      socket.disconnect();
    }
  }, [])

  return (
    <div className="App">
      <div className='menu'>
        {/* baud rate */}
        <Dropdown
          updateValue={updateBaudRate}
          defaultValue="9600 bps"
          options={[
            { value: '1200', label: '1200 bps' },
            { value: '2400', label: '2400 bps' },
            { value: '4800', label: '4800 bps' },
            { value: '9600', label: '9600 bps' },
            { value: '19200', label: '19200 bps' },
            { value: '38400', label: '38400 bps' },
            { value: '57600', label: '57600 bps' },
            { value: '115200', label: '115200 bps' },
          ]} />
        {/* devices */}
        <Dropdown
          updateValue={updateDevice}
          placeholder='Please choose a device'
          options={deviceOptions} />
        <button className='button' onClick={() => onClick()}>Rotate!</button>
      </div>
      {/* cube visualization */}
      <div className='cube'>
        <Cube
          value={angle}
        />
      </div>
    </div>
  );
}

export default App;