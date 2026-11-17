<template>
  <div class="login-page">
    <div class="login-decoration" aria-hidden="true">
      <div class="login-orbit"></div>
      <span class="login-art"
        ><span
          class="iconfont icon-gongnengdingyi"
          style="font-size: 100px"
          aria-hidden="true"
        ></span
      ></span>
      <div class="login-copy">
        <span>SMALL TOOLS. BIG POSSIBILITIES.</span>
        <h2>日常的小事，<br />都能做得更好。</h2>
        <p>你的随身百宝箱，从这里开始。</p>
      </div>
    </div>
    <main class="login-main">
      <router-link to="/" class="brand"
        ><span class="brand-mark"
          ><span
            class="iconfont icon-gongnengdingyi"
            style="font-size: 25px"
            aria-hidden="true"
          ></span></span
        ><span>Pocket Kit<small>百宝箱 · 管理后台</small></span></router-link
      >
      <div class="login-content">
        <div class="eyebrow">WELCOME BACK</div>
        <h1>欢迎来到工作台</h1>
        <p>让好用的小工具，触手可及。</p>
        <div class="login-demo-note">
          <span
            class="iconfont icon-xinxikongxin"
            style="font-size: 21px"
            aria-hidden="true"
          ></span>
          <div>
            <strong>当前为本地演示版本</strong>
            <p>
              无需账号密码即可体验管理功能。内容保存在当前浏览器，正式登录与权限控制将在后端接口就绪后接入。
            </p>
          </div>
        </div>
        <router-link to="/" class="button primary full-width"
          >进入演示工作台<span
            class="iconfont icon-xiayibu"
            style="font-size: 18px"
            aria-hidden="true"
          ></span></router-link
        ><small>请勿在演示环境中录入真实敏感信息。</small>
      </div>
      <footer>© {{ new Date().getFullYear() }} Pocket Kit</footer>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  display: flex;
  min-height: 100vh;
  background: white;
}
.login-decoration {
  width: 48%;
  background: #e9f0e4;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.login-orbit {
  border: 1px solid #cfdfc9;
  border-radius: 50%;
  width: 650px;
  height: 650px;
  position: absolute;
  top: -160px;
  left: -200px;
}
.login-art {
  width: 170px;
  height: 180px;
  border-radius: 40px 40px 60px 60px;
  background: #779b7f;
  color: #eef4df;
  display: grid;
  place-items: center;
  transform: rotate(-10deg);
  box-shadow: 0 30px 50px #6c886530;
  margin-top: 10vh;
}
.login-copy {
  padding: 55px 45px 80px;
  position: relative;
}
.login-copy > span {
  color: #8aa784;
  font-size: 9px;
  letter-spacing: 2px;
}
.login-copy h2 {
  font-size: 35px;
  color: #52764f;
  font-weight: 550;
  margin: 18px 0;
  line-height: 1.6;
}
.login-copy p {
  font-size: 12px;
  color: #95ac8f;
}
.login-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 50px 9%;
}
.login-content {
  margin: auto 0;
  padding: 65px 0;
  max-width: 400px;
}
.login-content h1 {
  font-size: 29px;
  margin-top: 13px;
}
.login-content > p {
  color: #9aa99b;
  margin-top: 10px;
  font-size: 12px;
}
.login-demo-note {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #f4f8f2;
  border: 1px solid #e8eee2;
  border-radius: 9px;
  padding: 20px;
  margin: 32px 0 24px;
  color: #93aa89;
}
.login-demo-note strong {
  font-size: 12px;
  color: #74936c;
  font-weight: 500;
}
.login-demo-note p {
  color: #a1b19a;
  font-size: 11px;
  margin-top: 6px;
  line-height: 1.9;
}
.login-content > small {
  display: block;
  color: #b0baab;
  font-size: 10px;
  margin-top: 18px;
  text-align: center;
}
.login-main footer {
  font-size: 10px;
  color: #b0baab;
}
@media (max-width: 1080px) {
  .login-main {
    padding: 40px 6%;
  }
  .login-copy {
    padding-left: 25px;
    padding-right: 25px;
  }
  .login-copy h2 {
    font-size: 29px;
  }
}
@media (max-width: 650px) {
  .login-decoration {
    display: none;
  }
  .login-main {
    padding: 35px 26px;
    min-height: 100vh;
  }
  .login-content {
    max-width: none;
  }
  .login-content h1 {
    font-size: 28px;
  }
}
</style>
