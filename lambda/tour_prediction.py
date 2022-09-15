import json
import requests
import boto3
from boto3.dynamodb.conditions import Key


def lambda_handler(event, context):
    # TODO implement
    
    print("execution start for prediction\n", event)
    print("event\n", event)
    print("context\n", context)
    body = event['body']
    print(body)
    print(type(body))
    body = json.loads(body)
    days = body.get('days')
    print("days:\n", days)
    inputdata = {"days": days}
    result = do_tourprediction(inputdata)
    print("GCP calling done")
    max_value = max(result, key=result.get)
    
    # filter values from dynamodb
    client = boto3.resource('dynamodb')
    table = client.Table("tour_packages")
    
    response = table.scan()
    tours = response['Items']

    tours = [tour for tour in tours if tour['type'] == max_value]
    return tours
    
    
    
def do_tourprediction(inputdata):
    print("Calling predicion on GCP")
    sentimental_url = "https://us-central1-apt-vine-329218.cloudfunctions.net/predtest"
    payload = json.dumps(inputdata)
    print("payload:", payload)
    headers = {
        'Content-Type': 'application/json',
        'Autbhorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjYzMWZhZTliNTk0MGEyZDFmYmZmYjAwNDAzZDRjZjgwYTIxYmUwNGUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNjE4MTA0NzA4MDU0LTlyOXMxYzRhbGczNmVybGl1Y2hvOXQ1Mm4zMm42ZGdxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNjE4MTA0NzA4MDU0LTlyOXMxYzRhbGczNmVybGl1Y2hvOXQ1Mm4zMm42ZGdxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTEzNDU3NjYxNDcxNjQyNTIxNTE4IiwiZW1haWwiOiJtaDMzMzk3MUBkYWwuY2EiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IkhlM3VPNzdaQmlXWmVIQVpSbWtFMXciLCJpYXQiOjE2NTg0NjA5MjEsImV4cCI6MTY1ODQ2NDUyMSwianRpIjoiZmViZWQ1MGJiNzEzMDQ0MzYxNDdiYTI0MDE5YTI2Nzg1OTgwYjI3ZCJ9.GRgmUkHNR2yYFVgJa3ZyW3tZeqZA0goSZA2bqjbd-9ZvIdoF2Y-4UbdSj4wchVwmy0K0I7HHxet-7_iEP_ggw9rmvZB7QQKRMYQyY1jbPFgp15kC35GpNu74xUTKAxNpCYf35F0ygp3kWj6QapkYQBg6xs7yq5B4WMe1ev0sFmMtwmgBt570C2B2ouKkB7tQNWLNjMRwexwkqpnxRxPJfLR7-1q_fLrF78YJV2IhEomQlvS8pCMIteUksB-Ko3EzVeXu19MUxThMmkud9QPVoTP7Q8q2b0OmZlj4AQt3jW7GmukfTTt7Mpe5Y6FqYd2B-ikVUscfi2xsu4xNVQtnJQ'
    }
    
    response = requests.request("POST", sentimental_url, headers=headers, data=payload)
    return json.loads(response.text)
