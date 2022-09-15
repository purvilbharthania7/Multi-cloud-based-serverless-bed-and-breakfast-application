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


def get_slots(intent_request):
    return intent_request['currentIntent']['slots']


def elicit_slot(session_attributes, intent_name, slots, slot_to_elicit, message):
    return {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'ElicitSlot',
            'intentName': intent_name,
            'slots': slots,
            'slotToElicit': slot_to_elicit,
            'message': message
        }
    }


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


def delegate(session_attributes, slots):
    return {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'Delegate',
            'slots': slots
        }
    }


""" --- Helper Functions --- """

def build_validation_result(is_valid, violated_slot, message_content):
    if message_content is None:
        return {
            "isValid": is_valid,
            "violatedSlot": violated_slot,
        }

    return {
        'isValid': is_valid,
        'violatedSlot': violated_slot,
        'message': {'contentType': 'PlainText', 'content': message_content}
    }



def validate_order_foods(food_name, quantity):
    food_types = ['sandwich', 'waffles', 'pancakes']
    if food_name is not None and food_name.lower() not in food_types:
        return build_validation_result(False,
                                       'FoodName',
                                       'We do not have {}, would you like a different type of food?  '
                                       'Our most popular foods are Waffles'.format(food_name))
                                       
    if quantity is not None and int(quantity) > 10:
        return build_validation_result(
            False,
            'FoodQuantity',
            'You can only order between 1 to 10 quantity. Can you provide the different quantity?'
        )
        
    return build_validation_result(True, None, None)


""" --- Functions that control the bot's behavior --- """

def order_foods(intent_request):
    
    food_name = get_slots(intent_request)["FoodName"]
    quantity = get_slots(intent_request)["FoodQuantity"]
    # room_number = get_slots(intent_request)["RoomNumber"]
    source = intent_request['invocationSource']
    total_price = 10
    
    if source == 'DialogCodeHook':
        # Perform basic validation on the supplied input slots.
        # Use the elicitSlot dialog action to re-prompt for the first violation detected.
        slots = get_slots(intent_request)

        validation_result = validate_order_foods(food_name, quantity)
        if not validation_result['isValid']:
            slots[validation_result['violatedSlot']] = None
            return elicit_slot(intent_request['sessionAttributes'],
                               intent_request['currentIntent']['name'],
                               slots,
                               validation_result['violatedSlot'],
                               validation_result['message'])

        # Pass the price of the flowers back through session attributes to be used in various prompts defined
        # on the bot model.
        output_session_attributes = intent_request['sessionAttributes'] if intent_request['sessionAttributes'] is not None else {}
        if food_name is not None:
            output_session_attributes['Price'] = len(food_name) * 5  # Elegant pricing model
        return delegate(output_session_attributes, get_slots(intent_request))
    
    
    # Check For login
    if not intent_request['sessionAttributes']['userId']:
      return close(intent_request['sessionAttributes'],
                 'Fulfilled',
                 {'contentType': 'PlainText',
                  'content': 'You need to login first to order a food.'})
    
    
    #Price Calculation
    if food_name.lower() == "pancakes":
        value = 12
    elif food_name.lower() == "sandwich":
        value = 20
    elif food_name.lower() == "waffles":
        value = 13
    else:
        logger.debug("Somthing is wrong")
    
    total_price = value * int(quantity);
    
    #Order a food
    
    orderSummary = {
        "id": "13213",
        "userId": intent_request['sessionAttributes']['userId'],
        "items":[
            {
                "name": food_name,
                "quantity": quantity,
            }
        ],
        "orderTime" : "1658112471967",
        "totalAmount": total_price,
        "totalCartQuantity": quantity,
        "orderStatus": "Preparing"
    }
    
    # print(orderSummary)
    API_ENDPOINT = "https://77v5j4qdxumchjlylhv3nb4j4e0shdws.lambda-url.us-east-1.on.aws/"
    encoded_body = json.dumps({
        "endpoint": "/orderFood",
        "order": orderSummary
    })
     
    res = http.request('POST', API_ENDPOINT,
                 headers={'Content-Type': 'application/json'},
                 body=encoded_body)
    dat=res.data
    
    # jsonResponse = json.loads(dat.decode('utf-8'))
    # logger.debug(jsonResponse)
    
    
    return close(intent_request['sessionAttributes'],
                 'Fulfilled',
                 {'contentType': 'PlainText',
                  'content': 'Thanks, your order for {} has been placed and your total is ${}'.format(food_name, total_price)})    
        


""" --- Intents --- """


def dispatch(intent_request):
    """
    Called when the user specifies an intent for this bot.
    """

    logger.debug('dispatch userId={}, intentName={}'.format(intent_request['userId'], intent_request['currentIntent']['name']))

    intent_name = intent_request['currentIntent']['name']

    # Dispatch to your bot's intent handlers
    if intent_name == 'OrderFood':
        return order_foods(intent_request)

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

    return dispatch(event)
