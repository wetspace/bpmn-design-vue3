<template>
    <div class="wet-bpmn-properties__content">
        <div class="wet-bpmn-properties__hd">
            <el-icon :size="20" :class="seletedBpmnElementInfo.class">
                <component v-if="!seletedBpmnElementInfo.class" :is="seletedBpmnElementInfo.icon"></component>
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
                    <div style="min-height: 100px;">
                        <component :element-id="props.elementId"
                        v-if="item.render" :is="item.render"></component>
                    </div>
                </ElCollapseItem>
            </ElCollapse>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ElCollapse,ElCollapseItem,ElSpace,ElIcon, } from 'element-plus'
import { EditPen,Document,Expand,Grid,LocationFilled,TopRight,Ticket,Coin,Monitor } from '@element-plus/icons-vue'
import { shallowRef,computed,watch,onMounted} from 'vue'
import useInject from '@/hooks/use-properties';

import Base from './base.vue'
import Documentation from './documentation.vue'
import ExtensionElements from './extensionElements.vue'
import ExecutionListener from './executionListener.vue'

const { seletedElementId,elementProperties,addedBpmnElementsMap } = useInject()
const props = defineProps({
    elementId:{
        type:String,
        value:''
    }
})
const openCollapse = shallowRef(['base'])

watch(seletedElementId,(v,oldv)=>{
    if(v!==oldv){
        openCollapse.value = ['base']
    }
},)

const seletedBpmnElementInfo = computed(()=>{
    const element = addedBpmnElementsMap.value[props.elementId!]?.element
    const res = {
        title: "流程",
        icon: LocationFilled,
        type: element?.type,
        class:''
    }

    switch(element?.type){
        case 'bpmn:Process':{
            res.title = '流程'
            res.icon= Grid
            break;
        }
        case 'bpmn:SequenceFlow':{
            res.icon = TopRight
            res.title = '流转过程'
            break;
        }
        case 'bpmn:DataObjectReference':{
            res.icon = Ticket
            res.title = '数据对象'
            break;
        }
        case 'bpmn:DataStoreReference':{
            res.icon = Coin
            res.title = '数据仓库'
            break;
        }
        case 'bpmn:Group':{
            res.title = '群组'
            res.class = 'bpmn-icon-group'
            break;
        }
        case 'bpmn:Participant':{
            res.title = '泳道'
            res.class= 'bpmn-icon-participant'
            break;
        }
        default:{
            res.icon = LocationFilled
            res.title = '节点'
        }
    }

    return res
})

const mergeArraysWithOrder = (a:any[], b:any[]) => {
  const map:Record<string,any> = {};
  const order:any[] = [];
  a.forEach(item => {
    if (!map[item.name]) {
      order.push(item.name);
    }
    map[item.name] = item;
  });
  b.forEach(item => {
    if (!map[item.name]) {
      order.push(item.name);
      map[item.name] = { ...item };
    } else {
      map[item.name] = { ...map[item.name], ...item }; // 合并对象属性
    }
  });
  return order.map(name => map[name]);
}

const propertiesGroup = computed(()=>{
    const currentElment = addedBpmnElementsMap.value[props.elementId!]?.element
    const seletedElementType = currentElment?.type
    const config =  seletedElementType? elementProperties.value[seletedElementType]: null
    const base = mergeArraysWithOrder([
        {
            name:'base',
            title:'常规信息',
            render:Base,
            icon:EditPen
        },
        {
            name:'documentation',
            title:'文档设置',
            render:Documentation,
            icon:Document
        },
        {
            name:'executionListener',
            title:'执行监听器',
            icon:Monitor,
            render:ExecutionListener,
        },
        {
            name:'extensionElements',
            title:'扩展属性',
            render:ExtensionElements,
            icon:Expand
        }
    ],elementProperties.value?.base || [])

    if(config){
        if(config.conver){
            return config.groups
        }else{
            return mergeArraysWithOrder(base,config.groups)
        }
    }else{
        return base
    }
})

onMounted(()=>{
    console.log('加载')
})
</script>