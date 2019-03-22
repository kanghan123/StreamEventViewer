from flask import Flask, request, abort
from TwitchService import subscribe_all_events
from TwitchService import get_streamer_id
from flask import jsonify, Response
from flask_socketio import SocketIO, send, emit, join_room, leave_room
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)


@app.route('/start/twitch/<streamer_id>', methods=['GET'])
def subscribe_twitch(streamer_id):
    client_id = request.args.get('client_id')
    subscribed = subscribe_all_events(streamer_id, client_id)
    return jsonify(subscribed)


@app.route('/listen/twitch/<streamer_id>', methods=['GET', "POST"])
def callback_twitch(streamer_id):
    if request.method == 'GET':
        hub_challenge = request.args.get('hub.challenge').rstrip()
        return Response(hub_challenge, content_type='text/plain')
    socketio.emit('new event', request.json['data'][0], room=streamer_id)
    print ("new event broadcasted.")
    return str(200)


@socketio.on('new event')
def handle_message(json):
    print('received message: ' + str(json))


@socketio.on('room')
def on_join(json):
    join_room(json)
    print("room joined")


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    socketio.run(app, port=port)