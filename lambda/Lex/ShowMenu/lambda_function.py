import math
import dateutil.parser
import datetime
import time
import os
import logging
import boto3
import urllib3
import json


logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

http = urllib3.PoolManager()

""" --- Helpers to build responses which match the structure of the necessary dialog actions --- """


def close(session_attributes, fulfillment_state, message):
    response = {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': fulfillment_state,
            'message': message
        }
    }

    return response


""" --- Functions that control the bot's behavior --- """

def show_menu(intent_request):
    
    API_ENDPOINT = "https://77v5j4qdxumchjlylhv3nb4j4e0shdws.lambda-url.us-east-1.on.aws/"
    encoded_body = json.dumps({
        "endpoint": "/fetchAllMenuItems"
    })
    r = http.request('POST', API_ENDPOINT,
                 headers={'Content-Type': 'application/json'},
                 body=encoded_body)
    data=r.data
    jsonResponse = json.loads(data.decode('utf-8'))
    
    message = ""
    for itemData in jsonResponse['Items']:
        print(itemData)
        message += f"Item: {itemData['name']}, Price: ${itemData['price']} \n"
    
    return close(intent_request['sessionAttributes'],
                 'Fulfilled',
                 {'contentType': 'PlainText',
                  'content': message})
    
    
""" --- Intents --- """


def dispatch(intent_request):
    """
    Called when the user specifies an intent for this bot.
    """

    # logger.debug('dispatch userId={}, intentName={}'.format(intent_request['userId'], intent_request['currentIntent']['name']))
    logger.debug(intent_request['sessionAttributes'])

    intent_name = intent_request['currentIntent']['name']

    # Dispatch to your bot's intent handlers
    if intent_name == 'ShowMenu':
        return show_menu(intent_request)
        #return order_flowers(intent_request)

    raise Exception('Intent with name ' + intent_name + ' not supported')


""" --- Main handler --- """


def lambda_handler(event, context):
    """
    Route the incoming request based on intent.
    The JSON body of the request is provided in the event slot.
    """
    # By default, treat the user request as coming from the America/New_York time zone.
    os.environ['TZ'] = 'America/New_York'
    time.tzset()
    logger.debug('event.bot.name={}'.format(event['bot']['name']))
    
    logger.debug(event)

    return dispatch(event)
