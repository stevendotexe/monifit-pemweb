import requests
from datetime import datetime
import json
import time  # Add this import at the top

# ==============================================================================
# Configuration
# ==============================================================================

# IMPORTANT: Replace 'YOUR_API_KEY_HERE' with your actual API key from data.gov
# You can sign up for a free API key at https://fdc.nal.usda.gov/api-key-signup
API_KEY = 'MafN3h2EyhcbAV6oXylEgzqHw4QXjFeEVfQGuNpN'

# Base URL for the USDA FoodData Central API
BASE_URL = "https://api.nal.usda.gov/fdc/v1"

# Nutrient IDs for common macronutrients in FoodData Central API
# These IDs are crucial for extracting the correct nutrient values.
NUTRIENT_IDS = {
    "calories": 1008,  # Energy (KCAL)
    "protein_g": 1003, # Protein (g)
    "carbs_g": 1005,   # Carbohydrate, by difference (g)
    "fat_g": 1004      # Total lipid (fat) (g)
}

# Define the maximum number of items to fetch
MAX_FETCH_LIMIT = 20

# Define the page size for API requests (USDA default is 50)
PAGE_SIZE = 50

# Output SQL file name
SQL_OUTPUT_FILE = "food_nutrition_inserts.sql"

# ==============================================================================
# Helper Functions
# ==============================================================================

def get_nutrient_value(food_nutrients, nutrient_id):
    """
    Extracts the value for a specific nutrient from the foodNutrients list.

    Args:
        food_nutrients (list): A list of nutrient dictionaries from the API response.
        nutrient_id (int): The ID of the nutrient to find (e.g., 1008 for calories).

    Returns:
        float or None: The nutrient value if found, otherwise None.
    """
    for nutrient in food_nutrients:
        if nutrient.get("nutrientId") == nutrient_id:
            # Return the amount, formatted to two decimal places
            return round(float(nutrient.get("amount", 0.0)), 2)
    return None

def fetch_food_details(fdc_id, api_key):
    """
    Fetches detailed information for a single food item by its FDC ID.

    Args:
        fdc_id (int): The FDC ID of the food item.
        api_key (str): Your USDA FoodData Central API key.

    Returns:
        dict or None: Detailed food data if successful, otherwise None.
    """
    url = f"{BASE_URL}/food/{fdc_id}"
    params = {
        "api_key": api_key,
        "format": "full"  # Request full details for all nutrients
    }
    try:
        response = requests.get(url, params=params, timeout=10) # Added timeout for robustness
        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx or 5xx)
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching details for FDC ID {fdc_id}: {e}")
        return None

def escape_sql_string(value):
    """
    Escapes single quotes in a string to prevent SQL injection issues.
    """
    if value is None:
        return 'NULL'
    return str(value).replace("'", "''")

def generate_sql_inserts(food_data_list, table_name="food_items"):
    """
    Generates SQL INSERT statements from a list of food data dictionaries.

    Args:
        food_data_list (list): A list of dictionaries, where each dictionary
                               represents a food item mapped to the database schema.
        table_name (str): The name of your database table.

    Returns:
        list: A list of SQL INSERT strings.
    """
    sql_statements = []
    for item in food_data_list:
        # Construct the SQL INSERT statement
        # Ensure values are properly quoted/formatted for SQL
        statement = (
            f"INSERT INTO `{table_name}` (`id`, `name`, `description`, `calories`, "
            f"`protein_g`, `carbs_g`, `fat_g`, `category`, `is_vegetarian`, "
            f"`is_vegan`, `is_gluten_free`, `created_at`, `updated_at`) VALUES (\n"
            f"    {item['id']},\n"
            f"    '{escape_sql_string(item['name'])}',\n"
            f"    '{escape_sql_string(item['description'])}',\n"
            f"    {item['calories']:.2f},\n" # Format decimals
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

# ==============================================================================
# Main Data Fetching Function
# ==============================================================================

def get_food_data(search_query: str, api_key: str, limit: int = MAX_FETCH_LIMIT):
    """
    Fetches food nutrition data from the USDA FoodData Central API and maps it
    to the specified database schema.

    Args:
        search_query (str): The keyword to search for food items (e.g., "apple", "chicken breast").
        api_key (str): Your USDA FoodData Central API key.
        limit (int): The maximum number of food items to retrieve.

    Returns:
        list: A list of dictionaries, where each dictionary represents a food item
              mapped to the database schema.
    """
    if not api_key or api_key == 'YOUR_API_KEY_HERE':
        print("Error: API_KEY is not set. Please replace 'YOUR_API_KEY_HERE' with your actual API key.")
        return []

    food_items = []
    page_number = 1
    start_time = time.time()

    print(f"Searching for '{search_query}' with a limit of {limit} items...")

    while len(food_items) < limit:
        search_url = f"{BASE_URL}/foods/search"
        search_params = {
            "api_key": api_key,
            "query": search_query,
            "pageSize": PAGE_SIZE,
            "pageNumber": page_number
        }

        try:
            print(f"Fetching page {page_number}...")
            response = requests.get(search_url, params=search_params, timeout=10)
            response.raise_for_status()
            search_results = response.json()

            # The 'foods' key contains the list of abridged food items
            foods_on_page = search_results.get("foods", [])

            if not foods_on_page:
                print("No more foods found or end of results reached.")
                break

            for abridged_food in foods_on_page:
                if len(food_items) >= limit:
                    break

                fdc_id = abridged_food.get("fdcId")
                if not fdc_id:
                    continue

                # Add a small delay between API calls to respect rate limits
                time.sleep(0.5)  # 500ms delay between requests

                detailed_food = fetch_food_details(fdc_id, api_key)

                if detailed_food:
                    # Print raw food data for debugging
                    print(f"\nRaw food data for {detailed_food.get('description', 'N/A')}:")
                    print(json.dumps(detailed_food, indent=2))
                    print("-" * 80)

                    # Extract nutrients
                    nutrients = detailed_food.get("foodNutrients", [])
                    calories = get_nutrient_value(nutrients, NUTRIENT_IDS["calories"])
                    protein = get_nutrient_value(nutrients, NUTRIENT_IDS["protein_g"])
                    carbs = get_nutrient_value(nutrients, NUTRIENT_IDS["carbs_g"])
                    fat = get_nutrient_value(nutrients, NUTRIENT_IDS["fat_g"])

                    # Print nutrient data for debugging
                    print(f"Extracted nutrients:")
                    print(f"Calories: {calories}")
                    print(f"Protein: {protein}")
                    print(f"Carbs: {carbs}")
                    print(f"Fat: {fat}")
                    print("-" * 80)

                    # Skip if any of the required nutrients are missing
                    if any(nutrient is None for nutrient in [calories, protein, carbs, fat]):
                        print(f"Skipping {detailed_food.get('description', 'N/A')} - Missing nutritional data")
                        continue

                    food_data = {
                        "id": fdc_id,
                        "name": detailed_food.get("description", "N/A"),
                        "description": f"{detailed_food.get('foodClass', '')} {detailed_food.get('dataType', '')}".strip(),
                        "calories": calories,
                        "protein_g": protein,
                        "carbs_g": carbs,
                        "fat_g": fat,
                        "category": detailed_food.get("dataType", "Unknown"),
                        "is_vegetarian": 0,
                        "is_vegan": 0,
                        "is_gluten_free": 0,
                        "created_at": datetime.now().isoformat(timespec='seconds'),
                        "updated_at": datetime.now().isoformat(timespec='seconds')
                    }
                    food_items.append(food_data)
                    
                    # Calculate and display progress
                    elapsed_time = time.time() - start_time
                    items_per_second = len(food_items) / elapsed_time if elapsed_time > 0 else 0
                    print(f"Added food: {food_data['name']} (ID: {food_data['id']}). "
                          f"Total fetched: {len(food_items)}. "
                          f"Rate: {items_per_second:.2f} items/sec")
                    print(f"Nutrition per serving: "
                          f"Calories: {food_data['calories']} kcal, "
                          f"Protein: {food_data['protein_g']}g, "
                          f"Carbs: {food_data['carbs_g']}g, "
                          f"Fat: {food_data['fat_g']}g")
                    print("-" * 80)

            if len(foods_on_page) < PAGE_SIZE:
                print("Last page of search results reached.")
                break

            page_number += 1
            # Add a small delay between pages
            time.sleep(1)  # 1 second delay between pages

        except requests.exceptions.HTTPError as http_err:
            print(f"HTTP error occurred: {http_err} - {response.text}")
            # If we hit a rate limit, wait longer and retry
            if response.status_code == 429:  # Too Many Requests
                print("Rate limit hit. Waiting 60 seconds before retrying...")
                time.sleep(60)
                continue
            break
        except requests.exceptions.ConnectionError as conn_err:
            print(f"Connection error occurred: {conn_err}")
            time.sleep(5)  # Wait 5 seconds before retrying
            continue
        except requests.exceptions.Timeout as timeout_err:
            print(f"Timeout error occurred: {timeout_err}")
            time.sleep(5)  # Wait 5 seconds before retrying
            continue
        except requests.exceptions.RequestException as req_err:
            print(f"An unexpected request error occurred: {req_err}")
            break
        except json.JSONDecodeError as json_err:
            print(f"JSON decoding error: {json_err} in response: {response.text}")
            break
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            break

    total_time = time.time() - start_time
    print(f"\nFinished fetching data for '{search_query}'. "
          f"Total items fetched: {len(food_items)} (out of requested {limit}). "
          f"Total time: {total_time:.2f} seconds. "
          f"Average rate: {len(food_items)/total_time:.2f} items/sec")
    return food_items

# ==============================================================================
# Example Usage
# ==============================================================================

if __name__ == "__main__":
    print(f"--- Starting data fetch and SQL export for '{SQL_OUTPUT_FILE}' ---")
    
    # List of food queries to search for
    food_queries = [
        # Fruits
        "apple", "banana", "orange", "berry", "grape", "melon", "citrus fruit",
        # Vegetables
        "leafy green", "root vegetable", "cruciferous vegetable", "tomato", "potato",
        # Meats
        "beef", "pork", "chicken", "turkey", "lamb", "processed meat",
        # Dairy
        "milk", "cheese", "yogurt", "butter", "cream",
        # Grains
        "rice", "wheat", "bread", "pasta", "cereal", "quinoa", "oats",
        # Seafood
        "fish", "shellfish", "salmon", "tuna", "shrimp",
        # Nuts and Seeds
        "almond", "walnut", "peanut", "cashew", "chia seed", "flax seed",
        # Legumes
        "bean", "lentil", "pea", "chickpea", "soybean",
        # Other Categories
        "egg", "mushroom", "herb", "spice", "sauce", "condiment",
        "snack food", "dessert", "beverage", "juice", "soup"
    ]
    
    all_fetched_data = []
    
    # Fetch data for each food query
    for query in food_queries:
        print(f"\nFetching data for query: '{query}'")
        fetched_data = get_food_data(search_query=query, api_key=API_KEY, limit=MAX_FETCH_LIMIT)
        if fetched_data:
            all_fetched_data.extend(fetched_data)
            print(f"Successfully fetched {len(fetched_data)} items for '{query}'")
        else:
            print(f"No data found for '{query}'")

    if all_fetched_data:
        # Generate SQL INSERT statements
        sql_statements = generate_sql_inserts(all_fetched_data)

        # Write SQL statements to a file
        try:
            with open(SQL_OUTPUT_FILE, 'w', encoding='utf-8') as f:
                for statement in sql_statements:
                    f.write(statement + "\n\n") # Add double newline for readability between statements
            print(f"\nSuccessfully wrote {len(sql_statements)} SQL INSERT statements to '{SQL_OUTPUT_FILE}'")
            print("You can now use this file to import data into your database.")
        except IOError as e:
            print(f"Error writing to file '{SQL_OUTPUT_FILE}': {e}")
    else:
        print("\nNo data fetched. No SQL file was generated. Please check your API key and network connection.")

    print("\n" + "="*50 + "\n")
