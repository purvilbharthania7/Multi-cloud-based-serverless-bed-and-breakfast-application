from concurrent.futures import TimeoutError
from google.cloud import pubsub_v1
import functions_framework
import json

subscriber = pubsub_v1.SubscriberClient()
subscription_path = subscriber.subscription_path("project5410-20200120", "DalSoft5410-sub")
messageBody = ""
timeout = 15.0
requestType = ""
isSuccess = False
messageContent = ""

@functions_framework.http
def hello_world(request):

    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)

    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    request_json = request.get_json(silent=True)
    requestType = request_json.get("type")
    
    def callback(message: pubsub_v1.subscriber.message.Message) -> None:
        messageBody = message.data
        messageJson = json.loads(messageBody.decode('utf-8'))
        messageType = messageJson.get("data").get("type")
        if messageType == requestType:
            global isSuccess
            isSuccess = True
            global messageContent
            messageContent = messageJson.get("data").get("message")
    
    streaming_pull_future = subscriber.subscribe(subscription_path, callback=callback)
    with subscriber:
        try:
            streaming_pull_future.result(timeout=timeout)
        except TimeoutError:
            streaming_pull_future.cancel()  # Trigger the shutdown.
            streaming_pull_future.result()  # Block until the shutdown is complete.
    if isSuccess:
        return (messageContent, 200, headers)
    else:
        return ('Failed', 200, headers)