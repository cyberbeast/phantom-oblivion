cd ~/Documents/demo;
nohup timeout $1s waitress-serve --host=0.0.0.0 --port=$2 --url-scheme=http run:__hug_wsgi__ &