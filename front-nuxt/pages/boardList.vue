<template>
    <el-container>
        <div class="logoutBtn">
            <el-button @click="logout" style="margin: 0;">Logout</el-button>
        </div>
        <el-header style="margin-top: 20px;">
            <el-row :gutter="20">
                <el-col :span="12" :offset="6">
                    <el-form ref="form" :model="form">
                        <el-select v-model="form.search_category" style="width: 120px;">
                            <el-option label="검색 조건" value='null'></el-option>
                            <el-option label="제목" value="title"></el-option>
                            <el-option label="작성자" value="nickname"></el-option>
                            <el-option label="제목 + 작성자" value="title_nickname"></el-option>
                        </el-select>
                        <el-input placeholder="검색할 내용을 입력해주세요." v-model="form.search_obj"
                            style="width: calc(100% - 280px);" />
                        <el-button type="primary" plain @click="search">검색</el-button>
                        <el-button @click="reset" style="margin: 0;">리셋</el-button>
                    </el-form>
                </el-col>
            </el-row>
        </el-header>
        <el-main id="BoardList">
            <el-row :gutter="20" style="box-sizing: border-box;">
                <el-col :span="16" :offset="4">
                    <el-table :data="tableData" @row-click="moveBoardView">
                        <el-table-column prop="rnum" label="글번호" width="80" align="center"></el-table-column>
                        <el-table-column prop="title" label="제목"></el-table-column>
                        <el-table-column prop="nickname" label="작성자" width="100" align="center"></el-table-column>
                        <el-table-column prop="writedate" label="작성일" width="130" align="center"></el-table-column>
                        <el-table-column prop="views" label="조회수" width="80" align="center"></el-table-column>
                    </el-table>
                </el-col>
                <el-col :span="16" :offset="4">
                    <div class="main_btn">
                        <el-select v-model="form.page_size" style="width: 120px;" @change="chg_pagesize">
                            <el-option label="5개씩 보기" value="5" align="center"></el-option>
                            <el-option label="7개씩 보기" value="7" align="center"></el-option>
                            <el-option label="10개씩 보기" value="10" align="center"></el-option>
                        </el-select>
                        <el-button type="info" plain @click="move_board_c">글쓰기</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-main>
        <el-footer>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"
                        :current-page="current_page" :total="total_page">
                    </el-pagination>
                </el-col>
            </el-row>
        </el-footer>
    </el-container>
</template>
  
<script>
import axios from 'axios';
import { mapActions } from 'vuex';
import { setHeader } from '@/utils/setHeader'

export default {

    data() {
        return {
            tableData: [],
            total_page: 0,
            current_page: 1,
            form: {
                search_obj: '',
                search_category: 'null',
                page_size: '10'
            }
        }
    },

    // 렌더링 이후 실행
    mounted() {
        setHeader();
        this.call_axios();
    },

    methods: {

        ...mapActions(['logout']),

        search() {
            if(this.form.search_category === 'null') {
                this.$message.warning('검색 조건을 지정해주세요.');
            }
            this.call_axios();
        },

        moveBoardView(row) { // 글 한건 보기
            axios.get(this.$store.getters.getBackURL + `board/increment/${row.idx}`).then(() => {})
            window.location.href = this.$store.getters.getFrontURL + `boardView?idx=${row.idx}`;
        },

        handleCurrentChange(current_page) { // 페이징

            const params = new URLSearchParams();
            params.append('current_page', current_page);
            params.append('search_category', this.form.search_category);
            params.append('search_obj', this.form.search_obj);
            params.append('page_size', this.form.page_size);

            axios.get(this.$store.getters.getBackURL + `board/list?${params.toString()}`)
            .then((response) => {
                this.tableData = response.data.boardList;
                this.total_page = response.data.total_page * 10;
                this.current_page = response.data.current_page;
            });
        },

        move_board_c() { // 글 등록 폼 이동
            window.location.href = this.$store.getters.getFrontURL + 'boardInsert'
        },

        chg_pagesize() {
            this.call_axios()
        },

        reset() {
            this.form.search_category = 'null',
            this.form.search_obj = '',
            this.form.page_size = '10',
            this.call_axios();
        },

        call_axios() {

            const params = new URLSearchParams();
            params.append('search_category', this.form.search_category);
            params.append('search_obj', this.form.search_obj);
            params.append('page_size', this.form.page_size);

            axios.get(this.$store.getters.getBackURL + `board/list?${params.toString()}`)
            .then((response) => {
                this.tableData = response.data.boardList;
                this.total_page = response.data.total_page * 10;
                this.current_page = response.data.current_page;
            }).catch((error) => {
                this.logout()
            })
        }
    },

}

</script>

<style>
main#BoardList {
    overflow: visible;
    height: 560px;
}

.el-main {
    padding: 0 20px;
}

.el-main>.el-row>.el-col {
    position: relative;
}

.cell {
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
}

thead>tr>th>div {
    text-align: center;
}

.el-pagination {
    width: 300px;
    margin: 0 auto;
    text-align: center;
}

.main_btn {
    margin-top: 10px;
    position: absolute;
    bottom: -40;
    right: 10px;
}
</style>