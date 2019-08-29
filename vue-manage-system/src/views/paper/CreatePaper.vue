<template>
    <div id="createPaperPage">
        <!--组卷页面试卷查询表单-->
        <div id="paperQueryForm">
            <el-form ref="paperQueryForm" :inline="true" :model="paperQueryFormData" class="demo-form-inline" :rules="rules">
                <el-form-item label="试卷名:" prop="name" size="mini">
                    <el-input v-model="paperQueryFormData.name"  style="width:100px"></el-input>
                </el-form-item>
                <el-form-item label="组卷人:" prop="combExamBy" size="mini">
                        <el-input v-model="paperQueryFormData.combExamBy"  style="width:100px"></el-input>
                </el-form-item>
                <el-form-item label="试卷难度:" prop="difficulty" size="mini">
                    <el-select v-model="paperQueryFormData.difficulty" placeholder="请选择难度"  style="width:110px">
                        <el-option label="简单" value="easy"></el-option>
                        <el-option label="一般" value="normal"></el-option>
                        <el-option label="困难" value="hard"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="组卷时间: 从" size="mini">
                    <el-col :span="11">
                        <el-form-item prop="startTime" style="width:130px" size="mini">
                            <el-date-picker type="date" placeholder="起始日期" v-model="paperQueryFormData.startTime" style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col class="line" :span="2">至</el-col>
                    <el-col :span="11">
                        <el-form-item prop="endTime" style="width:130px" size="mini">
                            <el-date-picker type="date" placeholder="结束日期" v-model="paperQueryFormData.endTime" style="width: 100%;"></el-date-picker>
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
            <el-button @click="handleQuickCreatePaper" type="text">快速组卷</el-button>
            <el-button @click="handleStandardCreatePaper" type="text">标准组卷</el-button>
            <el-button @click="handleTemplateCreatePaper" type="text">模板组卷</el-button>
        </div>

        <!--试卷主页面数据显示表格-->
        <div id="paperTable">
            <el-table :data="paperList.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width:100%;" stripe 
                border :default-sort="{prop:'combExamTime',order:'descending'}"
                row-style="height:20px"
                cell-style="padding:0"
                :row-key="getRowKey"
                max-height="350"
                @selection-change="handleSelectionChange" @row-dblclick="handleRowDblClick">
                <el-table-column type="selection" :reserve-selection="true">
                </el-table-column>
                <el-table-column prop="name" label="试卷名">
                </el-table-column>
                <el-table-column prop="combExamBy" label="组卷人" sortable>
                </el-table-column>
                <el-table-column prop="type" label="试卷类型">
                </el-table-column>
                <el-table-column prop="difficulty" label="试卷难度" :formatter="difficultyFormatter">
                </el-table-column>
                <el-table-column prop="combExamTime" label="组卷时间" 
                    :formatter="timeFormatter" sortable>
                </el-table-column>
                <el-table-column prop="total" label="试卷总分">
                </el-table-column>
                <el-table-column prop="description" label="试卷描述">
                </el-table-column>
                <el-table-column prop="status" label="状态" :formatter="statusFormatter">
                </el-table-column>
                <el-table-column label="操作" fixed="right">
                    <template slot-scope="scope">
                        <el-button @click="handleGetPaperDetails(scope.$index,scope.row)" type="text" size="medium" icon="el-icon-view"></el-button>
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
    name: 'Paper',
    data(){
        return{
            //封装查询参数的表单
            paperQueryFormData:{
                name: '',
                combExamBy: '',
                difficulty: '',
                startTime: '',
                endTime: ''
            },
            //试卷表格数据
            paperList:[
                {
                    paperId: 1,
                    name: 'test1',
                    combExamBy: 'JL',
                    type: 'Java',
                    difficulty: 'normal',
                    combExamTime: 1566010663,
                    total: 100 ,
                    description: 'test paper test paper test paper test paper test paper test paper',
                    status: 1
                },
                {
                    paperId: 2,
                    name: 'test2',
                    combExamBy: 'JL',
                    type: 'Java',
                    difficulty: 'normal',
                    combExamTime: 1566010663,
                    total: 100 ,
                    description: 'test paper',
                    status: 1
                },
                {
                    paperId: 3,
                    name: 'test3',
                    combExamBy: 'JL',
                    type: 'Java',
                    difficulty: 'normal',
                    combExamTime: 1566010663,
                    total: 100 ,
                    description: 'test paper',
                    status: 1
                },
                {
                    paperId: 4,
                    name: 'test4',
                    combExamBy: 'JL',
                    type: 'Java',
                    difficulty: 'normal',
                    combExamTime: 1566010663,
                    total: 100 ,
                    description: 'test paper',
                    status: 1
                },
                {
                    paperId: 5,
                    name: 'test5',
                    combExamBy: 'JL',
                    type: 'Java',
                    difficulty: 'normal',
                    combExamTime: 1566010663,
                    total: 100 ,
                    description: 'test paper',
                    status: 1
                },
                {
                    paperId: 6,
                    name: 'test6',
                    combExamBy: 'JL',
                    type: 'Java',
                    difficulty: 'normal',
                    combExamTime: 1566010663,
                    total: 100 ,
                    description: 'test paper',
                    status: 1
                },
                {
                    paperId: 7,
                    name: 'test7',
                    combExamBy: 'JL',
                    type: 'Java',
                    difficulty: 'normal',
                    combExamTime: 1566010663,
                    total: 100 ,
                    description: 'test paper',
                    status: 1
                },
                {
                    paperId: 8,
                    name: 'test8',
                    combExamBy: 'JL',
                    type: 'Java',
                    difficulty: 'normal',
                    combExamTime: 1566010663,
                    total: 100 ,
                    description: 'test paper',
                    status: 1
                },
                {
                    paperId: 9,
                    name: 'test9',
                    combExamBy: 'JL',
                    type: 'Java',
                    difficulty: 'normal',
                    combExamTime: 1566010663,
                    total: 100 ,
                    description: 'test paper',
                    status: 1
                },
                {
                    paperId: 10,
                    name: 'test10',
                    combExamBy: 'JL',
                    type: 'Java',
                    difficulty: 'normal',
                    combExamTime: 1566010663,
                    total: 100 ,
                    description: 'test paper',
                    status: 1
                },
                {
                    paperId: 11,
                    name: 'test11',
                    combExamBy: 'JL',
                    type: 'Java',
                    difficulty: 'normal',
                    combExamTime: 1566010663,
                    total: 100 ,
                    description: 'test paper',
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
            return row.paperId
        },
        handleQuickCreatePaper(){
            this.$router.push({
                path: '/QuickCreatePaper'
            })
        },
        handleStandardCreatePaper(){
            this.$router.push({
                path: '/StandardCreatePaper'
            })
        },
        handleTemplateCreatePaper(){
            this.$router.push({
                path: '/TemplateCreatePaper'
            })
        },
        handleGetPaperDetails(index,row){
           this.$router.push({
                path: '/PaperView',
                query: {paperOrTemplateId:row.paperId}
            })
        },
        handleSelectionChange(val){
            this.multipleSelection = val;
            console.log(val)
        },
        //清空查询参数的表单数据
        clearForm(){
            this.paperQueryFormData.name = '',
            this.paperQueryFormData.startTime = '',
            this.paperQueryFormData.endTime = '',
            this.paperQueryFormData.combExamBy = '',
            this.paperQueryFormData.difficulty = ''
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
            this.handleGetPaperDetails(row.index,row);
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

<style>
    .el-table th.gutter,
.el-table colgroup.gutter{
display: table-cell!important;
}
</style>

