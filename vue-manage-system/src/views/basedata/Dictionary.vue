<!-- 数据字典管理 -->
<template>
  <div>
    <!--查询部分 -->
    <el-form :inline="true" :model="searchpath" class="demo-form-inline" style="float:left">
      <el-form-item label="字典名称">
        <el-input type="text" v-model="searchpath.name" placeholder="字典名称"></el-input>
      </el-form-item>
      <el-form-item label="字典类型">
        <el-input type="text" v-model="searchpath.type" placeholder="字典类型"></el-input>
      </el-form-item>
      <el-form-item label="启用标记">
        <el-input type="text" v-model="searchpath.status" placeholder="启用标记"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryDictionary">查询</el-button>
      </el-form-item>
    </el-form>
    <edit-form @onSubmit="loadDictionaries()" ref="edit"></edit-form>
    <br />
    <br />
    <br />

    <!-- 操作区 -->
    <div style="float:left">
      <el-button
        type="text"
        class="el-icon-plus"
        style="font-size: 15px"
        @click="showAddDictionary"
      >增加</el-button>
      <label>&nbsp;&nbsp;&nbsp;&nbsp;</label>
      <el-button
        type="text"
        class="el-icon-delete"
        style="font-size: 15px"
        @click="deleteDictionaries"
      >批量删除</el-button>
      <label>&nbsp;&nbsp;&nbsp;&nbsp;</label>
      <el-button
        type="text"
        class="el-icon-edit"
        style="font-size: 15px"
        @click="checkAndshowEditDictionary"
      >修改</el-button>
      <label>&nbsp;&nbsp;&nbsp;&nbsp;</label>
      <el-button
        type="text"
        class="el-icon-edit"
        style="font-size: 15px"
        @click="loadDictionaries"
      >刷新</el-button>
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

    <!-- 显示数据字典的表单 -->
    <div>
      <el-table
        ref="dictionaryTable"
        :data="dictionaries.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :default-sort="{prop: 'date', order: 'descending'} "
      >
        <el-table-column prop="id"  :style="{ display: none }" ></el-table-column>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="字典名" width="110"></el-table-column>
        <el-table-column prop="dictionary" label="字典类型" sortable width="130"></el-table-column>
        <el-table-column prop="value" label="字典值" width="100"></el-table-column>
        <el-table-column prop="mark" label="标记" width="120"></el-table-column>
        <el-table-column prop="updated_time" label="更新时间" sortable width="180"></el-table-column>
        <el-table-column prop="remark" label="备注信息" width="140"></el-table-column>
        <el-table-column prop="status" label="状态" width="100"></el-table-column>
        <el-table-column prop="operate" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" class="el-icon-plus" @click="showAddDictionary"></el-button>
            <!-- 编辑同样调用增加页面弹窗，scope.row为这一行的数据 -->
            <el-button type="text" class="el-icon-delete" @click="deleteDictionary(scope.row.id)"></el-button>
            <el-button type="text" class="el-icon-edit" @click="showEditDictionary(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--添加与修改字典弹窗-->
    <div>
      <el-form
        :model="dictionary"
        :label-position="labelPosition"
        :rules="rules"
        ref="addDictionary"
        style="margin: 0px;
      padding: 0px;"
      >
        <!-- close-on-click-modal 点击空白处是否关闭弹窗 -->
        <el-dialog
          :title="dialogTitle"
          style="padding: 0px;"
          :close-on-click-modal="false"
          :visible.sync="dialogDictionary"
          width="60%"
          @close="cancelEidt"
        >
        
          <el-form-item label="字典名称" :label-width="formLabelWidth">
            <el-input v-model="dictionary.name" placeholder="字典名称"></el-input>
          </el-form-item>
          <el-form-item label="字典类型" :label-width="formLabelWidth" prop="dictionary">
            <el-input v-model="dictionary.dictionary" placeholder="字典类型"></el-input>
          </el-form-item>

          <el-form-item label="字典值" :label-width="formLabelWidth" prop="value">
            <el-input v-model="dictionary.value" placeholder="字典值" type="int"></el-input>
          </el-form-item>

          <el-form-item label="是否启用" :label-width="formLabelWidth" prop="status">
            <el-radio v-model="dictionary.status" label="1">是</el-radio>
            <el-radio v-model="dictionary.status" label="0">否</el-radio>
          </el-form-item>

          <el-form-item label="备注信息" :label-width="formLabelWidth" prop="remark">
            <el-input type="textarea" v-model="dictionary.remark"></el-input>
          </el-form-item>

          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancelEidt">取 消</el-button>
            <el-button size="mini" type="primary" @click="addDictionary" :style="{ display: visibleSave }">保 存</el-button>
            <el-button size="mini" type="primary" @click="updateDictionary" :style="{ display: visibleEdit }">更 新</el-button>
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
import { loadDictionaries,queryDictionary,addDictionary,deleteDictionaries } from "../../api/index";
export default {
  data() {
    return {
      //在表格中显示的数据
      dictionaries: [],
      //添加与修改弹窗显示与否
      dialogDictionary: false,
      //上传文件弹窗显示与否
      dialogUpload: false,
      //下载文件弹窗显示与否
      dialogDownload: false,
      //默认隐藏编辑按钮
      visibleEdit: "none",
      //默认显示新增按钮
      visibleSave: "",
      //添加与修改弹窗中的数值
      dictionary: {
        name: "",
        dictionary: "",
        value: "",
        status: "",
        remark: ""
      },
      //前端校验 @blur 当元素失去焦点时触发blur事件
      rules: {
        name: [{ required: true, message: "字典名称必填", trigger: "blur" }],
        dictionary: [
          { required: true, message: "字典类型必填", trigger: "blur" }
        ],
        value: [{ required: true, message: "字典值必填", trigger: "blur" }]
      },
      //弹窗数据右对齐
      labelPosition: "right",

      //导入
      fileUploadBtnText: "导入",
      //用于分页的数据
      currentPage: 1,
      pagesize: 10,
      // 多选选中值的坐标，用于批量删除
      sels: [],
      // 搜索框数据
      searchpath: {
        name: "",
        type: "",
        status: ""
      },
      formLabelWidth: "120px"
    };
  },
  
  // 页面加载完成后加载数据
  mounted: function() {
    this.loadDictionaries();
  },
  methods: {
    // 加载数据方法
    loadDictionaries() {
      let _this = this;
      loadDictionaries().then(resp => {
        if (resp) {
          _this.dictionaries = resp;
          console.log(resp);
        }
      }).catch(() => {
          this.$message({
            type: "error",
            message: "载入失败",
            duration: 1000
          });
        });
    },
    // 每一行多选选中时触发该方法
    handleSelectionChange(sels) {
      this.sels = sels;
    },
    // 搜索功能
    queryDictionary() {
      let _this = this;
      this.$axios
        .post("/search", {
          name: this.formInline.name,
          dictionary: this.formInline.dictionary,
          status: this.formInline.status
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
            _this.dictionaries = resp.data;
          }
        });
    },
    //显示添加数据弹窗
    showAddDictionary() {
      //设置弹窗表头
      this.dialogTitle = "添加数据字典";
      this.visibleEdit = "none",
      this.visibleSave = "",
      this.dialogDictionary = true;
    },
    // 增添數據
    addDictionary() {
      addDictionary( {
          name: this.dictionary.name,
          dictionary: this.dictionary.dictionary,
          value: this.dictionary.value,
          remark: this.dictionary.value,
          status: this.dictionary.status
        })
        .then(resp => {
          // 成功增加数据后刷新页面
          if (resp) {
            this.$notify({
              title: "成功",
              message: "数据已成功插入",
              type: "success",
              duration: 1500
            });
            this.loadDictionaries();
            this.dialogDictionary = false;
          }
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "数据插入失败",
            duration: 1000
          });
        });
    },
    //取消弹窗
    cancelEidt() {
      this.dialogDictionary = false;
      this.emptyDictionary();
    },
    //清除弹窗内容
    emptyDictionary() {
      this.dictionary = {
        name: "",
        dictionary: "",
        value: "",
        status: "",
        remark: ""
      };
    },
    //显示修改数据弹窗
    //多行检查后再修改
     checkAndshowEditDictionary() {
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
      this.showEditDictionary(this.$refs.dictionaryTable.selection[0]);
    },
    //修改本行
    showEditDictionary(row) {
      this.dialogTitle = "编辑数据字典";
      this.dictionary = row;
      this.dictionary.name = row.name;
      this.dictionary.dictionary = row.dictionary;
      this.dictionary.value = row.value;
      this.dictionary.status = row.status;
      this.dictionary.remark = row.remark;
      //显示编辑按钮，隐藏新增按钮
      this.visibleEdit = "",
      this.visibleSave = "none",
      this.dialogDictionary = true;
    },
    // 根据所选的id删除相应数据
    deleteDictionary(id) {
      this.$confirm("确认要删除该字典信息吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // console.log(this.$refs.multipleTable.selection)
          deleteDictionaries(id).then(resp => {
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
    deleteDictionaries() {
      if (this.sels.length < 1) {
        this.$message({
          message: "请选择要删除的数据字典",
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
  }
};
</script>
<style>
.el-upload.el-upload--text {
  width: 80px;
  height: 35px;
  border: 0px;
}
</style>
