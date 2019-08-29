<template>
  <div>
    <el-form :inline="true" v-model="searchExamRecord">
      &nbsp;&nbsp;
      <el-form-item label="考试名:">
        <el-input
          class="editInput"
          placeholder="请输入内容"
          v-model="searchExamRecord.examName"
          clearable
        ></el-input>
      </el-form-item>&nbsp;&nbsp;
      <el-form-item label="场次编号">
        <el-input
          class="editInput"
          placeholder="请输入内容"
          v-model="searchExamRecord.sessionId"
          clearable
        ></el-input>
      </el-form-item>&nbsp;&nbsp;
      <el-form-item label="考试时间段:从">
        <el-date-picker
          v-model="searchExamRecord.examStartTime"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
          style="width:140px;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="至">
        <el-date-picker
          v-model="searchExamRecord.examEndTime"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
          style="width:140px;"
        ></el-date-picker>
      </el-form-item>&nbsp;&nbsp;
      <el-form-item label="试卷发布人:">
        <el-input
          class="editInput"
          placeholder="请输入内容"
          v-model="searchExamRecord.publisher"
          clearable
        ></el-input>
      </el-form-item>&nbsp;&nbsp;
      <el-form-item>
        <el-button plain>查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="examRecordList"
      style="width: 100%"
      row-style="height:20px"
      cell-style="padding:0"
      :row-class-name="tableRowClassName"
      :default-sort="{prop: 'examName', order: 'Ascending'}"
      stripe
    >
      <el-table-column type="selection" width="30"></el-table-column>
      <el-table-column prop="examName" label="考试名" width="100"></el-table-column>
      <el-table-column prop="sessionId" label="场次" width="140"></el-table-column>
      <el-table-column prop="examEndTime" label="考试截止时间" width="140"></el-table-column>
      <el-table-column prop="tel" label="答卷人手机号" width="140"></el-table-column>
      <el-table-column prop="name" label="姓名" width="100"></el-table-column>
      <el-table-column prop="startTime" label="开始考试时间" width="140"></el-table-column>
      <el-table-column prop="submitTime" label="交卷时间" width="140"></el-table-column>
      <el-table-column prop="objective" label="客观题得分" width="100"></el-table-column>
      <el-table-column prop="subjective" label="主观题得分" width="100"></el-table-column>
      <el-table-column prop="Action" label="操作列">
        <el-button type="text" @click="lookExamRecord">查看试卷明细</el-button>
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
      :visible.sync="lookDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      aria-disabled="disabled"
      center
    >
      <div class="paper">
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
          <div v-if="item.categoryId == 1">
            <el-radio-group
              v-for="(itemAnswer , indexAnswer) of item.answerList"
              v-bind:index="indexAnswer"
              v-bind:key="itemAnswer.id"
              v-model="itemAnswer.myAnswer"
            >
              <el-radio
                disabled="disabled"
                v-if="item.myAnswer == itemAnswer.answer"
                aria-selected="selected"
              >{{itemAnswer.answer}}</el-radio>
              <el-radio label="1" disabled="disabled" v-else>{{itemAnswer.answer}}</el-radio>
            </el-radio-group>
          </div>
          <div v-if="item.categoryId == 2">
            <el-radio-group v-model="item.myAnswer">
              <el-radio label="正确" v-if="item.myAnswer == '正确'" aria-selected="selected">正确</el-radio>
              <el-radio label="错误" v-else-if="item.myAnswer == '错误'" aria-selected="selected">错误</el-radio>
            </el-radio-group>
          </div>
          <div v-if="item.categoryId == 3">
            <label size="small" class="inputAnswer">我的答案：{{item.myAnswer}}</label>
            &nbsp;&nbsp;
            <label
              size="small"
              class="inputAnswer"
              style="color:red;"
            >正确答案：{{item.answer}}</label>
          </div>
          <div v-if="item.categoryId == 4">
            <img :src="item.answer" class="avatar" />
          </div>
          <br />
        </div>
        <br />
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "PublishExamRecord",
  data() {
    return {
      examRecordList: [
        {
          examName: "h",
          sessionId: "h",
          examEndTime: "gg",
          tel: "a",
          name: "0",
          startTime: "h",
          submitTime: "h",
          objective: "gg",
          subjective: "a"
        },
        {
          examName: "h",
          sessionId: "h",
          examEndTime: "gg",
          tel: "a",
          name: "0",
          startTime: "h",
          submitTime: "h",
          objective: "gg",
          subjective: "a"
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
      lookDialogVisible: false,
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
            myAnswer: "A"
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
            myAnswer: ""
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
            myAnswer: ""
          },
          {
            subject: "判断题题目",
            categoryId: "2",
            answer: "A.测试A B.测试B",
            myAnswer: ""
          },
          {
            subject: "判断题题目",
            categoryId: "2",
            answer: "A.测试A B.测试B",
            myAnswer: "正确"
          },
          {
            subject: "填空题题目",
            categoryId: "3",
            answer: "正确答案",
            myAnswer: "测试"
          },
          {
            subject: "问答题题目",
            categoryId: "4",
            answer: "",
            myAnswer: ""
          }
        ],
        imageUrl: ""
      },
      searchExamRecord: {
        examName: "",
        sessionId: "",
        examStartTime: "",
        examEndTime: "",
        publisher: ""
      }
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
    lookExamRecord(rowData) {
      //打开编辑界面，并且设置数据
      //this.lookFormData = Object.assign({}, rowData);
      this.lookDialogVisible = true;
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
  width: 140px;
}

.rowTitle {
  text-align: center;
}
.subjectDiv {
  text-align: left;
}
.paper {
  border: 1px black solid;
}
.inputAnswer {
  width: 60%;
}
.submitButton {
  text-align: center;
}
</style>