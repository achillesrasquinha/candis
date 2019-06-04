import React from 'react'

class GistViewer extends React.Component 
{
    render ( ) 
    {
        const props = this.props
        const data  = props.data

        return (
            <div className="panel-group" id="gist">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <a href="javascript:void(0);" 
                            data-toggle="collapse" 
                            data-target="#gist-model"
                            data-parent="#gist">
                            <h4 className="font-bold">Model</h4>
                        </a>
                    </div>
                    <div className="collapse panel-collapse" id="gist-model">
                        <div className="panel-body">
                            {
                                data.models.map((model) => {
                                    return (
                                        <div className="panel panel-default">
                                            <div className="panel-heading">
                                                <div className="panel-title">
                                                    {model.label}
                                                </div>
                                            </div>
                                            <div className="panel-body">
                                                <h4 className="font-bold">Summary</h4>
                                                <pre>
                                                    {model.summary}
                                                </pre>
                                                {
                                                    model.graph ? 
                                                        <div>
                                                            <h5 className="font-bold">Graph</h5>
                                                            <div dangerouslySetInnerHTML={{ __html: Viz(model.graph) }}/>
                                                        </div>
                                                        : null
                                                }
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div>
                                                            <h5 className="font-bold">Learning Curve</h5>
                                                            <img className="center-block img-responsive" src={`data:image/png;base64,${ model.learning_curve }`}/>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div>
                                                            <h5 className="font-bold">Confusion Matrix</h5>
                                                            <img className="center-block img-responsive" src={`data:image/png;base64,${ model.confusion_matrix.plot }`}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div>
                                                            <h5 className="font-bold">ROC Curve</h5>
                                                            <img className="center-block img-responsive" src={`data:image/png;base64,${ model.roc_curve }`}/>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div>
                                                            <h5 className="font-bold">PRC Curve</h5>
                                                            <img className="center-block img-responsive" src={`data:image/png;base64,${ model.prc_curve }`}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default GistViewer