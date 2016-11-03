import hug

@hug.get('/')
def root():
	return 'Hello World! from vm_management_api'