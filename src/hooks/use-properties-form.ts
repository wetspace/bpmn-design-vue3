import { bpmnstate } from '../symbol'
import type { BpmnProvideType,BpmnModeling,BpmnModdle} from '../types'
import { inject,computed,useAttrs } from  'vue'

export default ()=>{
    const res =  inject(bpmnstate) as BpmnProvideType
    const $attrs = useAttrs()
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
    
    const seletedElementId = computed(()=>{
        return seletedElement.value?.id
    })

    const currentElement = computed(()=>{
        const  element =  res.addedBpmnElementsMap.value[$attrs['element-id'] as string]?.element
        return element
    })

    return {
        ...res,
        seletedElement,
        seletedElementId,
        getUpadateProperties,
        currentElement
    }
}