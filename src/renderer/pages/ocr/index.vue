<template>
  <div class="wrapper" keep-alive>
    <div class="el-upload__tip">
      只能上传jpg/jpeg/png文件，且不超过5Mb

      <el-button style="margin-left: 15px" type="primary" @click="handleOCR"
        >开始比对分析</el-button
      >
      <el-button
        style="margin-left: 15px"
        size="middle"
        @click="handleShowJMark"
        >展示校注</el-button
      >
      <el-button
        style="margin-left: 15px"
        size="middle"
        @click="handleChangeTextDiffDrawer"
        >查看文字比对</el-button
      >
      <el-switch
        v-model="dicrectionType"
        active-text="横版"
        inactive-text="竖版"
        @change="handleChangeDirectionSwitch"
        style="margin: 0 10px;"
      >
      </el-switch>
      <el-button>
        <span style="display: flex;align-items: center">
          选择标注颜色 &nbsp;<colorPicker
            v-model="color"
            @change="handleChangeColor"
          />
        </span>
      </el-button>
    </div>
    <main
      :class="`main main_${Number(!Boolean(dicrectionType))}`"
      v-loading="loading"
    >
      <div class="up-box">
        <div class="img-outer">
          <img id="imageA" class="show-img" :src="imageA" alt="" />
        </div>

        <el-upload
          class="upload-ope"
          action="https://jsonplaceholder.typicode.com/posts/"
          multiple
          :on-change="
            (file, fileList) => handleChangeOrigin(file, fileList, 'imageA')
          "
          :before-upload="handleBeforeUpload"
          :limit="2"
        >
          <el-tag style="margin: 5px" v-if="imageAFile" type="info"
            >【文件名】{{ imageAFile.name }}</el-tag
          >
          <el-tag style="margin: 5px" v-if="imageAFile" type="info"
            >{{ imageASize.w }} x {{ imageASize.h }}</el-tag
          >
          <el-button size="large" type="primary">点击上传图片</el-button>
        </el-upload>
      </div>
      <div class="center-ope">
        <div class="bar"></div>
      </div>
      <div class="up-box">
        <div class="img-outer">
          <img id="imageB" class="show-img" :src="imageB" alt="" />
          <canvas
            id="imageBCanvas"
            :class="`canvas imageBCanvas ${showHover && 'showHover'}`"
            :width="imageBSize.ow"
            :height="imageBSize.oh"
          ></canvas>
        </div>
        <el-upload
          class="upload-ope"
          action="https://jsonplaceholder.typicode.com/posts/"
          multiple
          :on-change="
            (file, fileList) => handleChangeOrigin(file, fileList, 'imageB')
          "
          :before-upload="handleBeforeUpload"
          :limit="2"
        >
          <el-tag style="margin: 5px" v-if="imageBFile" type="info"
            >【文件名】{{ imageBFile.name }}</el-tag
          >
          <el-tag style="margin: 5px" v-if="imageAFile" type="info"
            >{{ imageBSize.w }} x {{ imageBSize.h }}</el-tag
          >
          <el-button size="large" type="primary">点击上传待对比图片</el-button>
        </el-upload>
      </div>
    </main>
    <el-drawer
      size="70%"
      title="文字DIFF结果"
      :visible.sync="showDrawer"
      :with-header="true"
    >
      <div class="diff-wrapper">
        <div class="diff-box imageADiff">
          <el-tag style="margin: 5px" v-if="imageAFile" type="info"
            >【文件名】{{ imageAFile.name }}</el-tag
          >
          <ul class="ul">
            <li v-for="(item, i) in imageATextList" :key="item.words + i">
              {{ i + 1 }}.
              <span :class="`${!item.noDiff && 'isDiff'}`">
                {{ item.words }}
              </span>
            </li>
          </ul>
        </div>
        <div class="diff-box imageADiff">
          <el-tag style="margin: 5px" v-if="imageBFile" type="info"
            >【文件名】{{ imageBFile.name }}</el-tag
          >
          <ul class="ul">
            <li v-for="(item, i) in imageBTextList" :key="item.words + i">
              {{ i + 1 }}.
              <span :class="`${!item.noDiff && 'isDiff'}`">
                {{ item.words }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import SystemInformation from "./SystemInformation";
import Utils from "./../../utils";
import { Loading, Message } from "element-ui";
import { cloneDeep } from "lodash";

export default {
  name: "landing-page",
  components: { SystemInformation },
  computed: {},
  data() {
    return {
      dicrectionType: true,
      showHover: true,
      imageUrl: "~@/assets/logo.png",
      text: "",
      imageA: "", //  A代表原图
      imageATextList: [],
      imageB: "", //  B代表新图
      imageASize: {
        w: 0, //  图片像素尺寸
        h: 0,
        ow: 0, //  图片渲染尺寸
        oh: 0,
      },
      imageBSize: {
        w: 0,
        h: 0,
        ow: 0,
        oh: 0,
      },
      imageBTextList: [],
      imageAFile: null,
      imageBFile: null,
      showDrawer: false,
      color: "#ff0000",
    };
  },
  async mounted() {
    window.addEventListener("resize", () => {
      this.handleComputeImageCanvasSize();
    });
  },
  methods: {
    //  展示校注
    handleShowJMark() {
      this.diffWords();
    },
    //  切换排版
    handleChangeDirectionSwitch(event) {
      console.log(event);
      this.dicrectionType = event;
      let imgArray = ["imageA", "imageB"];
      imgArray.forEach((item) => {
        this.handleComputeImageCanvasSize(item);
      });
    },
    //  切换遮罩显示
    handleChangeHoverSwitch(event) {
      console.log(event);
      this.showHover = event;
    },
    //  展示文字比对抽屉
    handleChangeTextDiffDrawer() {
      this.showDrawer = !this.showDrawer;
      if (this.showDrawer) {
        this.diffWords();
      }
    },
    //  更改标注颜色
    handleChangeColor() {
      this.handleRenderMark();
    },
    //  监听图片上传回调
    async handleChangeOrigin(file, fileList, imageKey) {
      console.log([...arguments]);
      const res = await Utils.img2Base64({ file });
      this[imageKey] = res;
      this[imageKey + "File"] = file;

      setTimeout(() => {
        this.handleComputeImageCanvasSize(imageKey);
      }, 1000);
    },
    // 渲染canvas标注
    handleRenderMark() {
      const filterList = this.imageBTextList.filter((item) => {
        return !item.noDiff;
      });
      console.log("【需要标注区块】 => ", filterList);
      this.handleRenderRect(filterList);
    },
    //  绘制描边矩形
    handleRenderRect(filterList) {
      console.log("【需要标注区块2222】 => ", filterList);

      //  获取画布
      const cvs = document.getElementById("imageBCanvas");
      //  设置长宽
      cvs.width = this.imageBSize.ow;
      cvs.height = this.imageBSize.oh;
      //  获取画笔
      const ctx = cvs.getContext("2d");

      //  绘制比率
      const ratio = this.imageBSize.ow / this.imageBSize.w;

      // 描边矩形方法：strokeRect(x,y,w,h)
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1;
      filterList.forEach((item) => {
        const rectData = {
          x: item.location.left,
          y: item.location.top,
          width: item.location.width,
          height: item.location.height,
          words: item.words,
        };
        const { x, y, width, height, words } = rectData;
        console.log(
          "【矩形坐标】=>",
          x * ratio,
          y * ratio,
          width * ratio,
          height * ratio,
          words
        );
        ctx.strokeRect(x * ratio, y * ratio, width * ratio, height * ratio);
      });
    },
    //  重新计算canvas尺寸
    handleComputeImageCanvasSize(imageKey) {
      let dom = document.querySelector(`#${imageKey}`);
      if (dom) {
        const w = dom.naturalWidth;
        const h = dom.naturalHeight;
        const ow = dom.offsetWidth;
        const oh = dom.offsetHeight;
        this[imageKey + "Size"] = {
          w,
          h,
          ow,
          oh,
        };
        setTimeout(() => {
          const ow = dom.offsetWidth;
          const oh = dom.offsetHeight;
          this[imageKey + "Size"] = {
            ...this[imageKey + "Size"],
            ow,
            oh,
          };
          console.log(`【${imageKey}图片尺寸】 => `, w, h, ow, oh);
        }, 300);
      }
    },
    handleBeforeUpload(file) {
      // console.log(file);
    },
    //  上传图片获取文字提取内容
    async handleOCR() {
      if (!this.imageA || !this.imageB) {
        Message.info("请先上传图片");
        return void 0;
      }
      let imgArray = [
        { img: this.imageA, key: "imageA" },
        { img: this.imageB, key: "imageB" },
      ];
      imgArray.forEach(async (item) => {
        if (item.img) {
          let loadingInstance = Loading.service({ text: "文字提取中" });
          const ret = await Utils.BaiduAISdk.identifyOCRHighLevel({
            image: item.img.replace(/^data:image\/(png|jpg|jpeg);base64,/g, ""),
          });
          console.log(`【OCR RESULT RELAY】=> ${JSON.stringify(ret)}`);
          this[item.key + "TextList"] = (ret && ret.words_result) || [];
          this.$nextTick(() => {
            loadingInstance.close();
            this.handleShowJMark();
          });
        }
      });
    },
    //  计算文字diff
    diffWords() {
      const ATextList = cloneDeep(this.imageATextList);
      const BTextList = cloneDeep(this.imageBTextList);
      let isFound = false;
      let finderIndex = 0;
      BTextList.forEach((bItem, i) => {
        finderIndex = ATextList.findIndex((o) => o.words === bItem.words);
        isFound = finderIndex !== -1;
        BTextList[i] = {
          ...bItem,
          noDiff: isFound,
        };
        ATextList[finderIndex] = {
          ...ATextList[finderIndex],
          noDiff: isFound,
        };
      });
      this.imageATextList = ATextList;
      this.imageBTextList = BTextList;
      console.log("【IMAGE_A_TEXT_LIST】 => ", this.imageATextList);
      console.log("【IMAGE_B_TEXT_LIST】 => ", this.imageBTextList);
      this.handleRenderMark();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./../../styles/theme.scss";

.left-side {
  display: flex;
  flex-direction: column;
}

.welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
}

.title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.main {
  padding: 0 30px;
  margin-top: 15px;
  display: flex;
  justify-content: center;
  transition: all 0.2s ease-in-out;
  padding-bottom: 100px;
  .center-ope {
    display: flex;
    align-items: center;
    .bar {
      width: 1px;
      height: 100%;
      background: #eee;
    }
  }
  &.main_1 {
    flex-direction: column;
    align-items: center;
    .up-box {
      width: 100%;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .img-outer {
        height: 360px;
        margin: 0;
        width: 85%;
        flex: 1;
      }
      .upload-ope {
        padding: 80px 10px;
        text-align: center;
        width: 200px;
        margin-left: 20px;
      }
    }
    .center-ope {
      margin: 5px 0;
    }
  }
}
.img-box {
  width: 900px;
}
.up-box {
  width: 40%;
  margin: 0 5%;
  transition: all 0.2s ease-in-out;

  .img-outer {
    height: 500px;
    // border: 1px solid #999;
    box-shadow: $bs;
    margin-bottom: 10px;
    position: relative;
  }
  .upload-ope {
    padding: 10px 80px;
    text-align: center;
    width: 100%;
    // margin-left: 10px;
    box-shadow: $bs;
    // background: red;
  }
}
.el-upload {
  height: 100% !important;
  background: blue;
  .el-upload-dragger {
    height: 100% !important;
  }
}
.up-btn {
  margin: 0 auto;
}
.el-upload__tip {
  padding: 10px 60px;
  font-size: 18px;
}
.show-img {
  object-fit: contain;
  width: 100%;
}
.diff-wrapper {
  display: flex;
  padding: 10px;
  height: 100%;
  .diff-box {
    border: 1px solid #eee;
    height: 90%;
    // background: red;
    flex: 1;
    margin: 0 5px;
    overflow-y: scroll;
    .ul {
      padding: 10px;
      height: 50%;
      overflow-y: scroll;
      li {
        margin: 10px;
        font-size: 16px;
      }
    }
  }
}
.isDiff {
  background: red;
  color: $white;
}
.canvas {
  position: absolute;
  background: rgba(0, 89, 255, 0.089);
  top: 0;
  left: 0;
  .showHover {
    background: rgba(0, 89, 255, 0.289);
  }
}
</style>
