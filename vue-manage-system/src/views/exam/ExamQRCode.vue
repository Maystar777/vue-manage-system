<template>
<div class="QR">
  <div class="QRCode">
    <div id="qrCode" ref="qrCodeDiv"></div>
  </div>
  <div class="labelDiv">
  <label class="label">
    提示：扫描二维码，填写个人信息（手机号、姓名、性别）点确认开始进行答卷倒计时
  </label>
  </div>
</div>
</template>

<script>
import QRCode from 'qrcodejs2';
export default {
  name: "ExamQRCode",
  data() {
    return{}
  },
    mounted: function () {
        
      this.$nextTick(function () {
        this.bindQRCode();
      })
    },
    methods: {
      bindQRCode: function () {
        
          alert(this.$route.params.publishId)
        new QRCode(this.$refs.qrCodeDiv, {
        //   text: 'https://www.baidu.com',
          text: `http://192.168.43.94:23078/#/userInfo/${this.$route.params.publishId}`,
          width: 300,
          height: 300,
          colorDark: "#333333", //二维码颜色
          colorLight: "#ffffff", //二维码背景色
          correctLevel: QRCode.CorrectLevel.L//容错率，L/M/H
        })
      }
    }
};
</script>

<style scoped>
.QR{
    position: relative;
    width: 100%;
    height: 100%;
}
.QRCode {
  position: relative;
  top: 20%;
  left: 40%;
  width: 60%;

}
.labelDiv{
    position: relative;
    top: 25%;
    left: 3%;
    text-align: center;
    
}
</style>