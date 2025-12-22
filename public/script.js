const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const SERVER_URL = isLocal
  ? window.location.origin
  : "https://grateful-francene-maynoothuniversity-7d5783cc.koyeb.app";

const socket = io(SERVER_URL, {
  withCredentials: true
});

const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const welcomePanel = document.getElementById('welcome-panel');
const chatPanel = document.getElementById('chat-panel');
const nameForm = document.getElementById('name-form');
const nameInput = document.getElementById('name-input');
const statusIndicator = document.getElementById('status-indicator');

let username = '';

setStatus('Waiting to join');

nameForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  username = nameInput.value.trim() || 'Guest';

  appendMessage(`You joined as ${username}`);
  socket.emit('new-user', username);

  welcomePanel.classList.add('hidden');
  chatPanel.classList.remove('hidden');
  messageForm.classList.remove('hidden');

  setStatus(`Connected as ${username}`);
  messageInput.focus();
});

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`, 'incoming');
});

socket.on('user-connected', name => {
  appendMessage(`${name} connected`, 'incoming');
});

socket.on('user-disconnected', name => {
  appendMessage(`${name || 'A user'} disconnected`, 'incoming');
});

socket.on('connect', () => {
  if (username) {
    setStatus(`Connected as ${username}`);
  } else {
    setStatus('Connected · waiting to join');
  }
});

socket.on('disconnect', () => {
  setStatus('Disconnected · reconnecting...');
});

messageForm?.addEventListener('submit', e => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (!message) return;
  appendMessage(`You: ${message}`, 'outgoing');
  socket.emit('send-chat-message', message);
  messageInput.value = '';
});

function appendMessage(message, type = 'incoming') {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageElement.classList.add('message');
  messageElement.classList.add(type);
  messageContainer.append(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;

  requestAnimationFrame(() => {
    messageElement.classList.add('show');
  });
}

function setStatus(text) {
  if (statusIndicator) {
    statusIndicator.textContent = text;
  }
}
