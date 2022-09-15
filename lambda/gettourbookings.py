import json
import boto3

def lambda_handler(event, context):
    # TODO implement
    print(event)
    body = event.get('body')
    body = json.loads(body)
    userId = body.get('userId')
    
    client = boto3.resource('dynamodb')
    table = client.Table("tour_booking")
    
    response = table.scan()
    data = response['Items']
    filter_data = [d for d in data if d['userId'] == userId]
    
    
    print(filter_data)
    
    
    return filter_data