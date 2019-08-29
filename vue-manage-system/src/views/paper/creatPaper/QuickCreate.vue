<template>
    <div id="quickCreatePaperPage">
        <!--快速组卷页面配置项表格-->
        <div id="configTable">
            <el-table :data="configList.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width:100%" stripe 
                border :default-sort="{prop:'updatedTime',order:'descending'}"
                row-style="height:20px"
                cell-style="padding:0"
                max-height="400"
                @selection-change="handleSelectionChange" @row-dblclick="handleRowDblClick">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-table :data="scope.row.configItems">
                            <el-table-column type="index"></el-table-column>
                            <el-table-column prop="subjectClass" label="题目类别"></el-table-column>
                            <el-table-column prop="subjectType" label="题型"></el-table-column>
                            <el-table-column prop="subjectNumbers" label="题目数量"></el-table-column>
                            <el-table-column prop="subjectDifficulty" label="题目难度" :formatter="difficultyFormatter"></el-table-column>
                            <el-table-column prop="subjectScore" label="题目分值"></el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="配置名">
                </el-table-column>
                <el-table-column prop="difficulty" label="难度" sortable>
                </el-table-column>
                <el-table-column prop="updatedBy" label="修改人">
                </el-table-column>
                <el-table-column prop="updatedTime" label="修改时间" :formatter="timeFormatter" sortable>
                </el-table-column>
                <el-table-column prop="company" label="公司">
                </el-table-column>
                <el-table-column prop="remark" label="备注">
                </el-table-column>
                <el-table-column prop="status" label="状态" :formatter="statusFormatter">
                </el-table-column>
                <el-table-column label="操作" fixed="right">
                    <template slot-scope="scope">
                        <el-button @click="handleStartCombPaper(scope.$index,scope.row)" type="text" size="medium" icon="el-icon-begin">开始组卷</el-button>
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
    name: 'QuickCreatePaper',
    data(){
        return{
            //试卷配置项表格
            configList:[
                {
                    configId: 1,
                    name: 'test1',
                    difficulty: 'normal',
                    updatedBy: 'JL',
                    updatedTime: 1566010663,
                    company: '博思软件' ,
                    remark: 'test config',
                    status: 1,
                    configItems: [
                        {
                            configItemId: 1,
                            subjectClass: 'Java基础',
                            subjectType: '选择题',
                            subjectNumbers: 20,
                            subjectDifficulty: 'normal',
                            subjectScore: 40
                        },
                        {
                            configItemId: 2,
                            subjectClass: 'Java基础',
                            subjectType: '填空题',
                            subjectNumbers: 20,
                            subjectDifficulty: 'normal',
                            subjectScore: 20
                        },
                        {
                            configItemId: 3,
                            subjectClass: 'Java基础',
                            subjectType: '编程题',
                            subjectNumbers: 3,
                            subjectDifficulty: 'normal',
                            subjectScore: 40
                        }
                    ]
                },
                {
                    configId: 2,
                    name: 'test2',
                    difficulty: 'normal',
                    updatedBy: 'JL',
                    updatedTime: 1566010663,
                    company: '博思软件' ,
                    remark: 'test config',
                    status: 1,
                    configItems: [
                        {
                            configItemId: 1,
                            subjectClass: 'Java基础',
                            subjectType: '选择题',
                            subjectNumbers: 20,
                            subjectDifficulty: 'normal',
                            subjectScore: 40
                        },
                        {
                            configItemId: 2,
                            subjectClass: 'Java基础',
                            subjectType: '填空题',
                            subjectNumbers: 20,
                            subjectDifficulty: 'normal',
                            subjectScore: 20
                        },
                        {
                            configItemId: 3,
                            subjectClass: 'Java基础',
                            subjectType: '编程题',
                            subjectNumbers: 3,
                            subjectDifficulty: 'normal',
                            subjectScore: 40
                        }
                    ]
                },
                {
                    configId: 3,
                    name: 'test3',
                    difficulty: 'normal',
                    updatedBy: 'JL',
                    updatedTime: 1566010663,
                    company: '博思软件' ,
                    remark: 'test config',
                    status: 1,
                    configItems: [
                        {
                            configItemId: 1,
                            subjectClass: 'Java基础',
                            subjectType: '选择题',
                            subjectNumbers: 20,
                            subjectDifficulty: 'normal',
                            subjectScore: 40
                        },
                        {
                            configItemId: 2,
                            subjectClass: 'Java基础',
                            subjectType: '填空题',
                            subjectNumbers: 20,
                            subjectDifficulty: 'normal',
                            subjectScore: 20
                        },
                        {
                            configItemId: 3,
                            subjectClass: 'Java基础',
                            subjectType: '编程题',
                            subjectNumbers: 3,
                            subjectDifficulty: 'normal',
                            subjectScore: 40
                        }
                    ]
                }
            ],
            //验证规则
            rules:{
            },
            //表格多选框情况
            multipleSelection:[],
            total:3,
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
        handleStartCombPaper(index,row){
           
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
            if(row.subjectDifficulty=='easy'){
                return '简单'
            }else if(row.subjectDifficulty=='normal'){
                return '一般'
            }else if(row.subjectDifficulty=='hard'){
                return '困难'
            }
        },
        timeFormatter(row,column){
            if(row.updatedTime){
                var timestamp = row.updatedTime;
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

