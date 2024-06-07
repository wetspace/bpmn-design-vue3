<template>
    <WetSchemaForm label-width="100px" 
    ref="formIns"
    :inital-values="formInit"
    :properties="$properties" :span="24"></WetSchemaForm>
    <div style="display: flex;">
        <ElButton type="primary" style="display:flex;flex: 1;" @click="saveAction">保存</ElButton>
        <ElButton style="display:flex;flex: 1;">取消</ElButton>
    </div>
</template>
<script setup lang="ts">
import { WetSchemaForm } from '@wetspace/pro-components'
import type { WetProFormInstance } from '@wetspace/pro-components'
import { ElButton } from 'element-plus'
import type { BpmnModeling,BpmnModdle,BpmnModdleElement,BpmnElement} from '@/types/bpmn'
// import useInject from '@/hooks/use-inject';
import { computed,watch,ref,shallowRef, onMounted} from 'vue';
import { useDebounceFn } from '@vueuse/core'
import useInject from '@/hooks/use-inject';
import useProperties from '@/hooks/use-properties';

const { 
        modeler,
        seletedBpmnElement,
        processType
    } = useInject()

const props = defineProps({
    formType:String
})

const { $properties,seletedElementOne} = useProperties(props)


const formIns = shallowRef<WetProFormInstance>()

const formInit = ref<Record<string,any>>({
    id:'',
    title:''
})

const isInited = shallowRef(false)
const initValue = (v:BpmnElement)=>{
    console.log(v)
    const businessObject = v.businessObject
    if(props.formType === 'base'){
        formInit.value.id = businessObject.id || v.id
        formInit.value.name = businessObject.name || v.name

    }
    isInited.value = true
}

watch(seletedElementOne,(v)=>{
    if(v){
        initValue(v)
    }
},{immediate:true})

// onMounted(()=>{
//     isInited.value = true
// })

// const changeAction = useDebounceFn( async (v)=>{
//     const modeling = modeler.value?.get('modeling') as BpmnModeling
//     const moddle = modeler.value?.get('moddle') as BpmnModdle
//     const _seletedBpmnElement = seletedBpmnElement.value[0]
//     const formType = props.formType || "extendsAttrs"
//     if(modeling && _seletedBpmnElement){
//         // console.log(v,modeling)
//         const value = await formIns.value?.submit()
//         // modeling.updateProperties(_seletedBpmnElement,value)
        
//         // 新建一个属性字段
//         const newModdleElement = moddle.create(`${processType.value}:Property`,{
//             name:value.name,
//             value:'xxx'
//         })
//         // console.log(newModdleElement)
//         newModdleElements.value.push(newModdleElement)
//         const $newModdleElements= moddle.create(`${processType.value}:Properties`,{
//             values:[...newModdleElements.value]
//         })
//         console.log( $newModdleElements,' $newModdleElements',BpmnElementTypes[formType])
//         const extensionElements = moddle.create(BpmnElementTypes[formType],{
//             values:[$newModdleElements]
//         })
//         console.log(extensionElements,'extensionElements')
//         modeling.updateProperties(_seletedBpmnElement,{
//             extensionElements:extensionElements
//         })
//         modeling.updateModdleProperties
//         // const moddleEmenet = moddle.create()
//         // console.dir(modeler.value)
//         // modeling.updateProperties(_seletedBpmnElement,{
//         //     ...value
//         // })
//     }
// },400)
const saveAction = async ()=>{
    const modeling = modeler.value?.get('modeling') as BpmnModeling
    // const moddle = modeler.value?.get('moddle') as BpmnModdle
    const _seletedBpmnElement = seletedBpmnElement.value[0]
    if(!_seletedBpmnElement || !modeling) return 
    if(props.formType === 'base'){
        if(modeling){
            const value = await formIns.value?.submit()
            modeling.updateProperties(_seletedBpmnElement,value)
        }
    }
}
</script>