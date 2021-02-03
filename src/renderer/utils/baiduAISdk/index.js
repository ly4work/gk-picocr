import axios from "axios";
import qs from "qs";
/**
 * Baidu 图像识别接口sdk
 */

class BaiduAISdk {
  static BAIDU_API_AUTH_URL = "https://aip.baidubce.com/oauth/2.0/token";
  static BAIDU_API_CAR_URL =
    "https://aip.baidubce.com/rest/2.0/image-classify/v1/car";
  static BAIDU_API_OBJECT_URL =
    "https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general";
  static BAIDU_API_PLANT_URL =
    "https://aip.baidubce.com/rest/2.0/image-classify/v1/plant";
  static BAIDU_API_REDWINE_URL =
    "https://aip.baidubce.com/rest/2.0/image-classify/v1/redwine";
  static BAIDU_API_ANIMAL_URL =
    "https://aip.baidubce.com/rest/2.0/image-classify/v1/animal";
  static BAIDU_API_OCR_HIGH_LEVEL_URL =
    "https://aip.baidubce.com/rest/2.0/ocr/v1/accurate";
  static BAIDU_API_OCR_NORMAL_LEVEL_URL =
    "https://aip.baidubce.com/rest/2.0/ocr/v1/general";
  static CLIENT_CREDENTIALS = "client_credentials";
  static API_KEY = "5YA4cfTiH09eo2HTIb1GuQRE";
  static SECRET_KEY = "P85alwGGa1xGfsDh4vBQY703tRO4MHks";
  static APP_ID = "19513807";

  // baidusdk ajax
  static identify({ url, data, success, fail, complete }) {
    return new Promise((resolve, reject) => {
      return axios({
        url: BaiduAISdk.BAIDU_API_AUTH_URL,
        params: {
          grant_type: BaiduAISdk.CLIENT_CREDENTIALS,
          client_id: BaiduAISdk.API_KEY,
          client_secret: BaiduAISdk.SECRET_KEY,
        },
        method: "GET",
        timeout: 5 * 1000,
      }).then((res) => {
        const { access_token } = res.data;
        console.log("【OCR TOKEN => ", access_token);
        return axios({
          method: "POST",
          headers: {
            "content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
          url: `${url}?access_token=${access_token}`,
          data: qs.stringify(data),
        }).then((ret) => {
          resolve(ret.data);
        });
      });
    });
  }
  //  车型识别接口
  static identifyCar({ image, top_num = 5, baike_num = 10, success, fail }) {
    return BaiduAISdk.identify({
      url: BaiduAISdk.BAIDU_API_CAR_URL,
      data: {
        image,
        top_num,
        baike_num,
      },
      success,
      fail,
    });
  }
  //  通用物品识别
  static identifyObject({ image, success, fail, baike_num = 10 }) {
    return BaiduAISdk.identify({
      url: BaiduAISdk.BAIDU_API_OBJECT_URL,
      data: {
        image,
        baike_num,
      },
      success,
      fail,
    });
  }
  //  植物识别
  static identifyPlant({ image, success, fail, baike_num = 10 }) {
    return BaiduAISdk.identify({
      url: BaiduAISdk.BAIDU_API_PLANT_URL,
      data: {
        image,
        baike_num,
      },
      success,
      fail,
    });
  }
  //  动物识别
  static identifyAnimal({ image, success, fail, top_num = 5, baike_num = 10 }) {
    return BaiduAISdk.identify({
      url: BaiduAISdk.BAIDU_API_ANIMAL_URL,
      data: {
        image,
        top_num,
        baike_num,
      },
      success,
      fail,
    });
  }
  //  OCR高精度版本
  static identifyOCRHighLevel({
    image,
    success,
    fail,
    language_type = "CHN_ENG",
    recognize_granularity = "big",
    detect_direction = false,
    vertexes_location = false,
    paragraph = false,
    probability = false,
  }) {
    return BaiduAISdk.identify({
      url: BaiduAISdk.BAIDU_API_OCR_NORMAL_LEVEL_URL,
      data: {
        image,
        language_type,
        recognize_granularity,
        detect_direction,
        vertexes_location,
        paragraph,
        probability,
      },
      success,
      fail,
    });
  }
}

export default BaiduAISdk;
