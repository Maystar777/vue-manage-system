<!--题目管理 -->
<template>
  <div>
    <!--查询部分 -->
    <el-form :inline="true" :model="searchpath" class="demo-form-inline" style="float:left">
      <el-form-item label="题目分类">
        <el-select v-model="searchpath.subject_type" clearable placeholder="请选择">
          <el-option
                  v-for="item in subjecttypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择题型">
        <el-input type="text" v-model="searchpath.category" placeholder></el-input>
      </el-form-item>
      <el-form-item label="输入题目">
        <el-input type="text" v-model="searchpath.name" placeholder></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="querySubject">查询</el-button>
      </el-form-item>
    </el-form>
    <edit-form @onSubmit="loadSubjects()" ref="edit"></edit-form>

    <!-- 操作区 -->
    <div style="float:left">
      <el-button type="text" class="el-icon-plus" style="font-size: 15px" @click="showAddSubject">增加</el-button>
      <label>&nbsp;&nbsp;&nbsp;&nbsp;</label>
      <el-button
              type="text"
              class="el-icon-delete"
              style="font-size: 15px"
              @click="deleteSubjects"
      >批量删除</el-button>
      <label>&nbsp;&nbsp;&nbsp;&nbsp;</label>
      <el-button
              type="text"
              class="el-icon-edit"
              style="font-size: 15px"
              @click="checkAndshowEditSubject"
      >修改</el-button>
      <label>&nbsp;&nbsp;&nbsp;&nbsp;</label>
      <el-button
              type="text"
              class="el-icon-sort-down"
              style="font-size: 15px"
              @click="dialogUpload = true"
      >导入</el-button>
      <label>&nbsp;&nbsp;&nbsp;&nbsp;</label>
      <el-button
              type="text"
              class="el-icon-sort-up"
              style="font-size: 15px"
              @click="dialogDownload = true"
      >导出</el-button>
    </div>

    <!-- 记录数据的表单 -->
    <div>
      <el-table
          ref="subjectTable"
              :data="subjects.slice((currentPage-1)*pageSize,currentPage*pageSize)"
              style="width: 100%"
              row-style="height:20px"
              cell-style="padding:0"
              :row-class-name="tableRowClassName"
              @selection-change="handleSelectionChange"
              :default-sort="{prop: 'subject_type', order: 'Ascending'}"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="题目" sortable width="140"></el-table-column>
        <el-table-column prop="subject_type" label="题目类型" sortable width="140"></el-table-column>
        <el-table-column prop="category" label="题目分类" sortable width="140"></el-table-column>
        <el-table-column prop="update_time" label="更新时间" width="140"></el-table-column>
        <el-table-column prop="status" label="是否启用" sortable width="140"></el-table-column>
        <el-table-column prop="Action" label="操作">
          <template slot-scope="scope">
            <el-button type="text" class="el-icon-plus" @click="showAddSubject"></el-button>
            <el-button type="text" class="el-icon-delete" @click="deleteSubject(scope.row.id)"></el-button>
            <el-button type="text" class="el-icon-edit" @click="showEditSubject(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--添加与修改题目弹窗-->
    <div>
      <el-form
              :model="subject"
              :label-position="labelPosition"
              :rules="rules"
              ref="addSubject"
              style="margin: 0px;
      padding: 0px;"
      >
        <!-- close-on-click-modal 点击空白处是否关闭弹窗 -->
        <el-dialog
                :title="dialogTitle"
                style="padding: 0px;"
                :close-on-click-modal="false"
                :visible.sync="dialogSubject"
                width="50%"
                @close='cancelEidt'
        >
          <el-form-item label="题目类别:" prop="subject_type" :label-width="formLabelWidth">
            <el-select v-model="subject.subject_type" placeholder>
              <el-option
                      v-for="item in subjecttypes"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="题型:" prop="category" :label-width="formLabelWidth">
            <el-select v-model="subject.category" placeholder>
              <el-option
                      v-for="item in categories"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="难度:" prop="difficuty" :label-width="formLabelWidth">
            <el-select v-model="subject.difficuty" placeholder>
              <el-option
                      v-for="item in difficuty"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="题目" :label-width="formLabelWidth" prop="name">
            <el-input type="textarea" v-model="subject.name"></el-input>
          </el-form-item>

          <el-form-item label="选项" :label-width="formLabelWidth" prop="option">
            <el-button
                    type="text"
                    class="el-icon-plus"
                    style="font-size: 15px"
                    @click="addDomain"
            >添加选项</el-button>
          </el-form-item>

          <el-form-item
                  :label-width="formLabelWidth"
                  v-for="(domain, index) in dynamicValidateForm.domains"
                  :label="'选项:'+index"
                  :key="domain.key"
                  :prop="'domains.' + index + '.value'"
                  :rules="{
            required: true, message: '选项不能为空', trigger: 'blur'
          }"
          >
            <el-input type="textarea" v-model="domain.value" ></el-input>
            <el-button @click.prevent="removeDomain(domain)">删除</el-button>
          </el-form-item>

          <el-form-item label="选择图片" :label-width="formLabelWidth" prop="picture">
            <el-input type="text" style="width: 300px" v-model="subject.picture"></el-input>
            <el-upload
                    class="upload-demo"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    accept="application/vnd.ms-excel"
                    multiple
                    :limit="1"
                    :on-exceed="handleExceed"
                    :file-list="fileList"
            >
              <el-button size="small" type="primary">选择图片</el-button>
            </el-upload>
          </el-form-item>

          <el-form-item label="答案" :label-width="formLabelWidth" prop="option">
            <el-button
                    type="text"
                    class="el-icon-plus"
                    style="font-size: 15px"
                    @click="addAnswer"
            >添加答案</el-button>
          </el-form-item>

          <el-form-item
                  :label-width="formLabelWidth"
                  v-for="(answer, index) in dynamicValidateForm.answers"
                  :label="'答案:'+index"
                  :key="answer.key"
                  :prop="'answers.' + index + '.value'"
                  :rules="{
            required: true, message: '答案不能为空', trigger: 'blur'
          }"
          >
            <el-input type="textarea" v-model="answer.value"></el-input>
            <el-button @click.prevent="removeAnswer(answer)">删除</el-button>
          </el-form-item>

          <el-form-item label="是否启用" :label-width="formLabelWidth" prop="status">
            <el-radio v-model="subject.status" label="1">是</el-radio>
            <el-radio v-model="subject.status" label="0">否</el-radio>
          </el-form-item>

          <el-form-item label="备注信息" :label-width="formLabelWidth" prop="remark">
            <el-input type="textarea" v-model="subject.remark"></el-input>
          </el-form-item>

          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancelEidt">取 消</el-button>
            <el-button size="mini" type="primary" @click="addSubject" :style="{ display: visibleSave }">保 存</el-button>
            <el-button size="mini" type="primary" @click="updateSubject" :style="{ display: visibleEdit }">更 新</el-button>
          </span>
        </el-dialog>
      </el-form>
    </div>

    <!-- 添加导入文件对话框 -->
    <div>
      <el-dialog title="导入" :visible.sync="dialogUpload" width="30%" :before-close="handleClose">
        <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                accept="application/vnd.ms-excel"
                multiple
                :limit="1"
                :on-exceed="handleExceed"
                :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传excel文件，且需符合相应格式</div>
        </el-upload>
      </el-dialog>
    </div>

    <!-- 添加导出文件对话框 -->
    <div>
      <el-dialog title="导出" :visible.sync="dialogDownload" width="20%" :before-close="handleClose">
        <el-input style="width: 200px;"></el-input>
        <label>.xls</label>
        <el-button size="small" round>保存</el-button>
        <el-button size="small" round type="danger" @click="dialogDownload=false">取消</el-button>
        <div slot="tip">只能导出excel文件，且需符合相应格式</div>
      </el-dialog>
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

  </div>
</template>

<script>
import { loadSubjects,querySubject,addSubject,deleteSubjects } from "../../api/index";
  export default {
    name: "SubjectsType",

    data() {
      return {
        dynamicValidateForm: {
          domains: [
            {
              value: "",
              isright: ""
            },
          ],
          answers: [
            {
              value: "",
              isright: ""
            },
          ]
        },
        //在表格中显示的数据
        subjects: [
          {
            name: "as",
            subject_type: "sa",
            category: "sa",
            update_time: "sa",
            status: "sa"
          },
          {
            name: "as",
            subject_type: "sa",
            category: "sa",
            update_time: "sa",
            status: "sa"
          }
        ],
        //添加与修改弹窗显示与否
        dialogSubject: false,
        //上传文件弹窗显示与否
        dialogUpload: false,
        //下载文件弹窗显示与否
        dialogDownload: false,
        //弹窗右对齐参数
        labelPosition: "left",
        //修改弹窗中的值
        subject: [
          {
            subject_type: "",
            category: "",
            difficuty: "",
            name: "",
            picture: "",
            status: "",
            remark: ""
          }
        ],
        //表单中列表数据
        subjecttypes: [
          { id: 3, name: "地理题" },
          { id: 2, name: "算法题" },
          { id: 1, name: "编程题" }
        ],
        categories: [
          { id: 3, name: "上机题" },
          { id: 2, name: "填空题" },
          { id: 1, name: "选择题" }
        ],
        difficuty: [
          { id: 3, name: "困难" },
          { id: 2, name: "一般" },
          { id: 1, name: "简单" }
        ],
        //前端校验 @blur 当元素失去焦点时触发blur事件
        rules: {
          subject_type: [
            { required: true, message: "题目类别必填", trigger: "blur" }
          ],
          category: [{ required: true, message: "题型必填", trigger: "blur" }],
          difficuty: [{ required: true, message: "难度必填", trigger: "blur" }],
          name: [{ required: true, message: "题目必填", trigger: "blur" }],
          status: [{ required: true, message: "状态必填", trigger: "blur" }]
        },
        //弹窗数据右对齐
        labelPosition: "right",
        //导入
        fileUploadBtnText: "导入",
        //用于分页的数据
        currentPage: 1,
        pagesize: 10,
        //默认隐藏编辑按钮
        visibleEdit: "none",
        //默认显示新增按钮
        visibleSave: "",
        // 多选选中值的坐标，用于批量删除
        sels: [],
        // 搜索框数据
        searchpath: {
          subject_type: "",
          category: "",
          name: ""
        },
        formLabelWidth: "120px"
      };
    },
    methods: {
      removeDomain(item) {
        var index = this.dynamicValidateForm.domains.indexOf(item);
        if (index !== -1) {
          this.dynamicValidateForm.domains.splice(index, 1);
        }
      },
      addDomain() {
        this.dynamicValidateForm.domains.push({
          value: "",
          key: Date.now()
        });
      },
      removeAnswer(item) {
        var index = this.dynamicValidateForm.answers.indexOf(item);
        if (index !== -1) {
          this.dynamicValidateForm.answers.splice(index, 1);
        }
      },
      addAnswer() {
        this.dynamicValidateForm.answers.push({
          value: "",
          key: Date.now()
        });
      },
      // 每一行多选选中时触发该方法
      handleSelectionChange(sels) {
        this.sels = sels;
      },
      handleNodeClick(data) {
        console.log(data);
      },
      //显示添加数据弹窗
      showAddSubject() {
        //设置弹窗表头
        this.dialogTitle = "添加数据字典";
        this.visibleEdit = "none",
        this.visibleSave = "",
        this.dialogSubject = true;
      },
      //取消弹窗
      cancelEidt() {
        this.dialogSubject = false;
        this.emptySubject();
      },
      //清除弹窗内容
      emptySubject() {
        this.subject = {
          subject_type: "",
          category: "",
          difficuty: "",
          name: "",
          picture: "",
          status: "",
          remark: ""
        };
      },
      //显示修改数据弹窗
      //多行检查后再修改
     checkAndshowEditSubject() {
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
      this.showEditSubject(this.$refs.subjectTable.selection[0]);
    },
    //修改本行
      showEditSubject(row) {
        this.dialogTitle = "编辑题目";
        this.subject = row;
        this.subject.subject_type = row.subject_type;
        this.subject.category = row.category;
        this.subject.difficuty = row.difficuty;
        this.subject.name = row.name;
        this.subject.status = row.status;
        this.subject.remark = row.remark;
        //显示编辑按钮，隐藏新增按钮
        this.visibleEdit = "",
        this.visibleSave = "none",
        this.dialogSubject = true;
      },
      // 根据所选的id删除相应数据
      deleteSubject(id) {
        this.$confirm("确认要删除该题目信息吗?", "信息", {
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
                      this.loadCategories();
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
      deleteSubjects() {
        if (this.sels.length < 1) {
        this.$message({
          message: "请选择要删除的题目",
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
  .el-upload.el-upload--text {
    width: 80px;
    height: 35px;
    border: 0px;
  }
  .leftbox {
    height: 480px;
    width: 15%;
    background-color: white;
    float: left;
  }
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
  .rightbox {
    float: right;
    width: 85%;
  }
</style>