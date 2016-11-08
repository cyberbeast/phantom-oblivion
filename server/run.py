"""Entry point for backend application"""

import hug
from hug_app import config_api, vm_management_api
import json

@hug.not_found()
def not_found_handler():
    return "Thank you for your interest in our backend processes. But the resource you are looking/snooping for is not available here!"

@hug.get('/')
def say_hi():
	response = {"Hello World from server"}
	return response

@hug.extend_api('/config')
def config_api():
    return [config_api]

@hug.extend_api('/vm')
def vm_api():
	return [vm_management_api]