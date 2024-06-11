<template>
    <MainPanel v-if="!isRefresh" v-bind="props"></MainPanel>
</template>
<script setup lang="ts">
import { provide,shallowRef,computed } from 'vue'
import { WetBpmnDesignProps } from './types'
import { bpmnstate } from './symbol'
import MainPanel from './main-panel.vue'
import type Modeler from 'bpmn-js/lib/Modeler'
import type { BpmnProvideType,BpmnModuleDeclaration } from './types'
import type {  BpmnElement } from './types/bpmn'

const props = defineProps(WetBpmnDesignProps)

const modelerInstance = shallowRef<Modeler | null>(null)
const isRefresh = shallowRef(false)
const modules = shallowRef<BpmnModuleDeclaration[]>([])
const seletedBpmnElement = shallowRef<[BpmnElement | null]>([null])

const processType = computed(()=>props.processType)

provide<BpmnProvideType>(bpmnstate,{
    modules,
    modeler:modelerInstance,
    seletedBpmnElement,
    processType
})
</script>