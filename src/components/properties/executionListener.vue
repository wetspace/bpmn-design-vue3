<template>
    <WetSchemaForm label-width="100px" 
    ref="formIns"
    @change="saveAction"
    :inital-values="formInit"
    :properties="$properties" :span="24"></WetSchemaForm>
</template>
<script setup lang="ts">
import { computed,ref,shallowRef,onMounted} from 'vue'
import { WetSchemaForm } from '@wetspace/pro-components'
import listener from '../listener-form/index.vue';
import useInject from '@/hooks/use-properties';
import type { BpmnPropertiesFormItem,BpmnPropertiesFormIns,BpmnElement,BpmnModdleElement } from '@/types'
const formIns = shallowRef<BpmnPropertiesFormIns>()
const { 
    seletedElement,
    getUpadateProperties,
    processType
} = useInject()

const formInit = ref<Record<string,any>>({})
const parentElement = shallowRef<BpmnModdleElement>()
const parentProperties = shallowRef<BpmnModdleElement>()

const $properties = computed(()=>{
    const base:BpmnPropertiesFormItem[] = [
        {
            property:'listener',
            renderFormItem:listener
        },
    ]
    let res = base    
    return res
})

const isInited = shallowRef(false)
const initValue = (v:BpmnElement)=>{
    formIns.value?.clear()
    const businessObject = v.businessObject || {}
    const extensionElements = businessObject.extensionElements && businessObject.extensionElements
    parentElement.value = extensionElements
    if(extensionElements){
        const properties = ( extensionElements.values || []).find((item:BpmnModdleElement)=>{
            return item.$type === `${processType.value}:Properties`
        })
        parentProperties.value = properties
        formInit.value = {
            properties: (properties?.values || []).map((item:BpmnModdleElement)=>{
                return {
                    name:item.name,
                    value:item.value
                }
            })
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
    // console.log('调用更新')
    if(!isInited.value) return
    const { modeling,moddle } = getUpadateProperties()
    if(modeling && seletedElement.value){
        const value = await formIns.value?.submit()
        console.log(value.properties,'调用更新')
        const updateValueChild = value.properties.map((item:{name:string,value:string}[])=>{
            return moddle.create(`${processType.value}:Property`,item || {name:undefined,value:undefined})
        })
        const updateValue = moddle.create(`${processType.value}:Properties`,{values:updateValueChild})
        if(parentElement.value){
            console.log('调用更新')
            if(parentProperties.value){
                modeling.updateModdleProperties(seletedElement.value,parentProperties.value,{
                    values:updateValueChild
                })
            }else{
                modeling.updateModdleProperties(seletedElement.value,parentElement.value,{
                    values:[...parentElement.value.values,updateValue]
                })
            }
        }else{
            const $m = moddle.create(`bpmn:ExtensionElements`,{
                values:[updateValue]
            })
            modeling.updateProperties(seletedElement.value,{
                extensionElements:$m
            })
        }
    }
}
</script>