<template>
  <section class="welcome-banner">
    <div>
      <span class="banner-kicker"
        ><i class="green-dot"></i> YOUR EVERYDAY TOOLKIT</span
      >
      <h2>让每一个小工具，发挥大作用。</h2>
      <p>管理工具、连接用户，给日常多一点便利。</p>
      <router-link to="/tools"
        >探索工具管理
        <span
          class="iconfont icon-xiayibu"
          style="font-size: 17px"
          aria-hidden="true"
        ></span
      ></router-link>
    </div>
    <div class="banner-art" aria-hidden="true">
      <span class="art-orbit orbit-one"></span
      ><span class="art-orbit orbit-two"></span
      ><span class="art-float art-code"
        ><span
          class="iconfont icon-zitidaima"
          style="font-size: 28px"
          aria-hidden="true"
        ></span></span
      ><span class="art-float art-image"
        ><span
          class="iconfont icon-xingzhuang-tupian"
          style="font-size: 27px"
          aria-hidden="true"
        ></span></span
      ><span class="art-pocket"
        ><span
          class="iconfont icon-gongnengdingyi"
          style="font-size: 61px"
          aria-hidden="true"
        ></span></span
      ><span class="art-spark">✦</span><span class="art-dot"></span>
    </div>
    <span class="banner-badge">本地演示工作台</span>
  </section>
</template>

<style lang="scss" scoped>
.welcome-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #eaf2ea;
  border: 1px solid #e0eade;
  padding: 27px 30px 25px;
  border-radius: 11px;
  position: relative;
  overflow: hidden;
  min-height: 190px;
  margin-bottom: 23px;
}
.banner-kicker {
  font-size: 9px;
  letter-spacing: 2.4px;
  color: #83a28d;
  display: flex;
  align-items: center;
  gap: 7px;
}
.welcome-banner h2 {
  font-size: 23px;
  font-weight: 600;
  margin: 10px 0 7px;
  color: #325d49;
  letter-spacing: 0.2px;
}
.welcome-banner p {
  color: #82a08b;
  font-size: 11px;
}
.welcome-banner a {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: #42785c;
  font-size: 11px;
  margin-top: 20px;
}
.banner-badge {
  position: absolute;
  top: 18px;
  right: 20px;
  font-size: 8px;
  color: #91ab95;
  letter-spacing: 1px;
}
.banner-art {
  position: absolute;
  width: 270px;
  height: 210px;
  right: 42px;
  top: 5px;
}
.art-orbit {
  position: absolute;
  border: 1px solid #d7e4d4;
  border-radius: 50%;
  width: 255px;
  height: 255px;
  top: -30px;
  left: 8px;
}
.orbit-two {
  width: 190px;
  height: 190px;
  left: 40px;
  top: 2px;
}
.art-pocket {
  position: absolute;
  width: 103px;
  height: 111px;
  border-radius: 23px 23px 38px 38px;
  background: #6c9378;
  color: #eaf2de;
  left: 90px;
  top: 46px;
  display: grid;
  place-items: center;
  transform: rotate(-12deg);
  box-shadow:
    0 18px 26px #688e6d20,
    inset 0 1px 2px #ffffff90;
  border: 1px solid #789c80;
}
.art-float {
  display: grid;
  place-items: center;
  position: absolute;
  width: 54px;
  height: 54px;
  background: #fbfdf7;
  box-shadow: 0 8px 16px #788d7012;
  border-radius: 13px;
}
.art-code {
  left: 36px;
  top: 35px;
  transform: rotate(-14deg);
  color: #c1a571;
}
.art-image {
  right: 10px;
  bottom: 35px;
  transform: rotate(12deg);
  color: #86a390;
}
.art-spark {
  position: absolute;
  right: 36px;
  top: 42px;
  font-size: 25px;
  color: #cab77f;
}
.art-dot {
  width: 9px;
  height: 9px;
  background: #c5d9bc;
  border-radius: 50%;
  position: absolute;
  bottom: 35px;
  left: 66px;
}
@media (min-width: 1600px) {
  .welcome-banner {
    min-height: 205px;
  }
}
@media (max-width: 1280px) {
  .banner-art {
    right: 23px;
  }
  .welcome-banner h2 {
    font-size: 22px;
  }
}
@media (max-width: 1080px) {
  .welcome-banner h2 {
    font-size: 20px;
  }
  .banner-art {
    transform: scale(0.8);
    transform-origin: right center;
    right: 10px;
  }
  .welcome-banner {
    padding-left: 23px;
  }
}
@media (max-width: 880px) {
  .welcome-banner h2 {
    font-size: 23px;
  }
  .banner-art {
    transform: scale(0.9);
  }
}
@media (max-width: 650px) {
  .welcome-banner {
    padding: 24px 20px;
    min-height: 176px;
  }
  .welcome-banner h2 {
    max-width: 200px;
    font-size: 20px;
    line-height: 1.7;
    margin: 8px 0 4px;
  }
  .banner-kicker {
    font-size: 7px;
    letter-spacing: 1.3px;
  }
  .welcome-banner p {
    max-width: 180px;
    font-size: 9px;
    line-height: 1.8;
  }
  .welcome-banner a {
    font-size: 10px;
    margin-top: 14px;
  }
  .banner-art {
    transform: scale(0.59);
    right: -11px;
    top: 0;
  }
  .banner-badge {
    font-size: 7px;
    top: 13px;
    right: 13px;
  }
}
</style>
