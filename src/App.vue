<template>
  <div style="height: 100vh;">
    <BpmnDesign :elements="{
      'base':[],
      'bpmn:StartEvent':{
        groups:[],
        render:null,
      }
    }"></BpmnDesign>
  </div>
</template>
<script setup lang="ts">
import BpmnDesign from './bpmn-design.vue';

</script>
<style>
*{
  padding: 0;
  margin: 0;
}
</style>