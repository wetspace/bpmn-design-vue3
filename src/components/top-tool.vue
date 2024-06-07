<template>
    <div class="wet-bpmn__toptool">
        <ElSpace>
            <ElButtonGroup>
                <ElButton>保存流程</ElButton>
                <ElButton>打开</ElButton>
                <ToolViewUpload></ToolViewUpload>
                <ToolViewUpload></ToolViewUpload>
                <ElButton>模拟</ElButton>
            </ElButtonGroup>
        </ElSpace>
        <ElSpace>
            <ElButtonGroup>
                <ElButton>
                    <ElIcon>
                        <Refresh></Refresh>
                    </ElIcon>
                </ElButton>
            </ElButtonGroup>
        </ElSpace>
    </div>
</template>
<script setup lang="ts">
import { ElSpace,ElIcon,ElButton,ElButtonGroup } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import ToolViewUpload from './tool-view-upload.vue';


</script> 