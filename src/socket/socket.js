export function initializeSocket() {
  const port = import.meta.env.VITE_SOCKET_PORT;
  const wsUri = `ws://localhost:${port}/`
  const socket = new WebSocket(wsUri);


  socket.addEventListener('open', (event) => {
   // console.log(event)
  })


  socket.addEventListener('message', (event) => {
   // console.log(event.data)
  })


  socket.addEventListener('error', (event) => {
   // console.error("WebSocket error:", event);
  })


  socket.addEventListener('close', (event) => {
    if (event.wasClean) {
     // console.log(`Closed cleanly, code=${event.code}, reason=${event.reason}`);
    } else {
     // console.log("Connection died");
    }
  })

}