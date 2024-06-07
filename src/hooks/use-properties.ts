import { computed,shallowRef } from 'vue'
import type { WetSchemaItemType } from '@wetspace/pro-components'
import useInject from '@/hooks/use-inject';

export default (props:{
    formType?:string
})=>{
    const { 
        modeler,
        seletedBpmnElement,
        processType
    } = useInject()
    const bpmnElmentType = shallowRef('')
    const seletedElementOne = computed(()=>{
        const one = seletedBpmnElement.value[0]
        if(one){
            return one
        }else{
            return null
        }
    })
    // const bpmnProperties:Record<string,WetSchemaItemType[]> = {

    // }
    const properties:Record<string,(WetSchemaItemType & {
        bpmnelementTag?:string
    })[]> = {
        base: [
            {
                property:'id',
                title:'ID',
                formItemProps:{
                    disabled:true
                }
            },
            {
                property:'name',
                title:'节点名称'
            }
        ],
        documentation:[
            {
                property:'documentation',
                title:'文档内容',
                formItemProps:{
                    type:'textarea'
                }
            },
        ],
        extensionElements:[
            {
                property:'extensionElements',
                valueType:'array',
                formItemProps:{
                    showBottomAdd:true,
                    showActions:false,
                    showRowActions:['add','delete'],
                    columns:[
                        {
                            label:'属性名',
                            prop:'key',
                        },
                        {
                            label:'属性值',
                            prop:'value'
                        }
                    ]
                }
            }
        ],
        executionListener:[
            {
                property:'executionListener',
                title:''
            }
        ],
    }

    const $properties = computed(()=>{
        const bpmnElementType = seletedElementOne.value?.type
        const _properties = {...properties}
        if(bpmnElementType === 'bpmn:Process'){
            _properties.base = [...properties.base,{
                property:'versionTag',
                title:'版本标签'
            },{
                property:'isExecutable',
                title:'可执行',
                valueType:'switch',
                formItemProps:{
                    activeValue:'true',
                    activeText:'是',
                    inactiveText:'否',
                    inactivevalue:'false'
                }
            }]
        }
        
        if(props.formType){
            return  _properties[props.formType]
        }else{
            return []
        }
    })

    return {
        $properties,
        seletedElementOne
    }
}