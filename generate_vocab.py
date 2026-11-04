import json
import re
import urllib.request
import os

OUTPUT_PATH = os.path.join("src", "data", "vocabulary.json")
os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

CURATED_MODULES = {
    "1. Essential Phrases & Social": [
        ("phrase", "Guten Morgen", "good morning"),
        ("phrase", "Guten Tag", "hello"),
        ("phrase", "Guten Abend", "good evening"),
        ("phrase", "Gute Nacht", "good night"),
        ("phrase", "Auf Wiedersehen", "goodbye"),
        ("phrase", "Tschüss", "bye"),
        ("phrase", "Bitte", "please"),
        ("phrase", "Danke schön", "thank you"),
        ("phrase", "Vielen Dank", "thank you very much"),
        ("phrase", "Bitte sehr", "you are welcome"),
        ("phrase", "Entschuldigung", "excuse me"),
        ("phrase", "Es tut mir leid", "i am sorry"),
        ("phrase", "Wie geht es Ihnen?", "how are you"),
        ("phrase", "Wie geht's?", "how are you"),
        ("phrase", "Mir geht es gut", "i am doing well"),
        ("phrase", "Nicht so gut", "not so good"),
        ("phrase", "Wie heißen Sie?", "what is your name"),
        ("phrase", "Ich heiße...", "my name is"),
        ("phrase", "Woher kommen Sie?", "where are you from"),
        ("phrase", "Ich komme aus...", "i come from"),
        ("phrase", "Sprechen Sie Englisch?", "do you speak english"),
        ("phrase", "Ich verstehe nicht", "i do not understand"),
        ("phrase", "Können Sie das wiederholen?", "can you repeat that"),
        ("phrase", "Ich weiß nicht", "i do not know"),
        ("phrase", "Ja", "yes"),
        ("phrase", "Nein", "no"),
        ("phrase", "Vielleicht", "maybe"),
        ("phrase", "Kein Problem", "no problem"),
        ("phrase", "Bis später", "see you later"),
        ("phrase", "Bis morgen", "see you tomorrow")
    ],
    "2. Food, Dining & Market": [
        ("noun", "Apfel", "der", "apple"),
        ("noun", "Brot", "das", "bread"),
        ("noun", "Brötchen", "das", "bread roll"),
        ("noun", "Käse", "der", "cheese"),
        ("noun", "Milch", "die", "milk"),
        ("noun", "Wasser", "das", "water"),
        ("noun", "Kaffee", "der", "coffee"),
        ("noun", "Tee", "der", "tea"),
        ("noun", "Bier", "das", "beer"),
        ("noun", "Wein", "der", "wine"),
        ("noun", "Fleisch", "das", "meat"),
        ("noun", "Fisch", "der", "fish"),
        ("noun", "Suppe", "die", "soup"),
        ("noun", "Salat", "der", "salad"),
        ("noun", "Ei", "das", "egg"),
        ("noun", "Butter", "die", "butter"),
        ("noun", "Zucker", "der", "sugar"),
        ("noun", "Salz", "das", "salt"),
        ("noun", "Pfeffer", "der", "pepper"),
        ("noun", "Reis", "der", "rice"),
        ("noun", "Kartoffel", "die", "potato"),
        ("noun", "Gemüse", "das", "vegetables"),
        ("noun", "Obst", "das", "fruit"),
        ("noun", "Rechnung", "die", "bill"),
        ("noun", "Speisekarte", "die", "menu"),
        ("noun", "Kellner", "der", "waiter"),
        ("phrase", "Die Rechnung, bitte", "the check please"),
        ("phrase", "Ich möchte ein Glas Wasser", "i would like a glass of water"),
        ("phrase", "Guten Appetit", "enjoy your meal"),
        ("phrase", "Prost", "cheers")
    ],
    "3. Navigation, Transit & City": [
        ("noun", "Bahnhof", "der", "train station"),
        ("noun", "Flughafen", "der", "airport"),
        ("noun", "Zug", "der", "train"),
        ("noun", "Bus", "der", "bus"),
        ("noun", "U-Bahn", "die", "subway"),
        ("noun", "Straßenbahn", "die", "tram"),
        ("noun", "Fahrkarte", "die", "ticket"),
        ("noun", "Gleis", "das", "platform"),
        ("noun", "Haltestelle", "die", "stop"),
        ("noun", "Straße", "die", "street"),
        ("noun", "Platz", "der", "square"),
        ("noun", "Brücke", "die", "bridge"),
        ("noun", "Stadt", "die", "city"),
        ("noun", "Hotel", "das", "hotel"),
        ("noun", "Zimmer", "das", "room"),
        ("noun", "Schlüssel", "der", "key"),
        ("noun", "Ausgang", "der", "exit"),
        ("noun", "Eingang", "der", "entrance"),
        ("noun", "Weg", "der", "way"),
        ("noun", "Karte", "die", "map"),
        ("phrase", "Wo ist die U-Bahn?", "where is the subway"),
        ("phrase", "Geradeaus", "straight ahead"),
        ("phrase", "Nach links", "to the left"),
        ("phrase", "Nach rechts", "to the right"),
        ("phrase", "Wie komme ich zum Bahnhof?", "how do i get to the station")
    ],
    "4. Living, Home & Everyday Life": [
        ("noun", "Haus", "das", "house"),
        ("noun", "Wohnung", "die", "apartment"),
        ("noun", "Tür", "die", "door"),
        ("noun", "Fenster", "das", "window"),
        ("noun", "Tisch", "der", "table"),
        ("noun", "Stuhl", "der", "chair"),
        ("noun", "Bett", "das", "bed"),
        ("noun", "Küche", "die", "kitchen"),
        ("noun", "Bad", "das", "bathroom"),
        ("noun", "Schrank", "der", "cabinet"),
        ("noun", "Lampe", "die", "lamp"),
        ("noun", "Uhr", "die", "clock"),
        ("noun", "Telefon", "das", "telephone"),
        ("noun", "Buch", "das", "book"),
        ("noun", "Zeitung", "die", "newspaper"),
        ("noun", "Geld", "das", "money"),
        ("noun", "Tasche", "die", "bag"),
        ("noun", "Koffer", "der", "suitcase"),
        ("noun", "Kleidung", "die", "clothing"),
        ("noun", "Schuh", "der", "shoe")
    ],
    "5. Work, Office & Communication": [
        ("noun", "Arbeit", "die", "work"),
        ("noun", "Büro", "das", "office"),
        ("noun", "Kollege", "der", "colleague"),
        ("noun", "Chef", "der", "boss"),
        ("noun", "Computer", "der", "computer"),
        ("noun", "Nachricht", "die", "message"),
        ("noun", "Brief", "der", "letter"),
        ("noun", "Projekt", "das", "project"),
        ("noun", "Termin", "der", "appointment"),
        ("noun", "Frage", "die", "question"),
        ("noun", "Antwort", "die", "answer"),
        ("noun", "Problem", "das", "problem"),
        ("noun", "Lösung", "die", "solution"),
        ("noun", "Vertrag", "der", "contract"),
        ("phrase", "Ich habe eine Frage", "i have a question"),
        ("phrase", "Wann ist der Termin?", "when is the appointment"),
        ("phrase", "Können Sie mir helfen?", "can you help me")
    ],
    "6. Time, Nature & Surroundings": [
        ("noun", "Zeit", "die", "time"),
        ("noun", "Tag", "der", "day"),
        ("noun", "Nacht", "die", "night"),
        ("noun", "Woche", "die", "week"),
        ("noun", "Monat", "der", "month"),
        ("noun", "Jahr", "das", "year"),
        ("noun", "Morgen", "der", "morning"),
        ("noun", "Abend", "der", "evening"),
        ("noun", "Sonne", "die", "sun"),
        ("noun", "Mond", "der", "moon"),
        ("noun", "Wetter", "das", "weather"),
        ("noun", "Regen", "der", "rain"),
        ("noun", "Schnee", "der", "snow"),
        ("noun", "Wind", "der", "wind"),
        ("noun", "Baum", "der", "tree"),
        ("noun", "Wald", "der", "forest"),
        ("noun", "Berg", "der", "mountain"),
        ("noun", "See", "der", "lake"),
        ("noun", "Meer", "das", "sea"),
        ("noun", "Fluss", "der", "river")
    ]
}

dataset = []
item_id = 1

for module_name, items in CURATED_MODULES.items():
    for item in items:
        if item[0] == "phrase":
            dataset.append({
                "id": item_id,
                "type": "phrase",
                "german": item[1],
                "english": item[2],
                "module": module_name
            })
        elif item[0] == "noun":
            dataset.append({
                "id": item_id,
                "type": "noun",
                "german": item[1],
                "gender": item[2],
                "english": item[3],
                "module": module_name
            })
        item_id += 1

print(f"Curated foundational items: {len(dataset)}")

req = urllib.request.Request(
    "https://raw.githubusercontent.com/tiagoporto/german-words/master/words.json",
    headers={"User-Agent": "Mozilla/5.0"}
)

try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        external_words = json.loads(resp.read().decode("utf-8"))
        assigned_words = set(d["german"].lower() for d in dataset)
        
        for entry in external_words:
            if len(dataset) >= 1250:
                break
            
            de = entry.get("de", "").strip()
            en = entry.get("en", "").strip()
            gender = entry.get("gender", "").lower()
            
            if not de or not en or de.lower() in assigned_words:
                continue
            if len(de) > 20 or " " in de or not de[0].isupper():
                continue
                
            if gender in ["der", "die", "das"]:
                dataset.append({
                    "id": item_id,
                    "type": "noun",
                    "german": de,
                    "gender": gender,
                    "english": en.lower(),
                    "module": "General Vocabulary Expansion"
                })
                item_id += 1
                assigned_words.add(de.lower())
except Exception as e:
    print(f"External repo query notice: {e}")

with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    json.dump(dataset, f, ensure_ascii=False, indent=2)

print(f"Total entries compiled: {len(dataset)} -> {OUTPUT_PATH}")