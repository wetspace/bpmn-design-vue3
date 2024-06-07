import { computed,shallowRef,watch,ref} from 'vue'
import type { BpmnPropertiesFormItem } from '@/types'
import type { BpmnModeling,BpmnModdle,BpmnModdleElement,BpmnElement} from '@/types/bpmn'
import type { WetProFormInstance } from '@wetspace/pro-components'
import useInject from '@/hooks/use-inject';

export default (props:{
    formType?:string,
    bpmnModdleTag?:string,
    prefixModdleTag?:string
})=>{
    const { 
        modeler,
        seletedBpmnElement,
        processType
    } = useInject()
    const formIns = shallowRef<WetProFormInstance>()
    const formInit = ref<Record<string,any>>({})

    const seletedElementOne = computed(()=>{
        const one = seletedBpmnElement.value[0]
        if(one){
            return one
        }else{
            return null
        }
    })

    function capitalizeFirstLetter(str:string) {
        return str.replace(/^[a-z]/, match => match.toUpperCase());
    }

    const properties:Record<string,(BpmnPropertiesFormItem)[]> = {
        base: [
            {
                isOnlyPropery:true,
                property:'id',
                title:'ID',
                disabled:true,
            },
            {
                isOnlyPropery:true,
                property:'name',
                title:'节点名称'
            }
        ],
        documentation:[
            {
                isBpmnModdleElement:true,
                property:'documentation',
                title:'文档内容',
                formItemProps:{
                    type:'textarea'
                }
            },
        ],
        extensionElements:[
            {
                property:'properties',
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
                title:'版本标签',
                isOnlyPropery:true
            },{
                property:'isExecutable',
                title:'可执行',
                isOnlyPropery:true,
                valueType:'switch',
                formItemProps:{
                    activeValue:'11',
                    activeText:'是',
                    inactiveText:'否',
                    inactiveValue:'22'
                }
            },{
                isOnlyPropery:true,
                property:'taskPriority',
                title:'流程优先级'
            }]
        }
        
        if(props.formType){
            return  _properties[props.formType]
        }else{
            return []
        }
    })

    const propertiesElmentTagMap = ref<Record<string,{tag:string,type:string}>>({})

    const isInited = shallowRef(false)
    const initValue = (v:BpmnElement,p:BpmnPropertiesFormItem[])=>{
        formIns.value?.clear()
        const businessObject = v.businessObject || {}
        // console.log(v,'BpmnElement')
        p.forEach(item=>{
            if(item.isBpmnModdleElement){
                // propertiesElmentTagMap.value[item.property] = {
                //     tag:`bpmn:$${item.property}`,
                //     type:'bpmn'
                // }
            }else if(item.isOnlyPropery){
                const property = Array.isArray(item.property) ? item.property[0] :item.property
                formInit.value[property] = businessObject[property]
                // console.log(businessObject[property])
            }else{
                // propertiesElmentTagMap.value[item.property] = {
                //     tag:`${processType.value}:${item.property}`,
                //     type:'prefix'
                // }
            }
        })

        isInited.value = true
    }

    watch([seletedElementOne,$properties],([v,p])=>{
        if(v && p){
            initValue(v,p)
        }
    },{immediate:true})


    // const bpmnModdler = computed(()=>{
    //     const moddle = modeler.value?.get('moddle') as BpmnModdle
    //     if(!moddle) return null
    //     let res:Record<string,any> = {}
    //     if(props.bpmnModdleTag){
    //         res.bpmnModdle =  {
    //             key:props.bpmnModdleTag,
    //             value:moddle.create(`bpmn:${props.bpmnModdleTag}`,)
    //         }
    //     }

    //     return 
    // })

    const handleSaveValue= (value:any,moddle:BpmnModdle)=>{
        const baseUpdate:Record<string,any> = {}
        Object.keys(value).forEach( k =>{
            if(Array.isArray(value[k])){

            }else{
                const one = $properties.value.find( item=> item.property === k)
                if(!one) return null
                if(one.isOnlyPropery){
                    baseUpdate[k] = ['',null].includes(value[k])? undefined :value[k]
                }else if(one.isBpmnModdleElement){
                    console.log(k,'asgadsg')
                    if(!baseUpdate[k]){
                        baseUpdate[k] = []
                    }
                    const $m = moddle.create(`bpmn:${capitalizeFirstLetter(k)}`,{
                        value: value[k]
                    })
                    baseUpdate[k].push($m)
                    console.log(baseUpdate,'baseUpdate')
                }
            }
            // if(propertiesElmentTagMap.value[k].type === 'self'){
            //     baseUpdate[k] = value[k]
            // }
        })
        return {
            baseUpdate
        }
    }

    const saveAction = async ()=>{
        const modeling = modeler.value?.get('modeling') as BpmnModeling
        const moddle = modeler.value?.get('moddle') as BpmnModdle
        const _seletedBpmnElement = seletedBpmnElement.value[0]
        if(!_seletedBpmnElement || !modeling || !moddle) return 
        // const baseUpdate:Record<string,any> = {}
        const value = await formIns.value?.submit()
        const { baseUpdate } = handleSaveValue(value,moddle)
        console.log(value,baseUpdate)
        // const $self = handleSelfPropty(value)
        modeling.updateProperties(_seletedBpmnElement,baseUpdate)
    }

    return {
        $properties,
        seletedElementOne,
        formInit,
        formIns,
        saveAction,
        modeler,
        processType
    }
}