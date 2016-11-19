import hug

@hug.get('/')
def root():
	return 'Hello World! from web_services_api'