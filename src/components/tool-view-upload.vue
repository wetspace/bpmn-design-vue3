<template>
    <ElButton @click="()=>output()">
        xml
    </ElButton>
</template>
<script setup lang="ts">
import { ElSpace,ElIcon,ElButton,ElButtonGroup } from 'element-plus'
import useInject from '@/hooks/use-inject';

const { 
    modules,
    modeler
} = useInject()


const output = async (type:'json' | 'xml' = 'xml')=>{
    if(!modeler.value) return
    if(type === 'xml'){
        const res = await modeler.value.saveXML({format:true})
        console.log(res.xml,'xml:output')
    }else{

    }
}
</script>