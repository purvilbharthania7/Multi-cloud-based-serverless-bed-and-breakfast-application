import json
import boto3
import uuid
from datetime import datetime


def lambda_handler(event, context):
    print("event:\n", event)
    client = boto3.resource('dynamodb')
    tour_table = client.Table("tour_packages")
    
    booking_id = str(uuid.uuid1())
    body = event.get('body')
    body = json.loads(body)
    # input_data = event.get('tour_book')
    
    tour_id = body.get('type')
    userid = body.get('userId')
    price = body.get('packagePrice')
    package_name = body.get('packageName')
    startDate = body.get('startDate')
    # tour_id = event.get('id')
    # customer_name = event.get('name')
    quantity = 1
    
    
    tour_record = get_record(tour_table, {'id': tour_id})
    total_cost = tour_record[0]['Price'] * quantity
    time = str(datetime.now())
    
    # TODO implement
    result_data = {
        'booking_id': booking_id,
        'tour_id': tour_id,
        'userId': userid,
        'quantity': quantity,
        'total_cost': total_cost,
        'time': time,
        "startDate": startDate,
        "package_name": package_name
    }
    tour_booking_table = client.Table("tour_booking")
    response = tour_booking_table.put_item(
            Item=result_data
        )
    # {
    #     'statusCode': 200,
    #     'body': json.dumps('success')
    # }
    return result_data

def get_record(table, key_value_dict):
    response = table.get_item(
        Key=key_value_dict
    )
    return [response['Item']]

def book_tour(logger, tour_id, customer_id, booking_id, quantity):
    dynamo = DynamoDB()
    tour = dynamo.get_record(TOUR, {'id': tour_id})
    logger.info(tour)
    total_cost = tour[0]['cost'] * quantity
    logger.info(total_cost)
    data = {
        'id': str(uuid.uuid1()),
        'tour_id': tour_id,
        'customer_id': customer_id,
        'booking_id': booking_id,
        'quantity': quantity,
        'total_cost': total_cost,
        'time_stamp': str(datetime.now()),
        'package_name': package_name
    }
    dynamo.insert(TOUR_BOOKING, data)
    post_notification({
        "customer_id": customer_id,
        "message": "Tour booked for booking {}| Quantity: {} | Total Cost: ${} | Tour Booking date: {}".format(
           booking_id, quantity, total_cost, str(datetime.now().strftime("%B %d, %Y at %H:%M"))
        )
    })
    
