<!-- 题目类别管理-->
<template>
  <div>
    <!-- 左侧数结构 -->
    <div class="leftboxs">
      <span class="el-icon-notebook-1">&nbsp;题目类别</span>
      <span style="margin-left:10px">
        <el-button type="text" class="el-icon-plus" @click="showAddCategory"></el-button>
        <el-button type="text" class="el-icon-refresh" @click="refreshTree"></el-button>
      </span>
      <el-tree :data="tree" :props="defaultProps" @node-click="handleNodeClick" v-if="showTree"></el-tree>
    </div>

    <div class="rightboxs">
      <!--查询部分-->
      <el-form :inline="true" :model="searchpath">
        <el-form-item label="题目类别:">
          <el-input type="text" placeholder="请输入题目类别" v-model="searchpath.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryCategory">查询</el-button>
        </el-form-item>
      </el-form>

      <!-- <edit-form @onSubmit="loadCategories()" ref="edit"></edit-form> -->

      <!-- 操作区 -->
      <div style="float:left">
        <el-button
          type="text"
          class="el-icon-plus"
          style="font-size: 15px"
          @click="showAddCategory"
        >增加</el-button>
        <label>&nbsp;&nbsp;&nbsp;&nbsp;</label>
        <el-button
          type="text"
          class="el-icon-delete"
          style="font-size: 15px"
          @click="deleteCategories"
        >批量删除</el-button>
        <label>&nbsp;&nbsp;&nbsp;&nbsp;</label>
        <el-button
          type="text"
          class="el-icon-edit"
          style="font-size: 15px"
          @click="checkAndshowEditCategory"
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

      <!-- 显示题目类别表格 -->
      <div>
        <el-table
          stripe
          ref="categorytable"
          :data="categories.slice((currentPage-1)*pageSize,currentPage*pageSize)"
          style="width: 100%"
          row-style="height:20px"
          cell-style="padding:0"
          :row-class-name="tableRowClassName"
          @selection-change="handleSelectionChange"
          :default-sort="{prop: 'updated_time', order: 'descending'}"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="题目类别" sortable width="200"></el-table-column>
          <el-table-column prop="remark" label="备注信息" width="230"></el-table-column>
          <el-table-column prop="updated_time" label="更新时间" sortable width="140"></el-table-column>
          <el-table-column prop="status" label="是否启用" sortable width="140"></el-table-column>
          <el-table-column prop="operate" label="操作">
            <template slot-scope="scope">
              <el-button type="text" class="el-icon-plus" @click="showAddCategory"></el-button>
              <el-button type="text" class="el-icon-delete" @click="deleteCategory(scope.row.id)"></el-button>
              <el-button type="text" class="el-icon-edit" @click="showEditCategory(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 添加/修改题目类别弹窗 -->
      <div>
        <el-form
          :model="category"
          :label-position="labelPosition"
          :rules="rules"
          ref="addCategory"
          style="margin: 0px;
          padding: 0px;"
        >
          <!-- close-on-click-modal 点击空白处是否关闭弹窗 -->
          <el-dialog
            :title="dialogTitle"
            style="padding: 0px;"
            :close-on-click-modal="false"
            :visible.sync="dialogCategory"
            width="50%"
            @close="cancelEidt"
          >
            <el-form-item label="题目类别：" prop="name">
              <el-input v-model="category.name"></el-input>
            </el-form-item>
            <el-form-item label="是否启用：" prop="status">
              <el-radio-group v-model="category.status">
                <el-radio label="是"></el-radio>
                <el-radio label="否"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注信息：">
              <el-input type="textarea" :rows="7" v-model="category.remark"></el-input>
            </el-form-item>
            <span slot="footer" class="dialog-footer">
              <el-button size="mini" @click="cancelEidt">取 消</el-button>
              <el-button size="mini" type="primary" @click="addCategory" :style="{ display: visibleSave }">保 存</el-button>
              <el-button size="mini" type="primary" @click="updateCategory" :style="{ display: visibleEdit }">更 新</el-button>
            </span>
          </el-dialog>
        </el-form>
      </div>

      <!-- 导入文件对话框 -->
      <div>
        <el-dialog title="导入" :visible.sync="dialogUpload" width="30%" :before-close="handleClose">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
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

      <!-- 导出文件对话框 -->
      <div>
        <el-dialog
          title="导出"
          :visible.sync="dialogDownload"
          width="20%"
          :before-close="handleClose"
          center
        >
          <el-input style="width: 200px;"></el-input>
          <label>.xls</label>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" round>保 存</el-button>
            <el-button size="small" round type="primary" @click="dialogDownload = false">取 消</el-button>
          </div>
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
  </div>
</template>

<script>
import { loadCategories,queryCategory,addCategory,deleteCategoriesy } from "../../api/index";
export default {
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "c++题"
        },
        {
          value: "选项2",
          label: "java题"
        }
      ],
      value: "",
      tree: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1"
                }
              ]
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1"
                }
              ]
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1"
                }
              ]
            }
          ]
        }
      ],
      
      categories: [
        {
          name: "test1",
          remark: "备注",
          updated_time: "2019-6-21",
          status: "是"
        },
        {
          name: "test2",
          remark: "备注",
          updated_time: "2019-6-28",
          status: "否"
        },
        {
          name: "test3",
          remark: "备注",
          updated_time: "2019-6-21",
          status: "是"
        },
        {
          name: "test4",
          remark: "备注",
          updated_time: "2019-6-28",
          status: "否"
        },
        {
          name: "test5",
          remark: "备注",
          updated_time: "2019-6-21",
          status: "是"
        },
        {
          name: "test6",
          remark: "备注",
          updated_time: "2019-6-28",
          status: "否"
        },
        {
          name: "test7",
          remark: "备注",
          updated_time: "2019-6-21",
          status: "是"
        },
        {
          name: "test8",
          remark: "备注",
          updated_time: "2019-6-28",
          status: "否"
        },

        {
          name: "test9",
          remark: "备注",
          updated_time: "2019-6-21",
          status: "是"
        },
        {
          name: "test0",
          remark: "备注",
          updated_time: "2019-6-28",
          status: "否"
        },

        {
          name: "test11",
          remark: "备注",
          updated_time: "2019-6-21",
          status: "是"
        },
        {
          name: "test12",
          remark: "备注",
          updated_time: "2019-6-28",
          status: "否"
        },
        {
          name: "test13",
          remark: "备注",
          updated_time: "2019-6-21",
          status: "是"
        },
        {
          name: "test14",
          remark: "备注",
          updated_time: "2019-6-28",
          status: "否"
        }
      ],
      //弹窗显示与否
      dialogCategory: false,
      dialogUpload: false,
      dialogDownload: false,
      //默认隐藏编辑按钮
      visibleEdit: "none",
      //默认显示新增按钮
      visibleSave: "",
      //添加与修改弹窗中的数值
      category: {
        name: "",
        status: "是",
        remark: ""
      },

      //前端校验 失去焦点时显示message
      rules: {
        name: [
          { required: true, message: "题目类别名称必填", trigger: "blur" }
        ],
        status: [{ required: true, message: "是否启用必选", trigger: "blur" }]
      },

      //是否显示树（用于刷新）
      showTree: true,
      //用于分页的数据
      currentPage: 1,
      pageSize: 10,
      //多选选中值的坐标，用于批量删除
      sels: [],
      searchpath: {
        name: ""
      }
    };
  },
  methods: {
    //加载Category表格
    loadCategories() {
      let _this = this;
      this.$axios.get("/categories").then(resp => {
        if (resp && resp.status === 200) {
          _this.categories = resp.data;
        }
      });
    },
    // 每一行多选选中时触发该方法
    handleSelectionChange(sels) {
      this.sels = sels;
    },
    //搜索
    queryCategory() {
      let _this = this;
      this.$axios
        .post("/search", {
          name: this.searchpath.name
        })
        .then(resp => {
          if (resp && resp.status === 200) {
            this.$notify({
              title: "成功",
              message: "查询结果如下",
              type: "success",
              duration: 1000
            });
            // 若搜索成功则重新刷新页面
            _this.categories = resp.data;
          }
        });
    },
    //显示增加/修改数据弹窗
    showAddCategory() {
      this.dialogTitle = "添加题目类别";
      this.visibleEdit = "none",
      this.visibleSave = "",
      this.dialogCategory = true;
    },
    //增加题目类别
    addCategory() {
      this.$axios
        .post("/add", {
          name: this.category.name,
          status: this.category.status,
          remark: this.categories.remark
        })
        .then(resp => {
          this.$notify({
            title: "成功",
            message: "数据已成功插入",
            type: "success",
            duration: 1500
          });
          this.loadCategories();
          this.dialogCategory = false;
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "插入数据失败",
            duration: 1000
          });
        });
    },
    //修改题目类别
    updateCategory(){
      
    },
    //取消弹窗
    cancelEidt() {
      this.dialogCategory = false;
      this.emptyCategory();
    },
    //清除弹窗表单内容
    emptyCategory() {
      this.category = {
        name: "",
        status: "",
        remark: ""
      };
    },

    //显示修改数据弹窗
    //多行检查后再修改
    checkAndshowEditCategory() {
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
      this.showEditCategory(this.$refs.categorytable.selection[0]);
    },
    //修改本行
    showEditCategory(row) {
      this.dialogTitle = "编辑题目类别";
      this.category = row;
      this.category.name = row.name;
      this.category.status = row.status;
      this.category.remark = row.remark;
      
      //显示编辑按钮，隐藏新增按钮
      this.visibleEdit = "";
      this.visibleSave = "none";
      this.dialogCategory = true;
    },
    //根据所选的id删除相应数据
    deleteCategory(id) {
      this.$confirm("确认要删除该题目类别吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios.post("/delete", id).then(resp => {
            if (resp && resp.status === 200) {
              this.$notify({
                title: "成功",
                message: "数据已成功删除",
                type: "success",
                duration: 1000
              });
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
    deleteCategories() {
      if (this.sels.length < 1) {
        this.$message({
          message: "请选择要删除的题目类别",
          type: "warning",
          duration: 1000
        });
        return 0;
      }
      this.$confirm(
        "此操作将删除[" + this.sels.length + "]条数据，是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let ids = "";
          for (let i = 0; i < this.sels.length; i++) {
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
    },
    //刷新树
    refreshTree() {
      this.showTree = false;
      this.$nextTick(() => (this.showTree = true));
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

.leftboxs {
  height: 480px;
  width: 15%;
  float: left;
  padding: 10px;

  border-radius: 15px;
  background-clip: padding-box;
  background: #fff;
  border: 1px solid #eaeaea;
  /* box-shadow: 0 0 3px #cac6c6; */
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
.rightboxs {
  float: right;
  width: 82%;
}
</style>