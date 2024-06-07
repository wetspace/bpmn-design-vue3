<template>
    <ElDrawer style="width: 500px;" :modal="false" :with-header="false" v-model="visible" 
    :modal-class="'wet-bpmn-properties'">
        <div class="wet-bpmn-properties__content">
            <div class="wet-bpmn-properties__hd">
                <el-icon>
                    <component :is="seletedBpmnElementInfo.icon"></component>
                </el-icon>
                <span style="margin-left: 10px;">{{ seletedBpmnElementInfo.title }}</span>
            </div>
            <div  class="wet-bpmn-properties__body">
                <ElCollapse v-model="openCollapse" accordion>
                    <ElCollapseItem v-for="item in propertiesGroup" :key="item.name" :name="item.name">
                        <template #title>
                            <div>
                               <ElSpace>
                                    <el-icon>
                                        <component :is="item.icon"></component>
                                    </el-icon>
                                    <span style="font-weight: bold;">
                                        {{ item.title }}
                                    </span>
                               </ElSpace>
                            </div>
                        </template>
                        <div v-loading="!isSeleted" style="min-height: 100px;">
                            <component :form-type="item.name" v-if="item.render && isSeleted" :is="item.render"></component>
                        </div>
                    </ElCollapseItem>
                </ElCollapse>
            </div>
        </div>
    </ElDrawer>
</template>
<script setup lang="ts">
import { ElDrawer,ElCollapse,ElCollapseItem,ElSpace,ElIcon,ElLoading } from 'element-plus'
import { EditPen,Document,Bell,Expand,Grid,LocationFilled} from '@element-plus/icons-vue'
import { shallowRef,computed,watch } from 'vue'
import useInject from '@/hooks/use-inject';
import Base from './base.vue'

const visible  = shallowRef(true)
const { seletedBpmnElement } = useInject()
const isSeleted = shallowRef(true)
const vLoading = ElLoading.directive

const openCollapse = shallowRef(['base'])

let isSeletedTime:number;
watch(seletedBpmnElement,(v,oldv)=>{
    const newId = v[0]?.businessObject?.id || v[0]?.id
    const oldId = oldv[0]?.businessObject?.id || oldv[0]?.id
    if(newId === oldId) return
    openCollapse.value = ['base']
    isSeleted.value = false;
    clearTimeout(isSeletedTime)
    isSeletedTime = setTimeout(()=>{
        isSeleted.value = true
    },100)
},)

const seletedBpmnElementInfo = computed(()=>{
    const element = seletedBpmnElement.value?.[0]
    // console.log(element)
    return {
        title: element?.type === 'bpmn:Process'? "流程":'节点',
        icon: element?.type === 'bpmn:Process'? Grid:LocationFilled,
        type: element?.type
    }
})

const propertiesGroup = computed(()=>{
    return [
        {
            name:'base',
            title:'常规信息',
            render:Base,
            icon:EditPen
        },
        {
            name:'documentation',
            title:'文档设置',
            render:Base,
            icon:Document
        },
        {
            name:'executionListener',
            title:'执行监听器',
            render:Base,
            icon:Bell,
        },
        {
            name:'extensionElements',
            title:'扩展属性',
            render:Base,
            icon:Expand
        }
    ]
})
</script>