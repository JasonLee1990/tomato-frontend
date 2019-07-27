<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-form :inline="true" :model="condition" class="demo-form-inline">
        <el-form-item label="产品名称">
          <el-input v-model="condition.productName"></el-input>
        </el-form-item>
        <el-form-item label="产品状态">
          <el-select v-model="condition.productStatus" clearable>
            <el-option label="正常" value="ON"></el-option>
            <el-option label="下架" value="OFF"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData" icon="el-icon-search">查询</el-button>
          <el-button type="success" @click="toCreate" icon="el-icon-circle-plus-outline">创建</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="pageResult.list" style="width: 100%">
        <el-table-column label="名称" prop="productName"></el-table-column>
        <el-table-column label="售价" prop="salePrice"></el-table-column>
        <el-table-column label="状态" prop="productStatus"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="editData(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteData(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageResult.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="condition.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageResult.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import { baseUrl, baseImgPath } from "@/config/env";
import { productSearch, productDelete } from "@/api/getData";
export default {
  data() {
    return {
      condition: {
        startRow: 0,
        pageSize: 20,
        productName: null,
        productStatus: ""
      },
      pageResult: {
        list: [],
        total: 0,
        pageNum: 1
      }
    };
  },
  activated() {
    this.loadData();
  },
  // created() {
  //   this.loadData();
  // },
  components: {
    headTop
  },
  methods: {
    async loadData() {
      if (!this.condition.productName) {
        delete this.condition.productName;
      }
      if (
        !this.condition.productStatus ||
        this.condition.productStatus === ""
      ) {
        delete this.condition.productStatus;
      }
      try {
        const page = await productSearch(this.condition);
        if (page.code == 200) {
          const {
            data: { list, count, pageNum }
          } = page;
          this.pageResult.list = list;
          this.pageResult.total = count;
          this.pageResult.pageNum = pageNum;
        } else {
          throw new Error("获取数据失败");
        }
      } catch (err) {
        console.log("获取数据失败", err);
      }
    },
    editData(index, row) {
      this.$router.push({
        path: "/productEdit",
        query: {
          id: row.id
        }
      });
    },
    deleteData(index, row) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          productDelete(row.id).then(resp => {
            if (resp.successful) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.loadData();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    toCreate() {
      this.$router.push("/productCreate");
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.loadData();
    },
    handleCurrentChange(val) {
      this.pageResult.pageNum = val;
      this.startRow = (val - 1) * this.condition.pageSize;
      this.loadData();
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.table_container {
  padding: 20px;
}
.Pagination {
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
