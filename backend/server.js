const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const SENDBIRD_APP_ID = '0CC15161-7F37-4D3A-A870-2D0D30782360';
const SENDBIRD_API_TOKEN = '7944352f85c7b5e9f67a3a2e2f146168d01cd7f1';
const SENDBIRD_CHANNEL_URL = 'test_channel'; // 실제 채널 URL로 변경 가능

async function sendMessageToSendbird(message, userId = 'guest_user') {
  const url = `https://api-${SENDBIRD_APP_ID}.sendbird.com/v3/group_channels/${SENDBIRD_CHANNEL_URL}/messages`;
  try {
    const res = await axios.post(
      url,
      {
        message_type: 'MESG',
        user_id: userId,
        message: message,
      },
      {
        headers: {
          'Api-Token': SENDBIRD_API_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error('Sendbird API error:', err.response?.data || err.message);
    throw err;
  }
}

app.get('/', (req, res) => {
  res.send('Server is running');
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('chat message', async (msg) => {
    try {
      // Send message to Sendbird
      await sendMessageToSendbird(msg, 'guest_' + socket.id);
      // Broadcast to all clients (including sender)
      io.emit('chat message', msg);
    } catch (e) {
      socket.emit('chat error', '메시지 전송 실패');
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
}); 