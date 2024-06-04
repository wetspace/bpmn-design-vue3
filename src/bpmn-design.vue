<template>
    <MainPanel v-if="!isRefresh"></MainPanel>
</template>
<script setup lang="ts">
import { provide,shallowRef } from 'vue'
import { WetBpmnDesignProps } from './types'
import { bpmnstate } from './symbol'
import MainPanel from './main-panel.vue'

import type { BpmnProvideType } from './types'
import type { BpmnModuleDeclaration } from './types/bpmn'

const props = defineProps(WetBpmnDesignProps)

const isRefresh = shallowRef(false)
const modules = shallowRef<BpmnModuleDeclaration[]>([])

provide<BpmnProvideType>(bpmnstate,{
    modules
})
</script>