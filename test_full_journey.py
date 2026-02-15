import requests
import json
import random
import string

BASE_URL = "http://localhost:8000"

def print_separator(title):
    print("\n" + "="*50)
    print(f" {title}")
    print("="*50)

def generate_random_string(length=8):
    return ''.join(random.choices(string.ascii_lowercase, k=length))

def run_test():
    session = requests.Session()
    
    # 1. Signup
    print_separator("1. Authentication: Signup")
    username = f"user_{generate_random_string()}"
    email = f"{username}@example.com"
    password = "TestPassword123!"
    
    signup_data = {
        "username": username,
        "email": email,
        "password": password,
        "confirm_password": password
    }
    
    try:
        response = session.post(f"{BASE_URL}/api/auth/signup/", json=signup_data)
        print(f"Signup Status: {response.status_code}")
        print(f"Response: {response.json()}")
        if response.status_code != 201:
            print("Signup failed. Exiting.")
            return
    except Exception as e:
        print(f"Error during signup: {e}")
        return

    # 2. Login
    print_separator("2. Authentication: Login")
    login_data = {
        "username": username,
        "email": email,
        "password": password
    }
    
    access_token = None
    try:
        response = session.post(f"{BASE_URL}/api/auth/login/", json=login_data)
        print(f"Login Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            access_token = data.get("access")
            refresh_token = data.get("refresh")
            print("Login successful. Tokens received.")
        else:
            print(f"Login failed: {response.text}")
            return
    except Exception as e:
        print(f"Error during login: {e}")
        return

    # Set Authorization header for future requests
    headers = {"Authorization": f"Bearer {access_token}"}

    # 3. Interests
    print_separator("3. Interests: Fetch & Save")
    interest_domain_id = None
    try:
        # Fetch Domains
        response = session.get(f"{BASE_URL}/api/interests/domains/", headers=headers)
        print(f"Fetch Domains Status: {response.status_code}")
        domains = response.json()
        print(f"Found {len(domains)} domains.")
        
        if domains:
            selected_domain = domains[0]
            interest_domain_id = selected_domain['id']
            print(f"Selecting domain: {selected_domain['name']} (ID: {interest_domain_id})")
            
            # Save Interest
            interest_data = {
                "interest_ids": [interest_domain_id]
            }
            response = session.post(f"{BASE_URL}/api/interests/save/", json=interest_data, headers=headers)
            print(f"Save Interest Status: {response.status_code}")
            print(f"Response: {response.json()}")
        else:
            print("No domains found. Run 'python manage.py loaddata' or create domains first.")
    except Exception as e:
        print(f"Error in interests: {e}")

    # 4. Content
    print_separator("4. Content: List & Search")
    content_id = None
    try:
        # List Content (using the interest we just saved)
        response = session.get(f"{BASE_URL}/api/content/list/?interest_domain={interest_domain_id}", headers=headers)
        print(f"List Content Status: {response.status_code}")
        
        # ContentListAPIView returns a list directly, not a paginated dict with 'results'
        if isinstance(response.json(), list):
             content_list = response.json()
        else:
             content_list = response.json().get('results', [])
        
        print(f"Found {len(content_list)} content items.")
        
        if content_list:
            content_item = content_list[0]
            content_id = content_item['id']
            print(f"Selected Content: {content_item['title']} (ID: {content_id})")
        
        # Search Content
        search_payload = {"query": "python"}
        response = session.post(f"{BASE_URL}/api/content/search/", json=search_payload, headers=headers)
        print(f"Search Content Status: {response.status_code}")
    except Exception as e:
        print(f"Error in content: {e}")

    # 5. Engagement
    if content_id:
        print_separator("5. Engagement: View, Like, Save")
        try:
            # View
            response = session.post(f"{BASE_URL}/api/engagement/views/create/", json={"content_item_id": content_id}, headers=headers)
            print(f"Record View Status: {response.status_code}")

            # Like
            response = session.post(f"{BASE_URL}/api/engagement/like/toggle/", json={"content_item_id": content_id}, headers=headers)
            print(f"Toggle Like Status: {response.status_code}")
            print(f"Like Response: {response.json()}")

            # Save
            response = session.post(f"{BASE_URL}/api/engagement/saves/toggle/", json={"content_item_id": content_id}, headers=headers)
            print(f"Toggle Save Status: {response.status_code}")
            print(f"Save Response: {response.json()}")

            # Check Liked List
            response = session.get(f"{BASE_URL}/api/engagement/liked/list/", headers=headers)
            print(f"Liked List Status: {response.status_code}")
            
            # UserLikedListAPIView returns a list directly
            if isinstance(response.json(), list):
                 liked_list = response.json()
            else:
                 liked_list = response.json().get('results', [])
            
            print(f"Liked Items Count: {len(liked_list)}")

        except Exception as e:
            print(f"Error in engagement: {e}")

    # 6. Library
    if content_id:
        print_separator("6. Library: Folders & Items")
        folder_id = None
        try:
            # Create Folder
            folder_name = f"My Folder {generate_random_string(4)}"
            response = session.post(f"{BASE_URL}/api/library/folders/create/", json={"name": folder_name}, headers=headers)
            print(f"Create Folder Status: {response.status_code}")
            if response.status_code == 201:
                folder_data = response.json()
                folder_id = folder_data['id']
                print(f"Folder Created: {folder_name} (ID: {folder_id})")

            # Add Item to Folder
            if folder_id:
                response = session.post(f"{BASE_URL}/api/library/folders/{folder_id}/add-item/", json={"content_item_id": content_id}, headers=headers)
                print(f"Add Item Status: {response.status_code}")
                
            # List Folders
            response = session.get(f"{BASE_URL}/api/library/folders/", headers=headers)
            print(f"List Folders Status: {response.status_code}")

        except Exception as e:
            print(f"Error in library: {e}")

    # 7. Account & Settings
    print_separator("7. Account & Settings")
    try:
        # Get Profile
        response = session.get(f"{BASE_URL}/api/account/profile/", headers=headers)
        print(f"Get Profile Status: {response.status_code}")
        print(f"Profile: {response.json()}")

        # Get Settings
        response = session.get(f"{BASE_URL}/api/settings/user-settings/", headers=headers)
        print(f"Get Settings Status: {response.status_code}")
        print(f"Settings: {response.json()}")

    except Exception as e:
        print(f"Error in account/settings: {e}")

    print_separator("Test Complete")

if __name__ == "__main__":
    try:
        requests.get(BASE_URL)
        print("Server is reachable.")
        run_test()
    except requests.exceptions.ConnectionError:
        print(f"Could not connect to {BASE_URL}. Is the server running?")
