import axios        from 'axios'
import storage      from 'store'

import config       from '../config'

import ActionType   from '../constant/ActionType'
import FileFormat   from '../constant/FileFormat'
import { signout }  from '../action/AppAction'
import { read, write, getResource } from '../action/AsynchronousAction'
import { getFiles } from '../util'
import modal        from '../action/ModalAction'
import defaults     from '../action/DefaultsAction'
import Component    from '../constant/Component'

const Menus = [
  {
      title: 'Pipeline',
    actions: [
      {
           text: 'New',
           icon: `${config.routes.icons}/document.png`,
        tooltip: 'Create a new Pipeline',
        onClick: (dispatch) => {
          bootbox.prompt({
                title: '<span class="font-bold">Pipeline Name</span>',
            inputType: 'text',
              buttons:
              {
                 cancel: { label: "Cancel", className: "btn-sm btn-primary" },
                confirm: { label: "Create", className: "btn-sm btn-success" }
              },
                 size: "small",
              animate: false,
             callback: (name) => {
               if ( name !== null ) {
                const output  = { name: `${name}.cpipe`, format: FileFormat.PIPELINE }
                axios.post(config.routes.API.data.read, output).then((response) => {
                  response    = response.data

                  if ( response.status == 'success' ) { // I don't know why this check is even here.
                    toastr.warning(`Looks like file with name <span class="font-bold">${name}</span> already exists.`, 'Whoops!')
                  }
                }).catch(({ response }) => {
                  response    = response.data

                  if ( response.status == 'error' ) {
                    if ( response.error.code == 404 ) {
                      const action = write(output)

                      dispatch(action)
                    } else {
                      const error = response.error
                      error.errors.forEach((err) => {
                        toastr.error(`An unexpected error occured: ${err.message}`, 'Error')
                      })
                    }
                  }
                })
               }
             }
          })
        }
      },
      {
           text: 'Open',
           icon: `${config.routes.icons}/envelope-open.png`,
        tooltip: 'Open an existing Pipeline',
        onClick: (dispatch) => {
          const action    = getResource()

          dispatch(action).then((resource) => {
            const files   = getFiles(resource, [FileFormat.PIPELINE])
            const options = files.map((file) => {
              const name  = file.name
              const value = JSON.stringify(file)

              return { text: name, value: value }
            })

            if ( options.length ) {
              bootbox.prompt({
                      title: '<span class="font-bold">Open Pipeline</span>',
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

                        dispatch(action)
                      }
                    }
              })
            } else {
              toastr.warning('No files found. Create a new pipeline by clicking on the <span class="font-bold">New</div> option.', 'Sorry!')
            }
          })
        }
      }
    ]
  },
  {
      title: 'Options',
    actions: [
      {
            text: 'Settings',
            icon: `${config.routes.icons}/settings.png`,
         tooltip: 'Open Settings View',
         onClick: (dispatch) => {
           const dialog = {
             component: Component.DefaultsForm,
             title: 'Default Settings',
             size: 'lg',
             buttons: [
               {
                 label: "Restore Defaults",
                 className: "btn-primary",
                 onClick: () => {
                   let action = defaults.restore()
                   dispatch(action)
                   toastr.success("Defaults restored successfully!")
                   action = modal.hide()
                   dispatch(action)
                 }
               },
               {
                 label: "Ok",
                 className: "btn-primary",
                 onClick: () => {
                   const action = modal.hide()
                   dispatch(action)
                 }
               }
             ],
             props:
             {
               classNames: { root: ['no-background', 'no-border', 'no-shadow', 'no-margin'] }
             }
           }
           const action = modal.show(dialog)
           dispatch(action)
         }
      }
    ]
  },
  {
      title: 'Help',
    actions: [
      {
           text: 'About',
           icon: `${config.routes.icons}/info.png`,
        tooltip: 'Show application information',
        onClick: (dispatch) => {
          const title   =
          `
            <span class="font-bold">
              ${config.title}
            </span>
          `
          const message =
          `
            <div class="wrapper">
              <img class="img-responsive center-block" src="${config.routes.images}/logo-w-title.png"
                style="max-height: 256px">
            </div>
          `

          bootbox.alert({
              title: title,
            message: message,
            buttons:
            {
              ok: { label: "Ok", className: "btn-sm btn-primary" }
            },
            animate: false
          })
        }
      },
      {
           text: 'Documentation',
           icon: `${config.routes.icons}/documentation.png`,
        tooltip: 'View Documentation',
        onClick: () => {
          window.open(config.urls.docs)
        }
      }
    ]
  },
  {
    title: 'My Profile',
    actions: [
      {
          text: 'Quit',
            icon: `${config.routes.icons}/quit.png`,
        tooltip: 'Quit the application',
        onClick: (dispatch) => {
          bootbox.confirm({
              message: "Are you sure you want to quit?",
              buttons:
              {
                cancel: { label: "Cancel", className: "btn-sm btn-primary" },
                confirm: { label: "Quit",   className: "btn-sm btn-success" }
              },
                size: "small",
              animate: false,
            callback: (confirm) => {
              if ( confirm ) {
                dispatch({
                  type: ActionType.App.SIGNOUT_REQUEST,
                })

                dispatch(signout())

                dispatch({
                  type: ActionType.App.SIGNOUT_SUCCESS
                })
              }
            }
            })
          }
      }
    ]
  }
]

export default Menus
