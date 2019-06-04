import React      from 'react'
import {connect}  from 'react-redux'
import {SortableContainer} from 'react-sortable-hoc'
import classNames from 'classnames'

import Media      from './Media'

import Pipeline   from '../../constant/Pipeline'
import { stage }  from '../../action/DocumentProcessorAction'

class PipelineEditor extends React.Component
{
	constructor(props){
		super(props)
		this.onClick = this.onClick.bind(this)
	}

	onClick (e) {
		const action = stage.delete(e.target.value)

		this.props.dispatch(action)
	}
	
	render ( )
	{
		const props = this.props

		return (
			<ul className="list-group">
				{
					props.stages.map((node, index) => {
						return (
							<li key={index} className={classNames("list-group-item",
								{  "list-group-item-danger": node.status == Pipeline.Status.PENDING },
								{ "list-group-item-warning": node.status == Pipeline.Status.READY }
							)}>
								<div>
									<div className="row">
										<div className="col-xs-9">
											<a style={{ color: '#FFF' }} href="javascript:void(0);" onClick={() => {
												if ( node.onClick ) {
													props.dispatch(node.onClick)
												}
											}}>
												<Media
													title={node.name}
													 icon={node.icon}
													 body={node.label}/>
											</a>
										</div>
										<div className="col-xs-3" >
											<button className="close" value={node.ID} onClick={this.onClick}>&times;</button>
										</div>
									</div>
								</div>
							</li>
						)
					})
				}
			</ul>
		)
	}
}

export default connect()(PipelineEditor)
