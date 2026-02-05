import requests as req
import datetime
import csv
import boto3
import os
from io import StringIO



# Executed every fifteen minutes via AWS Lambda, scheduled with CloudWatch Events.
# Should really use a DB not a CSV in an S3, as CSV will become too big and we have 
# to load the whole thing in to memory on but this is ok for an MVP, CSV structure is pretty simple too 

def lambda_handler(event, context):


    #publically availble open data API for parking in Vejle, Denmark
    baseUrl = "https://letparkeringapi.azurewebsites.net/api/ParkingOverview"

    s3 = boto3.client('s3')

    csvfile_obj = s3.get_object(Bucket='fcgtest26', Key='vejle_data.csv')
    cdata = csvfile_obj.get('Body').read().decode('utf-8')
    q = csv.DictReader(StringIO(cdata))
    alldata = []
    for row in q:
       alldata.append(row)
       print(row)

    fetchTimestamp = datetime.datetime.now()
    response = req.get(baseUrl)
    data = response.json()

    for i in data:
     newRow = {'datetime' : str(fetchTimestamp), 'carpark_id' : i['id'], 'occupied' : i['optagedePladser'], 'empty' : i['ledigePladser']}
     alldata.append(newRow)
  
    # create a new csv file with appended data, we have to use /tmp/ because lambda functions only have write access to that folder
    with open('/tmp/vejle_data.csv', 'w', newline='') as csvfile:
     fieldnames = ['datetime', 'carpark_id', 'occupied', 'empty']
     writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
     writer.writeheader()
     for r in alldata:
        writer.writerow(r)
    
    s3.put_object(Bucket='fcgtest26', Key='vejle_data.csv', Body=open('/tmp/vejle_data.csv', 'rb')) 
    

