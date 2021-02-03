<template>
  <div id="app">
    <div class="brand" keep-alive>
      <span class="slogan">高金实业 GoldKinn</span>

      <div class="right-bar">
        <div class="cir date">
          <i class="el-icon-date"></i>
          <span>
            {{ currentDate }}
          </span>
        </div>
        <div class=" cir sts">
          <i class="el-icon-setting"></i>
        </div>
      </div>
    </div>
    <div class="back-box" v-if="$router.currentRoute.name !== 'workbench'">
      <span class="back" @click="handleToHome">
        <i class="el-icon-back"></i> 返回</span
      >
    </div>
    <transition name="transitionRouter">
      <router-view></router-view>
    </transition>
    <footer>Copyright©{{ new Date().getFullYear() }} 高金数字化运营中心</footer>
  </div>
</template>

<script>
export default {
  name: "picocrvue",
  computed: {
    isHome() {
      console.log(this.$router.currentRoute);
      return this.$router.currentRoute.name === "workbench";
    },
  },
  methods: {
    handleToHome() {
      console.log(this.$router.currentRoute.name);
      this.$router.push("/");
    },
  },
  data() {
    return {
      currentDate: new Date().toLocaleDateString(),
      transitionName: "slide-right",
    };
  },
};
</script>

<style lang="scss">
@import "./styles/theme.scss";
@import "./styles/reset.scss";

.transitionRouter-enter-active,
.transitionRouter-leave-active {
  transition: all 0.4s ease-in-out;
}

.transitionRouter-enter,
.transitionRouter-leave {
  // transform: translate3d(100%, 0, 0);
  opacity: 0;
}
body {
  background: radial-gradient(
    ellipse at top left,
    white 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
}
.brand {
  background: $main;
  height: 60px;
  font-size: 28px;
  font-weight: bold;
  // margin-bottom: 6px;
  padding: 10px 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .slogan {
    color: #fff;
  }
  .right-bar {
    font-size: 18px;
    color: #fff;
    display: flex;
    align-items: center;
  }
  .cir {
    margin: 0 10px;
  }
}
.back-box {
  padding: 10px 60px;
  box-shadow: $bs;
  .back {
    color: $word;
    font-size: 18px;
    cursor: pointer;
  }
}
footer {
  color: #666;
  text-align: center;
  padding: 10px 5px;
  font-size: 14px;
}
/* CSS */
</style>
