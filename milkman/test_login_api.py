import requests
import json

url = 'http://127.0.0.1:8000/customer/login/'
data = {
    'email': 'diksha@gmail.com',
    'password': 'bittu2003'
}

headers = {
    'Content-Type': 'application/json'
}

print("Testing Customer Login API...")
print(f"URL: {url}")
print(f"Data: {json.dumps(data)}")

try:
    response = requests.post(url, json=data, headers=headers)
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response: {response.text}")
    if response.status_code == 200:
        print(f"\n✓ Login successful!")
        print(f"Token: {response.json()['token']}")
except Exception as e:
    print(f"Error: {e}")
