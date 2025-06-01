<template>
  <ChatRoom />
</template>

<script>
import ChatRoom from './components/ChatRoom.vue';

export default {
  name: 'App',
  components: {
    ChatRoom
  }
};
</script>

<style>
body {
  margin: 0;
  font-family: 'Noto Sans KR', Arial, sans-serif;
  background: #f5f6fa;
}
</style>
