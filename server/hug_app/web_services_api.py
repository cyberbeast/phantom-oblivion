import hug
from pymongo import *
import json
from bson.objectid import ObjectId
from bson import BSON
from bson import json_util
client = MongoClient()
functions_db = client.functions_db
functions = functions_db.functions
import os
import shutil

# collection.createIndex({"function_id":1}, {unique: true})

def cors_support(response, *args, **kwargs):
    response.set_header('Access-Control-Allow-Origin', '*')
    response.set_header('Access-Control-Allow-Headers', '*')

@hug.get('/')
def root():
	return 'Hello World! from web_services_api'

@hug.post('/save_function', requires=cors_support)
def save_function(body):
	content = json.loads(body)
	newInsert = False;
	
	# project_name = content['project_name']
	if '__new' in content['_id']['$oid']:
		newInsert = True
	else:
		function_id = content['_id']['$oid']

	function_name = content['function_name']
	request_method = content['request_method']
	function_description = content['function_description']
	function_code = content['function_code']
	
	insert_object = {
		"function_name" : function_name,
		"function_description" : function_description,
		"function_code" : function_code,
		"request_method" : request_method
	}

	if not newInsert:
		print(function_code)
		print(functions.update({'_id':ObjectId(function_id)}, insert_object, True))
		return 0
	else:
		inserted_id_res = functions.insert_one(insert_object).inserted_id

		output = json.loads(json.dumps(functions.find_one({"_id": ObjectId(inserted_id_res)}), default=json_util.default))
		return output

@hug.get('/get_functions', requires=cors_support)
def get_functions():
	output = []
	for function in functions.find():
		output.append(json.loads(json.dumps(function, default=json_util.default)))
	return output

@hug.get('/compile', requires=cors_support)
def compile():
	doNotCompile = False;
	cwd = os.getcwd()

	dependencies_directory = os.path.join(cwd, "compile_dependencies")
	bash_dependency = os.path.join(dependencies_directory, "script.sh")
	
	project_directory = os.path.join(cwd, "projects")
	project_name = os.listdir(project_directory)[0]
	project_path = os.path.join(project_directory, project_name)
	# print(project_path)

	writeFile = open(os.path.join(project_path,'run.py'), 'w+')

	import_content = "import hug \n"

	# print(import_content)
	writeFile.write(import_content)

	for function in functions.find():
		if 'GET' in function['request_method']:
			hug_decorator_content = "@hug.get('/" + function['function_name'] +"') \n"
		if not function['function_code']:
			doNotCompile = True;
		else:
			hug_code_content = function['function_code']
		
		if not doNotCompile:
			writeFile.write("\n")
			# print(hug_decorator_content)
			writeFile.write(hug_decorator_content)
			# print(hug_code_content)
			writeFile.write(hug_code_content)
			writeFile.write("\n")

			# Clone a copy of the tor python script
			shutil.copy2(bash_dependency, project_path)
		else:
			print("Compile Error - Malformed Function")

	return "success"


