<template>
  <div class="chat-container">
    <header class="chat-header">dubidub chat</header>
    <div class="chat-messages">
      <div
        v-for="(msg, idx) in messages"
        :key="idx"
        :class="['chat-message', msg.isMine ? 'mine' : '']"
      >
        <div class="chat-bubble">
          {{ msg.text }}
        </div>
      </div>
    </div>
    <form class="chat-input-area" @submit.prevent="sendMessage">
      <input
        v-model="input"
        class="chat-input"
        type="text"
        placeholder="Enter message"
        autocomplete="off"
      />
      <button class="chat-send-btn" type="submit">전송</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { io } from 'socket.io-client';

export default {
  name: 'ChatRoom', 
  setup() {
    const socket = io('https://bf37-27-117-183-171.ngrok-free.app');    
    const messages = ref([]);
    const input = ref('');

    const sendMessage = () => {
      if (input.value.trim() === '') return;
      socket.emit('chat message', input.value);
      messages.value.push({ text: input.value, isMine: true });
      input.value = '';
    };  

    onMounted(() => {
      socket.on('chat message', (msg) => {
        messages.value.push({ text: msg, isMine: false });
      });
    });

    onBeforeUnmount(() => {
      socket.disconnect();
    });

    return { messages, input, sendMessage };
  },
};
</script>

<style scoped>
.chat-container {
  max-width: 480px;
  margin: 40px auto;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 600px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.chat-header {
  background: #fafafa;
  padding: 18px;
  font-size: 1.2rem;
  font-weight: bold;
  border-bottom: 1px solid #e0e0e0;
  text-align: left;
}
.chat-messages {
  flex: 1;
  padding: 18px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.chat-message {
  display: flex;
  align-items: flex-end;
}
.chat-message.mine {
  justify-content: flex-end;
}
.chat-bubble {
  background: #f1f1f1;
  color: #222;
  padding: 10px 16px;
  border-radius: 18px;
  max-width: 70%;
  word-break: break-word;
}
.chat-message.mine .chat-bubble {
  background: #8e4cf7;
  color: #fff;
}
.chat-input-area {
  display: flex;
  border-top: 1px solid #e0e0e0;
  padding: 12px;
  background: #fafafa;
}
.chat-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 18px;
  outline: none;
  font-size: 1rem;
}
.chat-send-btn {
  margin-left: 8px;
  padding: 0 18px;
  background: #8e4cf7;
  color: #fff;
  border: none;
  border-radius: 18px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.chat-send-btn:hover {
  background: #6c2bd7;
}
</style> 