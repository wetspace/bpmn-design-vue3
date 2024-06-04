import type { PropType,ShallowRef } from 'vue'
import type { BpmnModuleDeclaration } from './bpmn'

export const WetBpmnDesignProps = {
    xml:{
        type:String,
        default:''
    },
    json:{
        type:Object as PropType<Record<string,any>>,
        default:null
    }
}

export const WetBpmnDesignMainPanelProps = {
    ...WetBpmnDesignProps
}

export type BpmnProvideType = {
    modules: ShallowRef<BpmnModuleDeclaration[]>
}
