<template>
  <div>
    <el-form :inline="true" v-model="searchPublishExamRecord">
      &nbsp;&nbsp;
      <el-form-item label="试卷发布人:">
        <el-input
          style="width: 100px;"
          placeholder="请输入内容"
          v-model="searchPublishExamRecord.publisher"
          clearable
        ></el-input>
      </el-form-item>&nbsp;&nbsp;
      <el-form-item label="发布时间段:从">
        <el-date-picker
          v-model="searchPublishExamRecord.startTime"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
          style="width: 100px;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="至">
        <el-date-picker
          v-model="searchPublishExamRecord.endTime"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
          style="width: 100px;"
        ></el-date-picker>
      </el-form-item>&nbsp;&nbsp;
      <el-form-item label="考试时间段:从">
        <el-date-picker
          v-model="searchPublishExamRecord.examStartTime"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
          style="width: 100px;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="至">
        <el-date-picker
          v-model="searchPublishExamRecord.examEndTime"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
          style="width: 100px;"
        ></el-date-picker>
      </el-form-item>&nbsp;&nbsp;
      <el-form-item label="考试标题:">
        <el-input
          style="width: 100px;"
          placeholder="请输入内容"
          v-model="searchPublishExamRecord.title"
          clearable
        ></el-input>
      </el-form-item>&nbsp;&nbsp;
      <el-form-item>
        <el-button plain>查询</el-button>
      </el-form-item>
    </el-form>&nbsp;
    <el-button
      type="text"
      class="el-icon-edit"
      style="font-size: 15px"
      @click="editPublishRecord"
    >修改</el-button>
    <label>&nbsp;&nbsp;&nbsp;&nbsp;</label>
    <el-button
      type="text"
      class="el-icon-delete"
      style="font-size: 15px"
      @click="deletePublishRecordList"
    >删除</el-button>
    <label>&nbsp;&nbsp;&nbsp;&nbsp;</label>
    <el-button
      type="text"
      class="el-icon-sort-down"
      style="font-size: 15px"
      @click="addPublishRecord"
    >发布</el-button>

    <br />
    <el-table
      :data="publishExamRecord"
      style="width: 100%"
      row-style="height:20px"
      cell-style="padding:0"
      :default-sort="{prop: 'status', order: 'Ascending'}"
      stripe
      size="small"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="30"></el-table-column>
      <el-table-column prop="publisher" label="试卷发布人" width="100"></el-table-column>
      <el-table-column prop="createdTime" label="发布时间段" width="140"></el-table-column>
      <el-table-column prop="endTime" label="考试结束日期和时间" width="140"></el-table-column>
      <el-table-column prop="planPeopleNum" label="计划人数" width="100"></el-table-column>
      <el-table-column prop="limitTime" label="考试时长" width="100"></el-table-column>
      <el-table-column prop="marker" label="评卷官" width="100"></el-table-column>
      <el-table-column prop="descript" label="考试说明" width="100"></el-table-column>
      <el-table-column prop="status" label="状态列" sortable width="120"></el-table-column>
      <el-table-column prop="publishNum" label="发布次数" width="100"></el-table-column>
      <el-table-column prop="Action" label="操作列">
        <template slot-scope="scope">
          <el-button type="text" class="el-icon-edit" @click="editPublishRecord(scope.row)"></el-button>
          <el-button type="text" class="el-icon-delete" @click="deletePublishRecord(scope.row)"></el-button>
          <el-button type="text" class="el-icon-download" @click="dialogDownload = true"></el-button>
          <el-button type="text" class="el-icon-share" @click="sharePublishRecord"></el-button>
        </template>
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

    <!-- 发布操作 -->
    <el-dialog
      title="发布信息"
      :visible.sync="addDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      center
    >
      <el-form :model="addFormData" :rules="rulesAddFormData" ref="addFormData" label-width="200px">
        <el-form-item prop="paper" label="试卷:">
          <el-input type="text" v-model="addFormData.paper" size="small" class="editInput"></el-input>&nbsp;&nbsp;
          <el-button>选择试卷</el-button>
        </el-form-item>
        <el-form-item prop="sessionId" label="考试场次:">
          <el-input
            type="text"
            v-model="addFormData.sessionId"
            size="small"
            class="editInput"
            disabled="disabled"
          ></el-input>
        </el-form-item>
        <el-form-item prop="title" label="考试标题:">
          <el-input type="text" v-model="addFormData.title" size="small" class="editInput"></el-input>
        </el-form-item>
        <el-form-item prop="endTime" label="考试结束日期和时间:">
          <el-date-picker
            v-model="addFormData.endTime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions"
            style="width:50%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="planPeopleNum" label="计划人数:">
          <el-input type="text" v-model="addFormData.planPeopleNum" size="small" class="editInput"></el-input>
        </el-form-item>
        <el-form-item prop="limitTime" label="考试时长:">
          <el-input type="text" v-model="addFormData.limitTime" size="small" class="editInput"></el-input>
        </el-form-item>
        <el-form-item prop="marker" label="评卷官:">
          <el-input type="text" v-model="addFormData.marker" size="small" class="editInput"></el-input>&nbsp;&nbsp;
          <el-button icon="el-icon-plus">增加评卷官</el-button>
        </el-form-item>
        <el-form-item prop="markingMode" label="阅卷方式:">
          <el-select v-model="addFormData.markingMode" placeholder="请选择" class="editInput">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="markingStopTime" label="阅卷截止时间:">
          <el-date-picker
            v-model="addFormData.markingStopTime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions"
            style="width:50%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="descript" label="考试说明:">
          <el-input
            type="textarea"
            :rows="2"
            v-model="addFormData.descript"
            size="small"
            class="editInput"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-row :gutter="30">
        <el-col span="4" :offset="8">
          <el-button @click.native="addCancel" type="danger">取 消</el-button>
        </el-col>
        <el-col span="4">
          <el-button v-if="addSubmitView" @click.native="editSubmit">保存</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 修改操作 -->
    <el-dialog
      title="发布信息"
      :visible.sync="editDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      center
    >
      <el-form :model="editFormData" :rules="rules2" ref="editFormData" label-width="200px">
        <el-form-item prop="sessionId" label="考试场次:">
          <el-input type="text" v-model="editFormData.sessionId" size="small" class="editInput"></el-input>
        </el-form-item>
        <el-form-item prop="title" label="考试标题:">
          <el-input type="text" v-model="editFormData.title" size="small" class="editInput"></el-input>
        </el-form-item>
        <el-form-item prop="endTime" label="考试结束日期和时间:">
          <el-date-picker
            v-model="editFormData.endTime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions"
            style="width:50%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="planPeopleNum" label="计划人数:">
          <el-input type="text" v-model="editFormData.planPeopleNum" size="small" class="editInput"></el-input>
        </el-form-item>
        <el-form-item prop="limitTime" label="考试时长:">
          <el-input type="text" v-model="editFormData.limitTime" size="small" class="editInput"></el-input>
        </el-form-item>
        <el-form-item prop="marker" label="评卷官:">
          <el-input type="text" v-model="editFormData.marker" size="small" class="editInput"></el-input>&nbsp;&nbsp;
          <el-button icon="el-icon-plus">增加评卷官</el-button>
        </el-form-item>
        <el-form-item prop="markingMode" label="阅卷方式:">
          <el-select v-model="editFormData.markingMode" placeholder="请选择" class="editInput">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="markingStopTime" label="阅卷截止时间:">
          <el-date-picker
            v-model="editFormData.markingStopTime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions"
            style="width:50%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="descript" label="考试说明:">
          <el-input
            type="textarea"
            :rows="2"
            v-model="editFormData.descript"
            size="small"
            class="editInput"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-row :gutter="30">
        <el-col span="4" :offset="8">
          <el-button @click.native="editCancel" type="danger">取 消</el-button>
        </el-col>
        <el-col span="4">
          <el-button v-if="editSubmitView" @click.native="editSubmit">保存</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 添加导出文件对话框 -->
    <div>
      <el-dialog title="导出" :visible.sync="dialogDownload" width="25%" :before-close="handleClose">
        <el-row>
          <el-col :offset="1" span="6">
            <label>文件名:&nbsp;</label>
          </el-col>
          <el-col span="16">
            <el-input style="width: 75%;"></el-input>
            <label>.doc</label>
          </el-col>
        </el-row>
        <br />
        <el-row :gutter="30">
          <el-col span="4" :offset="4">
            <el-button size="small" round>保存</el-button>
          </el-col>
          <el-col span="4" offset="6">
            <el-button size="small" round type="danger" @click="dialogDownload=false">取消</el-button>
          </el-col>
        </el-row>
        <div slot="tip">只能导出word文件，且需符合相应格式</div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { queryPublishRecord } from "../../api/exam";
export default {
  name: "PublishExamRecord",
  data() {
    return {
      publishExamRecord: [
        {
          publisher: "h",
          createdTime: "h",
          endTime: "1",
          planPeopleNum: "a",
          limitTime: "0",
          marker: "h",
          descript: "h",
          status: "d",
          publishNum: "gg",
          sessionId: "1",
          title: "1",
          markingMode: 1,
          markingStopTime: "1"
        },
        {
          publisher: "h",
          createdTime: "h",
          endTime: "1",
          planPeopleNum: "a",
          limitTime: "0",
          marker: "h",
          descript: "h",
          status: "d",
          publishNum: "gg",
          sessionId: "1",
          title: "1",
          markingMode: 1,
          markingStopTime: "1"
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
      //搜索
      searchPublishExamRecord: {
        publisher: "",
        startTime: "",
        endTime: "",
        examStartTime: "",
        examEndTime: "",
        title: ""
      },
      //修改的数据
      editFormData: {
        sessionId: "1",
        title: "1",
        endTime: "1",
        planPeopleNum: "1",
        limitTime: 1,
        marker: "1",
        markingMode: 1,
        markingStopTime: "1",
        descript: "1"
      },
      editDialogVisible: false, //修改界面是否显示
      editSubmitView: false, //修改保存按钮是否显示
      addDialogVisible: false, //修改界面是否显示
      addSubmitView: false, //修改保存按钮是否显示
      dialogDownload: false, //导出界面是否显示
      addFormData: {
        paper: "2",
        sessionId: "2",
        title: "2",
        endTime: "2",
        planPeopleNum: "2",
        limitTime: 1,
        marker: "2",
        markingMode: 1,
        markingStopTime: "1",
        descript: "1"
      },
      rulesAddFormData: {
        paper: [
          { required: true, message: "请输入试卷名字", trigger: "blur" },
          { min: 3, max: 5, message: "长度在3-5个字符", trigger: "blur" }
        ],
        sessionId: [{ required: true, message: "请输入场次", trigger: "blur" }],
        title: [
          { required: true, message: "请输入考试标题", trigger: "blur" },
          { min: 1, max: 32, message: "长度在1到32个字符", trigger: "blur" }
        ],
        endTime: [
          {
            required: true,
            type: "date",
            message: "请输入考试结束日期和时间",
            trigger: "change"
          }
        ],
        planPeopleNum: [
          { required: true, message: "请输入计划人数", trigger: "blur" },
          { type: "number", message: "计划人数必须为数字" }
        ],
        limitTime: [
          { required: true, message: "请输入考试时长", trigger: "blur" },
          { type: "number", message: "考试时长必须为数字" }
        ],
        marker: [{ required: true, message: "请输入评卷官", trigger: "blur" }],
        markingMode: [
          { required: true, message: "请选择阅卷方式", trigger: "blur" }
        ],
        markingStopTime: [
          {
            type: "date",
            required: true,
            message: "请输入阅卷截止时间",
            trigger: "blur"
          }
        ],
        descript: [
          { required: true, message: "请输入考试说明", trigger: "blur" }
        ]
      },
      rulesEditFormData: {
        sessionId: [{ required: true, message: "请输入场次", trigger: "blur" }],
        title: [
          { required: true, message: "请输入考试标题", trigger: "blur" },
          { min: 1, max: 32, message: "长度在1到32个字符", trigger: "blur" }
        ],
        endTime: [
          {
            required: true,
            type: "date",
            message: "请输入考试结束日期和时间",
            trigger: "change"
          }
        ],
        planPeopleNum: [
          { required: true, message: "请输入计划人数", trigger: "blur" },
          { type: "number", message: "计划人数必须为数字" }
        ],
        limitTime: [
          { required: true, message: "请输入考试时长", trigger: "blur" },
          { type: "number", message: "考试时长必须为数字" }
        ],
        marker: [{ required: true, message: "请输入评卷官", trigger: "blur" }],
        markingMode: [
          { required: true, message: "请选择阅卷方式", trigger: "blur" }
        ],
        markingStopTime: [
          {
            type: "date",
            required: true,
            message: "请输入阅卷截止时间",
            trigger: "blur"
          }
        ],
        descript: [
          { required: true, message: "请输入考试说明", trigger: "blur" }
        ]
      },
      multipleSelection: []
    };
  },
  mounted: function() {
    let that = this;
    queryPublishRecord("")
      .then(resp => {
        // console.log("success");
        console.log(resp);
        that.publishExamRecord = resp.body.list
      })
      .catch(() => {
        console.log("fail");
      });
  },
  methods: {
    /**
     * 获取选中的数据
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /**
     * 打开编辑界面，并且设置数据
     */
    editPublishRecord(rowData) {
      this.editFormData = Object.assign({}, rowData);
      console.log(this.editFormData);
      this.editDialogVisible = true;
      this.editSubmitView = true;
    },
    /**
     * 取消修改数据
     */
    editCancel() {
      this.editSubmitView = false;
      this.editDialogVisible = false;
    },
    /**
     * 打开发布界面，并且设置数据
     */
    addPublishRecord() {
      this.addDialogVisible = true;
      this.addSubmitView = true;
    },
    /**
     * 取消发布
     */
    addCancel() {
      this.addSubmitView = false;
      this.addDialogVisible = false;
    },
    /**
     * 删除单条记录
     */
    deletePublishRecord(rowData) {
      this.$confirm("是否删除该数据？如果数据已被使用则不可删除", "", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消"
      }).then(() => {
        //删除数据
      });
    },
    /**
     * 删除多条记录
     */
    deletePublishRecordList() {
      let that = this;
      this.$confirm(
        "是否删除" +
          this.multipleSelection.length +
          "条数据？如果数据已被使用则不可删除",
        "",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "确认",
          cancelButtonText: "取消"
        }
      ).then(() => {
        //删除数据
        that.openFullScreen();
      });
    },
    /**
     * 显示加载
     */
    openFullScreen() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      setTimeout(() => {
        loading.close();
      }, 2000);
    },
    /**
     * 显示二维码
     */
    sharePublishRecord() {
      let publishId = 111;
      this.$router.push({
        path: `./ExamQRCode/${publishId}`
      });
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
  width: 50%;
}
</style>