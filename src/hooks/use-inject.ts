import { bpmnstate } from '../symbol'
import type { BpmnProvideType,BpmnModeling,BpmnModdle} from '../types'
import { inject,computed } from  'vue'


export default ()=>{
    const res =  inject(bpmnstate) as BpmnProvideType

    const seletedElement = computed(()=>{
        const one = res.seletedBpmnElement.value[0]
        if(one){
            return one
        }else{
            return null
        }
    })

    const getUpadateProperties = ()=>{
        const modeling = res.modeler.value?.get('modeling') as BpmnModeling
        const moddle = res.modeler.value?.get('moddle') as BpmnModdle
        return {
            modeling,
            moddle
        }
    }

    return {
        ...res,
        seletedElement,
        getUpadateProperties
    }
}