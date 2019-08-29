<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem,i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >{{ threeItem.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from "./bus";
export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: "el-icon-document",
          title: "基础数据管理",
          index: 1,
          subs: [
            {
              index: "Dictionary",
              title: "数据字典管理"
            },
            {
              index: "Category",
              title: "题目类别管理"
            },
            {
              index: "SubjectType",
              title: "题型管理"
            },
            {
              index: "Subject",
              title: "题目管理"
            },
            {
                index:"CombExam",
                title:"组卷配置"
            }
          ]
        },
        {
          icon: "el-icon-edit",
          title: "考试管理",
          index: 2,
          subs: [
            {
              index: "PublishExamRecord",
              title: "发布试卷管理"
            },
            {
              index: "ExamRecord",
              title: "手机答卷"
            },
            {
              index: "MarkingList",
              title: "评卷管理"
            },
            {
              index: "ExamReport",
              title: "考试报表"
            }
          ]
        },
        {
          icon: "el-icon-collection",
          index: 3,
          title: "考卷管理",
          subs: [
            {
              index: "CreatePaper",
              title: "组卷"
            },
            {
              index: "UploadPaper",
              title: "上传试卷"
            },
            {
              index: "DownloadPaper",
              title: "下载试卷"
            },
            {
              index: "PaperManage",
              title: "维护试卷"
            },
            {
              index: "TemplateManage",
              title: "试卷模板管理"
            }
          ]
        }
      ]
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 200px;
}
.sidebar > ul {
  height: 100%;
}
</style>
