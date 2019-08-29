<template>
  <div id="SubjectAddPage">
    <!--添加试题页面题库查询表单-->
    <div id="subjectQueryForm">
      <el-form
        ref="subjectQueryForm"
        :inline="true"
        :model="subjectQueryFormData"
        class="demo-form-inline"
        :rules="rules"
      >
        <el-form-item label="题目类别:" prop="subjectClass" size="mini">
          <el-select
            v-model="subjectQueryFormData.subjectClass"
            placeholder="请选择题目类别"
            style="width:110px"
          >
            <el-option label="Java" value="java"></el-option>
            <el-option label="C++" value="cpp"></el-option>
            <el-option label="Php" value="php"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="题型:" prop="subjectType" size="mini">
          <el-select
            v-model="subjectQueryFormData.subjectType"
            placeholder="请选择题型"
            style="width:110px"
          >
            <el-option label="选择" value="Single-Choice"></el-option>
            <el-option label="判断" value="Judgement"></el-option>
            <el-option label="编程" value="Program"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="题目难度:" prop="subjectDifficulty" size="mini">
          <el-select
            v-model="subjectQueryFormData.subjectDifficulty"
            placeholder="请选择难度"
            style="width:110px"
          >
            <el-option label="简单" value="easy"></el-option>
            <el-option label="一般" value="normal"></el-option>
            <el-option label="困难" value="hard"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="题干:" prop="subjectContent" size="mini">
          <el-input v-model="subjectQueryFormData.subjectContent" placeholder="题目内容"></el-input>
        </el-form-item>

        <el-form-item size="mini" style="width:50px">
          <el-button plain @click="query">查询</el-button>
        </el-form-item>
        <el-form-item size="mini" style="width:50px">
          <el-button plain @click="clearForm">清空</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!--操作按钮组-->
    <div id="operationLinks">
      <el-button @click="handleMultipleSubjectAdd" type="text">批量添加</el-button>
    </div>

    <!--试卷主页面数据显示表格-->
    <div id="subjectTable">
      <el-table
        :data="subjectList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        style="width:100%;"
        stripe
        border
        :default-sort="{prop:'combExamTime',order:'descending'}"
        row-style="height:20px"
        cell-style="padding:0"
        :row-key="getRowKey"
        max-height="350"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleRowDblClick"
      >
        <el-table-column type="selection" :reserve-selection="true"></el-table-column>
        <el-table-column prop="name" label="题目名"></el-table-column>
        <el-table-column prop="subjectClass" label="题目类别" :formatter="subjectClassFormatter"></el-table-column>
        <el-table-column prop="subjectType" label="题型" :formatter="subjectTypeFormatter"></el-table-column>
        <el-table-column prop="difficulty" label="难度" :formatter="difficultyFormatter"></el-table-column>
        <el-table-column prop="description" label="题目描述"></el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              @click="handleSubjectAdd(scope.$index,scope.row)"
              type="text"
              size="medium"
              icon="el-icon-plus"
            ></el-button>
            <el-button
              @click="handleGetsubjectDetails(scope.$index,scope.row)"
              type="text"
              size="medium"
              icon="el-icon-edit"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center;margin-top: 30px;position:fixed;bottom:20px;left:20%;">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-sizes="[5,10,20]"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handleCurrectPageChange"
          @size-change="handlePageSizeChange"
        ></el-pagination>
      </div>
    </div>

    <div>
      <el-dialog title="修改试题" :visible.sync="dialogEditSubjectVisible">
        <el-form
          :rules="editDialogRules"
          :model="SubjectData"
          label-width="80px"
          label-position="right"
        >
          <el-form-item prop="name" label="题目名" style="width:300px;">
            <el-input v-model="SubjectData.name" style="width:200px;"></el-input>
          </el-form-item>

          <el-form-item prop="subjectClass" label="题目类别">
            <el-select v-model="SubjectData.subjectClass" placeholder="请选择题目类别" style="width:200px">
              <el-option
                :label="item.name"
                :value="item.code"
                v-for="(item, index) in SubjectClassList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="subjectType" label="题型">
            <el-select v-model="SubjectData.subjectType" placeholder="请选择题型" style="width:300px">
              <el-option
                :label="item.name"
                :value="item.code"
                v-for="(item, index) in SubjectTypeList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="subjectDifficulty" label="难度">
            <el-select
              v-model="SubjectData.subjectDifficulty"
              placeholder="请选择难度"
              style="width:300px"
            >
              <el-option
                :label="item.name"
                :value="item.code"
                v-for="(item, index) in SubjectDifficultyList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="subjectContent" label="题干">
            <el-input type="textarea" v-model="SubjectData.subjectContent"></el-input>
          </el-form-item>

          <!-- 答案区域 -->
          <div
            v-for="(answer, index) in SubjectData.answers"
            :key="index"
            style="border:1px solid #F0F0F0;padding:20px;margin:20px 0 20px 0;"
          >
            <el-form-item
              :prop="'answers.'+index+'.content'"
              label="答案"
              :rules="dialogSubjectAnswersRules.answersRules"
            >
              <el-input
                v-model="answer.content"
                type="textarea"
                clearable
                @keyup.enter.native="addlastitems(index, '1')"
              />
            </el-form-item>

            <el-form-item
              :prop="'answers.'+index+'.isRight'"
              label="是否正确"
              :rules="dialogSubjectAnswersRules.isRightRules"
            >
              <el-row>
                <el-col :span="5">
                  <el-select v-model="answer.isRight">
                    <el-option label="正确" value="true"></el-option>
                    <el-option label="错误" value="false"></el-option>
                  </el-select>
                </el-col>

                <el-col :span="6">
                  <section v-if="index === 0">
                    <el-button
                      type="primary"
                      icon="el-icon-plus"
                      plain
                      style="margin-left:10px;"
                      circle
                      @click="addlastitems(index, '1')"
                    />
                  </section>

                  <section v-if="index > 0">
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      plain
                      style="margin-left:10px;"
                      circle
                      @click="rmlastitems(index, '1')"
                    />
                  </section>
                </el-col>
              </el-row>
            </el-form-item>
          </div>
        </el-form>

        <el-row>
          <el-button type="primary" style="margin-left:25%" @click="handleSaveSubjectEdit">保存</el-button>
          <el-button style="margin-left:30px" @click="dialogEditSubjectVisible = false">关闭</el-button>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "subject",
  data() {
    return {
      dialogEditSubjectVisible: false,
      //封装查询参数的表单
      subjectQueryFormData: {
        name: "",
        subjectType: "",
        subjectClass: "",
        subjectDifficulty: "",
        subjectContent: ""
      },
      //题目表格数据
      subjectList: [
        {
          subjectId: 1,
          name: "test1",
          subjectType: "Single-Choice",
          subjectClass: "java",
          difficulty: "hard",
          description:
            "test subject test subject test subject test subject test subject test subject"
        },
        {
          subjectId: 2,
          name: "test2",
          subjectType: "Judgement",
          subjectClass: "php",
          difficulty: "hard",
          description:
            "test subject test subject test subject test subject test subject test subject"
        },
        {
          subjectId: 3,
          name: "test3",
          subjectType: "Judgement",
          subjectClass: "java",
          difficulty: "hard",
          description:
            "test subject test subject test subject test subject test subject test subject"
        },
        {
          subjectId: 4,
          name: "test4",
          subjectType: "Program",
          subjectClass: "cpp",
          difficulty: "hard",
          description:
            "test subject test subject test subject test subject test subject test subject"
        },
        {
          subjectId: 5,
          name: "test5",
          subjectType: "Single-Choice",
          subjectClass: "java",
          difficulty: "easy",
          description:
            "test subject test subject test subject test subject test subject test subject"
        },
        {
          subjectId: 6,
          name: "test6",
          subjectType: "Judgement",
          subjectClass: "cpp",
          difficulty: "normal",
          description:
            "test subject test subject test subject test subject test subject test subject"
        },
        {
          subjectId: 7,
          name: "test7",
          subjectType: "Single-Choice",
          subjectClass: "java",
          difficulty: "hard",
          description:
            "test subject test subject test subject test subject test subject test subject"
        }
      ],
      //验证规则
      //修改试题对话框数据
      SubjectData: {
        name: "",
        subjectClass: "",
        subjectType: "",
        subjectDifficulty: "",
        subjectContent: "",
        answers: [
          {
            content: "",
            isRight: ''
          }
        ]
      },
      SubjectClassList: [
        {
          code: "java",
          name: "Java"
        },
        {
          code: "cpp",
          name: "C++"
        },
        {
          code: "php",
          name: "Php"
        }
      ],
      SubjectTypeList: [
        {
          code: "Judgement",
          name: "判断题"
        },
        {
          code: "Single-Choice",
          name: "单选题"
        },
        {
          code: "Program",
          name: "编程题"
        }
      ],
      SubjectDifficultyList: [
        {
          code: "easy",
          name: "简单"
        },
        {
          code: "normal",
          name: "一般"
        },
        {
          code: "hard",
          name: "困难"
        }
      ],
      editDialogRules:{
          name:[ {required:true,message:'请输入试题名',trigger:'blur'} ],
          subjectClass:[ {required:true,message:'请输入试题类别',trigger:'blur'} ],
          subjectType:[{required:true,message:'请输入题型',trigger:'blur'} ],
          subjectDifficulty:[{required:true,message:'请输入试题难度',trigger:'blur'}],
          subjectContent:[{required:true,message:'请输入试题题干',trigger:'blur'}]
      },
      dialogSubjectAnswersRules:{
          answersRules:[{required:true,message:'请输入答案内容',trigger:'blur'}],
          isRightRules:[{required:true,message:'请选择是否正确',trigger:'blur'}]
      },
      //表格多选框情况
      multipleSelection: [],
      total: 7,
      pageSize: 5,
      currentPage: 1
    };
  },
  created: function() {},
  inject: ["reload"],
  methods: {
    // 处理查询按钮点击方法
    query() {},
    getRowKey(row) {
      return row.subjectId;
    },
    handleQuickCreatesubject() {
      this.$router.push({
        path: "/QuickCreatesubject"
      });
    },
    handleStandardCreatesubject() {
      this.$router.push({
        path: "/StandardCreatesubject"
      });
    },
    handleTemplateCreatesubject() {
      this.$router.push({
        path: "/TemplateCreatesubject"
      });
    },
    handleGetsubjectDetails(index, row) {
      this.dialogEditSubjectVisible = true;
    },
    handleSubjectAdd(index, row) {},
    handleMultipleSubjectAdd() {},
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    //清空查询参数的表单数据
    clearForm() {
      (this.subjectQueryFormData.name = ""),
        (this.subjectQueryFormData.startTime = ""),
        (this.subjectQueryFormData.endTime = ""),
        (this.subjectQueryFormData.combExamBy = ""),
        (this.subjectQueryFormData.subjectClass = "");
    },
    //格式化表格subjectClass列的输出
    difficultyFormatter(row, column) {
      if (row.difficulty == "easy") {
        return "简单";
      } else if (row.difficulty == "normal") {
        return "一般";
      } else if (row.difficulty == "hard") {
        return "困难";
      }
    },
    subjectClassFormatter(row, colum) {
      if (row.subjectClass == "java") {
        return "Java";
      } else if (row.subjectClass == "cpp") {
        return "C++";
      } else if (row.subjectClass == "php") {
        return "Php";
      }
    },
    subjectTypeFormatter(row, colum) {
      if (row.subjectType == "Single-Choice") {
        return "单选";
      } else if (row.subjectType == "Judgement") {
        return "判断";
      } else if (row.subjectType == "Program") {
        return "编程";
      }
    },
    timeFormatter(row, column) {
      if (row.combExamTime) {
        var timestamp = row.combExamTime;
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
    handleRowDblClick(row, column, event) {
      console.log("handleRowDblClick");
      this.handleGetsubjectDetails(row.index, row);
    },
    handleCurrectPageChange: function(currentPage) {
      this.currentPage = currentPage;
    },
    handlePageSizeChange: function(size) {
      this.pageSize = size;
    },
    addlastitems(index, type) {
      if (type === "1") {
        this.SubjectData.answers.push({
          content: "",
          isRight: ""
        });
      }
    },
    rmlastitems(index, type) {
      switch (type) {
        case "1":
          this.SubjectData.answers.splice(index, 1);
          break;
        default:
          break;
      }
      this.$message.success("移除成功");
    }
  }
};
</script>

<style>
.el-table th.gutter,
.el-table colgroup.gutter {
  display: table-cell !important;
}
</style>

