import hug
import os
import json

def cors_support(response, *args, **kwargs):
    response.set_header('Access-Control-Allow-Origin', '*')
    response.set_header('Access-Control-Allow-Headers', '*')

@hug.get('/')
def trial():
	return 'Hello World! from config_api'

@hug.get('/first_run_status', requires=cors_support)
def first_run_status():
	if not os.path.exists('projects'):
		return True
	else:
		return False


@hug.get('/get_tabs', requires=cors_support)
def get_tabs():
	return [{'id': 1, 'name': 'VM Manager', 'description': 'desc for vm manager tab'}, {'id': 2, 'name': 'TOR Manager', 'description': 'desc for TOR manager tab'}, {'id': 3, 'name': 'Web Services Manager', 'description': 'desc for Web Services manager tab'}]

@hug.post('/new_project', requires=cors_support)
def new_project(body):
	# print("GOT {}: {}".format(type(body), repr(body)))
	content = json.loads(body)
	print(content['value'])
	if not os.path.exists('projects/' + content['value']):
		os.makedirs('projects/' + content['value'])
	return {'id':1, 'name':'success yo', 'description':'success_desc yo', 'status':'success_status yo'}
