<template>
    <div>
        <ElTable :data="props.modelValue || []">
            <ElTableColumn label="事件类型"></ElTableColumn>
            <ElTableColumn label="监听器类型"></ElTableColumn>
            <ElTableColumn label="操作">
                <template #default="{$index}">
                    <ElButton type="primary" link @click="toEdite($index)">修改</ElButton>
                    <ElButton  type="danger" link @click="toDel($index)">删除</ElButton>  
                </template>
            </ElTableColumn>
        </ElTable>
        <div style="margin-top:10px">
            <ElButton type="primary" style="width:100%" @click="()=>visibleChange(true)">添加监听器</ElButton>
        </div>
        <ElDialog append-to-body v-model="visible" title="执行监听器" width="700px">
            <WetProForm :span="24">
                <WetFormRadio required label="事件类型" prop="event" :options="[
                    {
                        label:'开始',
                        value:'start'
                    },
                    {
                        label:'启用',
                        value:'take'
                    },
                    {
                        label:'结束',
                        value:'end'
                    },
                ]"></WetFormRadio>
                <WetFormRadio required label="事件类型" @change="changeAction" prop="listenerType" :options="[
                    {
                        label:'Java类',
                        value:'class'
                    },
                    {
                        label:'表达式',
                        value:'expression'
                    },
                    {
                        label:'代理表达式',
                        value:'delegateExpression'
                    },
                ]"></WetFormRadio>
                <WetFormText :label="valueLabel" prop="value"></WetFormText>
                <div style="margin-left: 20px;margin-bottom: 10px;">注入字段</div>
                <WetFormArray height="200px" showBottomAdd  :showActions="false" :showRowActions="['add','delete']" :columns="([
                    {
                        label:'字段名',
                        prop:'name',
                    },
                    {
                        label:'字段类型',
                        prop:'type',
                        inputType:'select',
                        formInputProps:{
                            options:[
                                {
                                    label:'字符串',
                                    value:'string'
                                },
                                {
                                    label:'表达式',
                                    value:'expression'
                                },
                            ]
                        }
                    },
                    {
                        label:'字段值',
                        prop:'value'
                    }
                ] as any)">
                </WetFormArray>
            </WetProForm>
            <div style="text-align: right;">
                <ElButton>取消</ElButton>
                <ElButton type="primary">确定</ElButton>
            </div>
        </ElDialog>
    </div>
</template>
<script setup lang="ts">
import { ref,shallowRef } from 'vue'
import { ElTable,ElTableColumn,ElButton,ElDialog } from 'element-plus'
import { WetProForm,WetFormRadio,WetFormText,WetFormArray} from "@wetspace/pro-components"

const props = defineProps({
    modelValue: Array,
    default(){
        return []
    }
})

const valueLabel = shallowRef('值')
const changeAction = (v:string)=>{
    console.log(v)
}
const emits = defineEmits(['update:modelValue','change'])
const visible = shallowRef(false)

const visibleChange = (v:boolean)=>visible.value = v

const toEdite = (index:number)=>{
    visibleChange(true)
}

const toDel = (index:number)=>{

}
</script>