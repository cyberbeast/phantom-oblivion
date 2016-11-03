import hug

@hug.get('/')
def trial():
	return 'Hello World! from config_api'