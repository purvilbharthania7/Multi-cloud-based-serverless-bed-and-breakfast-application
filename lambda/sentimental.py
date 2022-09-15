import json
import uuid
import boto3
import requests
from decimal import Decimal

def lambda_handler(event, context):
    # TODO implement
    print("event:\n", event)
    body = event.get('body')
    body = json.loads(body)
    
    feedback = body.get('text', None)
    userId = body.get('userId', None)
    serviceName = body.get('serviceName', None)

    sentimentdata = do_sentimental(feedback)
    print("sentimental done")
    sentimentdata['userId'] = userId
    sentimentdata['serviceName'] = serviceName
    result = store_into_dynamodb(json.loads(json.dumps(sentimentdata), parse_float=Decimal))
    print("data stored into table")
    print(result)
    return {
        'statusCode': 200,
        'body': json.dumps('success')
    }
    
def do_sentimental(feedback):
    sentimental_url = "https://us-central1-serverless-project-164d7.cloudfunctions.net/SentimentAnalysis"
    payload = json.dumps({
        "name" :"temp",
        "text": feedback
    })
    headers = {
        'Content-Type': 'application/json',
        'Autbhorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjYzMWZhZTliNTk0MGEyZDFmYmZmYjAwNDAzZDRjZjgwYTIxYmUwNGUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNjE4MTA0NzA4MDU0LTlyOXMxYzRhbGczNmVybGl1Y2hvOXQ1Mm4zMm42ZGdxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNjE4MTA0NzA4MDU0LTlyOXMxYzRhbGczNmVybGl1Y2hvOXQ1Mm4zMm42ZGdxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTEzNDU3NjYxNDcxNjQyNTIxNTE4IiwiZW1haWwiOiJtaDMzMzk3MUBkYWwuY2EiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IkhlM3VPNzdaQmlXWmVIQVpSbWtFMXciLCJpYXQiOjE2NTg0NjA5MjEsImV4cCI6MTY1ODQ2NDUyMSwianRpIjoiZmViZWQ1MGJiNzEzMDQ0MzYxNDdiYTI0MDE5YTI2Nzg1OTgwYjI3ZCJ9.GRgmUkHNR2yYFVgJa3ZyW3tZeqZA0goSZA2bqjbd-9ZvIdoF2Y-4UbdSj4wchVwmy0K0I7HHxet-7_iEP_ggw9rmvZB7QQKRMYQyY1jbPFgp15kC35GpNu74xUTKAxNpCYf35F0ygp3kWj6QapkYQBg6xs7yq5B4WMe1ev0sFmMtwmgBt570C2B2ouKkB7tQNWLNjMRwexwkqpnxRxPJfLR7-1q_fLrF78YJV2IhEomQlvS8pCMIteUksB-Ko3EzVeXu19MUxThMmkud9QPVoTP7Q8q2b0OmZlj4AQt3jW7GmukfTTt7Mpe5Y6FqYd2B-ikVUscfi2xsu4xNVQtnJQ'
    }
    
    response = requests.request("POST", sentimental_url, headers=headers, data=payload)
    return json.loads(response.text)

def store_into_dynamodb(data):
    client = boto3.resource('dynamodb')
    table = client.Table("sentimental_data")
    # creating unique id for each record
    data['id'] = str(uuid.uuid4())
    table.put_item(Item= data)
    return True