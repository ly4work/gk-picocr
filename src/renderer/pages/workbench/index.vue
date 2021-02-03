<template>
  <div class="wrapper">
    <main class="main">
      <div class="title" keep-alive>
        <i class="el-icon-s-grid"></i>
        应用列表
      </div>

      <div class="modules" keep-alive>
        <div
          class="item"
          v-for="item in appList"
          :key="item.id"
          @click="opanApp(item)"
        >
          <div class="box">
            <div class="i-icon">
              <i :class="item.icon"></i>
            </div>
            <div class="i-header">
              {{ item.title }}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import SystemInformation from "./SystemInformation";

export default {
  name: "landing-page",
  components: { SystemInformation },

  methods: {
    opanApp(item) {
      this.$router.push(item.route);
    },
  },
  data() {
    return {
      appList: [
        {
          title: "版面对比",
          route: "/ocr",
          icon: "el-icon-picture-outline",
          id: "app.ocr",
          name: "ocr",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./../../styles/theme.scss";

.wrapper {
  // background: radial-gradient(
  //   ellipse at top left,
  //   rgba(255, 255, 255, 1) 40%,
  //   rgba(229, 229, 229, 0.9) 100%
  // );
  height: 80vh;
  // padding: 60px 80px;
  width: 100vw;
}

.main {
  padding: 0 60px;
}

.title {
  color: #666;
  font-size: 20px;
  font-weight: bold;
  margin: 30px 0;
}

.modules {
  width: 100%;
  // height: 800px;
  padding: 30px;
  // border: 1px solid #ddd;
  // border-left: 1px solid #ddd;
  border-radius: 5px;
  margin: 10px 0;
  display: grid;
  grid-template-columns: repeat(5, 20%);
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);

  // grid-template-rows: 33.33% 33.33% 33.33%;
  .item {
    .box {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      color: $word;
      // background: red;
      padding: 20px;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      border-radius: 5px;
      &:hover {
        // color: $white;
        // background: $main;
        color: #333;
        font-weight: bold;
        box-shadow: $bs;
        transform: translate(5px, -5px);
      }
      .i-icon {
        font-size: 36px;
      }
      .i-header {
        margin-top: 10px;
        font-size: 16px;
      }
    }
  }
}
</style>
