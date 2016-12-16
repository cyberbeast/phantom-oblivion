import hug
import os
from pymongo import *
import json
from bson.objectid import ObjectId
from bson import BSON
from bson import json_util
import os
import shutil
from hug_app.web_services_api import compile
import socket
import threading
import paramiko
from paramiko.ssh_exception import SSHException, ChannelException, NoValidConnectionsError, NoValidConnectionsError
import functools
import subprocess
import psutil


class AllowAnythingPolicy(paramiko.MissingHostKeyPolicy):
    def missing_host_key(self, client, hostname, key):
        return

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

def read_until_EOF(fileobj, output):
    s = fileobj.readline()
    while s:
        output.append(s.strip())
        s = fileobj.readline()

def transfer_callback(filename, bytes_so_far, bytes_total):
    print('Transfer of %r is at %d/%d bytes (%.1f%%)' % (
        filename, bytes_so_far, bytes_total, 100. * bytes_so_far / bytes_total))

@hug.post('/obliviate', requires=cors_support)
def obliviate(body):
	content = json.loads(body)
	# print(json.loads(body))
	# print(content)
	
	allow_flag = False

	if content["dev"] == "PASS":
		allow_flag = True
	else:
		return({
			"status"	: "Failure",
			"error"		: "Invalid API auth credentials!",
			"access_url": "__KEEP_SAME__",
			"tor_status": "FAIL",
			"api_status": "FAIL"
			})

	if allow_flag:
		servers_list = []
		for server in servers.find():
			servers_list.append(json.loads(json.dumps(server, default=json_util.default)))

		output = compile()
		print(output)
		if compile() == "success":
			# SSH access test
			SSH_Client = paramiko.SSHClient()
			SSH_Client.set_missing_host_key_policy(AllowAnythingPolicy())
			for server in servers_list:
				try:
					SSH_Client.connect(server['server_host'], username=server['server_username'], password=server['server_password'])			
				except (SSHException, ChannelException, NoValidConnectionsError, NoValidConnectionsError, socket.error) as e:
					print("FAIL ", e)
					return {
						"status" : "FAIL",
						"error" : str(e),
						"access_url" : "DENIED",
						"tor_status" : "DOWN",
						"api_status" : "DOWN"
					}

			tor_status = tor_config.find_one({'name':'obliviate_status'})['status']
			print("THIS IS WHAT I AM SEEING... ", tor_status)
			if tor_status != "CONNECTED":
				tor_config.update({'name':'obliviate_status'}, {'name':'obliviate_status', 'status':'CONNECTED'}, upsert=True)
				prev = tor_config.find_one({'name':'access_url'})['value']

				pro = subprocess.Popen(['python','.\compile_dependencies\\tor.py'], shell=True)
				print(pro.pid)
				tor_config.update({'name':'process_id'}, {'name':'process_id', 'id':pro.pid}, upsert=True)
				
				while(tor_config.find_one({'name':'access_url'})['value'] == prev):
					print("Waiting", end="\r")
			else:
				print("ALREADY SERVING!")

			access_url = tor_config.find_one({'name':'access_url'})['value'] + ".onion"
			tor_status = tor_config.find_one({'name':'obliviate_status'})['status']
			api_status = tor_config.find_one({'name':'obliviate_status'})['status']
			status = "SUCCESS"
			error = "None"

			return_object = {
				"status" : status,
				"error" : error,
				"access_url" : access_url,
				"tor_status" : tor_status,
				"api_status" : api_status
			}	
			return return_object

@hug.post('/stop_obliviate', requires=cors_support)
def stop_obliviate(body):
	content = json.loads(body)

	
	allow_flag = False

	if content["dev"] == "PASS":
		allow_flag = True
	else:
		return({
			"status"	: "Failure",
			"error"		: "Invalid API auth credentials!",
			"access_url": "__KEEP_SAME__",
			"tor_status": "FAIL",
			"api_status": "FAIL"
			})

	tor_config.update({'name':'obliviate_status'}, {'name':'obliviate_status', 'status':'PAUSE'}, upsert=True)
	tor_process_id = tor_config.find_one({'name':'process_id'})['id']
	p = psutil.Process(tor_process_id)
	print(p.terminate())
	tor_config.update({ 'name': 'access_url'}, {'name': "access_url", "value": "unassigned"}, upsert=True)

	return tor_config.find_one({'name':'access_url'})['value']








