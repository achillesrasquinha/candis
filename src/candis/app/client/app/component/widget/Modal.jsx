import React          from 'react'
import PropTypes      from 'prop-types'
import { connect }    from 'react-redux'
import shortid        from 'shortid'
import classNames     from 'classnames'

import Component      from '../../constant/Component'

class Modal extends React.Component {
  render ( ) {
    const props     = this.props
    const modal     = props.modal

    const buttons   = modal.buttons || [ ]

    const Component = modal.component
    const attrs     = modal.props   || { }

    if ( props.display )
      $(`#${props.ID}`).modal('show')
    else
      $(`#${props.ID}`).modal('hide')

    return (
      <div className="modal" id={props.ID}>
        <div className={classNames("modal-dialog",
          { "modal-lg": modal.size == 'lg' },
          { "modal-sm": modal.size == 'sm' }
        )}>
          <div className="modal-content">
            <div className="modal-header">
              <button className="close" data-dismiss="modal">
                &times;
              </button>
              {
                modal.title ?
                  <div className="modal-title font-heavy">
                    {modal.title}
                  </div> : null
              }
            </div>
            <div className="modal-body">
              {Component ? <Component {...attrs}/> : null}
            </div>
            <div className="modal-footer">
              {
                buttons ?
                  <div className="text-right">
                    {
                      buttons.map((button, index) => {
                        return (
                          <button key={index} className={classNames("btn btn-default", button.className)}
                            onClick={(event) => { button.onClick(event) }}>
                            {button.label}
                          </button>
                        )
                      })
                    }
                  </div> : null
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Modal.propTypes      =
{
       ID: PropTypes.string,
  display: PropTypes.bool,
    modal: PropTypes.object
}
Modal.defaultProps   =
{
       ID: shortid.generate(),
  display: false,
    modal: { }
}

const mapStateToProps = (state) => {
  const modal         = state.modal

  return {
    display: modal.display,
      modal: modal.modal
  }
}

export default connect(mapStateToProps)(Modal)
