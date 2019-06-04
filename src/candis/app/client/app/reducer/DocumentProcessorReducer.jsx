import shortid    from 'shortid'
import isEqual    from 'lodash.isequal'
import cloneDeep  from 'lodash.clonedeep'

import ActionType from '../constant/ActionType'
import FileFormat from '../constant/FileFormat'
import nodesMeta from '../meta/nodes'

const initial             =
{
  documents: [ ],
     active: null,
      nodes: { },
    running: null,
     status: [ ],
     errors: [ ]
}

const documentProcessor   = (state = initial, action) => {
  switch (action.type) {
    case ActionType.Asynchronous.READ_SUCCESS: {
      const meta          = action.payload
      var   active        = null

      nodes            = cloneDeep(state.nodes)

      if ( meta.output.format == FileFormat.PIPELINE )
      {
        const documents   = state.documents.slice().map((dokument) =>
        {

          const exists    = isEqual(dokument.output.name, meta.output.name)
          if ( exists )
          {
            const pipe    = [ ]
            meta.data.forEach((stage) =>
            {
              
              if(stage.code){
              nodes[stage.code] =
              {
                icon: stage.icon,
                onClick: stage.onClick
              }}

              const node =
              {
                     ID: stage.ID,
                   code: stage.code,
                   name: stage.name,
                  icon: stage.icon,
                  label: stage.label,
                onClick: stage.onClick,
                  value: stage.value,
                 status: stage.status
              }

              pipe.push(node)
            })

            dokument.data = pipe
            active        = dokument
          }

          return {...dokument, active: exists }
        })

        if ( !active ) {
          const pipe   = [ ]
          meta.data.forEach((stage) =>
          {

            
            if (stage.code){
            nodes[stage.code] =
            {
              icon: stage.icon,
              onClick: stage.onClick
            }}

            const node =
            {
                   ID: stage.ID,
                 code: stage.code,
                 name: stage.name,
                icon: stage.icon,
                label: stage.label,
                onClick: stage.onClick,
                value: stage.value,
               status: stage.status
            }

            pipe.push(node)
          })

          active       =
          {
                ID: shortid.generate(),
            output: meta.output,
              data: pipe,
            active: true
          }

          documents.push(active)
        }

        return {...state, documents: documents, active: active, errors: [ ], nodes: nodes}
      }

      break
    }


    case ActionType.Asynchronous.WRITE_SUCCESS: {
      const meta          = action.payload.data
      var   active        = null

      if ( meta.output.format == FileFormat.PIPELINE )
      {
        const documents   = state.documents.slice().map((dokument) =>
        {
          const exists    = isEqual(dokument.output.name, meta.output.name)
          if ( exists )
          {
            const pipe    = [ ]
            meta.data.forEach((stage) =>
            {
              const node =
              {
                     ID: stage.ID,
                   code: stage.code,
                   name: stage.name,
                   icon: state.nodes[stage.code].icon,
                  label: stage.label,
                onClick: state.nodes[stage.code].onClick,
                  value: stage.value,
                 status: stage.status
              }

              pipe.push(node)
            })

            dokument.data = pipe
            active        = dokument
          }

          return {...dokument, active: exists }
        })

        if ( !active ) {
          const pipe   = [ ]
          meta.data.forEach((stage) =>
          {
            const node =
            {
                   ID: stage.ID,
                 code: stage.code,
                 name: stage.name,
                 icon: state.nodes[stage.code].icon,
                label: stage.label,
              onClick: state.nodes[stage.code].onClick,
                value: stage.value,
               status: stage.status
            }

            pipe.push(node)
          })

          active       =
          {
                ID: shortid.generate(),
            output: meta.output,
              data: pipe,
            active: true
          }

          documents.push(active)
        }

        return {...state, documents: documents, active: active, errors: [ ] }
      }

      break
    }

    case ActionType.DocumentProcessor.SET_ACTIVE_DOCUMENT:
    {
      const active       = action.payload
      const documents    = state.documents.slice().map((dokument) =>
      {
        return {...dokument, active: isEqual(dokument.output.name, active.output.name) }
      })

      return {...state, documents: documents, active: active, errors: [ ]}
    }

    case ActionType.DocumentProcessor.SET_STAGE:
    {
      const node         = action.payload
      var   nodes        = state.nodes

      // check if active pipeline already has the node same as action.payload.
      if (!state.active.data.map(localNode => localNode.code).includes(node.code))
      {
        nodes            = cloneDeep(state.nodes)
        nodes[node.code] =
        {
          onClick: node.onClick,
             icon: node.icon
        }
      }

      return {...state, nodes: nodes, errors: [ ] }
    } 

    case ActionType.Pipeline.REMOVE_STAGE:
    {
      const payload = action.payload
      
      const updatedNodes = [ ]
      payload.data.forEach((node) => {
        if(node.ID !== payload.ID){
          updatedNodes.push(node)
        }
      })
      let documents = state.documents.slice()
      documents = documents.map((dokument) => {
        if(dokument.active){
          dokument.data = updatedNodes
        }
        return dokument
      })
      const active = {
        ...state.active,
        data: updatedNodes
      }
      return {...state, documents, active }
    }

    case ActionType.Pipeline.RUN_REQUEST:
      nprogress.set(0.0)
      return {...state, running: action.payload }

    case ActionType.Pipeline.RUN_SUCCESS:
      nprogress.set(1.0)
      return {...state, running: null }

    case ActionType.Pipeline.RUN_ERROR:
      nprogress.set(1.0)
      return {...state, running: null, errors: action.payload.error.errors }

    case ActionType.Pipeline.DELETE_PIPELINE:
    {
      let documents = state.documents.slice()
      documents = documents.filter((document) => {
        return document.active ? false :true
      })
      let active = null
      if(documents !== undefined && documents.length > 0){
        // i.e. after deletion, there are still atleast one doc left which need to be set to active
        documents[0].active = true
        active = documents[0]
      }
      
      return {...state, documents, active}
    }
  }

  return state
}

export default documentProcessor
