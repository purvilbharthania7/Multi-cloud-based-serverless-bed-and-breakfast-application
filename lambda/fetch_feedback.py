import json
import boto3

def lambda_handler(event, context):
    # TODO implement
    
    
    client = boto3.resource('dynamodb')
    table = client.Table("sentimental_data")
    
    response = table.scan()
    data = response['Items']
    
    print(data)
    
    
    return data
