from os import stat_result

from setuptools.command.test import test
from simple_websocket_server import WebSocketServer, WebSocket


from utils.stream import *

stream = Stream()
stream.start_stream()



class SimpleChat(WebSocket):
    def handle(self):
        for client in clients:
            if client != self:
                client.send_message(self.address[0] + u' - ' + self.data)

    def connected(self):
        print(self.address, 'connected')
        for client in clients:
            client.send_message(self.address[0] + u' - connected')
        clients.append(self)
        stream.set_clients(clients)

    def handle_close(self):
        clients.remove(self)
        print(self.address, 'closed')
        stream.set_clients(clients)
        


clients = []

server = WebSocketServer('', 8000, SimpleChat)
server.serve_forever()
