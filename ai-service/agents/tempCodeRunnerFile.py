




# import requests
# import json
# from dotenv import load_dotenv
# import os
# FOURSQUARE_API_KEY = os.getenv("FOURSQUARE_API_KEY")
# CLIENT_ID = "AVFSI53NXSID1HBVXIGVYQJNZANUOUFGFGLEUJ3O4NLSCBHX"
# CLIENT_SECRET = "EHQDGJ3LGAFBXMICQDARW5TRLGWBACLIQLRBHHFCVCCDNSS1"


# url = "https://api.foursquare.com/v2/venues/search"

# params = {
# "client_id": CLIENT_ID,
# "client_secret": CLIENT_SECRET,
# "v": "20240601",
# "near": "Tokyo",
# "limit": 5
# }

# try:
#     response = requests.get(url, params=params, timeout=15)

    
#     print("Status Code:", response.status_code)

#     data = response.json()

#     print("\nResponse:")
#     print(json.dumps(data, indent=2))
    

# except Exception as e:
#     print("Error:", e)
