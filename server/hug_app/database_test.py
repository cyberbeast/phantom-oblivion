from pymongo import MongoClient
import datetime

client = MongoClient()
code_db = client.code_database
collection = code_db.code_collection
# collection.createIndex('function_id', unique=True)

key = {'function_id':0}
data = {
	'function_name': 'get_sum'
}
collection.update(key, data, {upsert:True})