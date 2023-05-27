<script setup lang="ts">
import AnimationChat from "@/components/animations/AnimationChat1.vue";
import ZpAnimation1 from "@/components/animations/ZpAnimation1.vue";
import ZpAnimation2 from "@/components/animations/ZpAnimation2.vue";
import ZpAnimation3 from "@/components/animations/ZpAnimation3.vue";
import {useDisplay} from "vuetify";

const {mobile} = useDisplay();


</script>

<template>

  <v-toolbar v-if="mobile" color="white">
    <img src="@/assets/zp/logo.png" width="100"/>
    <v-toolbar-title>
      <span class="text-h6 font-weight-bold">上海忠平物流</span>
    </v-toolbar-title>
  </v-toolbar>
  <v-card v-else>
    <v-container>
      <v-row>
        <v-col cols="1">
          <img src="@/assets/zp/logo.png" width="100"/>
        </v-col>
        <v-col cols="2">
          <div class="mt-2">
            <span class="text-h6 font-weight-bold">上海忠平物流</span>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>


  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="5" lg="5">
        <v-card-title class="text-center">公司简介</v-card-title>
        <v-card-subtitle class="text-center text-pre-wrap">
          上海忠平物流有限公司公司成立于2008年，是一家以供应链管理服务为主导的专业第三方物流，总部设在上海。
        </v-card-subtitle>
        <v-card-subtitle class="text-center text-pre-wrap">
          目前业务涉及配送涉及大型超市、高端超市、大型连锁餐饮、高端餐饮客户等等。
        </v-card-subtitle>
        <v-card-subtitle class="text-center text-pre-wrap">
          公司具备“整体解决方案基础”立志于将服务做到区域内最大，并提供各项增值服务，形成专业的物流服务体系。
        </v-card-subtitle>
        <ZpAnimation1 :size="300" />
      </v-col>
      <v-col cols="12" sm="5" lg="7" class="ml-auto">
        <img src="@/assets/zp/truck2.jpg" alt="banner" class="img-fluid"/>
      </v-col>
    </v-row>
  </v-container>

  <v-card>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="5" lg="7" class="ml-auto">
          <img src="@/assets/zp/truck3.jpg" alt="banner" class="img-fluid"/>
        </v-col>
        <v-col cols="12" sm="5" lg="5">
          <div class="text-center font-weight-medium text-h6">公司实力</div>
          <v-card-subtitle class="text-center text-pre-wrap">
            目前公司专注于冷藏、冷冻、市内配送服务及普通货物运输。
          </v-card-subtitle>
          <v-card-subtitle class="text-center text-pre-wrap  ">
            拥有多款车型，冷藏运输资源覆盖了华东及华南地区多个城市。
          </v-card-subtitle>
          <v-card-subtitle class="text-center text-pre-wrap">
            车辆配有GPS温度记录仪，可随时监控车厢温度、制冷机开关情况及车辆位置。
          </v-card-subtitle>
          <ZpAnimation2 :size="300" />
        </v-col>
      </v-row>
    </v-container>
  </v-card>

  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="5" lg="5">
        <v-card-title class="text-center">业务范围</v-card-title>
        <v-card-subtitle class="text-center text-pre-wrap">
          目前公司专注于冷藏、冷冻、市内配送服务及普通货物运输。
        </v-card-subtitle>
        <v-card-subtitle class="text-center text-pre-wrap">
          冷藏运输资源涵盖了大部分车型，覆盖了华东及华南地区多个城市。
        </v-card-subtitle>
        <ZpAnimation3 :size="300" />
      </v-col>
      <v-col cols="12" sm="5" lg="7" class="ml-auto">
        <img src="@/assets/zp/truck4.jpg" alt="banner" class="img-fluid"/>
      </v-col>
    </v-row>
  </v-container>


  <v-card>
    <div class="text-center mt-6">
      <h2 class="font-weight-medium">
        我们的合作伙伴
      </h2>
    </div>
    <v-container>
      <v-row class="mt-8">
        <v-col cols="6" md="3" sm="6">
          <v-card class="portfolio-card overflow-hidden card-shadow">
            <div class="portfolio-img">
              <img src="@/assets/sb/s01.jpg"/>
            </div>
          </v-card>
        </v-col>
        <v-col cols="6" md="3" sm="6">
          <v-card class="portfolio-card overflow-hidden card-shadow">
            <div class="portfolio-img">
              <img src="@/assets/sb/s02.jpg"/>
            </div>
          </v-card>
        </v-col>
        <v-col cols="6" md="3" sm="6">
          <v-card class="portfolio-card overflow-hidden card-shadow">
            <div class="portfolio-img">
              <img src="@/assets/sb/s03.jpg"/>
            </div>
          </v-card>
        </v-col>
        <v-col cols="6" md="3" sm="6">
          <v-card class="portfolio-card overflow-hidden card-shadow">
            <div class="portfolio-img">
              <img src="@/assets/sb/s04.jpg"/>
            </div>
          </v-card>
        </v-col>
        <v-col cols="6" md="3" sm="6">
          <v-card class="portfolio-card overflow-hidden card-shadow">
            <div class="portfolio-img">
              <img src="@/assets/sb/s05.jpg"/>
            </div>
          </v-card>
        </v-col>
        <v-col cols="6" md="3" sm="6">
          <v-card class="portfolio-card overflow-hidden card-shadow">
            <div class="portfolio-img">
              <img src="@/assets/sb/s06.jpg"/>
            </div>
          </v-card>
        </v-col>
        <v-col cols="6" md="3" sm="6">
          <v-card class="portfolio-card overflow-hidden card-shadow">
            <div class="portfolio-img">
              <img src="@/assets/sb/s07.jpg"/>
            </div>
          </v-card>
        </v-col>
        <v-col cols="6" md="3" sm="6">
          <v-card class="portfolio-card overflow-hidden card-shadow">
            <div class="portfolio-img">
              <img src="@/assets/sb/s08.jpg"/>
            </div>
          </v-card>
        </v-col>
        <v-col cols="6" md="3" sm="6">
          <v-card class="portfolio-card overflow-hidden card-shadow">
            <div class="portfolio-img">
              <img src="@/assets/sb/s09.jpg"/>
            </div>
          </v-card>
        </v-col>
        <v-col cols="6" md="3" sm="6">
          <v-card class="portfolio-card overflow-hidden card-shadow">
            <div class="portfolio-img">
              <img src="@/assets/sb/s10.jpg"/>
            </div>
          </v-card>
        </v-col>
        <v-col cols="6" md="3" sm="6">
          <v-card class="portfolio-card overflow-hidden card-shadow">
            <div class="portfolio-img">
              <img src="@/assets/sb/s11.jpg"/>
            </div>
          </v-card>
        </v-col>
        <v-col cols="6" md="3" sm="6">
          <v-card class="portfolio-card overflow-hidden card-shadow">
            <div class="portfolio-img">
              <img src="@/assets/sb/s12.jpg"/>
            </div>
          </v-card>
        </v-col>
        <v-col cols="6" md="3" sm="6">
          <v-card class="portfolio-card overflow-hidden card-shadow">
            <div class="portfolio-img">
              <img src="@/assets/sb/s13.jpg"/>
            </div>
          </v-card>
        </v-col>
        <v-col cols="6" md="3" sm="6">
          <v-card class="portfolio-card overflow-hidden card-shadow">
            <div class="portfolio-img">
              <img src="@/assets/sb/s14.jpg"/>
            </div>
          </v-card>
        </v-col>
        <v-col cols="6" md="3" sm="6">
          <v-card class="portfolio-card overflow-hidden card-shadow">
            <div class="portfolio-img">
              <img src="@/assets/sb/s15.jpg"/>
            </div>
          </v-card>
        </v-col>
        <v-col cols="6" md="3" sm="6">
          <v-card class="portfolio-card overflow-hidden card-shadow">
            <div class="portfolio-img">
              <img src="@/assets/sb/s16.jpg"/>
            </div>
          </v-card>
        </v-col>
        <v-col cols="6" md="3" sm="6">
          <v-card class="portfolio-card overflow-hidden card-shadow">
            <div class="portfolio-img">
              <img src="@/assets/sb/s17.jpg"/>
            </div>
          </v-card>
        </v-col>
        <v-col cols="6" md="3" sm="6">
          <v-card class="portfolio-card overflow-hidden card-shadow">
            <div class="portfolio-img">
              <img src="@/assets/sb/s18.jpg"/>
            </div>
          </v-card>
        </v-col>
        <v-col cols="6" md="3" sm="6">
          <v-card class="portfolio-card overflow-hidden card-shadow">
            <div class="portfolio-img">
              <img src="@/assets/sb/s19.jpg"/>
            </div>
          </v-card>
        </v-col>
        <v-col cols="6" md="3" sm="6">
          <v-card class="portfolio-card overflow-hidden card-shadow">
            <div class="portfolio-img">
              <img src="@/assets/sb/s20.jpg"/>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>

  <v-container>
    <!-- -----------------------------------------------
           Start Contact Form
       ----------------------------------------------- -->
    <v-row justify="center">
      <v-col cols="12" sm="10" md="9" lg="7">
        <div class="text-center">
          <h2 class="ui-title font-weight-bold">联系我们</h2>
          <p class="text-muted">
            我们将在一个工作日内与您取得联系
          </p>
        </div>
      </v-col>
    </v-row>

    <!-- -----------------------------------------------
      Start Contact Form
  ----------------------------------------------- -->
    <v-row justify="center">
      <v-col cols="12" md="4">
        <AnimationChat :size="300" />
      </v-col>
      <v-col cols="12" md="8">
        <div>
          <form>
            <v-row class="mt-7">
              <v-col cols="12" md="6" class="py-0">
                <v-text-field label="贵姓" variant="outlined" color="primary" placeholder="您的称呼" />
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <v-text-field label="号码" variant="outlined" type="phone" color="primary" placeholder="联系方式"/>
              </v-col>
              <v-col cols="12" class="py-0">
                <v-textarea
                  name="message"
                  color="primary"
                  variant="outlined"
                  label="备注"
                  placeholder="其它信息"
                  rows="3"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col offset="9">
                <v-btn color="primary">
                  提交
                </v-btn>
              </v-col>
            </v-row>
          </form>
        </div>
      </v-col>
    </v-row>
  </v-container>


  <v-footer>
    <v-container>
      <v-row>
        <v-col cols="12" md="2" sm="6">
          <h4 class="font-weight-regular font-18">总部地址</h4>
          <p class="mt-5 text-muted">上海市宝山区城银路525号1217室</p>
        </v-col>
        <v-col cols="12" md="2" sm="6">
          <h4 class="font-weight-regular font-18">电话</h4>
          <p class="mt-5 text-muted">021-66683379</p>
        </v-col>
        <v-col cols="12" md="2" sm="6">
          <h4 class="font-weight-regular font-18">邮件</h4>
          <p class="mt-5 text-muted">
            hu.yudang@shzpwl.com
          </p>
        </v-col>
        <v-col cols="12" md="2" sm="6">
          <h4 class="font-weight-regular font-18">官方网址</h4>
          <p class="mt-5 text-muted">
            www.shzpwl.com
          </p>
        </v-col>
        <v-col cols="12" md="2" sm="6">
          <h4 class="font-weight-regular font-18">TMS</h4>
          <p class="mt-5 text-muted">
            <a href="/order/query" class="link">忠平TMS</a>
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="5" sm="12">
          <div>
            <p>All Rights Reserved by
              <a href="https://www.shzpwl.com/" class="link">shzpwl.com</a>
            </p>
          </div>
        </v-col>
        <v-col cols="12" md="4" sm="12">
          <div>
            <a target="_blank"
               href="http://www.beian.gov.cn">
              <img src="@/assets/zp/icon-fw.png" style="float:left;"/>
              <p style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">
                沪ICP备2023010169号</p></a>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<style lang="scss">

.portfolio-card {
  .portfolio-img {
    overflow: hidden;
    max-height: 255px;

    img {
      transition: 0.1s ease-in;
      cursor: pointer;
    }

    &:hover {
      img {
        transform: scale(1.1);
      }
    }
  }
}


</style>
