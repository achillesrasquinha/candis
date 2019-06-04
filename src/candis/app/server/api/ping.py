from candis.app.server.app import app

@app.route('/api/ping')
def ping():
    return "{ 'data': 'pong' }"
