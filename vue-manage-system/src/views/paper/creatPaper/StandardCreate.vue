<template>
  <div id="standardCreatePaperPage">
    <el-form :model="form" style="margin-left:5%;" :rules="rules">
      <el-row>
        <el-col :span="6" style="margin-left:3%;">
          <el-form-item prop="name" label="试卷名:">
            <el-input v-model="form.name" style="width:180px" placeholder="请输入试卷名"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="7">
          <el-form-item prop="type" label="试卷类型">
            <el-select v-model="form.type" placeholder="请选择试卷类型">
              <el-option label="Java" value="java"></el-option>
              <el-option label="C++" value="cpp"></el-option>
              <el-option label="数据结构" value="dataStruct"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item prop="difficulty" label="试卷难度">
            <el-select v-model="form.difficulty" placeholder="请选择难度" style="width:120px">
              <el-option label="简单" value="easy"></el-option>
              <el-option label="一般" value="normal"></el-option>
              <el-option label="困难" value="hard"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <div v-for="(value, index) in form.configItems" :key="index">
        <el-row>
          <el-col :span="6">
            <el-form-item
              :rules="configItemRules.subjectClassRules"
              :prop="'configItems.'+index+'.subjectClass'"
              label="配置项:"
              label-width="80px"
            >
              <el-select
                v-model="form.configItems[index].subjectClass"
                placeholder="请选择题目类别"
                clearable
                @keyup.enter.native="addlastitems(index, '1')"
              >
                <el-option label="Java" value="java"></el-option>
                <el-option label="C++" value="cpp"></el-option>
                <el-option label="数据结构" value="dataStruct"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item
              :rules="configItemRules.subjectTypeRules"
              :prop="'configItems.'+index+'.subjectType'"
            >
              <el-select
                v-model="form.configItems[index].subjectType"
                placeholder="请选择题型"
                clearable
                @keyup.enter.native="addlastitems(index, '1')"
              >
                <el-option label="选择题" value="choose"></el-option>
                <el-option label="填空题" value="fillBlank"></el-option>
                <el-option label="编程题" value="program"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item
              :rules="configItemRules.subjectNumbersRules"
              :prop="'configItems.'+index+'.subjectNumbers'"
            >
              <el-input
                v-model.number="form.configItems[index].subjectNumbers"
                placeholder="请输入试题数"
                clearable
                @keyup.enter.native="addlastitems(index, '1')"
              />
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item
              :rules="configItemRules.subjectDifficultyRules"
              :prop="'configItems.'+index+'.subjectDifficulty'"
            >
              <el-select
                v-model="form.configItems[index].subjectDifficulty"
                placeholder="请选择难度"
                clearable
                @keyup.enter.native="addlastitems(index, '1')"
              >
                <el-option label="简单" value="easy"></el-option>
                <el-option label="一般" value="normal"></el-option>
                <el-option label="困难" value="hard"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item
              :rules="configItemRules.subjectScoreRules"
              :prop="'configItems.'+index+'.subjectScore'"
            >
              <el-input
                v-model.number="form.configItems[index].subjectScore"
                placeholder="请输入分值"
                clearable
                @keyup.enter.native="addlastitems(index, '1')"
              />
            </el-form-item>
          </el-col>

          <section v-if="index === 0">
            <el-col :span="2">
              <el-button
                type="primary"
                icon="el-icon-plus"
                plain
                style="margin-left:10px;"
                circle
                @click="addlastitems(index, '1')"
              />
            </el-col>
          </section>

          <section v-if="index > 0">
            <el-col :span="2">
              <el-button
                type="danger"
                icon="el-icon-delete"
                plain
                style="margin-left:10px;"
                circle
                @click="rmlastitems(index, '1')"
              />
            </el-col>
          </section>
        </el-row>
      </div>

      <el-form-item style="margin-left:40%;margin-top:5%">
        <el-button type="primary" @click="handleStartCombPaper">开始组卷</el-button>
        <el-button @click="handleReturn">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "StandardCreatePaper",
  data() {
      var checkSubjectNumbers = (rule, value, callback) => {
        if (value == null) {
          return callback(new Error('请输入试题数量配置'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入试题数量值'));
          } else {
            if (value <= 0) {
              callback(new Error('必须至少要有一道以上题目'));
            } else {
              callback();
            }
          }
        }, 100);
      };
      var checkSubjectScore = (rule, value, callback) => {
        if (value == null) {
          return callback(new Error('请输入试题分数配置'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入试题分数整数值'));
          } else {
            if (value <= 0) {
              callback(new Error('分数必需大于0'));
            } else {
              callback();
            }
          }
        }, 100);
      };
    return {
      //试卷配置项明细
      form: {
        name: "",
        type: "",
        difficulty: "",
        configItems: [
          {
            subjectClass: "",
            subjectType: "",
            subjectNumbers: "",
            subjectDifficulty: "",
            subjectScore: ""
          }
        ]
      },

      //验证规则
      rules: {
        name: [{ required: true, message: "请输入试卷名", trigger: "blur" }],
        type: [{ required: true, message: "请输入试卷类型", trigger: "blur" }],
        difficulty: [{ required: true, message: "请输入试卷难度", trigger: "blur" }]
      },

      configItemRules: {
        subjectClassRules: [
          { required: true, message: "请输入试题类别配置", trigger: "blur" }
        ],
        subjectTypeRules: [{ required: true, message: "请输入试题题型配置", trigger: "blur" }],
        subjectNumbersRules: [
            { validator:checkSubjectNumbers,trigger: "blur"}
        ],
        subjectDifficultyRules: [{ required: true, message: "请输入试题难度配置", trigger: "blur" }],
        subjectScoreRules: [{ validator:checkSubjectScore, trigger: "blur" }]
      }
    };
  },
  created: function() {},
  inject: ["reload"],
  methods: {
    // 处理查询按钮点击方法
    query() {},
    handleStartCombPaper() {},
    handleReturn() {
      console.log(this.form.configItems);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    //格式化表格difficulty列的输出
    difficultyFormatter(row, column) {
      if (row.subjectDifficulty == "easy") {
        return "简单";
      } else if (row.subjectDifficulty == "normal") {
        return "一般";
      } else if (row.subjectDifficulty == "hard") {
        return "困难";
      }
    },
    timeFormatter(row, column) {
      if (row.updatedTime) {
        var timestamp = row.updatedTime;
        return new Date(timestamp).toLocaleString("chinese", { hour12: false });
      }
    },
    statusFormatter(row, column) {
      if (row.status == 0) {
        return "未启用";
      } else if (row.status == 1) {
        return "已启用";
      } else {
        return "未知";
      }
    },
    addlastitems(index, type) {
      if (type === "1") {
        this.form.configItems.push({
          subjectClass: "",
          subjectType: "",
          subjectNumbers: "",
          subjectDifficulty: "",
          subjectScore: ""
        });
      }
    },
    rmlastitems(index, type) {
      switch (type) {
        case "1":
          this.form.configItems.splice(index, 1);
          break;
        default:
          break;
      }
      this.$message.success("移除成功");
    }
  }
};
</script>

