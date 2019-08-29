<!-- 登录页面 -->
<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">博思考试系统</div>
      <el-form
        v-show="showUsernameForm"
        :model="UsernameForm"
        :rules="rules"
        ref="UsernameForm"
        label-width="0px"
        class="ms-content"
      >
        <el-form-item prop="username">
          <el-input v-model="UsernameForm.username" placeholder="请输入用户名">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="UsernameForm.password"
            @keyup.enter.native="submitForm('UsernameForm')"
          >
            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>
        <el-checkbox class="box" label="记住密码" name="type">记住密码</el-checkbox>
        <a href="#" class="float-right">忘记密码</a>
        <div class="login-btn">
          <el-button type="primary" round @click="submitForm('UsernameForm')">登录</el-button>
        </div>
        <a href="#" @click="change()">短信验证码登录</a>
        <a href="#" class="float-right">注册</a>
      </el-form>

      <el-form
        v-show="showMessageForm"
        :model="MessageForm"
        :rules="rules"
        ref="MessageForm"
        label-width="0px"
        class="ms-content"
      >
        <el-form-item prop="phone">
          <el-input ref="phoneInput" v-model="MessageForm.phone" placeholder="请输入手机号">
            <el-button slot="prepend" icon="el-icon-mobile-phone"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            class="getMessage"
            type="code"
            placeholder="请输入验证码"
            v-model="MessageForm.code"
            @keyup.enter.native="submitForm('MessageForm')"
          >
            <el-button slot="prepend" icon="el-icon-message"></el-button>
          </el-input>
          <el-button
            :disabled="codeSent"
            id="btnCode"
            class="float-right"
            @click="sendCode"
          >{{codeBtnText}}</el-button>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" round @click="submitForm('MessageForm')">登录</el-button>
        </div>
        <a href="#" @click="change()">账号密码登录</a>
        <a href="#" class="float-right">注册</a>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        console.log(reg.test(value));
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    return {
      UsernameForm: {
        username: "admin",
        password: "123123"
      },
      MessageForm: {
        phone: "",
        code: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" }
        ],
        code: [{ required: true, message: "请输入短信验证码", trigger: "blur" }]
      },
      showUsernameForm: true,
      showMessageForm: false,
      codeBtnText: "获取短信验证码",
      codeSent: false,
      timeCount: 60
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          localStorage.setItem("ms_username", this.UsernameForm.username);
          this.$router.push("/BasicData");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    change() {
      this.showUsernameForm = !this.showUsernameForm;
      this.showMessageForm = !this.showMessageForm;
    },
    sendCode() {
      this.codeSent = true;
      this.countSecond();
    },
    countSecond() {
      if (this.timeCount <= 0) {
        this.resetCount();
        return;
      }
      this.codeBtnText = `${this.timeCount}秒后可重发`;
      this.timer = setTimeout(() => {
        this.timeCount--;
        this.countSecond();
      }, 1000);
    },
    resetCount() {
      clearTimeout(this.timer);
      this.codeSent = false;
      this.codeBtnText = `重新获取短信验证码`;
      this.$nextTick(() => {
        this.timeCount = 60;
      });
    }
  }
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/login-bg.jpg);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #909399;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-top: 10px;
  margin-bottom: 10px;
}
a,
.login-tips {
  font-size: 13px;
  line-height: 30px;
  color: #fff;
  padding-left: 10px;
  padding-right: 10px;
}
.box {
  font-size: 12px;
  line-height: 30px;
  padding-left: 5px;
}
.float-right {
  float: right;
}
.getMessage {
  width: 155px;
}
#btnCode {
  width: 135px;
}
</style>