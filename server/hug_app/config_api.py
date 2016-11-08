import hug
def cors_support(response, *args, **kwargs):
    response.set_header('Access-Control-Allow-Origin', '*')

@hug.get('/')
def trial():
	return 'Hello World! from config_api'

@hug.get('/get_tabs', requires=cors_support)
def get_tabs():
	return [{'id': 1, 'name': 'VM Manager', 'description': 'desc for vm manager tab'}, {'id': 2, 'name': 'TOR Manager', 'description': 'desc for TOR manager tab'}, {'id': 3, 'name': 'Web Services Manager', 'description': 'desc for Web Services manager tab'}]