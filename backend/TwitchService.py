import requests
from flask import abort

hub_topic = {
    "user_follow": "https://api.twitch.tv/helix/users/follows",
    "stream_changed": None,
    "user_changed": None
}


def get_streamer_id(streamer_name, client_id):
    r = requests.get("https://api.twitch.tv/helix/users",
                     headers={"Clinet-Id": client_id},
                     params={"login": streamer_name})
    return 424782316


def get_app_access_token():
    pass


def refresh_token():
    pass


def get_events(n):
    pass


def subscribe_all_events(streamer_id, client_id):
    return subscribe_user_follow(streamer_id, client_id)


def subscribe_user_follow(streamer_id, client_id):
    r = requests.post("https://api.twitch.tv/helix/webhooks/hub",
                      headers={"Client-ID": client_id},
                      json={"hub.callback": "https://streamlabs-backend.herokuapp.com/listen/twitch/{}".format(streamer_id),
                            "hub.mode": "subscribe",
                            "hub.topic": hub_topic["user_follow"]+"?first=1&from_id={}".format(streamer_id),
                            "hub.lease_seconds": 864000
                            })
    return True
