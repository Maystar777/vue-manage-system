<template>
  <div>
    <el-form :inline="true" v-model="searchMarking">
      &nbsp;&nbsp;
      <el-form-item label="批阅状态:">
        <el-select v-model="searchMarking.status" placeholder="请选择" class="editInput">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>&nbsp;&nbsp;
      <el-form-item label="交卷时间段:从">
        <el-date-picker
          v-model="searchMarking.submitStartTime"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="至">
        <el-date-picker
          v-model="searchMarking.submitEndTime"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>&nbsp;&nbsp;
      <el-form-item label="场次编号">
        <el-input
          style="width: 100px;"
          placeholder="请输入内容"
          v-model="searchMarking.sessionId"
          clearable
        ></el-input>
      </el-form-item>&nbsp;&nbsp;
      <el-form-item>
        <el-button plain>查询</el-button>
      </el-form-item>
    </el-form>&nbsp;
    <el-button type="text" class="el-icon-tickets" style="font-size: 15px" @click="markingExam">阅卷</el-button>

    <el-table
      :data="markingList"
      style="width: 100%"
      row-style="height:20px"
      cell-style="padding:0"
      :row-class-name="tableRowClassName"
      :default-sort="{prop: 'status,markingStopTime', order: 'Ascending'}"
      stripe
    >
      <el-table-column type="selection" width="30"></el-table-column>
      <el-table-column prop="paper" label="试卷" width="80"></el-table-column>
      <el-table-column prop="sessionId" label="场次" width="100"></el-table-column>
      <el-table-column prop="createTime" label="发布日期" width="120"></el-table-column>
      <el-table-column prop="tel" label="答卷人手机号" width="100"></el-table-column>
      <el-table-column prop="name" label="答卷人" width="100"></el-table-column>
      <el-table-column prop="submitTime" label="交卷时间" width="120"></el-table-column>
      <el-table-column prop="markingStopTime" label="阅卷截止时间" sortable width="120"></el-table-column>
      <el-table-column prop="objective" label="客观题" width="80"></el-table-column>
      <el-table-column prop="subjective" label="主观题" width="80"></el-table-column>
      <el-table-column prop="systemEvaluate" label="系统评价" width="120"></el-table-column>
      <el-table-column prop="status" label="状态" width="100" sortable></el-table-column>
      <el-table-column prop="Action" label="操作列">
        <el-button type="text" class="el-icon-tickets" @click="markingExam"></el-button>
      </el-table-column>
    </el-table>

    <el-pagination
      style="text-align: center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage3"
      :page-size="100"
      layout="prev, pager, next, jumper"
      :total="1000"
    ></el-pagination>

    <!-- 查看试卷明细操作 -->
    <el-dialog
      title="答卷信息"
      :visible.sync="markingDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <div class="divMarking">
        <el-row class="rowTitle">
          <label>{{paper.title}}</label>
        </el-row>
        <div
          v-for="(item , index) of paper.subjectList"
          class="subjectDiv"
          v-bind:index="index"
          v-bind:key="item.id"
        >
          <label>{{index + 1}}.{{item.subject}}</label>
          <label v-if="item.categoryId == 1">&nbsp;&nbsp;({{item.myAnswer}})</label>
          <label v-if="item.categoryId == 2">&nbsp;&nbsp;___{{item.myAnswer}}___</label>
          <label v-if="item.categoryId == 3">&nbsp;&nbsp;___{{item.myAnswer}}___</label>
          <!-- 答案信息 -->
          <div v-if="item.categoryId == 1" class="divExam">
            <el-radio-group
              v-for="(itemAnswer , indexAnswer) of item.answerList"
              v-bind:index="indexAnswer"
              v-bind:key="itemAnswer.id"
              v-model="itemAnswer.myAnswer"
            >
              <el-radio
                disabled="disabled"
                v-if="item.myAnswer == itemAnswer.answer"
                selected="selected"
              >{{itemAnswer.answer}}</el-radio>
              <el-radio label="1" disabled="disabled" v-else>{{itemAnswer.answer}}</el-radio>
            </el-radio-group>
          </div>
          <div v-if="item.categoryId == 2" class="divExam">
            <el-radio-group>
              <el-radio label="正确" disabled="disabled">正确</el-radio>
              <el-radio label="错误" disabled="disabled">错误</el-radio>
            </el-radio-group>
          </div>
          <div v-if="item.categoryId == 3" class="divExam">
            <label size="small" class="inputAnswer">我的答案：{{item.myAnswer}}</label>
            &nbsp;&nbsp;
            <label
              size="small"
              class="inputAnswer"
              style="color:red;"
            >正确答案：{{item.answer}}</label>
          </div>
          <div v-if="item.categoryId == 4" class="divExamQuestion">
            <img :src="item.myAnswer" class="avatar" />
          </div>
          <div class="divScore">
            <label>得分:&nbsp;&nbsp;</label>

            <el-input
              v-if="item.categoryId != 4"
              class="score"
              value="item.score"
              disabled="disabled"
              v-model="item.score"
            ></el-input>
            <el-input v-else v-model="item.score" class="score"></el-input>
          </div>
          <div class="divEvaluate" v-if="item.categoryId == 4">
            评语:&nbsp;&nbsp;
            <el-input type="textarea" :rows="2" v-model="item.evaluate" class="evaluate"></el-input>
          </div>
          <br />
        </div>
      </div>
      <br />
      <el-row :gutter="30">
        <el-col :offset="1">
          总得分:&nbsp;&nbsp;
          <el-input type="text" v-model="paper.totleScore" class="score"></el-input>
        </el-col>
      </el-row>
      <br />
      <el-row :gutter="30">
        <el-col :offset="1">
          &emsp;评语:&nbsp;&nbsp;
          <el-input type="text" v-model="paper.evaluate" class="evaluate"></el-input>
        </el-col>
      </el-row>
      <br />

      <el-row :gutter="30">
        <el-col span="5" :offset="8">
          <el-button>提交</el-button>
        </el-col>
        <el-col span="5">
          <el-button type="danger">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "MarkingList",
  data() {
    return {
      markingList: [
        {
          paper: "h",
          sessionId: "h",
          createTime: "gg",
          tel: "a",
          name: "0",
          submitTime: "0",
          markingStopTime: "h",
          objective: "h",
          subjective: "gg",
          systemEvaluate: "a",
          status: "0"
        },
        {
          paper: "h",
          sessionId: "h",
          createTime: "gg",
          tel: "a",
          name: "0",
          submitTime: "0",
          markingStopTime: "h",
          objective: "h",
          subjective: "gg",
          systemEvaluate: "a",
          status: "0"
        }
      ],

      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      markingDialogVisible: false,
      paper: {
        title: "JAVA",
        subjectList: [
          {
            subject: "选择题题目",
            categoryId: "1",
            answerList: [
              {
                answer: "A"
              },
              {
                answer: "B"
              },
              {
                answer: "C"
              }
            ],
            myAnswer: "A",
            score: "",
            evaluate: ""
          },
          {
            subject: "选择题题目",
            categoryId: "1",
            answerList: [
              {
                answer: "A"
              },
              {
                answer: "B"
              },
              {
                answer: "C"
              }
            ],
            myAnswer: "",
            score: "",
            evaluate: ""
          },
          {
            subject: "选择题题目",
            categoryId: "1",
            answerList: [
              {
                answer: "A"
              },
              {
                answer: "B"
              },
              {
                answer: "C"
              }
            ],
            myAnswer: "",
            score: "",
            evaluate: ""
          },
          {
            subject: "判断题题目",
            categoryId: "2",
            answer: "A.测试A B.测试B",
            myAnswer: "",
            score: "",
            evaluate: ""
          },
          {
            subject: "判断题题目",
            categoryId: "2",
            answer: "A.测试A B.测试B",
            myAnswer: "正确",
            score: "",
            evaluate: ""
          },
          {
            subject: "填空题题目",
            categoryId: "3",
            answer: "正确答案",
            myAnswer: "测试",
            score: "",
            evaluate: ""
          },
          {
            subject: "问答题题目",
            categoryId: "4",
            answer: "",
            myAnswer: "",
            score: "",
            evaluate: ""
          },
          {
            subject: "问答题题目",
            categoryId: "4",
            answer: "",
            myAnswer: "",
            score: "",
            evaluate: ""
          }
        ],
        totalScore: "",
        evaluate: ""
      },
      searchMarking: {
        status: "",
        submitStartTime: "",
        submitEndTime: "",
        sessionId: ""
      },
      options: [
        {
          label: "已批阅"
        },
        {
          label: "未批阅"
        }
      ]
    };
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    markingExam(rowData) {
      //打开编辑界面，并且设置数据
      //this.lookFormData = Object.assign({}, rowData);
      this.markingDialogVisible = true;
    }
  }
};
</script>

<style scoped>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

.editInput {
  width: 220px;
}
.divMarking {
  border: 1px black solid;
}
.rowTitle {
  text-align: center;
}
.subjectDiv {
  position: relative;
  left: 1%;
  top: 5%;
  width: 98%;
  text-align: left;
  display: inline-block;
  height: auto;
}
.inputAnswer {
  width: 60%;
}
.submitButton {
  text-align: center;
}

.divExam {
  position: relative;
  width: 78%;
}
.divExamQuestion {
  position: relative;
  width: 78%;
  min-height: 80px;
}
.divScore {
  position: absolute;
  top: 1%;
  right: 1%;
  width: 20%;
  color: red;
  text-align: right;
}
.divEvaluate {
  position: absolute;
  top: 40px;
  right: 1%;
  width: 30%;
  color: red;
  text-align: right;
}
.score {
  width: 40%;
}

.evaluate {
  width: 70%;
}
</style>