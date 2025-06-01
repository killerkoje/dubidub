const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    allowedHosts: 'all', // 이 부분은 그대로 유지
    client: {
      webSocketURL: 'wss://0.0.0.0:8081/ws', // 이 줄을 추가합니다.
                                            // 8081은 Vue 개발 서버의 기본 포트입니다.
                                            // 혹시 다른 포트를 사용 중이시라면 해당 포트 번호로 변경해주세요.
    }
  }
})