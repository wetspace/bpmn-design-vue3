<template>
    <WetSchemaForm label-width="100px" :properties="$properties" :span="24"></WetSchemaForm>
</template>
<script setup lang="ts">
import { WetSchemaForm } from '@wetspace/pro-components'
import type { WetSchemaItemType } from '@wetspace/pro-components'
import useInject from '@/hooks/use-inject';
import { computed } from 'vue';

const { 
    modules,
    modeler
} = useInject()

const properties:WetSchemaItemType[] = [
    {
        property:'documentation',
        title:'文档内容'
    }
]
const $properties = computed(()=>{
    return properties
})
</script>