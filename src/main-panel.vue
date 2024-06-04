<template>
    <div class="wet-bpmndesign" ref="containerRef">
        <TopTool></TopTool>
    </div>
</template>
<script setup lang="ts">
import { WetBpmnDesignMainPanelProps } from './types'
import { onMounted,shallowRef,inject } from 'vue'
import { bpmnstate } from './symbol'

import type { BpmnProvideType } from './types'

import TopTool from './components/top-tool.vue'

const containerRef = shallowRef<HTMLDivElement>()
const modelerInstance = shallowRef()

const props = defineProps(WetBpmnDesignMainPanelProps)

const { 
    modules 
} = inject(bpmnstate) as BpmnProvideType

const init = async ()=>{
    const res = await import('bpmn-js/lib/Modeler')
    const Modeler = res.default
    modelerInstance.value = new Modeler({
        container:containerRef.value,
        additionalModules:[
            ...modules.value
        ]
    })
}
onMounted(()=>{
  init()
})
</script>