import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '后台管理' },
            children: [
                {
                    path: 'Category',
                    component: resolve => require(['../views/basedata/Category.vue'], resolve),
                    meta: { title: '题目类别管理' }
                },
                
                {
                    path: 'CombExam',
                    component: resolve => require(['../views/basedata/CombExam.vue'], resolve),
                    meta: { title: '组卷配置' }
                },
                {

                    path: 'Dictionary',
                    component: resolve => require(['../views/basedata/Dictionary.vue'], resolve),
                    meta: { title: '数据字典管理' }
                },
                {

                    path: 'Subject',
                    component: resolve => require(['../views/basedata/Subject.vue'], resolve),
                    meta: { title: '题目管理' }
                },
                {
                    path: 'SubjectType',
                    component: resolve => require(['../views/basedata/SubjectType.vue'], resolve),
                    meta: { title: '题型管理' }
                },
                {

                    path: 'CreatePaper',
                    component: resolve => require(['../views/paper/CreatePaper.vue'], resolve),
                    meta: { title: '组卷' }
                },
                {
                    path: 'QuickCreatePaper',
                    component: resolve => require(['../views/paper/creatPaper/QuickCreate.vue'],resolve),
                    meta: { title:'快速组卷' }
                },
                {
                    path: 'StandardCreatePaper',
                    component: resolve => require(['../views/paper/creatPaper/StandardCreate.vue'],resolve),
                    meta: { title:'标准组卷' }
                },
                {
                    path: 'TemplateCreatePaper',
                    component: resolve => require(['../views/paper/creatPaper/TemplateCreate.vue'],resolve),
                    meta: { title:'模板组卷' }
                },
                {
                    path: 'UploadPaper',
                    component: resolve => require(['../views/paper/UploadPaper.vue'], resolve),
                    meta: { title:'上传试卷' }
                },
                {
                    path: 'DownloadPaper',
                    component: resolve => require(['../views/paper/DownloadPaper.vue'], resolve),
                    meta: { title:'下载试卷' }
                },
                {
                    path: 'PaperManage',
                    component: resolve => require(['../views/paper/PaperManage.vue'], resolve),
                    meta: { title:'维护试卷' }
                },
                {
                    path: 'PaperView',
                    component: resolve => require(['../views/paper/editPaper/View.vue'], resolve),
                    meta: { title:'试卷预览' }
                },
                {
                    path: 'PaperEdit',
                    component: resolve => require(['../views/paper/editPaper/Edit.vue'], resolve),
                    meta: { title:'修改试卷' }
                },
                {
                    path: 'TemplateManage',
                    component: resolve  => require(['../views/paper/TemplateManage.vue'], resolve),
                    meta: { title:'试卷模板管理' }
                },
                {
                    path: 'SubjectAddOnPaper',
                    component: resolve => require(['../views/paper/editPaper/SubjectAdd.vue'],resolve),
                    meta: { title:'添加试题' }
                },
                {
                    path: '/tabs',
                    component: resolve => require(['../components/common/Tabs.vue'], resolve),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/404',
                    component: resolve => require(['../page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../page/403.vue'], resolve),
                    meta: { title: '403' }
                },
                {
                    path: '/PublishExamRecord',
                    component: resolve => require(['../views/exam/PublishExamRecord.vue'], resolve),
                    meta: { title: '发布试卷管理' }
                },
                {
                    path: '/ExamRecord',
                    component: resolve => require(['../views/exam/ExamRecord.vue'], resolve),
                    meta: { title: '答卷查询' }
                },
                {
                    path: '/MarkingList',
                    component: resolve => require(['../views/exam/MarkingList.vue'], resolve),
                    meta: { title: '评卷管理' }
                },
                {
                    path: '/ExamReport',
                    component: resolve => require(['../views/exam/ExamReport.vue'], resolve),
                    meta: { title: '考试报表' }
                },
                {
                    path: '/ExamReportItem',
                    component: resolve => require(['../views/exam/ExamReportItem.vue'], resolve),
                    meta: { title: '考试报表明细' }
                },
                {
                    path: '/ExamQRCode/:publishId',
                    component: resolve => require(['../views/exam/ExamQRCode.vue'], resolve),
                    meta: { title: '考试二维码' }
                },
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
