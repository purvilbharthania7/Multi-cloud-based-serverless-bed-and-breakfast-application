import base64
import json
import os
import functions_framework
from google.cloud import pubsub_v1

# Instantiates a Pub/Sub client
publisher = pubsub_v1.PublisherClient()
PROJECT_ID = os.getenv('project5410-20200120')

@functions_framework.http
def booktour(request):

    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    request_json = request.get_json(silent=True)
    topic_name = request_json.get("topic")
    message = request_json.get("message")

    if not topic_name or not message:
        return ('Missing "topic" and/or "message" parameter.', 400, headers)

    print(f'Publishing message to topic {topic_name}')

    # References an existing topic
    topic_path = publisher.topic_path('project5410-20200120', topic_name)

    print(topic_path)

    message_json = json.dumps({
        'data': {'message': message, 'type': 'booktour'},
    })
    message_bytes = message_json.encode('utf-8')

    # Publishes a message
    try:
        publish_future = publisher.publish(topic_path, data=message_bytes)
        publish_future.result()  # Verify the publish succeeded
        return ('Message published.', 200, headers)
    except Exception as e:
        print(e)
        return (e, 500, headers)