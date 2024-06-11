<template>
    <div class="wet-bpmndesign">
        <TopTool></TopTool>
        <div class="wet-bpmndesign__container" ref="containerRef"></div>
        <PropertiesForm></PropertiesForm>
    </div>
</template>
<script setup lang="ts">
import { WetBpmnDesignMainPanelProps } from './types'
import { onMounted,shallowRef,inject,computed } from 'vue'
import { bpmnstate } from './symbol'
import { createNewDiagram } from './utils'
import type { BpmnProvideType,BpmnElement,BpmnEventBus } from './types'

import PropertiesForm from './components/properties/index.vue'

import TopTool from './components/top-tool.vue'
import activitiSchema from './moddles/activiti/schema.json'
import flowableSchema from './moddles/flowable/schema.json'
import camundaSchema from 'camunda-bpmn-moddle/resources/camunda.json';

const ProcessTypes = {
    activiti:activitiSchema,
    camunda:camundaSchema,
    flowable:flowableSchema
}

const containerRef = shallowRef<HTMLDivElement>()

const props = defineProps(WetBpmnDesignMainPanelProps)

const moddleExtensions = computed(()=>{
    const processType = props.processType || 'flowable'
    const actions:Record<string,any> = {}
    actions[processType] = ProcessTypes[processType]
    return actions
})

const { 
    modules,
    modeler,
    seletedBpmnElement
} = inject(bpmnstate) as BpmnProvideType

const init = async ()=>{
    const events = ['shape.added', 'shape.move.end', 'shape.removed', 'connect.end', 'connect.move']
    const res = await import('bpmn-js/lib/Modeler')
    const Modeler = res.default
    modeler.value = new Modeler({
        container:containerRef.value,
        additionalModules:[
            ...modules.value
        ],
        moddleExtensions:moddleExtensions.value
    })

    const elementRegistry:any = modeler.value.get('elementRegistry')
    // 注册modeler事件
    events.forEach(event =>{
        modeler.value?.on(event,(e:any)=>{
            // console.log(event)
            if(event === 'shape.added'){
                const element = e.element as BpmnElement
                const shape = element ? elementRegistry.get(element.id) :e.shape
                seletedBpmnElement.value = [shape]
            }
        })
    })
    // 注册diagram element事件
    const eventBus = modeler.value.get('eventBus') as BpmnEventBus<string>
    const elementEvents = ['element.click','element.changed']
    elementEvents.forEach(event=>{
        eventBus.on(event,(e=>{
            if(event === 'element.click'){
                const element = (e as any).element as BpmnElement
                if(element){
                    seletedBpmnElement.value = [element]
                }
            }
        }))
    })
    await createNewDiagram(modeler.value,{
        xml:props.xml
    })
    const bpmnProcessElement = elementRegistry.find((item:any)=>item.type === 'bpmn:Process') as BpmnElement
    if(bpmnProcessElement){
        seletedBpmnElement.value = [bpmnProcessElement]
    }
}
onMounted(()=>{
  init()
})
</script>