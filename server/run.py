"""Entry point for backend application"""

import hug
from hug_app import config_api, vm_management_api

@hug.get('/')
def say_hi():
    return "Server says HI! :P"

@hug.extend_api('/config')
def config_api():
    return [config_api]

@hug.extend_api('/vm')
def vm_api():
	return [vm_management_api]