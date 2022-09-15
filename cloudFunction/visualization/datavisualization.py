import datetime
import boto3
import json
from google.cloud import bigquery
import functions_framework
import pandas as pd

dynamodb = boto3.resource(
  'dynamodb',
  region_name='us-east-1',
  aws_access_key_id='ASIARBVCX2VTAU7B4XPD',
  aws_secret_access_key='TfpezdS6xsAoTfKz6NUIu/XxEW/jkZgHpgQu/YgB',
  aws_session_token='FwoGZXIvYXdzEEgaDOcKotyGd4afBvyQ1yLAARPhfzGhAnbuIfiShuoebziNenHFiVes3ujksHW935u4bN4DIlYVDHxoYDcCx+kk76WsUIph4KCFkzsFLd9BSfio2shoPR1COH9GaKHvxcnhmfHN2esON1WtaYABa8thtNX2pw9FH0EpS6QTrUfZtDPZ40os+lDpLF/YA7yVEsJaD2HD7quwka8xeDuiTYID30bDDYdKkgD4sWM94BWH8HDsKhbsg9WhZlucgxhj2AKzHtcKP/rpMWWLLh4CCsuLsSi75fGWBjItErh3cIGqwJBr9GL4nst8TaboeVTFojmyS/y4w0PUZujj9e6H5FBKWMkVwWZT'
)
client = bigquery.Client()

@functions_framework.http
def hello_world(request):
  '''
    generate food_order table
  '''
  table_food = dynamodb.Table('orders')
  response_food = table_food.scan(
      Select='SPECIFIC_ATTRIBUTES',
      AttributesToGet=[
          'items',
          'orderTime'
      ])
  foodsList = response_food['Items']  
  
  i = 1
  df = pd.DataFrame([], columns=['id', 'name', 'quantity', 'price', 'date'])

  for item in foodsList:
    a = item.get('items')
    b = item.get('orderTime')
    x = datetime.datetime.utcfromtimestamp(int(b)/1000)
    date = x.strftime("%Y-%m-%d")
    for content in a:
      name = content.get('name')
      quantity = content.get('quantity')
      price = content.get('price')
      df = df.append({'id': i, 'name': name, 'quantity': int(quantity), 'price': price, 'date': date}, ignore_index=True)
      i += 1

  json_data = df.to_json(orient = 'records')
  json_object = json.loads(json_data)

  job_config = bigquery.LoadJobConfig(
    schema=[
        bigquery.SchemaField("id", "INTEGER"),
        bigquery.SchemaField("name", "STRING"),
        bigquery.SchemaField("quantity", "INTEGER"),
        bigquery.SchemaField("price", "FLOAT"),
        bigquery.SchemaField("date", "STRING"),
    ],
    write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE,
    source_format=bigquery.SourceFormat.NEWLINE_DELIMITED_JSON,
  )

  table_id = 'project5410-20200120.project5410dataset.food_order'

  load_job = client.load_table_from_json(json_object, table_id, job_config=job_config)

  load_job.result()

  '''
    store room order data
  '''
  table_room = dynamodb.Table('room_booking')
  response_room = table_room.scan(
      Select='SPECIFIC_ATTRIBUTES',
      AttributesToGet=[
          'price',
          'startDate'
      ])
  roomsList = response_room['Items']
  i = 1
  df_room = pd.DataFrame([], columns=['id', 'price', 'date'])

  for item in roomsList:
    price = item.get('price')
    date = item.get('startDate')
    df_room = df_room.append({'id': i, 'price': int(price), 'date': date}, ignore_index=True)
    i += 1

  json_data_room = df_room.to_json(orient = 'records')
  json_object_room = json.loads(json_data_room)

  job_config_room = bigquery.LoadJobConfig(
    schema=[
        bigquery.SchemaField("id", "INTEGER"),
        bigquery.SchemaField("price", "INTEGER"),
        bigquery.SchemaField("date", "STRING"),
    ],
    write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE,
    source_format=bigquery.SourceFormat.NEWLINE_DELIMITED_JSON,
  )
  table_id_room = 'project5410-20200120.project5410dataset.room_order'

  load_job_room = client.load_table_from_json(json_object_room, table_id_room, job_config=job_config_room)

  load_job_room.result()

  '''
    feedback
  '''
  table_feedback = dynamodb.Table('sentimental_data')
  response_feedback = table_feedback.scan(
      Select='SPECIFIC_ATTRIBUTES',
      AttributesToGet=[
          'polarity'
      ])
  feedbacksList = response_feedback['Items']
  i = 1
  df_feedback = pd.DataFrame([], columns=['id', 'polarity'])

  for item in feedbacksList:
    polarity = item.get('polarity')
    df_feedback = df_feedback.append({'id': i, 'polarity': polarity}, ignore_index=True)
    i += 1

  json_data_feedback = df_feedback.to_json(orient = 'records')
  json_object_feedback = json.loads(json_data_feedback)

  job_config_feedback = bigquery.LoadJobConfig(
    schema=[
        bigquery.SchemaField("id", "INTEGER"),
        bigquery.SchemaField("polarity", "STRING"),
    ],
    write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE,
    source_format=bigquery.SourceFormat.NEWLINE_DELIMITED_JSON,
  )

  table_id_feedback = 'project5410-20200120.project5410dataset.feedback '
  load_job_feedback = client.load_table_from_json(json_object_feedback, table_id_feedback, job_config=job_config_feedback)

  load_job_feedback.result()

  destination_table = client.get_table(table_id_feedback)
  print("Loaded {} rows.".format(destination_table.num_rows))

  return "success"