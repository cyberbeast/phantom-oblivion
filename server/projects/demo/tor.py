from stem.control import Controller
import subprocess

server_port = 8118
print(' * Connecting to tor')

with Controller.from_port() as controller:
  controller.authenticate()
  response = controller.create_ephemeral_hidden_service({80: server_port}, await_publication = True)
  print(" * Our service is available at %s.onion, press ctrl+c to quit" % response.service_id)

  try:
    subprocess.run(["waitress-serve", "--port="+str(server_port), "run:__hug_wsgi__"])
  finally:
    print(" * Shutting down our hidden service")