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

def cors_support(response, *args, **kwargs):
    response.set_header('Access-Control-Allow-Origin', '*')
    response.set_header('Access-Control-Allow-Headers', '*')

@hug.get('/')
def root():
	return 'Hello World! from vm_management_api'

@hug.get('/get_servers', requires=cors_support)
def get_servers():
	output = []
	for server in servers.find():
		output.append(json.loads(json.dumps(server, default=json_util.default)))
	return output

@hug.post('/save_server', requires=cors_support)
def save_server(body):
	content = json.loads(body)
	newInsert = False;
	
	# project_name = content['project_name']
	if '__new' in content['_id']['$oid']:
		newInsert = True
	else:
		server_id = content['_id']['$oid']

	server_host = content['server_host']
	server_username = content['server_username']
	server_password = content['server_password']
	
	insert_object = {
		"server_host" : server_host,
		"server_username" : server_username,
		"server_password" : server_password
	}

	if not newInsert:
		print(server_host)
		print(servers.update({'_id':ObjectId(server_id)}, insert_object, True))
		return 0
	else:
		inserted_id_res = servers.insert_one(insert_object).inserted_id

		output = json.loads(json.dumps(servers.find_one({"_id": ObjectId(inserted_id_res)}), default=json_util.default))
		return output
