<template>
    <div id="downloadtemplatePage">
        <!--下载试卷查询表单-->
        <div id="templateQueryForm">
            <el-form ref="templateQueryForm" :inline="true" :model="templateQueryFormData" class="demo-form-inline" :rules="rules">
                <el-form-item label="模板名:" prop="name" size="mini">
                    <el-input v-model="templateQueryFormData.name"  style="width:100px"></el-input>
                </el-form-item>
                <el-form-item label="组卷人:" prop="combExamBy" size="mini">
                        <el-input v-model="templateQueryFormData.combExamBy"  style="width:100px"></el-input>
                </el-form-item>
                <el-form-item label="试卷难度:" prop="difficulty" size="mini">
                    <el-select v-model="templateQueryFormData.difficulty" placeholder="请选择难度"  style="width:110px">
                        <el-option label="简单" value="easy"></el-option>
                        <el-option label="一般" value="normal"></el-option>
                        <el-option label="困难" value="hard"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="生成时间: 从" size="mini">
                    <el-col :span="11">
                        <el-form-item prop="startTime" style="width:130px" size="mini">
                            <el-date-picker type="date" placeholder="起始日期" v-model="templateQueryFormData.startTime" style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col class="line" :span="2">至</el-col>
                    <el-col :span="11">
                        <el-form-item prop="endTime" style="width:130px" size="mini">
                            <el-date-picker type="date" placeholder="结束日期" v-model="templateQueryFormData.endTime" style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
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
            <el-button @click="handleMultipleDownload" type="text" icon="el-icon-download">批量下载试卷</el-button>
        </div>

        <!--试卷主页面数据显示表格-->
        <div id="templateTable">
            <el-table :data="templateList.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width:100%" stripe 
                border :default-sort="{prop:'combExamTime',order:'descending'}"
                row-style="height:20px"
                cell-style="padding:0"
                :row-key="getRowKey"
                max-height="350"
                @selection-change="handleSelectionChange" @row-dblclick="handleRowDblClick">
                <el-table-column type="selection" :reserve-selection="true"> 
                </el-table-column>
                <el-table-column prop="name" label="模板名">
                </el-table-column>
                <el-table-column prop="combExamBy" label="组卷人" sortable>
                </el-table-column>
                <el-table-column prop="type" label="试卷类型">
                </el-table-column>
                <el-table-column prop="difficulty" label="试卷难度" :formatter="difficultyFormatter">
                </el-table-column>
                <el-table-column prop="combExamTime" label="生成时间" 
                    :formatter="timeFormatter" sortable>
                </el-table-column>
                <el-table-column prop="total" label="试卷总分">
                </el-table-column>
                <el-table-column prop="description" label="模板描述">
                </el-table-column>
                <el-table-column prop="status" label="状态" :formatter="statusFormatter">
                </el-table-column>
                <el-table-column label="操作" fixed="right">
                    <template slot-scope="scope">
                        <el-button @click="handleDownload(scope.$index,scope.row)" type="text" size="medium" icon="el-icon-download"></el-button>
                        <el-button @click="handleGetTemplateDetails(scope.$index,scope.row)" type="text" size="medium" icon="el-icon-view"></el-button>
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
                    >
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'downloadPaper',
    data(){
        return{
            //封装查询参数的表单
            templateQueryFormData:{
                name: '',
                combExamBy: '',
                difficulty: '',
                startTime: '',
                endTime: ''
            },
            //试卷表格数据
            templateList:[
                {
                    templateId: 1,
                    name: 'test1',
                    combExamBy: 'JL',
                    type: 'Java',
                    difficulty: 'normal',
                    combExamTime: 1566010663,
                    total: 100 ,
                    description: 'test template test template test template test template test template test template',
                    status: 1
                },
                {
                    templateId: 2,
                    name: 'test2',
                    combExamBy: 'JL',
                    type: 'Java',
                    difficulty: 'normal',
                    combExamTime: 1566010663,
                    total: 100 ,
                    description: 'test template',
                    status: 1
                },
                {
                    templateId: 3,
                    name: 'test3',
                    combExamBy: 'JL',
                    type: 'Java',
                    difficulty: 'normal',
                    combExamTime: 1566010663,
                    total: 100 ,
                    description: 'test template',
                    status: 1
                },
                {
                    templateId: 4,
                    name: 'test4',
                    combExamBy: 'JL',
                    type: 'Java',
                    difficulty: 'normal',
                    combExamTime: 1566010663,
                    total: 100 ,
                    description: 'test template',
                    status: 1
                },
                {
                    templateId: 5,
                    name: 'test5',
                    combExamBy: 'JL',
                    type: 'Java',
                    difficulty: 'normal',
                    combExamTime: 1566010663,
                    total: 100 ,
                    description: 'test template',
                    status: 1
                },
                {
                    templateId: 6,
                    name: 'test6',
                    combExamBy: 'JL',
                    type: 'Java',
                    difficulty: 'normal',
                    combExamTime: 1566010663,
                    total: 100 ,
                    description: 'test template',
                    status: 1
                },
                {
                    templateId: 7,
                    name: 'test7',
                    combExamBy: 'JL',
                    type: 'Java',
                    difficulty: 'normal',
                    combExamTime: 1566010663,
                    total: 100 ,
                    description: 'test template',
                    status: 1
                },
                {
                    templateId: 8,
                    name: 'test8',
                    combExamBy: 'JL',
                    type: 'Java',
                    difficulty: 'normal',
                    combExamTime: 1566010663,
                    total: 100 ,
                    description: 'test template',
                    status: 1
                },
                {
                    templateId: 9,
                    name: 'test9',
                    combExamBy: 'JL',
                    type: 'Java',
                    difficulty: 'normal',
                    combExamTime: 1566010663,
                    total: 100 ,
                    description: 'test template',
                    status: 1
                },
                {
                    templateId: 10,
                    name: 'test10',
                    combExamBy: 'JL',
                    type: 'Java',
                    difficulty: 'normal',
                    combExamTime: 1566010663,
                    total: 100 ,
                    description: 'test template',
                    status: 1
                },
                {
                    templateId: 11,
                    name: 'test11',
                    combExamBy: 'JL',
                    type: 'Java',
                    difficulty: 'normal',
                    combExamTime: 1566010663,
                    total: 100 ,
                    description: 'test template',
                    status: 1
                }
            ],
            //验证规则
            rules:{
            },
            //表格多选框情况
            multipleSelection:[],
            total:11,
            pageSize:5,
            currentPage:1
        }
    },
    created:function(){
    },
    inject:["reload"],
    methods:{
        // 处理查询按钮点击方法
        query(){
           
        },
        getRowKey(row){
            return row.templateId
        },
        //下载试卷
        handleDownload(index,row){
           
        },
        //批量下载
        handleMultipleDownload(){

        },
        handleGetTemplateDetails(index,row){
           this.$router.push({
                path: '/PaperView',
                query: {paperOrTemplateId:row.templateId}
            })
        },
        handleSelectionChange(val){
            this.multipleSelection = val;
            console.log(val)
        },
        //清空查询参数的表单数据
        clearForm(){
            this.templateQueryFormData.name = '',
            this.templateQueryFormData.startTime = '',
            this.templateQueryFormData.endTime = '',
            this.templateQueryFormData.combExamBy = '',
            this.templateQueryFormData.difficulty = ''
        },
        //格式化表格difficulty列的输出
        difficultyFormatter(row,column){
            if(row.difficulty=='easy'){
                return '简单'
            }else if(row.difficulty=='normal'){
                return '一般'
            }else if(row.difficulty=='hard'){
                return '困难'
            }
        },
        timeFormatter(row,column){
            if(row.combExamTime){
                var timestamp = row.combExamTime;
                return new Date(timestamp).toLocaleString('chinese',{hour12:false})
            }
        },
        statusFormatter(row,column){
            if(row.status==0){
                return '未启用'
            }else if(row.status==1){
                return '已启用'
            }else{
                return '未知'
            }
        },
        handleRowDblClick(row, column, event){
            console.log('handleRowDblClick')
            this.handleGettemplateDetails(row.index,row);
        },
        handleCurrectPageChange:function(currentPage){
            this.currentPage = currentPage;
        },
        handlePageSizeChange:function(size){
            this.pageSize = size;
        }
    }
}
</script>

