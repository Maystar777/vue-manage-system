<template>
  <div>
    <el-form :inline="true" v-model="searchReport">
      &nbsp;&nbsp;
      <el-form-item label="场次号">
        <el-input
          style="width: 100px;"
          placeholder="请输入内容"
          v-model="searchReport.sessionId"
          clearable
        ></el-input>
      </el-form-item>&nbsp;&nbsp;
      <el-form-item label="考试名:">
        <el-input
          style="width: 100px;"
          placeholder="请输入内容"
          v-model="searchReport.examName"
          clearable
        ></el-input>
      </el-form-item>&nbsp;&nbsp;
      <el-form-item label="试卷发布人:">
        <el-input
          style="width: 100px;"
          placeholder="请输入内容"
          v-model="searchReport.publisher"
          clearable
        ></el-input>
      </el-form-item>&nbsp;&nbsp;
      <el-form-item label="考试时间段:从">
        <el-date-picker
          v-model="searchReport.actualStartTime"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
          style="width: 100px;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="至">
        <el-date-picker
          v-model="searchReport.actualEndTime"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
          style="width: 100px;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button plain>查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="examReport"
      style="width: 100%"
      row-style="height:20px"
      cell-style="padding:0"
      :row-class-name="tableRowClassName"
      :default-sort="{prop: 'examName', order: 'Ascending'}"
      stripe
    >
      <el-table-column type="selection" width="100"></el-table-column>
      <el-table-column prop="examName" label="考试名" width="160"></el-table-column>
      <el-table-column prop="sessionId" label="场次" width="160"></el-table-column>
      <el-table-column prop="endTime" label="考试截止时间" width="160"></el-table-column>
      <el-table-column prop="planPeopleNum" label="计划考试人数" width="160"></el-table-column>
      <el-table-column prop="actualPeopleNum" label="实际考试人数" width="160"></el-table-column>
      <el-table-column prop="Action" label="操作">
        <el-button type="text" class="el-icon-question" @click="lookExamReportItem"></el-button>
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
  </div>
</template>

<script>
export default {
  name: "ExamReport",
  data() {
    return {
      examReport: [
        {
          examName: "h",
          sessionId: "h",
          endTime: "gg",
          planPeopleNum: "a",
          actualPeopleNum: "0"
        },
        {
          examName: "h",
          sessionId: "h",
          endTime: "gg",
          planPeopleNum: "a",
          actualPeopleNum: "0"
        }
      ],
      searchReport: {
        sessionId: "",
        examName: "",
        publisher: "",
        actualStartTime: "",
        actualEndTime: ""
      },

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
      value1: ""
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
    lookExamReportItem(rowData) {
      this.$router.push("./ExamReportItem");
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
</style>