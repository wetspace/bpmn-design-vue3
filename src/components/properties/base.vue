<template>
    <WetSchemaForm label-width="100px" 
    ref="formIns"
    @change="saveAction"
    :inital-values="formInit"
    :properties="$properties" :span="24"></WetSchemaForm>
</template>
<script setup lang="ts">
import { computed,ref,shallowRef,watch,nextTick } from 'vue'
import { WetSchemaForm } from '@wetspace/pro-components'
// import { ElButton } from 'element-plus'
import usePropertiesForm from '@/hooks/use-properties-form';
import type { BpmnPropertiesFormItem,BpmnPropertiesFormIns,BpmnElement,BpmnModeling } from '@/types'

const formIns = shallowRef<BpmnPropertiesFormIns>()
const { 
    modeler,
    seletedElement,
    currentElement,
    seletedElementId
} = usePropertiesForm()

const formInit = ref<Record<string,any>>({})

const $properties = computed(()=>{
    const bpmnElementType = currentElement.value?.type
    const base:BpmnPropertiesFormItem[] = [
        {
            property:'id',
            title:'ID',
            disabled:true,
        },
        {
            property:'name',
            title:'节点名称'
        }
    ]
    let res = base
    if(bpmnElementType === 'bpmn:Process'){
        res = [...base,{
            property:'versionTag',
            title:'版本标签',
        },{
            property:'isExecutable',
            title:'可执行',
            valueType:'switch',
            formItemProps:{
                activeValue:'11',
                activeText:'是',
                inactiveText:'否',
                inactiveValue:'22'
            }
        },{
            property:'taskPriority',
            title:'流程优先级'
        }]
    }
    
    return res
})

const isInited = shallowRef(false)
const initValue = (v:BpmnElement,p:BpmnPropertiesFormItem[])=>{
    isInited.value = false
    const businessObject = v.businessObject || {}
    p.forEach(item=>{
        formInit.value[item.property] = businessObject[item.property]
    })
    isInited.value = true
}


watch($properties,async (v)=>{
    if(currentElement.value){
        await nextTick()
        initValue(currentElement.value,$properties.value)
    }
},{
    immediate:true
})

// watch($properties,async (v)=>{
//     if(currentElement.value && currentElement.value.id === v){
//         await nextTick()
//         initValue(currentElement.value,$properties.value)
//     }
// },{
//     immediate:true
// })

const saveAction = async ()=>{
    if(!isInited.value) return
    const modeling = modeler.value?.get('modeling') as BpmnModeling
    if(modeling && seletedElement.value){
        const value = await formIns.value?.submit()
        modeling.updateProperties(seletedElement.value,value)
    }
}
</script>