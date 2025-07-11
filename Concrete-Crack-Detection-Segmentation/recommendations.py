import pandas as pd
import numpy as np

# Data extracted from the provided document, now with added performance metrics
# 'base_healing_pct': Represents the typical or ideal crack healing percentage for the technique.
# 'healing_std_dev': Represents the standard deviation for healing percentage, simulating variability.
healing_data_raw = {
    "Autogenous (natural) healing": {"crack_width": [0, 0.3], "temp": [5, 40], "humidity": [70, 100], "cost": 0, "base_healing_pct": 50, "healing_std_dev": 10},
    "Bacterial Self-Healing Concrete": {"crack_width": [0, 0.5], "temp": [10, 30], "humidity": [50, 90], "cost": 10, "base_healing_pct": 75, "healing_std_dev": 15},
    "Biomimetic Self-Healing": {"crack_width": [0, 0.2], "temp": [10, 30], "humidity": [50, 90], "cost": 80, "base_healing_pct": 80, "healing_std_dev": 10},
    "Bio-Based Coatings": {"crack_width": [0, 0.2], "temp": [0, 40], "humidity": [20, 80], "cost": 25, "base_healing_pct": 65, "healing_std_dev": 12},
    "Cementitious grout injection": {"crack_width": [5, 100], "temp": [5, 30], "humidity": [0, 100], "cost": 20, "base_healing_pct": 95, "healing_std_dev": 5},
    "Colloidal silica injection": {"crack_width": [0, 0.4], "temp": [20, 40], "humidity": [90, 100], "cost": 50, "base_healing_pct": 85, "healing_std_dev": 8},
    "Crack stitching (steel staples)": {"crack_width": [5, 100], "temp": [-50, 100], "humidity": [0, 100], "cost": 50, "base_healing_pct": 98, "healing_std_dev": 2}, # Very high structural repair
    "Crystalline waterproofing": {"crack_width": [0, 0.5], "temp": [-50, 100], "humidity": [70, 100], "cost": 10, "base_healing_pct": 70, "healing_std_dev": 10},
    "Electrochemical (electrodeposition)": {"crack_width": [0, 1], "temp": [10, 40], "humidity": [90, 100], "cost": 200, "base_healing_pct": 88, "healing_std_dev": 7},
    "Epoxy resin injection": {"crack_width": [0, 0.3], "temp": [5, 30], "humidity": [0, 10], "cost": 60, "base_healing_pct": 92, "healing_std_dev": 5},
    "Fungal-Based Self-Healing": {"crack_width": [0, 0.2], "temp": [10, 25], "humidity": [60, 90], "cost": 40, "base_healing_pct": 78, "healing_std_dev": 10},
    "FRP lamination / NSM": {"crack_width": [5, 100], "temp": [5, 35], "humidity": [0, 10], "cost": 80, "base_healing_pct": 97, "healing_std_dev": 3}, # High structural repair
    "Graphene-Based Self-Healing": {"crack_width": [0, 0.2], "temp": [-20, 100], "humidity": [20, 80], "cost": 100, "base_healing_pct": 85, "healing_std_dev": 8},
    "Microbial Induced Carbonate Precipitation (MICP)": {"crack_width": [0, 0.5], "temp": [10, 30], "humidity": [50, 90], "cost": 30, "base_healing_pct": 72, "healing_std_dev": 15},
    "Microcapsule-Based Self-Healing": {"crack_width": [1, 3], "temp": [-20, 50], "humidity": [20, 80], "cost": 50, "base_healing_pct": 90, "healing_std_dev": 5},
    "Nano-Silica-Based Self-Healing": {"crack_width": [0, 0.1], "temp": [-50, 100], "humidity": [0, 100], "cost": 100, "base_healing_pct": 82, "healing_std_dev": 10},
    "Organic-Based Self-Healing": {"crack_width": [0, 0.3], "temp": [0, 40], "humidity": [20, 80], "cost": 20, "base_healing_pct": 70, "healing_std_dev": 12},
    "Plant-Based Self-Healing": {"crack_width": [0, 0.2], "temp": [10, 30], "humidity": [50, 80], "cost": 30, "base_healing_pct": 60, "healing_std_dev": 15},
    "Polymer-Based Self-Healing": {"crack_width": [0, 0.3], "temp": [-20, 100], "humidity": [50, 90], "cost": 30, "base_healing_pct": 88, "healing_std_dev": 7},
    "Shape Memory Alloys (SMAs)": {"crack_width": [0, 0.1], "temp": [-100, 100], "humidity": [0, 100], "cost": 100, "base_healing_pct": 96, "healing_std_dev": 4},
    "SMP tendon (shape-memory polymer)": {"crack_width": [0, 0.3], "temp": [90, 90], "humidity": [0, 100], "cost": 100, "base_healing_pct": 93, "healing_std_dev": 6},
    "Superabsorbent Polymers (SAPs)": {"crack_width": [1, 5], "temp": [0, 40], "humidity": [50, 100], "cost": 5, "base_healing_pct": 70, "healing_std_dev": 10},
    "Vascular Techniques": {"crack_width": [1, 5], "temp": [-20, 1000], "humidity": [0, 100], "cost": 80, "base_healing_pct": 94, "healing_std_dev": 5},
}

def generate_synthetic_data(num_samples_per_technique=100):
    """
    Generates synthetic data for each healing technique based on its defined ranges
    and now includes a simulated Healing_Percentage based on base_healing_pct and std_dev.
    """
    data = []
    for technique, ranges in healing_data_raw.items():
        for _ in range(num_samples_per_technique):
            crack_width = np.random.uniform(ranges["crack_width"][0], ranges["crack_width"][1])
            temperature = np.random.uniform(ranges["temp"][0], ranges["temp"][1])
            humidity = np.random.uniform(ranges["humidity"][0], ranges["humidity"][1])
            cost = ranges["cost"]
            
            # Simulate healing percentage with some noise
            healing_pct = np.random.normal(ranges["base_healing_pct"], ranges["healing_std_dev"])
            healing_pct = max(0, min(100, healing_pct)) # Cap between 0 and 100
            
            data.append([technique, crack_width, temperature, humidity, cost, healing_pct])
    
    df = pd.DataFrame(data, columns=["Technique", "Crack_Width_mm", "Temperature_C", "Humidity_RH", "Cost_USD_per_sqm", "Healing_Percentage"])
    return df

def recommend_healing_agent(crack_width, temperature, humidity, synthetic_data_df):
    """
    Recommends a healing agent technique based on input parameters,
    prioritizing techniques with a good history (higher healing percentage).
    """
    
    # Filter techniques that match the crack width range
    # We allow a small tolerance for crack width to find suitable techniques
    suitable_techniques = synthetic_data_df[
        (synthetic_data_df['Crack_Width_mm'] >= crack_width - 0.1) &
        (synthetic_data_df['Crack_Width_mm'] <= crack_width + 0.1)
    ].copy() # Use .copy() to avoid SettingWithCopyWarning

    if suitable_techniques.empty:
        # If no direct match on crack width, broaden the search to techniques that can handle the crack width
        # This means the crack width falls within the technique's overall range, not just a specific generated point
        
        # Get the min/max crack width for each technique from the raw data
        technique_crack_ranges = {
            tech: raw_data["crack_width"] for tech, raw_data in healing_data_raw.items()
        }
        
        broad_match_techniques = []
        for tech, crack_range in technique_crack_ranges.items():
            if crack_width >= crack_range[0] and crack_width <= crack_range[1]:
                broad_match_techniques.append(tech)
        
        if not broad_match_techniques:
            print(f"DEBUG: No technique found for crack width {crack_width} mm even with broad match.")
            return ["No suitable technique found for the given crack width. Please re-evaluate the crack size."]
        
        # Filter the synthetic data to include only these broadly matching techniques
        suitable_techniques = synthetic_data_df[
            synthetic_data_df['Technique'].isin(broad_match_techniques)
        ].copy()

    print(f"DEBUG: Techniques suitable for crack width {crack_width} mm: {suitable_techniques['Technique'].unique().tolist()}")

    # Now filter by temperature and humidity using the raw data ranges for robustness
    final_recommendations_info = []
    for technique_name in suitable_techniques['Technique'].unique():
        raw_ranges = healing_data_raw[technique_name]
        
        temp_min, temp_max = raw_ranges["temp"]
        humidity_min, humidity_max = raw_ranges["humidity"]

        # Check if the input temperature and humidity fall within the technique's defined range
        temp_match = (temperature >= temp_min) and (temperature <= temp_max)
        humidity_match = (humidity >= humidity_min) and (humidity <= humidity_max)
        
        if temp_match and humidity_match:
            # If applicable, add its base healing percentage and cost for sorting
            final_recommendations_info.append({
                "Technique": technique_name,
                "Base_Healing_Percentage": raw_ranges["base_healing_pct"],
                "Cost_USD_per_sqm": raw_ranges["cost"]
            })
           
    if not final_recommendations_info:
        print(f"DEBUG: No technique found matching temperature {temperature}°C and humidity {humidity}% RH among crack-suitable techniques.")
        return ["No technique found that matches all criteria (crack width, temperature, and humidity)."]
    # Convert to DataFrame for easier sorting
    recommendations_df = pd.DataFrame(final_recommendations_info)
    
    # Sort primarily by Base_Healing_Percentage (descending) and then by Cost (ascending)
    recommendations_df = recommendations_df.sort_values(
        by=["Base_Healing_Percentage", "Cost_USD_per_sqm"],
        ascending=[False, True]
    ).reset_index(drop=True)

    # Extract just the technique names in sorted order and return only the top 3
    sorted_recommendations = recommendations_df["Technique"].tolist()
    return sorted_recommendations