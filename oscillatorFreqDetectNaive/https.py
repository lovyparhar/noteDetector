# taken from http://www.piware.de/2011/01/creating-an-https-server-in-python/
# generate server.xml with the following command:
#    openssl req -new -x509 -keyout server.pem -out server.pem -days 365 -nodes
# run as follows:
#    python simple-https-server.py
# then in your browser, visit:
#    https://localhost:4443

from http.server import HTTPServer,SimpleHTTPRequestHandler
from socketserver import BaseServer
import ssl

host = ('0.0.0.0', 8000)

httpd = HTTPServer(host, SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket (httpd.socket, certfile='server.pem', server_side=True)

print(f"https://{host[0]}:{host[1]}//")

httpd.serve_forever()