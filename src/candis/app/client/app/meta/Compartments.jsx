import axios        from 'axios'
import shortid      from 'shortid'

import config       from '../config'

import Component    from '../constant/Component'
import Pipeline     from '../constant/Pipeline'
import FileFormat   from '../constant/FileFormat'

import modal        from '../action/ModalAction'
import { read, write, getResource }  from '../action/AsynchronousAction'
import { stage }    from '../action/DocumentProcessorAction'
import { getFiles } from '../util'

const Compartments =
[
  {
       name: 'Data',
       icon: `${config.routes.icons}/database.png`,
    tooltip: 'Tools for Source Selection',
      tools: [
        {
             name: 'Create',
             icon: `${config.routes.icons}/edit.png`,
          tooltip: 'Create a new DataSet',
          onClick: (dispatch) => {
            var   name    = ""
            var   data    = { }
            const dialog  =
            {
              component: Component.FileEditor,
                  title: 'Create',
                   size: 'lg',
                buttons:
                [
                  {
                        label: "Ok",
                    className: "btn-primary",
                      onClick: ( ) =>
                      {
                        var output = { name: `${name}.cdata`, format: FileFormat.CDATA }
                        var buffer = data

                        var action = write(output, buffer)
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
                ],
                  props:
                  {
                    classNames: { root: ['no-background', 'no-border', 'no-shadow', 'no-margin'] },
                      onChange:
                      {
                        name: (changed) => { name = changed },
                        data: (changed) => { data = changed }
                      }
                  }
            }
            const action  = modal.show(dialog)

            dispatch(action)
          }
        },
        {
             name: 'File',
             icon: `${config.routes.icons}/document.png`,
          tooltip: 'Load a CDATA/CSV file',
          onClick: (dispatch) => {
            const action  = getResource()

            dispatch(action).then(() => {
              const ID      = shortid.generate()
              const meta    =
              {
                     ID: ID,
                   name: 'File',
                   code: 'dat.fle',
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
                } // end meta.onClick
              } // end meta
  
              const action = stage.set(meta)
  
              dispatch(action)
            })
          }
        },
        {
             name: 'Download',
             icon: `${config.routes.icons}/cloud-computing.png`,
          tooltip: 'Download a DataSet from a remote host',
          onClick: (dispatch) => {
            const dialog = {
              component: Component.Entrez,
              title: 'Download CEL files from NCBI',
              size: 'lg',
              buttons:
              [                
                {
                  label: "Cancel",
                  onClick: () => {
                    let action = modal.hide()
                    dispatch(action)
                  }
                }
              ],
              props:
                  {
                    classNames: { root: ['no-background', 'no-border', 'no-shadow', 'no-margin'] },
                    dbs: ['pubmed', 'GEO', 'Gene']
                  }
            }
            const action = modal.show(dialog)
            dispatch(action)
          }
        }
      ]
  },
  {
       name: 'Preprocess',
       icon: `${config.routes.icons}/gears.png`,
    tooltip: 'Tools for Data Preprocessing',
      tools: [
        {
             name: 'k-Fold Cross-Validation',
             icon: `${config.routes.icons}/cross-validation.png`,
          tooltip: 'Split a dataset into k folds',
          onClick: (dispatch) => {
            const ID     = shortid.generate()
            const meta   =
            {
                   ID: ID,
                 name: 'k-Fold Cross-Validation',
                 icon: `${config.routes.icons}/cross-validation.png`,
                 code: 'prp.kcv',
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
            } // end meta

            const action = stage.set(meta)

            dispatch(action)
          }
        }
      ],
    fetcher: ( ) =>
    {
      return axios.get(config.routes.API.preprocess.methods).then(({ data }) => {
        const response    = data

        if ( response.status == "success" ) {
          const data      = response.data

          const tools     = data.map((method) => {
            const tool    =
            {
                 name: method.name,
              onClick: (dispatch) => {
                  const options = method.methods.map((option) =>
                  {
                    return { label: option.name, value: JSON.stringify(option) }
                  })

                  const ID      = shortid.generate()
                  const meta    = {
                         ID: ID,
                       code: method.code,
                       name: method.name,
                    onClick: (dispatch) => {
                      var   option = null
                      const dialog =
                      {
                        component: Component.SelectViewer,
                            title: method.name,
                          buttons:
                          [
                            {
                                  label: "Select",
                              className: "btn-primary",
                                onClick: ( ) =>
                                {
                                      method = JSON.parse(option.value)
                                  var update =
                                  {
                                     label: method.name,
                                     value: method.value,
                                    status: Pipeline.Status.READY
                                  }

                                  var action = stage.update(ID, update)

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
                                 options: options,
                                onChange: (changed) => { option = changed }
                            } // end dialog.props
                      }
                      const action = modal.show(dialog)

                      dispatch(action)
                    } // end meta.onClick
                  } // end meta

                  const action = stage.set(meta)

                  dispatch(action)
              } // end tool.onClick
            } // end tool

            return tool
          })

          return tools
        } else {
          return [ ]
        }
      })
    }
  },
  {
       name: 'Feature Selection',
       icon: `${config.routes.icons}/column-select.png`,
    tooltip: 'List of Feature Selection Methods',
    fetcher: ( ) =>
    {
      return axios.get(config.routes.API.featselect.methods).then(({ data }) => {
        const response = data
        var   tools    = [ ]

        if ( response.status == "success" ) {
          const data      = response.data

          const tools     = data.map((method) => {
            const name    = `${method.search.name.replace(/([A-Z])/g, ' $1')} + ${method.evaluator.name.replace(/([A-Z])/g, ' $1')}`
            const tool    =
            {
                 name: name,
              onClick: (dispatch) => {
                  const ID      = shortid.generate()
                  const meta    = {
                         ID: ID,
                       code: 'ats',
                       name: name,
                      value: { ...method, use: true },
                     status: Pipeline.Status.READY,
                    onClick: (dispatch) =>
                    {
                        // const title    =
                        // `
                        // <div class="font-bold">
                        //   ${method.name}
                        // </div>
                        // `
                        // ,     detail   = desc.long || desc.short
                        // ,     message  =
                        // `
                        // <div class="text-justify">
                        //   ${detail.replace(/\n/g, '<br/>')}
                        // </div>
                        // `

                        // const dialog   = bootbox.dialog({
                        //     title: title,
                        //   message: message,
                        //   buttons: { ok: { label: "Ok"} },
                        //      size: 'large',
                        //   animate: false
                        // })

                        //  dialog.init(() => {
                        //   setTimeout(() => {
                        //     var $element = dialog.find('.bootbox-body');

                        //     MathJax.Hub.Queue(["Typeset", MathJax.Hub, $element[0]]);
                        //   }, 500)
                        // })
                    } // end meta.onClick
                  } // end meta

                  const action = stage.set(meta)

                  dispatch(action)
              } // end tool.onClick
            } // end tool

            return tool
          })

          return tools
        } else {
          return [ ]
        }
      })
    }
  },
  {
       name: 'Model',
       icon: `${config.routes.icons}/network.png`,
    tooltip: 'List of Models',
    fetcher: ( ) =>
    {
      return axios.get(config.routes.API.model.methods).then(({ data }) => {
        const response = data
        var   tools    = [ ]

        if ( response.status == "success" ) {
          const data      = response.data

          const tools     = data.map((method) => {
            const tool    =
            {
                 name: method.label,
              onClick: (dispatch) => {
                  const ID      = shortid.generate()
                  const meta    = {
                         ID: ID,
                       code: 'lrn',
                       name: method.label,
                      value: { ...method, use: true },
                     status: Pipeline.Status.READY,
                    onClick: (dispatch) =>
                    {
                        // const title    =
                        // `
                        // <div class="font-bold">
                        //   ${method.name}
                        // </div>
                        // `
                        // ,     detail   = desc.long || desc.short
                        // ,     message  =
                        // `
                        // <div class="text-justify">
                        //   ${detail.replace(/\n/g, '<br/>')}
                        // </div>
                        // `

                        // const dialog   = bootbox.dialog({
                        //     title: title,
                        //   message: message,
                        //   buttons: { ok: { label: "Ok"} },
                        //      size: 'large',
                        //   animate: false
                        // })

                        //  dialog.init(() => {
                        //   setTimeout(() => {
                        //     var $element = dialog.find('.bootbox-body');

                        //     MathJax.Hub.Queue(["Typeset", MathJax.Hub, $element[0]]);
                        //   }, 500)
                        // })
                    } // end meta.onClick
                  } // end meta

                  const action = stage.set(meta)

                  dispatch(action)
              } // end tool.onClick
            } // end tool

            return tool
          })

          return tools
        } else {
          return [ ]
        }
      })
    }
  },
  {
       name: 'Evaluate',
       icon: `${config.routes.icons}/clipboard.png`,
    tooltip: 'Tools for Model Evaluation',
      tools: [
        {
             name: 'Predict',
          tooltip: 'Perform a prediction',
          onClick: (dispatch) => {
            toastr.warning('To be implemented.')
            const action = getResource()

            dispatch(action).then((resource) => {
              const files = getFiles(resource, [FileFormat.MODEL, FileFormat.ARFF])
              const options = files.map((file) => {
                return { text: file.name, value: file.name }
              })
              const arff_options = options.filter((option) => {
                return option.text.endsWith(FileFormat.ARFF)
              })
              const model_options = options.filter((option) => {
                return option.text.endsWith(FileFormat.MODEL)
              })
              
              if( arff_options.length ){
                bootbox.prompt({
                  title: '<span class="font-bold">Select testing dataset</span>',
                  inputType: 'select',
                  inputOptions: arff_options,
                  buttons: {
                    cancel:  { label: "Cancel", className: "btn-sm btn-primary" },
                    confirm: { label: "Select",   className: "btn-sm btn-success" }
                  },
                  size: "small",
                  animate: false,
                  callback: (arff_output) => {
                    if( arff_output != null ){
                      if ( model_options.length ) {
                        bootbox.prompt({
                          title: '<span class="font-bold">Select trained model</span>',
                          inputType: 'select',
                          inputOptions: model_options,
                          buttons: {
                            cancel:  { label: "Cancel", className: "btn-sm btn-primary" },
                            confirm: { label: "Select",   className: "btn-sm btn-success" }
                          },
                          size: "small",
                          animant: false,
                          callback: (model_output) => {
                            if( model_output != null ){
                              const output = {'test_path': arff_output, 'model_path': model_output}
                              axios.post(config.routes.API.pipeline.predict, output).then(({data}) => {
                                toastr.success("Predicting...")
                              }).catch(({response}) => {
                                const error = response.data.error
                                toastr.error(error)
                              })
                            }
                          }
                        })
                      } else {
                        toastr.warning('No model/classifier found.')
                      }
                    }
                  }
                })
              }else{
                toastr.warning('No ARFF file found.')
              }

            })
          }
        }
      ]
  },
  {
    name: 'Visualize',
    icon: `${config.routes.icons}/pie-chart.png`,
 tooltip: 'Tools for Data Visualization',
   tools: [
        {
          name: 'Output',
      tooltip: 'Generate a Classification Report',
      onClick: (dispatch) => {
        const action    = getResource()
        
        dispatch(action).then((resource) => {
          const files   = getFiles(resource, [FileFormat.GIST])
          const options = files.map((file) => {
            const name  = file.name
            const value = JSON.stringify(file)

            return { text: name, value: value }
          })

          if ( options.length ) {
            bootbox.prompt({
                    title: '<span class="font-bold">Open Gist</span>',
                inputType: 'select',
              inputOptions: options,
                  buttons:
                    {
                      cancel:  { label: "Cancel", className: "btn-sm btn-primary" },
                      confirm: { label: "Open",   className: "btn-sm btn-success" }
                    },
                      size: "small",
                  animate: false,
                  callback: (result) => {
                    if ( result  !== null ) {
                      const output = JSON.parse(result)
                      const action = read(output)

                      dispatch(action).then((gist) => {
                        const dialog  =
                        {
                          component: Component.GistViewer,
                              title: 'Gist',
                                size: 'lg',
                            buttons:
                            [
                              {
                                    label: "Ok",
                                className: "btn-primary",
                                  onClick: ( ) =>
                                  {
                                    var action = modal.hide()
            
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
                            ],
                              props:
                              {
                                classNames: { root: ['no-background', 'no-border', 'no-shadow', 'no-margin'] },
                                      data: gist
                              }
                        }
                        const action  = modal.show(dialog)
            
                        dispatch(action)
                      })
                    }
                  }
            })
          } else {
            toastr.warning('No gist found. Create a new pipeline by clicking on the <span class="font-bold">New</div> option.', 'Sorry!')
          }
        })
      }
    }
   ]
  },
]

export default Compartments
