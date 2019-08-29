<template>
  <div id="PaperEdit">
    <div id="paper">
      <h3 id="paperTitle" style="text-align:center;">{{ paperName }}</h3>

      <div id="OtherInfo"></div>

      <div id="Subject" class="Subject">
        <ol id="SubjectTypes" :model="allSubjectList" class="SubjectTypeOL" type="I">
          <li class="SubjectTypeLI" v-for="(subjectType, index) in allSubjectList" :key="index">
            <!--题型大标题-->
            <p class="TypeTitle">
              <strong>{{ subjectType.typeName }}</strong>
            </p>
            <ol id="SubjectList" class="SubjectListOL">
              <li
                class="SubjectLI"
                v-for="(subject, index) in subjectType.subjectList"
                :key="index"
              >
                <!--题目内容-->
                <p class="SubjectContent">
                  <strong>{{ subject.subject }}</strong>
                  <el-button
                    @click="handleAddSubject()"
                    icon="el-icon-plus"
                    style="margin-left:50%;"
                  ></el-button>
                  <el-button @click="handleEditSubject(subject.subjectId)" icon="el-icon-edit"></el-button>
                  <el-button @click="handleDeleteSubject(subject.subjectId)" icon="el-icon-delete"></el-button>
                </p>

                <!--选择题(单、多)答案显示方式-->
                <section
                  v-if="subjectType.type === 'Single-Choice' || subjectType.type === 'Multiple-Choice'"
                >
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
                  <img src="../../../assets/img/img.jpg" />
                </section>
              </li>
            </ol>
          </li>
        </ol>
      </div>
    </div>

    <div>
      <el-dialog title="修改试题" :visible.sync="dialogEditSubjectVisible">
        <el-form
          :rules="editDialogRules"
          :model="SubjectData"
          label-width="80px"
          label-position="right"
        >
          <el-form-item prop="name" label="题目名" style="width:300px;">
            <el-input v-model="SubjectData.name" style="width:200px;"></el-input>
          </el-form-item>

          <el-form-item prop="subjectClass" label="题目类别">
            <el-select v-model="SubjectData.subjectClass" placeholder="请选择题目类别" style="width:200px">
              <el-option
                :label="item.name"
                :value="item.code"
                v-for="(item, index) in SubjectClassList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="subjectType" label="题型">
            <el-select v-model="SubjectData.subjectType" placeholder="请选择题型" style="width:300px">
              <el-option
                :label="item.name"
                :value="item.code"
                v-for="(item, index) in SubjectTypeList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="subjectDifficulty" label="难度">
            <el-select
              v-model="SubjectData.subjectDifficulty"
              placeholder="请选择难度"
              style="width:300px"
            >
              <el-option
                :label="item.name"
                :value="item.code"
                v-for="(item, index) in SubjectDifficultyList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="subjectContent" label="题干">
            <el-input type="textarea" v-model="SubjectData.subjectContent"></el-input>
          </el-form-item>

          <!-- 答案区域 -->
          <div
            v-for="(answer, index) in SubjectData.answers"
            :key="index"
            style="border:1px solid #F0F0F0;padding:20px;margin:20px 0 20px 0;"
          >
            <el-form-item :prop="'answers.'+index+'.content'" label="答案" :rules="dialogSubjectAnswersRules.answersRules">
              <el-input
                v-model="answer.content"
                type="textarea"
                clearable
                @keyup.enter.native="addlastitems(index, '1')"
              />
            </el-form-item>

            <el-form-item :prop="'answers.'+index+'.isRight'" label="是否正确" :rules="dialogSubjectAnswersRules.isRightRules">
              <el-row>
                <el-col :span="5">
                  <el-select v-model="answer.isRight" >
                    <el-option label="正确" value='true'></el-option>
                    <el-option label="错误" value='false'></el-option>
                  </el-select>
                </el-col>

                <el-col :span="6">
                  <section v-if="index === 0">
                    <el-button
                      type="primary"
                      icon="el-icon-plus"
                      plain
                      style="margin-left:10px;"
                      circle
                      @click="addlastitems(index, '1')"
                    />
                  </section>

                  <section v-if="index > 0">
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      plain
                      style="margin-left:10px;"
                      circle
                      @click="rmlastitems(index, '1')"
                    />
                  </section>
                </el-col>
              </el-row>
            </el-form-item>
          </div>
        </el-form>

        <el-row>
            <el-button type="primary" style="margin-left:25%" @click="handleSaveSubjectEdit">保存</el-button>
            <el-button style="margin-left:30px" @click="dialogEditSubjectVisible = false">关闭</el-button>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { truncate } from "fs";
export default {
  name: "EditPaper",
  //获取试卷或模板ID，向后端查询
  created: function() {
    const id = this.$route.query.paperOrTemplateId;
    console.log(id);
    //以下为查询方法
  },
  data() {
    return {
      paperName: "XXXX试卷",
      dialogEditSubjectVisible: false,
      allSubjectList: [
        {
          type: "Single-Choice",
          typeName: "单选题",
          subjectList: [
            {
              subjectId: 1,
              subject: "这是第一道单选测试题",
              answers: [
                {
                  answerId: 1,
                  answer:
                    "这是第一个选项这是第一个选项X这是第一个选项这是第一个选项这是第一个选项这是第一个选项这是第一个选项这是第一个选项这是第一个选项这是第一个选项这是第一个选项这是第一个选项这是第一个选项",
                  isRight: true
                },
                {
                  answerId: 2,
                  answer: "这是第二个选项",
                  isRight: false
                },
                {
                  answerId: 3,
                  answer: "这是第三个选项",
                  isRight: false
                },
                {
                  answerId: 4,
                  answer: "这是第四个选项",
                  isRight: false
                }
              ]
            },
            {
              subjectId: 2,
              subject: "这是第二道单选测试题",
              answers: [
                {
                  answerId: 5,
                  answer: "这是第一个选项",
                  isRight: false
                },
                {
                  answerId: 6,
                  answer: "这是第二个选项",
                  isRight: false
                },
                {
                  answerId: 7,
                  answer: "这是第三个选项",
                  isRight: false
                },
                {
                  answerId: 8,
                  answer: "这是第四个选项",
                  isRight: true
                }
              ]
            }
          ]
        },
        {
          type: "Completion",
          typeName: "填空题",
          subjectList: [
            {
              subjectId: 3,
              subject: "这是第一道填空测试题",
              answers: [
                {
                  answerId: 9,
                  answer: "这是正确答案",
                  isRight: true
                }
              ]
            },
            {
              subjectId: 4,
              subject: "这是第二道填空测试题",
              answers: [
                {
                  answerId: 10,
                  answer: "这是正确答案",
                  isRight: true
                }
              ]
            }
          ]
        },
        {
          type: "Program",
          typeName: "编程题",
          subjectList: [
            {
              subjectId: 5,
              subject: "这是第一道编程测试题",
              answers: [
                {
                  answerId: 11,
                  answer: "这里放入代码图片",
                  isRight: true
                }
              ]
            }
          ]
        }
      ],
      //修改试题对话框数据
      SubjectData: {
        name: "",
        subjectClass: "",
        subjectType: "",
        subjectDifficulty: "",
        subjectContent: "",
        answers: [
          {
            content: "",
            isRight: ''
          }
        ]
      },
      SubjectClassList: [
        {
          code: "java",
          name: "Java"
        },
        {
          code: "cpp",
          name: "C++"
        },
        {
          code: "php",
          name: "Php"
        }
      ],
      SubjectTypeList: [
        {
          code: "Judgement",
          name: "判断题"
        },
        {
          code: "Single-Choice",
          name: "单选题"
        },
        {
          code: "Program",
          name: "编程题"
        }
      ],
      SubjectDifficultyList: [
        {
          code: "easy",
          name: "简单"
        },
        {
          code: "normal",
          name: "一般"
        },
        {
          code: "hard",
          name: "困难"
        }
      ],
      editDialogRules:{
          name:[ {required:true,message:'请输入试题名',trigger:'blur'} ],
          subjectClass:[ {required:true,message:'请输入试题类别',trigger:'blur'} ],
          subjectType:[{required:true,message:'请输入题型',trigger:'blur'} ],
          subjectDifficulty:[{required:true,message:'请输入试题难度',trigger:'blur'}],
          subjectContent:[{required:true,message:'请输入试题题干',trigger:'blur'}]
      },
      dialogSubjectAnswersRules:{
          answersRules:[{required:true,message:'请输入答案内容',trigger:'blur'}],
          isRightRules:[{required:true,message:'请选择是否正确',trigger:'blur'}]
      }
    };
  },
  methods: {
    handleAddSubject() {
      this.$router.push({
        path: "/SubjectAddOnPaper"
      });
    },
    handleEditSubject(subjectId) {
      this.dialogEditSubjectVisible = true;
      //根据ID查询出试题信息放入对话框绑定的model中
    },
    handleDeleteSubject(subjectId) {
        this.$confirm('您确定要删除吗？','提示',{
                type:'warning'
            })
            .then(_ => {
                //发起删除请求
                this.$message.success('删除成功')
            })
            .catch(_ => {});
    },
    handleSaveSubjectEdit(){},
    addlastitems(index, type) {
      if (type === "1") {
        this.SubjectData.answers.push({
          content: "",
          isRight: ""
        });
      }
    },
    rmlastitems(index, type) {
      switch (type) {
        case "1":
          this.SubjectData.answers.splice(index, 1);
          break;
        default:
          break;
      }
      this.$message.success("移除成功");
    },
    isRightFormatter(){

    }
  }
};
</script>

<style>
.Subject {
  margin-left: 250px;
  margin-top: 60px;
}
.SubjectTypeLI {
  margin-top: 10px;
}
.SubjectListOL {
  margin-left: 50px;
}
.SubjectLI {
  margin: 10px;
}
.ChoiceDisplayOL {
  margin-left: 50px;
}
.ChoiceLI {
  width: 50%;
  margin: 10px;
}
.TypeTitle {
  font-size: large;
}
</style>

