# 3DCube

The 3D representation of the cube is shown on the web-app with opportunity to rotate the cube by the angle received from an arduino microcontroller. 

# How to run
1. Clone this repository `git clone ... `
2. Install all necessary dependencies `npm install`
3. Run simulation part (`simulation` folder) by using `npm start`. It will start on port 5000
4. Start frontend (client) (`3d-cube` folder) part by suing `npm start`. It will start on port 3000. Ports are important since it will influence the connection between 2 parts.

# Notes

The task was done by using Arduino which provides a number from 0 to 359 every second. To connect the arduino and the client side web socket was used to transmit data from arduino to client and from client to websocket.

Assume that arduino sends number as string and then it is converted to integer.

After the frontend part opens, the client side immediately gets a list of available devices from web socket. This is why it is important to start simulation part (see instructions) first and only then the client side.

When an user goes to frontend, the cube will remain its position until the moment when the user chooses a baud rate and the device from list of connected devices. After that, the user clicks the button and client side gets data from the arduino. The data is the angle in degrees which then is provided to cube and rotated it. Before that the convertion to radians has to be done.

The cube itself positioned in the scene and will rotate around z-axes. The cube has texture from the picture `space.jpeg`.

If the user won't choose both parameters (baud rate and device), the clent side won't be able to connect with the arduino (alert message pops up).

For the arduino controller it is possible to connect only with baud rate equaled 9600 pbs.

Implementation details which I would add in case of the production deployment and more time:

1. Better design and relevant to the company brand
2. Testing of the web socket part and frontend (client) part
3. Displaying a message on frontend when the device is disconnected physically (when you put away the arduino microcontroller). Right now the message is shown only on the simulation part.
4. Displaying a message when we have connection problems