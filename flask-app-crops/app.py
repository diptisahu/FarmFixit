from flask import Flask, request ,jsonify
import os
import pickle
import numpy as np
import requests

app = Flask(__name__)

cf_port = os.getenv("PORT")

model=""
with open('XGBoost_crop.pkl','rb') as model_file:
    model = pickle.load(model_file)
	
#data = np.array([[100,59,12,25.73044432,70.74739256,6.877869005,201]])
def cropPredicition(data):
	dataArray = np.array([data])	
	output = {}
	prediction = model.predict_proba(dataArray).tolist()[0]
	classes = model.classes_
	for i in range(0,len(prediction)):
		output[classes[i]] = prediction[i]
	sorted_x = sorted(output.items(),key=lambda kv: kv[1],reverse=True)
	result = [sorted_x[0][0],sorted_x[1][0],sorted_x[2][0]]
	return result

#district = 'Bangalore'
def searchMarket(district):
	endpoint = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd0000019e6d830f5d7c45da7fabd0468e6c2516&format=json&limit=1000"
	response = requests.get(url=endpoint).json()
	records = response['records']
	market_list = []
	markets = []
	commodity = {}
	market_commodity_details = {}

	for item_data in records:
		if district in item_data['district']:
			commodity[item_data['commodity']] = (item_data['min_price'],item_data['max_price'],item_data['modal_price'])
			markets.append(item_data['market'])
			market_commodity_details[item_data['market']] = commodity

	markets = list(set(markets))
	import pandas as pd
	df = pd.DataFrame(data=markets)
	df_html = df.to_html()  
	return df_html

@app.route('/getMarketTableByDistrictSearch',methods=['GET'])
def getMarketTable():
	district = request.args.get("district")
	searchMarket(district)
	return jsonify({"result":searchMarket(district)})

@app.route('/getCropPredictionListByWeatherParameters', methods=['GET', 'POST'])
def getCrops():
	content = request.json
	data = content["data"]
	result = cropPredicition(data)
	return {"result":result}

@app.route('/')
def hello():
    return 'API server is running :)'

if __name__ == '__main__':
	if cf_port is None:
		app.run(host='0.0.0.0', port=8080, debug=True)
	else:
		app.run(host='0.0.0.0', port=int(cf_port), debug=True)