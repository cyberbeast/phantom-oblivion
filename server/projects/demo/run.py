import hug 

@hug.get('/func1') 
def func1(num1):
    output = num1 + num1
    return output

@hug.get('/new_func') 
def hi():
    return 0
