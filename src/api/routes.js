const routes = {
  signup: '/signup',
  login: '/login',
  logout: '/logout',
  getUser: '/user',
  getChatRooms: "/chatRooms",
  getUserChat: "/messages"
}

const chatRoutes = {
  getChat: "/chat/chat",
  createChatRoom: "/chat/create-chatroom",
  saveMessage: "/chat/"
}

export {routes, chatRoutes};