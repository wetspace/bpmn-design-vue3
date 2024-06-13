<template>
    <WetSchemaForm label-width="100px" 
    ref="formIns"
    @change="saveAction"
    :inital-values="formInit"
    :properties="$properties" :span="24"></WetSchemaForm>
    <!-- <div style="display: flex;">
        <ElButton type="primary" style="display:flex;flex: 1;" @click="saveAction">保存</ElButton>
        <ElButton style="display:flex;flex: 1;">取消</ElButton>
    </div> -->
</template>
<script setup lang="ts">
import { computed,ref,shallowRef,onMounted } from 'vue'
import { WetSchemaForm } from '@wetspace/pro-components'
// import { ElButton } from 'element-plus'
import useInject from '@/hooks/use-properties';
import type { BpmnPropertiesFormItem,BpmnPropertiesFormIns,BpmnElement,BpmnModdleElement } from '@/types'
const formIns = shallowRef<BpmnPropertiesFormIns>()
const { 
    seletedElement,
    getUpadateProperties
} = useInject()

const formInit = ref<Record<string,any>>({})
const parentElement = shallowRef<BpmnModdleElement>()

const $properties = computed(()=>{
    const base:BpmnPropertiesFormItem[] = [
        {
            property:'text',
            title:'文档内容',
            formItemProps:{
                type:'textarea'
            }
        },
    ]
    let res = base    
    return res
})

const isInited = shallowRef(false)
const initValue = (v:BpmnElement)=>{
    formIns.value?.clear()
    const businessObject = v.businessObject || {}
    const documentation = businessObject.documentation && businessObject.documentation[0]
    parentElement.value = documentation
    // console.log(parentElement.value)
    if(documentation){
        formInit.value = {
            text:documentation.text
        }
    }
    isInited.value = true
}

onMounted(()=>{
    if(seletedElement.value){
        initValue(seletedElement.value)
    }
})

const saveAction = async ()=>{
    console.log('change,触发-docs')
    if(!isInited.value) return
    const { modeling,moddle } = getUpadateProperties()
    if(modeling && seletedElement.value){
        const value = await formIns.value?.submit()
        if(parentElement.value){
            modeling.updateModdleProperties(seletedElement.value,parentElement.value,{
                text:value.documentation
            })
        }else{
            const $m = moddle.create(`bpmn:Documentation`,value)
            console.log($m,value)
            modeling.updateProperties(seletedElement.value,{
                documentation:[$m]
            })
        }
    }
}
</script>