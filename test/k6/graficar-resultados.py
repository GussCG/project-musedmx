import json
import pandas as pd
import matplotlib.pyplot as plt

data = []
with open("auth-results.json", "r", encoding="utf-8") as f:
    for line in f:
        obj = json.loads(line)
        if obj["type"] == "Point" and obj["metric"] == "vus":
            data.append({
                "timestamp": obj["data"]["time"],
                "value": obj["data"]["value"]
            })

# Convertir a DataFrame
df = pd.DataFrame(data)
df["timestamp"] = pd.to_datetime(df["timestamp"])
df.set_index("timestamp", inplace=True)

# Graficar
plt.figure(figsize=(12, 6))
plt.plot(df.index, df["value"], marker="o")
plt.title("Usuarios Virtuales (VUs) a lo largo del tiempo")
plt.xlabel("Tiempo")
plt.ylabel("VUs")
plt.grid(True)
plt.tight_layout()
plt.show()