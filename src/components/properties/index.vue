<template>
    <ElDrawer style="width: 500px;" :modal="false" :with-header="false" v-model="visible" 
    :modal-class="'wet-bpmn-properties'">
        <PropertyPanel v-for="item in Object.keys(addedBpmnElementsMap)" 
        :element-id="item" :key="item" v-show="item === seletedElementId"></PropertyPanel>
    </ElDrawer>
</template>
<script setup lang="ts">
import PropertyPanel from './panel.vue'
import { ElDrawer} from 'element-plus'
import useInject from '@/hooks/use-properties';
import { shallowRef } from 'vue'

const visible  = shallowRef(true)
const { seletedElementId,addedBpmnElementsMap } = useInject()

</script>