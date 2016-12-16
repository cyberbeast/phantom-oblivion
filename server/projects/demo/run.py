import hug 

@hug.get('/func1') 
def func1():
    return "hi"

@hug.get('/func2') 
def func2():
    return "works"
