import re

def extract_duration(label: str):
    # Match both 'Pay in full (X months)' and 'X months'
    regex = r"(\d+)\s*(month|months)"
    match = re.search(regex, label)

    if match:
        number = int(match.group(1))  # Extract the number (e.g., 6)
        unit = match.group(2)  # Extract the unit (e.g., month or months)

        # Return formatted string with correct pluralization
        return f"{number} {unit if number == 1 else unit + 's'}"
    
    return None