let reqId = 0;

class Socket {
  constructor() {
    this.socket = new WebSocket("ws://localhost:8080");
    this.socket.onmessage = this.handleServerMessage
    this.queue = {};
  }

  set startChatHandler(handler) {
    this.startChat = handler;
  }

  set chatMessageHandler(handler) {
    this.chatMessage = handler;
  }

  set notYourTurnHandler(handler) {
    this.notYourTurn = handler;
  }

  set onOpenHandler(handler) {
    this.socket.onopen = handler;
  }

  send = (handler, routePath, data) => {
    const req = {requestId: `${routePath}${reqId++}`, routePath, data}
    this.queue[req.requestId] = handler;
    this.socket.send(JSON.stringify(req))
  }
  sendChatMessage = (handler, data) => {
    data.toUser = this.toUser;
    const req = {requestId: `send_message${reqId++}`, routePath: "send_message", data}
    this.queue[req.requestId] = handler;
    this.socket.send(JSON.stringify(req))
  }
  handleServerMessage = (ev) => {
    if (typeof ev.data === "string") {
      const {requestId, error, data} = JSON.parse(ev.data);
      if (error) {
        alert("error")
        console.log(error, requestId)
      }
      if (this.queue[requestId]) {
        this.queue[requestId](data, error);
        delete this.queue[requestId];
      } else {
        this.events(requestId, data);
      }
    }
  }

  events = (requestId, data) => {
    if (requestId === "themeReady") {
      this.startChat();
    } else if (data.event === "chat_started") {
      this.toUser = data.data;
    } else if (data.event === "current_user_send_message") {
      this.chatMessage("another: " + data.data)
    } else if (data.event === "message_delivered") {
      this.chatMessage("me: " + data.data)
    }else if (data.event === "not_your_turn") {
      this.notYourTurn();
    }
  }
}

export default Socket;