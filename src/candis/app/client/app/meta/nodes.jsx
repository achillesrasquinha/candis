import shortid      from 'shortid'

import config       from '../config'
import Component    from '../constant/Component'
import Pipeline     from '../constant/Pipeline'
import FileFormat   from '../constant/FileFormat'

import modal        from '../action/ModalAction'
import { read, write, getResource }  from '../action/AsynchronousAction'
import { stage }    from '../action/DocumentProcessorAction'
import { getFiles } from '../util'

const nodes = {
    'dat.fle': (ID) => {return {
        icon: `${config.routes.icons}/document.png`,
        onClick: (dispatch) =>
        {
          var   output  = null
          const dialog  =
          {
            component: Component.FileViewer,
                title: 'File',
                 size: 'lg',
              buttons:
              [
                {
                      label: "Select",
                  className: "btn-primary",
                    onClick: ( ) =>
                    {
                      var action;
                      var update =
                      {
                         value: output,
                         label: `${output.path}/${output.name}`,
                        status: Pipeline.Status.READY
                      }

                      action     = stage.update(ID, update)

                      dispatch(action)

                      action     = modal.hide()

                      dispatch(action)
                    }
                },
                {
                      label: "Cancel",
                    onClick: ( ) =>
                    {
                      var action = modal.hide()

                      dispatch(action)
                    }
                }
              ], // end dialog.buttons
                props:
                {
                  classNames: { root: ['no-background', 'no-border', 'no-shadow', 'no-margin'] },
                    onSelect: (selected) => { output = selected }
                } // end dialog.props
          } // end dialog
          const action  = modal.show(dialog)

          dispatch(action)
        } 
    }},

    'prp.kcv': (ID) => { return {
        icon: `${config.routes.icons}/cross-validation.png`,
        onClick: (dispatch) =>
        {
          bootbox.prompt({
                title: '<span class="font-bold">Number of Folds</span>',
            inputType: 'number',
            className: '#input-k-fold',
              buttons:
              {
                 cancel: { label: "Cancel", className: "btn-sm btn-primary" },
                confirm: { label: "Ok",     className: "btn-sm btn-success" }
              },
                 size: "small",
              animate: false,
             callback: (folds) => {
               if ( folds !== null ) {
                  const update = { value: folds, label: `${folds} folds`, status: Pipeline.Status.READY }
                  const action = stage.update(ID, update)

                  dispatch(action)
               }
             }
          })

          // HACK
          $(document).ready(() => {
            $('#input-k-fold').attr('minlength', 0);
          })
        } // end meta.onClick
    }}
    
}

export default nodes
