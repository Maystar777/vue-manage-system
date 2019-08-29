<!-- 组卷配置管理 -->
<template>
  <div>
    <!--查询部分 -->
    <el-form :inline="true" :model="searchpath" class="demo-form-inline" style="float:left">
      <el-form-item label="组卷配置项标题">
        <el-input type="text" v-model="searchpath.name" placeholder="请输入内容"></el-input>
      </el-form-item>
      <label>&nbsp;&nbsp;&nbsp;&nbsp;</label>
      <el-form-item>
        <el-button type="primary" @click="queryCombExam">查询</el-button>
      </el-form-item>
    </el-form>
    <edit-form @onSubmit="loadCombExams()" ref="edit"></edit-form>
    <br />
    <br />
    <br />

    <!-- 操作区 -->
    <div style="float:left">
      <el-button
              type="text"
              class="el-icon-plus"
              style="font-size: 15px"
              @click="showAddCombExam"
      >增加</el-button>
      <label>&nbsp;&nbsp;&nbsp;&nbsp;</label>
      <el-button
              type="text"
              class="el-icon-delete"
              style="font-size: 15px"
              @click="deleteCombExams"
      >批量删除</el-button>
      <label>&nbsp;&nbsp;&nbsp;&nbsp;</label>
      <el-button
              type="text"
              class="el-icon-edit"
              style="font-size: 15px"
              @click="checkAndshowEditCombExam"
      >修改</el-button>
    </div>

    <!-- 页面表格 -->
    <el-table
            ref="combExamTable"
            :data="combExams.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            style="width: 100%"
            row-style="height:20px"
            cell-style="padding:0"
            :row-class-name="tableRowClassName"
            @selection-change="handleSelectionChange"
            :default-sort="{prop: 'date', order: 'descending'} "
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="配置项" width="120"></el-table-column>
      <el-table-column prop="difficult" label="难度" sortable width="80"></el-table-column>
      <el-table-column prop="updated_by" label="修改人" width="120"></el-table-column>
      <el-table-column prop="update_time" label="修改时间" width="120"></el-table-column>
      <el-table-column prop="status" label="启用标志" width="120"></el-table-column>
      <el-table-column prop="company" label="公司" sortable width="120"></el-table-column>
      <el-table-column prop="remark" label="备注" sortable width="120"></el-table-column>
      <el-table-column prop="Action" label="操作">
        <template slot-scope="scope">
          <el-button type="text" class="el-icon-plus" @click="showAddCombExam"></el-button>
          <el-button type="text" class="el-icon-delete" @click="deleteCombExam(scope.row.id)"></el-button>
          <el-button type="text" class="el-icon-edit" @click="showEditCombExam(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加与修改组卷配置弹窗 -->
    <div>
      <el-form
              :model="combExam"
              :label-position="labelPosition"
              :rules="rules"
              ref="addCombExam"
              style="margin: 0px;
      padding: 0px;"
      >
        <!-- close-on-click-modal 点击空白处是否关闭弹窗 -->
        <el-dialog
                :title="dialogTitle"
                style="padding: 0px;"
                :close-on-click-modal="false"
                :visible.sync="dialogCombExam"
                width="80%"
                @close='cancelEidt'
        >
          <!-- <label>&nbsp;&nbsp;组卷配置信息:&nbsp;&nbsp;</label> -->
          <el-form-item label="配置项名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="combExam.name" placeholder></el-input>
          </el-form-item>

          <el-form-item label="是否启用" :label-width="formLabelWidth" prop="status">
            <el-radio v-model="combExam.status" label="1">是</el-radio>
            <el-radio v-model="combExam.status" label="0">否</el-radio>
          </el-form-item>

          <label>&nbsp;&nbsp;添加配置明细:&nbsp;&nbsp;</label>

          <!-- 题目详情表格 -->
          <el-table
                  
                  :data="combExam.test"
                  style="width: 100%"
                  row-style="height:20px"
                  cell-style="padding:0"
                  :row-class-name="tableRowClassName"
                  :default-sort="{prop: 'DictionaryType,StartTag', order: 'Ascending'}"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="序号" width="140"></el-table-column>
            <el-table-column prop="SubjectType" label="题目类别" sortable width="140"></el-table-column>
            <el-table-column prop="Category" label="题型" width="140"></el-table-column>
            <el-table-column prop="num" label="题目数量" width="140"></el-table-column>
            <el-table-column prop="difficult" label="题目难度" width="140"></el-table-column>
            <el-table-column prop="score" label="题目分值" sortable width="140"></el-table-column>
            <el-table-column prop="Action" label="操作">
              <el-button type="text" class="el-icon-plus"></el-button>
              <el-button type="text" class="el-icon-delete"></el-button>
              <el-button type="text" class="el-icon-edit"></el-button>
            </el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancelEidt">取 消</el-button>
            <el-button size="mini" type="primary" @click="addCombExam" :style="{ display: visibleSave }">保 存</el-button>
            <el-button size="mini" type="primary" @click="updateCombExam" :style="{ display: visibleEdit }">更 新</el-button>
          </span>
        </el-dialog>
      </el-form>
    </div>

    <!-- 分页 -->
      <div>
      <el-pagination
        style="text-align: center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="1000"
      ></el-pagination>
      </div>

    <!-- 题目详情表格 -->
    <el-table
            :data="combExam"
            style="width: 100%"
            row-style="height:20px"
            cell-style="padding:0"
            :row-class-name="tableRowClassName"
            :default-sort="{prop: 'DictionaryType,StartTag', order: 'Ascending'}"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="序号" width="140"></el-table-column>
      <el-table-column prop="SubjectType" label="题目类别" sortable width="140"></el-table-column>
      <el-table-column prop="Category" label="题型" width="140"></el-table-column>
      <el-table-column prop="num" label="题目数量" width="140"></el-table-column>
      <el-table-column prop="difficult" label="题目难度" width="140"></el-table-column>
      <el-table-column prop="score" label="题目分值" sortable width="100"></el-table-column>
      <el-table-column prop="Action" label="操作">
        <el-button type="text" class="el-icon-plus"></el-button>
        <el-button type="text" class="el-icon-delete"></el-button>
        <el-button type="text" class="el-icon-edit"></el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { log } from 'util';
  import { loadCombExams,queryCombExam,addCombExam,deleteCombExams } from "../../api/index";
  export default {
    name: "BasicData",

    data() {
      return {
        //组卷配置表格中数据
        combExams: [
          {
            name: "iuy",
            difficult: "h",
            updated_by: "gg",
            update_time: "2016/09/21",
            status: "s",
            company: "任天堂",
            remark: "love&peace",
            test: [
              {
                id: "1",
                SubjectType: "python",
                Category: "选择题",
                num: "5",
                difficult: "中等",
                score: "30"
              },
              {
                id: "2",
                SubjectType: "java",
                Category: "选择题",
                num: "5",
                difficult: "中等",
                score: "30"
              },
              {
                id: "3",
                SubjectType: "sss",
                Category: "选择题",
                num: "5",
                difficult: "中等",
                score: "30"
              }
            ]
          },
          {
            name: "PPP",
            difficult: "h",
            updated_by: "gg",
            update_time: "2016/09/21",
            status: "s",
            company: "sa",
            remark: "love&peace"
          }
        ],
        combExam:[],

        //弹窗中数据
        combExam: [
          {
            name: "",
            status: "",
            id: "1",
            SubjectType: "python",
            Category: "选择题",
            num: "5",
            difficult: "中等",
            score: "30"
          }
        ],
        //前端校验 @blur 当元素失去焦点时触发blur事件
        rules: {
          name: [{ required: true, message: "组卷配置名称必填", trigger: "blur" }]
        },
        //弹窗数据右对齐
        labelPosition: "right",
        // 搜索框数据
        searchpath: {
          name: ""
        },
        //添加与修改弹窗显示与否
        dialogCombExam: false,
        //用于分页的数据
        currentPage: 1,
        pageSize: 10,
        // 多选选中值的坐标，用于批量删除
        sels: [],
        //默认隐藏编辑按钮
        visibleEdit: "none",
        //默认显示新增按钮
        visibleSave: "",
      };
    },
    
    methods: {
      //显示添加数据弹窗
      showAddCombExam() {
        //设置弹窗表头
        this.dialogTitle = "添加数据字典";
        this.visibleEdit = "none",
        this.visibleSave = "",
        this.dialogCombExam = true;
      },
      //取消弹窗
      cancelEidt() {
        this.dialogCombExam = false;
        this.emptyCombExam();
      },
      //清除弹窗内容
      emptyCombExam() {
        this.combExam = {
          name: "",
          status: ""
        };
      },
      // 每一行多选选中时触发该方法
      handleSelectionChange(sels) {
        this.sels = sels;
      },
      //显示修改数据弹窗
      //多行检查后再修改
     checkAndshowEditCombExam() {
      if (this.sels.length > 1) {
        this.$message({
          message: "不可以同时编辑多行",
          type: "warning",
          duration: 1000
        });
        return 0;
      } else if (this.sels.length < 1) {
        this.$message({
          message: "请选择要编辑的行",
          type: "warning",
          duration: 1000
        });
        return 0;
      }
      this.showEditCombExam(this.$refs.combExamTable.selection[0]);
    },
    //修改本行
      showEditCombExam(row) {
        this.dialogTitle = "编辑数据字典";
        this.combExam = row;
        this.combExam.name = row.name;
        //显示编辑按钮，隐藏新增按钮
        this.visibleEdit = "",
        this.visibleSave = "none",
        this.dialogCombExam = true;
      },
      // 根据所选的id删除相应数据
      deleteCombExam(id) {
        this.$confirm("确认要删除该字典信息吗?", "信息", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
                .then(() => {
                  // console.log(this.$refs.multipleTable.selection)
                  this.$axios.post("/delete", id).then(resp => {
                    if (resp && resp.status === 200) {
                      this.$notify({
                        title: "成功",
                        message: "数据已成功删除",
                        type: "success",
                        duration: 1000
                      });
                      // 若删除成功则重新刷新页面
                      this.loadDictionaries();
                    }
                  });
                })
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: "已取消删除",
                    duration: 1000
                  });
                });
      },
      //批量删除数据
      deleteCombExams() {
        if (this.sels.length < 1) {
        this.$message({
          message: "请选择要删除的组卷配置",
          type: "warning",
          duration: 1000
        });
        return 0;
      }
        this.$confirm(
                "此操作将删除[" + this.sels.length + "]条数据, 是否继续?",
                "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                }
        )
                .then(() => {
                  var ids = "";
                  for (var i = 0; i < this.sels.length; i++) {
                    ids += this.sels[i].id + ",";
                  }
                  this.doDelete(ids);
                })
                .catch(() => {});
      },
      //分页方法
      handleSizeChange(val) {
        this.pageSize = val;
      },
      handleCurrentChange(val) {
        this.currentPage = val;
      }
    }
  };
</script>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>