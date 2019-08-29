<template>
    <div id="PaperView">
        <div id="paper">
            <h3 id="paperTitle" style="text-align:center;">{{ paperName }}</h3>

            <div id="OtherInfo"></div>

            <div id="Subject" class="Subject">
                <ol id="SubjectTypes" :model="allSubjectList" class="SubjectTypeOL" type="I">
                    <li class="SubjectTypeLI" v-for="(subjectType, index) in allSubjectList" :key="index">
                        <!--题型大标题-->
                        <p class="TypeTitle"><strong>{{ subjectType.typeName }}</strong></p>
                        <ol id="SubjectList" class="SubjectListOL">
                            <li class="SubjectLI" v-for="(subject, index) in subjectType.subjectList" :key="index">
                                <!--题目内容-->
                                <p class="SubjectContent"><strong>{{ subject.subject }}</strong></p>
                                
                                <!--选择题(单、多)答案显示方式-->
                                <section v-if="subjectType.type === 'Single-Choice' || subjectType.type === 'Multiple-Choice'">
                                    <ol class="ChoiceDisplayOL" type="A">
                                        <li class="ChoiceLI" v-for="(answer, index) in subject.answers" :key="index">
                                            <section v-if="answer.isRight === true">
                                                <p style="color:red;">{{ answer.answer }}</p>
                                            </section>
                                            <section v-if="!answer.isRight === true">
                                                <p>{{ answer.answer }}</p>
                                            </section>
                                        </li>
                                    </ol>
                                </section>

                                <!--判断题答案显示方式-->
                                <section v-if="subjectType.type === 'Judgement'"></section>

                                <!--填空题答案显示方式-->
                                <section v-if="subjectType.type === 'Completion'">
                                    <p>{{ subject.answers[0].answer }}</p>
                                </section>

                                <!--编程题题答案显示方式-->
                                <section v-if="subjectType.type === 'Program'">
                                    <img src="../../../assets/img/img.jpg">
                                </section>
                            </li>
                        </ol>
                    </li>
                </ol>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PaperDetails',
    //获取试卷或模板ID，向后端查询
    created:function(){
        const id = this.$route.query.paperOrTemplateId;
        console.log(id)
        //以下为查询方法
    },
    data(){
        return{
            paperName:'XXXX试卷',
            allSubjectList:[
                {
                    type:'Single-Choice',
                    typeName:'单选题',
                    subjectList:[
                        {
                            subject:'这是第一道单选测试题',
                            answers:[
                                {
                                    answerId:1,
                                    answer:'这是第一个选项这是第一个选项X这是第一个选项这是第一个选项这是第一个选项这是第一个选项这是第一个选项这是第一个选项这是第一个选项这是第一个选项这是第一个选项这是第一个选项这是第一个选项',
                                    isRight:true
                                },
                                {
                                    answerId:2,
                                    answer:'这是第二个选项',
                                    isRight:false
                                },
                                {
                                    answerId:3,
                                    answer:'这是第三个选项',
                                    isRight:false
                                },
                                {
                                    answerId:4,
                                    answer:'这是第四个选项',
                                    isRight:false
                                }
                            ]
                        },
                        {
                            subject:'这是第二道单选测试题',
                            answers:[
                                {
                                    answerId:5,
                                    answer:'这是第一个选项',
                                    isRight:false
                                },
                                {
                                    answerId:6,
                                    answer:'这是第二个选项',
                                    isRight:false
                                },
                                {
                                    answerId:7,
                                    answer:'这是第三个选项',
                                    isRight:false
                                },
                                {
                                    answerId:8,
                                    answer:'这是第四个选项',
                                    isRight:true
                                }
                            ]
                        }
                    ]
                },
                {
                    type:'Completion',
                    typeName:'填空题',
                    subjectList:[
                        {
                            subject:'这是第一道填空测试题',
                            answers:[
                                {
                                    answerId:9,
                                    answer:'这是正确答案',
                                    isRight:true
                                }
                            ]
                        },
                        {
                            subject:'这是第二道填空测试题',
                            answers:[
                                {
                                    answerId:10,
                                    answer:'这是正确答案',
                                    isRight:true
                                }
                            ]
                        }
                    ]
                },
                {
                    type:'Program',
                    typeName:'编程题',
                    subjectList:[
                        {
                            subject:'这是第一道编程测试题',
                            answers:[
                                {
                                    answerId:11,
                                    answer:'这里放入代码图片',
                                    isRight:true
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
}
</script>

<style>
    .Subject{
        margin-left: 250px;
        margin-top: 60px;
    }
    .SubjectTypeLI{
        margin-top: 10px;
    }
    .SubjectListOL{
        margin-left: 50px;
    }
    .SubjectLI{
        margin: 10px;
    }
    .ChoiceDisplayOL{
        margin-left: 50px;
    }
    .ChoiceLI{
        width: 50%;
        margin: 10px;
    }
    .TypeTitle{
        font-size: large;
    }

</style>

