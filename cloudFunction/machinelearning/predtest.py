import json
from google.cloud import aiplatform
from google.protobuf import json_format
from google.protobuf.struct_pb2 import Value


def test_prediction(request):
    final_response, parameters_dict = {}, {}
    request_json_data = request.get_json()
    instance_dict={
        "days": request_json_data["days"]
        }    
    
    project, endpoint_id, location ="325567291622", "8480339670989799424", "us-central1"
    api_endpoint = "us-central1-aiplatform.googleapis.com"
    
    client_options = {"api_endpoint": api_endpoint}
    client = aiplatform.gapic.PredictionServiceClient(client_options=client_options)
    
    instances = [json_format.ParseDict(instance_dict, Value())]
    
    parameters = json_format.ParseDict(parameters_dict, Value())
    endpoint = client.endpoint_path(
        project=project, location=location, endpoint=endpoint_id
    )
    response = client.predict(
        endpoint=endpoint, instances=instances, parameters=parameters
    )

    prediction_array = []
    predictions = response.predictions
    print("Hello response output:\n", response)
    print("\nHello predictions output:\n", predictions)

    for prediction in predictions:
        print("in loop prediction:", dict(prediction))
    prediction = predictions[0]
    prediction_dict = dict(prediction)
    classes = prediction_dict['classes']
    scores = prediction_dict['scores']
    print('classes', classes)
    print('scores', scores)
    result_data = dict(zip(classes, scores))
    return result_data