import { bpmnstate } from '../symbol'
import type { BpmnProvideType } from '../types'
import { inject } from  'vue'

export default ()=>{
    const res =  inject(bpmnstate) as BpmnProvideType

    return res
}