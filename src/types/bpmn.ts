import type { ModuleDeclaration } from 'didi'
// Moddle
import type { Element,ModdleElement} from 'bpmn-js/lib/model/Types'
import type  EventBus  from 'diagram-js/lib/core/EventBus'
import type Modeling from 'bpmn-js/lib/features/modeling/Modeling'

export type BpmnModuleDeclaration = ModuleDeclaration;
export type BpmnElement = Element
export type BpmnEventBus<D> = EventBus<D>
export type BpmnModeling = Modeling
export type BpmnModdleElement = ModdleElement

export type BpmnModdle = {
    create(type: string, properties?: Record<string,any>): BpmnModdleElement;
}