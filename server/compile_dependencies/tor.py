# print("BEGIN")
from stem.control import Controller
import time
import subprocess
import os
from pymongo import *
import json
from bson.objectid import ObjectId
from bson import BSON
from bson import json_util
import functools 
import shutil
from itertools import cycle
import socket
import threading
import paramiko
from paramiko.ssh_exception import SSHException, ChannelException, NoValidConnectionsError, NoValidConnectionsError

class AllowAnythingPolicy(paramiko.MissingHostKeyPolicy):
    def missing_host_key(self, client, hostname, key):
        return

client = MongoClient()
servers_db = client.servers_db
servers = servers_db.servers

conf_db = client.conf_db
tor_config = conf_db.tor_config
threshold_config = conf_db.threshold_config

def read_until_EOF(fileobj, output):
    s = fileobj.readline()
    while s:
        output.append(s.strip())
        print(s.strip)
        s = fileobj.readline()

def transfer_callback(filename, bytes_so_far, bytes_total):
    print('Transfer of %r is at %d/%d bytes (%.1f%%)' % (
        filename, bytes_so_far, bytes_total, 100. * bytes_so_far / bytes_total))

# tor_config.update({ 'name': 'access_url'}, {'name': "access_url", "value": "unassigned"}, upsert=True)
# print(tor_config.find_one())

def read_until_EOF(fileobj, output):
    s = fileobj.readline()
    while s:
        output.append(s.strip())
        s = fileobj.readline()

servers_list = []
for server in servers.find():
    servers_list.append(json.loads(json.dumps(server, default=json_util.default)))

server_port = 8118
server_pool = cycle(servers_list)

cwd = os.getcwd()
project_directory = os.path.join(cwd, "projects")
project_name = os.listdir(project_directory)[0]
project_path = os.path.join(project_directory, project_name)

# print(tor_config.find_one({'name':'obliviate_status'}))

while "CONNECTED" == tor_config.find_one({'name':'obliviate_status'})['status']:
  current_server = next(server_pool)
  with Controller.from_port() as controller:
    controller.authenticate()
    status = tor_config.find_one({'name':'access_url'})['value']
    if status != "unassigned":
      print(status)
      controller.remove_ephemeral_hidden_service(status)
    response = controller.create_ephemeral_hidden_service({80: current_server['server_host'] + ":" + str(server_port)}, await_publication = True, detached=True)
    tor_config.update({ 'name': 'access_url'}, {"name":"access_url", "value": response.service_id}, upsert=True)
    print("ASSIGNED!")
    print(" * Our service is available at %s.onion" % response.service_id)
    
    SSH_Client = paramiko.SSHClient()
    SSH_Client.set_missing_host_key_policy(AllowAnythingPolicy())
    try:
        print("connecting to: ", current_server['server_host'])
        SSH_Client.connect(current_server['server_host'], username=current_server['server_username'], password=current_server['server_password'])
        SSH_Client.exec_command('mkdir ~/Documents/' + project_name)
        sftp_client = SSH_Client.open_sftp()
        sftp_client.chdir('/home/pi/Documents/' + project_name)

        print(sftp_client.getcwd())
        print(os.listdir(project_path))

        for filename in os.listdir(project_path):
          if "__pycache__" not in filename:
            callback_for_filename = functools.partial(transfer_callback, filename)
            sftp_client.put(os.path.join(project_path, filename), filename, callback=callback_for_filename)
        print(str(threshold_config.find_one()['value']))
        # SSH_Client.chdir("/home/pi/Documents/demo")
        init_API_req = SSH_Client.exec_command('bash /home/pi/Documents/' + project_name +'/script.sh ' + str(threshold_config.find_one()['value']) +" "+ str(server_port))
        print("BASH SCRIPT CALLED...")
    except (SSHException, ChannelException, NoValidConnectionsError, NoValidConnectionsError, socket.error) as e:
        print("TOR.pY failed!", e)

  time.sleep(threshold_config.find_one()['value'])

print("PAUSING...")
tor_config.update({ 'name': 'access_url'}, {'name': "access_url", "value": "unassigned"}, upsert=True)

