let wsBaseURL, wsProtocol;
if (process.env.NODE_ENV === "production") {
  if (location.port) {
    wsBaseURL = `${location.host}/websocket`;
    wsProtocol = "ws://";
  } else {
    wsBaseURL = `${location.hostname}/websocket`;
    wsProtocol = "wss://";
  }
} else {
  wsProtocol = "ws://";
  // wsBaseURL = `10.3.1.34:8082`;
  wsBaseURL = `10.3.1.34:8090`;
}

export const wsConfig = {
  wsProtocol,
  wsBaseURL,
  wsUrl: process.env.NODE_ENV === "production" ? "/ws" : "/job/ws",
  wsChatUrl: process.env.NODE_ENV === "production" ? "/ws" : "/job/ws"
};
