import hug
import os
from pymongo import *
import json
from bson.objectid import ObjectId
from bson import BSON
from bson import json_util
import os
import shutil

client = MongoClient()
functions_db = client.functions_db
functions = functions_db.functions

servers_db = client.servers_db
servers = servers_db.servers

conf_db = client.conf_db
tor_config = conf_db.tor_config
threshold_config = conf_db.threshold_config

def cors_support(response, *args, **kwargs):
    response.set_header('Access-Control-Allow-Origin', '*')
    response.set_header('Access-Control-Allow-Headers', '*')

@hug.get('/')
def trial():
	return 'Hello World! from config_api'

@hug.get('/first_run_status', requires=cors_support)
def first_run_status():
	if not os.path.exists('projects'):
		return str(1)
	else:
		print(os.listdir('projects')[0])
		return os.listdir('projects')[0]


@hug.get('/get_tabs', requires=cors_support)
def get_tabs():
	return [{'id': 1, 'name': 'VM Manager', 'description': 'desc for vm manager tab'}, {'id': 2, 'name': 'TOR Manager', 'description': 'desc for TOR manager tab'}, {'id': 3, 'name': 'Web Services Manager', 'description': 'desc for Web Services manager tab'}]

@hug.post('/new_project', requires=cors_support)
def new_project(body):
	# print("GOT {}: {}".format(type(body), repr(body)))
	content = json.loads(body)
	# print(content['value'])
	if not os.path.exists('projects' + os.sep + content['value']):
		os.makedirs('projects' + os.sep + content['value'])

	insert_Function_object = {
		"function_name" : "",
		"function_description" : "",
		"function_code" : "",
		"request_method" : "GET"
	}
	inserted_Function_id_res = functions.insert_one(insert_Function_object).inserted_id

	insert_Server_object = {
		"server_host" : "",
		"server_username" : "",
		"server_password" : ""
	}
	inserted_Server_id_res = servers.insert_one(insert_Server_object).inserted_id
	tor_config.update({ 'name': 'access_url'}, {'name': "access_url", "value": "unassigned"}, upsert=True)

	threshold_config.update( 
        { 'name': 'timer'}, 
        {
        	'name': 'timer',
            "value": 120
            } , upsert=True
    )

	tor_config.update({'name':'obliviate_status'}, {'name':'obliviate_status', 'status':'PAUSE'}, upsert=True)

	return {'name':content['value']}
