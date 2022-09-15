from google.cloud import language_v1
import json
# import io

# Add a new document
client = language_v1.LanguageServiceClient()

def sentimental_analysis(request):

    request_json = request.get_json()
    feedback_name = request_json["name"]
    feedback_text = request_json["text"]
    # Then query for documents
    document = language_v1.Document(content=feedback_text, type_=language_v1.Document.Type.PLAIN_TEXT)
    sentiment = client.analyze_sentiment(request={"document": document} ).document_sentiment
    if (sentiment.score < 0):
      polarity = "NEGATIVE"
    else:
      polarity = "POSITIVE"
            
    result_dict = {}
    result_dict['name'] = feedback_name
    result_dict['feedback'] = feedback_text
    result_dict['sentimentscore'] = sentiment.score
    result_dict['sentimentmagnitude'] = sentiment.magnitude
    result_dict['polarity'] = polarity
    print(result_dict)
    return result_dict