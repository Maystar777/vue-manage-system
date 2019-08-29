<template>
  <div>
    <el-table
      :data="reportDetail"
      style="width: 100%"
      row-style="height:20px"
      cell-style="padding:0"
      :row-class-name="tableRowClassName"
      :default-sort="{prop: 'ranking', order: 'Ascending'}"
      stripe
    >
      <el-table-column prop="name" label="姓名" width="140"></el-table-column>
      <el-table-column prop="sex" label="性别" width="140"></el-table-column>
      <el-table-column prop="examName" label="考试名" width="140"></el-table-column>
      <el-table-column prop="objective" label="主观题" width="140"></el-table-column>
      <el-table-column prop="subjective" label="客观题" width="140"></el-table-column>
      <el-table-column prop="score" label="总分" width="140"></el-table-column>
      <el-table-column prop="ranking" label="排名" width="140"></el-table-column>
      <el-table-column prop="usingTime" label="考试耗时" width="140"></el-table-column>
      <el-table-column prop="abilityTag" label="能力标签" width="100" sortable></el-table-column>
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
  name: "ExamReportItem",
  data() {
    return {
      reportDetail: [
        {
          name: "h",
          sex: "h",
          examName: "gg",
          objective: "a",
          subjective: "0",
          score: "0",
          ranking: "3",
          usingTime: "1",
          abilityTag: "A"
        },
        {
          name: "h",
          sex: "h",
          examName: "gg",
          objective: "a",
          subjective: "0",
          score: "0",
          ranking: "1",
          usingTime: "1",
          abilityTag: "D"
        },
        {
          name: "h",
          sex: "h",
          examName: "gg",
          objective: "a",
          subjective: "0",
          score: "0",
          ranking: "2",
          usingTime: "1",
          abilityTag: "C"
        }
      ],
      input1: "",
      input2: ""
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
</style>