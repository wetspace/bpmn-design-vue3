<template>
    <ElDrawer style="width: 500px;" :modal="false" :with-header="false" v-model="visible" 
    :modal-class="'wet-bpmn-properties'">
        <PropertyPanel v-for="item in Object.keys(addedBpmnElementsMap)" :key="item" v-show="item === seletedElementId"></PropertyPanel>
    </ElDrawer>
</template>
<script setup lang="ts">
import PropertyPanel from './panel.vue'
import { ElDrawer} from 'element-plus'
import useInject from '@/hooks/use-properties';
import { shallowRef,watch,computed} from 'vue'

const visible  = shallowRef(true)
const { seletedElementId,addedBpmnElementsMap } = useInject()

const a = computed(()=>Object.keys(addedBpmnElementsMap.value))
watch(a,(v)=>{
    console.log(v,'哈啥')
},{
    deep:true
})
</script>