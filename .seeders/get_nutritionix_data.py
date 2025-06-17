import requests
from datetime import datetime
import json
import time
import random  # Add this import at the top

# ==============================================================================
# Configuration
# ==============================================================================

# IMPORTANT: Replace with your actual API credentials from Nutritionix
# Sign up at https://www.nutritionix.com/business/api
APP_ID = 'b080c715'
API_KEY = '739b59581bfb0332ef60e8d7c184a15b'

# Base URL for the Nutritionix API
BASE_URL = "https://trackapi.nutritionix.com/v2"

# Output SQL file name
SQL_OUTPUT_FILE = "food_nutrition_nutritionix.sql"

# Define the maximum number of items to fetch
MAX_FETCH_LIMIT = 450

# ==============================================================================
# Helper Functions
# ==============================================================================

def escape_sql_string(value):
    """
    Escapes single quotes in a string to prevent SQL injection issues.
    """
    if value is None:
        return 'NULL'
    return str(value).replace("'", "''")

def generate_sql_inserts(food_data_list, table_name="pre_added_foods"):
    """
    Generates SQL INSERT statements from a list of food data dictionaries.
    """
    sql_statements = []
    for item in food_data_list:
        statement = (
            f"INSERT INTO `{table_name}` (`id`, `name`, `description`, `calories`, "
            f"`protein_g`, `carbs_g`, `fat_g`, `category`, `is_vegetarian`, "
            f"`is_vegan`, `is_gluten_free`, `created_at`, `updated_at`) VALUES (\n"
            f"    {item['id']},\n"
            f"    '{escape_sql_string(item['name'])}',\n"
            f"    '{escape_sql_string(item['description'])}',\n"
            f"    {item['calories']:.2f},\n"
            f"    {item['protein_g']:.2f},\n"
            f"    {item['carbs_g']:.2f},\n"
            f"    {item['fat_g']:.2f},\n"
            f"    '{escape_sql_string(item['category'])}',\n"
            f"    {item['is_vegetarian']},\n"
            f"    {item['is_vegan']},\n"
            f"    {item['is_gluten_free']},\n"
            f"    '{item['created_at']}',\n"
            f"    '{item['updated_at']}'\n"
            f");"
        )
        sql_statements.append(statement)
    return sql_statements

def fetch_food_data(query: str, app_id: str, api_key: str, max_retries: int = 3):
    """
    Fetches food nutrition data from the Nutritionix API with retry logic.
    """
    headers = {
        'x-app-id': app_id,
        'x-app-key': api_key,
        'Content-Type': 'application/json'
    }
    
    data = {
        'query': query,
        'timezone': 'US/Eastern'
    }
    
    # First API call - Search endpoint
    for attempt in range(max_retries):
        try:
            search_url = f"{BASE_URL}/search/instant"
            search_params = {'query': query}
            print(f"API Call 1/2: Searching for '{query}' (Attempt {attempt + 1}/{max_retries})")
            search_response = requests.get(
                search_url,
                headers=headers,
                params=search_params,
                timeout=10
            )
            search_response.raise_for_status()
            search_data = search_response.json()
            
            if not search_data.get('common'):
                print(f"No results found for '{query}'")
                return None
                
            # Get the first result's food name
            first_result = search_data['common'][0]
            food_name = first_result.get('food_name')
            
            if not food_name:
                print(f"No food name found in search results for '{query}'")
                return None
            
            # Second API call - Nutrition endpoint
            for nutrition_attempt in range(max_retries):
                try:
                    nutrition_url = f"{BASE_URL}/natural/nutrients"
                    print(f"API Call 2/2: Getting nutrition for '{food_name}' (Attempt {nutrition_attempt + 1}/{max_retries})")
                    nutrition_response = requests.post(
                        nutrition_url,
                        headers=headers,
                        json={'query': food_name},
                        timeout=10
                    )
                    nutrition_response.raise_for_status()
                    return nutrition_response.json()
                except requests.exceptions.RequestException as e:
                    if nutrition_attempt < max_retries - 1:
                        print(f"Nutrition API call failed, retrying... ({e})")
                        time.sleep(1)  # Wait before retry
                    else:
                        print(f"Failed to get nutrition data after {max_retries} attempts: {e}")
                        return None
                        
        except requests.exceptions.RequestException as e:
            if attempt < max_retries - 1:
                print(f"Search API call failed, retrying... ({e})")
                time.sleep(1)  # Wait before retry
            else:
                print(f"Failed to search after {max_retries} attempts: {e}")
                return None
        except json.JSONDecodeError as e:
            print(f"Error parsing response for '{query}': {e}")
            return None

def generate_random_id():
    """
    Generates a random 12-digit number as a string.
    """
    return str(random.randint(100000000000, 999999999999))

def get_food_data(search_queries: list, app_id: str, api_key: str, limit: int = MAX_FETCH_LIMIT):
    """
    Fetches food nutrition data for multiple queries.
    """
    if not app_id or app_id == 'YOUR_APP_ID_HERE' or not api_key or api_key == 'YOUR_API_KEY_HERE':
        print("Error: APP_ID and API_KEY must be set. Please replace the placeholder values with your actual credentials.")
        return []

    food_items = []
    start_time = time.time()
    used_ids = set()  # Keep track of used IDs to ensure uniqueness
    
    # Add counters for statistics
    total_queries = len(search_queries)
    found_items = 0
    not_found_items = 0
    skipped_items = 0
    total_api_calls = 0

    print(f"Starting data fetch for {total_queries} queries...")

    for query in search_queries:
        print(f"\nFetching data for: '{query}'")
        
        # Add a small delay between requests to respect rate limits
        time.sleep(.3)  # 300ms delay between requests
        
        data = fetch_food_data(query, app_id, api_key)
        total_api_calls += 2  # Each query makes 2 API calls
        
        if data:
            foods = data.get('foods', [])
            if not foods:
                not_found_items += 1
                print(f"No data found for: {query}")
                continue
                
            for food in foods:
                if len(food_items) >= limit:
                    break

                try:
                    # Extract nutritional information
                    nutrients = food.get('full_nutrients', [])

                    # Get macronutrients
                    calories = food.get('nf_calories')
                    protein = food.get('nf_protein')
                    carbs = food.get('nf_total_carbohydrate')
                    fat = food.get('nf_total_fat')

                    # Skip if any required nutrient is missing
                    if any(nutrient is None for nutrient in [calories, protein, carbs, fat]):
                        skipped_items += 1
                        print(f"Skipping {food.get('food_name', 'N/A')} - Missing nutritional data")
                        continue

                    # Generate a unique random ID
                    while True:
                        random_id = generate_random_id()
                        if random_id not in used_ids:
                            used_ids.add(random_id)
                            break

                    food_data = {
                        "id": random_id,
                        "name": food.get('food_name', 'N/A'),
                        "description": f"Nutritionix data for {food.get('food_name', 'N/A')}",
                        "calories": float(calories),
                        "protein_g": float(protein),
                        "carbs_g": float(carbs),
                        "fat_g": float(fat),
                        "category": query,  # Using the search query as category
                        "is_vegetarian": 0,  # Default values as Nutritionix doesn't provide this info
                        "is_vegan": 0,
                        "is_gluten_free": 0,
                        "created_at": datetime.now().isoformat(timespec='seconds'),
                        "updated_at": datetime.now().isoformat(timespec='seconds')
                    }
                    
                    food_items.append(food_data)
                    found_items += 1
                    
                    # Print simplified food data
                    print(f"Added data: {food_data['name']}, {food_data['calories']:.0f} calories, "
                          f"{food_data['fat_g']:.1f} gr fat, {food_data['carbs_g']:.1f} gr carbs, "
                          f"{food_data['protein_g']:.1f} gr proteins")

                except (ValueError, TypeError) as e:
                    skipped_items += 1
                    print(f"Error processing item {food.get('food_name', 'N/A')}: {e}")
                    continue
        else:
            not_found_items += 1
            print(f"No data found for: {query}")

    total_time = time.time() - start_time
    print(f"\nFetching Statistics:")
    print(f"Total queries: {total_queries}")
    print(f"Total API calls: {total_api_calls}")
    print(f"Successfully found: {found_items}")
    print(f"Not found: {not_found_items}")
    print(f"Skipped (missing data): {skipped_items}")
    print(f"Total time: {total_time:.2f} seconds")
    print(f"Average rate: {len(food_items)/total_time:.2f} items/sec")
    return food_items

# ==============================================================================
# Main Execution
# ==============================================================================

if __name__ == "__main__":
    print(f"--- Starting data fetch and SQL export for '{SQL_OUTPUT_FILE}' ---")
    
    # List of food queries to search for
    food_queries = [        
        # Mediterranean Dishes
        "greek salad", "falafel", "shawarma", "moussaka", "spanakopita",
        "tabbouleh", "baba ganoush", "dolma", "fattoush", "shakshuka",
        
        # Korean Cuisine
        "bibimbap", "kimchi jjigae", "bulgogi", "japchae", "tteokbokki",
        "samgyeopsal", "sundubu jjigae", "galbi", "pajeon", "dakgalbi",
        
        # Vietnamese Cuisine
        "pho", "banh mi", "spring rolls", "bun cha", "com tam",
        "cao lau", "banh xeo", "mi quang", "cha ca", "bun bo hue",
        
        # Thai Cuisine
        "pad thai", "green curry", "tom yum", "massaman curry", "som tam",
        "pad kra pao", "khao soi", "tom kha gai", "pad see ew", "mango sticky rice",
        
        # Vegetarian Mains
        "mushroom risotto", "eggplant parmesan", "black bean burger", "chickpea curry", "vegetable lasagna",
        "stuffed peppers", "lentil loaf", "portobello steak", "tempeh stir fry", "jackfruit tacos",
        
        # Comfort Foods
        "mac and cheese", "chicken pot pie", "beef stew", "meatloaf", "grilled cheese",
        "shepherd's pie", "chicken noodle soup", "baked ziti", "pot roast", "beef stroganoff"
    ]
    
    # Fetch data for all queries
    fetched_data = get_food_data(food_queries, APP_ID, API_KEY, MAX_FETCH_LIMIT)

    if fetched_data:
        # Generate SQL INSERT statements
        sql_statements = generate_sql_inserts(fetched_data)

        # Write SQL statements to a file
        try:
            with open(SQL_OUTPUT_FILE, 'w', encoding='utf-8') as f:
                for statement in sql_statements:
                    f.write(statement + "\n\n")
            # print(f"\nSuccessfully wrote {len(sql_statements)} SQL INSERT statements to '{SQL_OUTPUT_FILE}'")
            # print("You can now use this file to import data into your database.")
        except IOError as e:
            print(f"Error writing to file '{SQL_OUTPUT_FILE}': {e}")
    else:
        print("\nNo data fetched. No SQL file was generated. Please check your API credentials and network connection.")

    print("\n" + "="*50 + "\n") 