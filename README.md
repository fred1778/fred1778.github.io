# vejle-spacer
Parking pattern tracking tool for Vejle, Denmark

## Structure

There are 3 components to this tool: 2 AWS services (an S3 bucket and a Lambda) and a front-end web client. The lambda is executed every 15 minutes (driven by a scheduled AWS Cloudwatch event). The lambda pulls a CSV file from the S3 bucket, decodes it in to Python dictionary, fetches data from (opendata.dk)[https://www.opendata.dk/city-of-vejle/vejle-parkering], parses the JSON response in dictionary objects, appends this to the CSV data, before finally re-encoding the augmented data to CSV and saving it back in the S3. 

The front-end is a simple webpage making use of custom-syled map view from MapBox, with CSV parsing support provided by a minified version of Papaparse. 



#TODO 
> Currently, lambda is only used for ETL process, and analytics on the data are performed client side. Analytical outputs should be produced server-side and fetched by client instead.
> Using a CSV file that needs to be read/written to in full is ineffecient and not scalable, only suitable for a proof of concept. A DB-driven approach (either Postgres/MySQL or NoSQL) would be the correct approach. 
