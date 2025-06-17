import random
import re

print("line 3")

def randomize_ids():
    # Read the SQL file
    with open('data.sql', 'r') as file:
        print("file read")
        lines = file.readlines()

    # Collect all lines that contain data
    data_lines = []
    current_insert = []
    for line in lines:
        if 'INSERT INTO' in line:
            # If we have collected lines from previous INSERT, add them
            if current_insert:
                data_lines.extend(current_insert)
                current_insert = []
            # Start new collection with INSERT line
            current_insert = [line]
        elif line.strip().startswith('('):
            # Add data lines to current collection
            current_insert.append(line)
        elif current_insert and line.strip() == '':
            # Empty line marks end of current INSERT
            data_lines.extend(current_insert)
            current_insert = []
    
    # Add any remaining lines
    if current_insert:
        data_lines.extend(current_insert)

    # Separate INSERT statements from data rows
    insert_statements = [line for line in data_lines if 'INSERT INTO' in line]
    data_rows = [line for line in data_lines if line.strip().startswith('(')]

    # Generate new unique 12-digit IDs
    used_ids = set()
    def generate_new_id():
        while True:
            new_id = random.randint(100000000000, 999999999999)
            if new_id not in used_ids:
                used_ids.add(new_id)
                return new_id

    # Replace old IDs with new ones in each data row
    new_data_rows = []
    for row in data_rows:
        # Find the first number in the row (the ID)
        old_id = re.search(r'\((\d+),', row).group(1)
        new_id = generate_new_id()
        print(f"Replacing ID {old_id} with {new_id}")
        new_row = re.sub(r'\((\d+),', f'({new_id},', row, 1)
        new_data_rows.append(new_row)

    # Randomly shuffle the modified data rows
    random.shuffle(new_data_rows)

    # Reconstruct the file content
    new_content = []
    current_insert_idx = 0
    
    # Add each INSERT statement followed by its shuffled data rows
    rows_per_insert = len(new_data_rows) // len(insert_statements)
    for i, insert_stmt in enumerate(insert_statements):
        new_content.append(insert_stmt)
        start_idx = i * rows_per_insert
        end_idx = start_idx + rows_per_insert if i < len(insert_statements) - 1 else len(new_data_rows)
        
        # Add the rows for this INSERT statement
        for row in new_data_rows[start_idx:end_idx]:
            new_content.append(row)
        new_content.append('\n')  # Add spacing between INSERT blocks

    # Write the modified content back to a new file
    with open('datar.sql', 'w') as file:
        file.writelines(new_content)

if __name__ == "__main__":
    randomize_ids()
