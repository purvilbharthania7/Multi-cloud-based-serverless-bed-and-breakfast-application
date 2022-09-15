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

def isvalid_date(date):
    try:
        dateutil.parser.parse(date)
        return True
    except ValueError:
        return False

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



def validate_room_booking(room_type, checkin_date,checkout_date,guests):
    room_types = ['queen', 'king', 'single','family','luxury','conference']
    if room_type is not None and room_type.lower() not in room_types:
        return build_validation_result(False,
                                       'RoomType',
                                       'I did not recognize that room type.  Would you like to stay in a queen, king, or deluxe room?')
                                       
    if checkin_date:
        if not isvalid_date(checkin_date):
            return build_validation_result(False, 'CheckInDate', 'I did not understand your check in date.  When would you like to check in?')
        if datetime.datetime.strptime(checkin_date, '%Y-%m-%d').date() <= datetime.date.today():
            return build_validation_result(False, 'CheckInDate', 'Reservations must be scheduled at least one day in advance.  Can you try a different date?')
            
    if checkout_date:
        if not isvalid_date(checkout_date):
            return build_validation_result(False, 'CheckOutDate', 'I did not understand your check out date.  When would you like to check out?')
        if datetime.datetime.strptime(checkout_date, '%Y-%m-%d').date() <= datetime.datetime.strptime(checkin_date, '%Y-%m-%d').date():
            return build_validation_result(False, 'CheckOutDate', 'Checkout date should be after Checkin date. Can you try a different date?')
            
                                       
    if guests is not None and (int(guests) < 1 or int(guests) > 50):
        return build_validation_result(
            False,
            'Guests',
            'You can make a reservations for from one to fifty guests.  How many guests would you like to have with you?'
        )
        
    return build_validation_result(True, None, None)


""" --- Functions that control the bot's behavior --- """

def book_room(intent_request):
    
    room_type = get_slots(intent_request)["RoomType"]
    checkin_date = get_slots(intent_request)["CheckInDate"]
    checkout_date = get_slots(intent_request)["CheckOutDate"]
    guests = get_slots(intent_request)["Guests"]
    source = intent_request['invocationSource']
    total_price = 10
    
    if source == 'DialogCodeHook':
        # Perform basic validation on the supplied input slots.
        # Use the elicitSlot dialog action to re-prompt for the first violation detected.
        slots = get_slots(intent_request)

        validation_result = validate_room_booking(room_type,checkin_date,checkout_date,guests)
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
        # if food_name is not None:
        #     output_session_attributes['Price'] = len(food_name) * 5  # Elegant pricing model
        return delegate(output_session_attributes, get_slots(intent_request))
    
    
    
    #Check for availability
    if room_type.lower() == "single":
        roomId = "1"
        value = 100
    elif room_type.lower() == "king":
        roomId = "2"
        value = 300
    elif room_type.lower() == "queen":
        roomId = "3"
        value = 200
    elif room_type.lower() == "luxury":
        roomId = "4"
        value = 500
    elif room_type.lower() == "family":
        roomId = "5"
        value = 500
    elif room_type.lower() == "conference":
        roomId = "6"
        value = 1000
    else:
        logger.debug("Somthing is wrong")
        
    # logger.debug(roomId)
    
    CHECK_API_ENDPOINT = "https://wwjgputmtzmg5zpl3sob7jbsgi0sbpsz.lambda-url.us-east-1.on.aws/"
    encoded_body = json.dumps({
        "roomId": roomId,
        "startDate": checkin_date,
        "endDate": checkout_date
    })
    
    r = http.request('POST', CHECK_API_ENDPOINT,
                 headers={'Content-Type': 'application/json'},
                 body=encoded_body)
    data=r.data
    
    jsonResponse = json.loads(data.decode('utf-8'))
    
    flag = jsonResponse['isAvailable'] 
    
    if not flag:
        return close(intent_request['sessionAttributes'],
                 'Fulfilled',
                 {'contentType': 'PlainText',
                  'content': 'Room is not available for given date, Please select the different date.'})

    
    #Check For login
    if not intent_request['sessionAttributes']['userId']:
      return close(intent_request['sessionAttributes'],
                 'Fulfilled',
                 {'contentType': 'PlainText',
                  'content': 'You need to login first to book a room.'})
    
    #Book room
    
    delta = datetime.datetime.strptime(checkout_date, '%Y-%m-%d').date() - datetime.datetime.strptime(checkin_date, '%Y-%m-%d').date()
    total_price = (delta.days * value) + (delta.days * value * 0.12)
    # logger.debug(total_price)
    
    BOOK_API_ENDPOINT = "https://bh2fj5zzdl67owlbn2kkgk5zrm0zwngk.lambda-url.us-east-1.on.aws/"
    encoded_body2 = json.dumps({
        "userId": intent_request['sessionAttributes']['userId'],
        "roomId": roomId,
        "startDate": checkin_date,
        "endDate": checkout_date,
        "guest": guests,
        "price": total_price
     })
     
    res = http.request('POST', BOOK_API_ENDPOINT,
                 headers={'Content-Type': 'application/json'},
                 body=encoded_body2)
    dat=res.data
    
    jsonResponse = json.loads(dat.decode('utf-8'))
    logger.debug(jsonResponse)
    
    return close(intent_request['sessionAttributes'],
                 'Fulfilled',
                 {'contentType': 'PlainText',
                  'content': 'Thanks, your order has been placed and your total is ${}'.format(total_price)})    
        


""" --- Intents --- """


def dispatch(intent_request):
    """
    Called when the user specifies an intent for this bot.
    """

    logger.debug('dispatch userId={}, intentName={}'.format(intent_request['userId'], intent_request['currentIntent']['name']))

    intent_name = intent_request['currentIntent']['name']

    # Dispatch to your bot's intent handlers
    if intent_name == 'BookRoom':
        return book_room(intent_request)

    raise Exception('Intent with name ' + intent_name + ' not supported')


""" --- Main handler --- """


def lambda_handler(event, context):
    # By default, treat the user request as coming from the America/New_York time zone.
    os.environ['TZ'] = 'America/New_York'
    time.tzset()
    logger.debug('event.bot.name={}'.format(event['bot']['name']))

    return dispatch(event)
