import json
import os

OUTPUT_PATH = os.path.join("src", "data", "vocabulary.json")
os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

# 14 Goethe A1 Thematic Topics
MODULES = [
    {
        "id": "food",
        "name": "1. Essen & Trinken (Food & Drink)",
        "level": "A1",
        "description": "Meals, ingredients, cafe orders, and beverages.",
        "reading": {
            "title": "Im Restaurant Zum BÃ¤ren",
            "text": "Guten Abend! Was mÃ¶chten Sie bestellen? Ich nehme ein Schnitzel mit Kartoffelsalat und ein Glas Wasser. Mein Freund trinkt einen Tee mit Zitrone. Das Essen schmeckt ausgezeichnet. KÃ¶nnen wir bitte zahlen? Zusammen oder getrennt? Zusammen, bitte.",
            "english": "Good evening! What would you like to order? I will take a schnitzel with potato salad and a glass of water. My friend is drinking tea with lemon. The food tastes excellent. Can we pay please? Together or separately? Together, please.",
            "questions": [
                {"q": "Was isst die Person?", "options": ["Eine Suppe", "Ein Schnitzel mit Kartoffelsalat", "Einen Salat", "Nur Brot"], "answer": "Ein Schnitzel mit Kartoffelsalat"},
                {"q": "Wie mÃ¶chten die GÃ¤ste bezahlen?", "options": ["Getrennt", "Zusammen", "Mit Karte nicht mÃ¶glich", "SpÃ¤ter"], "answer": "Zusammen"}
            ]
        },
        "vocab": [
            {"id": 101, "german": "Kaffee", "gender": "der", "english": "coffee", "type": "noun", "level": "A1", "example": "Ich trinke morgens einen heiÃŸen Kaffee.", "example_en": "I drink a hot coffee in the morning.", "tip": "Hot brewed drinks take masculine ('der')."},
            {"id": 102, "german": "Tee", "gender": "der", "english": "tea", "type": "noun", "level": "A1", "example": "MÃ¶chten Sie grÃ¼nen Tee?", "example_en": "Would you like green tea?", "tip": "Hot brewed drinks take masculine ('der')."},
            {"id": 103, "german": "Wasser", "gender": "das", "english": "water", "type": "noun", "level": "A1", "example": "Ein kaltes Wasser, bitte.", "example_en": "A cold water, please.", "tip": "Cognate Shift: t -> ss (water -> Wasser). Base liquids take 'das'."},
            {"id": 104, "german": "Milch", "gender": "die", "english": "milk", "type": "noun", "level": "A1", "example": "Die Milch steht im KÃ¼hlschrank.", "example_en": "The milk is in the fridge.", "tip": "Cognate Shift: k -> ch (milk -> Milch). Biological dairy takes 'die'."},
            {"id": 105, "german": "Brot", "gender": "das", "english": "bread", "type": "noun", "level": "A1", "example": "Das Brot ist frisch gebacken.", "example_en": "The bread is freshly baked.", "tip": "Cognate Shift: d -> t (bread -> Brot). Core staples default to 'das'."},
            {"id": 106, "german": "BrÃ¶tchen", "gender": "das", "english": "bread roll", "type": "noun", "level": "A1", "example": "Zwei BrÃ¶tchen bitte.", "example_en": "Two rolls please.", "tip": "Suffix Rule: -chen is 100% neuter ('das')."},
            {"id": 107, "german": "KÃ¤se", "gender": "der", "english": "cheese", "type": "noun", "level": "A1", "example": "Der KÃ¤se schmeckt wÃ¼rzig.", "example_en": "The cheese tastes tangy.", "tip": "Solid fermented dairy takes masculine ('der')."},
            {"id": 108, "german": "Fleisch", "gender": "das", "english": "meat", "type": "noun", "level": "A1", "example": "Ich esse kein Fleisch.", "example_en": "I eat no meat.", "tip": "Cognate: Related to English 'flesh'. Unprocessed mass protein takes 'das'."},
            {"id": 109, "german": "Fisch", "gender": "der", "english": "fish", "type": "noun", "level": "A1", "example": "Der Fisch ist sehr frisch.", "example_en": "The fish is very fresh.", "tip": "Direct Cognate. Whole animal creatures often take 'der'."},
            {"id": 110, "german": "Apfel", "gender": "der", "english": "apple", "type": "noun", "level": "A1", "example": "Ein roter Apfel liegt auf dem Tisch.", "example_en": "A red apple is on the table.", "tip": "Shift: p -> pf (apple -> Apfel). Fresh tree fruits take 'der'."},
            {"id": 111, "german": "Rechnung", "gender": "die", "english": "bill / check", "type": "noun", "level": "A1", "example": "Die Rechnung bitte!", "example_en": "The check please!", "tip": "Suffix Rule: -ung is 100% feminine ('die')."}
        ]
    },
    {
        "id": "shopping",
        "name": "2. Einkaufen & Markt (Shopping & Market)",
        "level": "A1",
        "description": "Supermarket, prices, payment, and quantities.",
        "reading": {
            "title": "Auf dem Wochenmarkt",
            "text": "Heute gehe ich auf den Markt. Ich brauche zwei Kilo Ã„pfel, eine Flasche Ã–l und ein StÃ¼ck KÃ¤se. Wie teuer sind die Tomaten? Ein Kilo kostet drei Euro. Das ist gÃ¼nstig. Ich bezahle mit Bargeld.",
            "english": "Today I go to the market. I need two kilos of apples, a bottle of oil and a piece of cheese. How expensive are the tomatoes? One kilo costs three euros. That is reasonable. I pay with cash.",
            "questions": [
                {"q": "Was kauft die Person auf dem Markt?", "options": ["Schuhe", "Ã„pfel, Ã–l und KÃ¤se", "Einen Tisch", "BÃ¼cher"], "answer": "Ã„pfel, Ã–l und KÃ¤se"},
                {"q": "Wie bezahlt die Person?", "options": ["Mit Kreditkarte", "Mit Bargeld", "Mit Scheck", "Gar nicht"], "answer": "Mit Bargeld"}
            ]
        },
        "vocab": [
            {"id": 201, "german": "Supermarkt", "gender": "der", "english": "supermarket", "type": "noun", "level": "A1", "example": "Der Supermarkt schlieÃŸt um 20 Uhr.", "example_en": "The supermarket closes at 8 PM.", "tip": "Compound: der Markt governs gender -> der Supermarkt."},
            {"id": 202, "german": "Preis", "gender": "der", "english": "price", "type": "noun", "level": "A1", "example": "Der Preis ist sehr hoch.", "example_en": "The price is very high.", "tip": "Direct Cognate. Monetary indicators take 'der'."},
            {"id": 203, "german": "Geld", "gender": "das", "english": "money", "type": "noun", "level": "A1", "example": "Ich habe kein Bargeld dabei.", "example_en": "I have no cash on me.", "tip": "Mass financial concept takes 'das'."},
            {"id": 204, "german": "Flasche", "gender": "die", "english": "bottle", "type": "noun", "level": "A1", "example": "Eine Flasche Mineralwasser.", "example_en": "A bottle of mineral water.", "tip": "Cognate Shift: sk -> sch (flask -> Flasche). Ends in -e -> 'die'."},
            {"id": 205, "german": "Kilo", "gender": "das", "english": "kilo", "type": "noun", "level": "A1", "example": "Ein Kilo Bananen bitte.", "example_en": "One kilo of bananas please.", "tip": "Metric measurement abbreviations take neuter ('das')."}
        ]
    },
    {
        "id": "housing",
        "name": "3. Wohnen & Haushalt (Housing & Household)",
        "level": "A1",
        "description": "Rooms, furniture, household items, and rent.",
        "reading": {
            "title": "Unsere Wohnung in Berlin",
            "text": "Wir haben eine Dreizimmerwohnung gemietet. Das Wohnzimmer ist groÃŸ und sonnig. Die KÃ¼che hat einen Herd, einen KÃ¼hlschrank und eine SpÃ¼lmaschine. Das Bad hat eine Dusche, aber keine Badewanne. Die Miete betrÃ¤gt achthundert Euro im Monat.",
            "english": "We rented a three-room apartment. The living room is large and sunny. The kitchen has a stove, a refrigerator and a dishwasher. The bathroom has a shower, but no bathtub. The rent is eight hundred euros per month.",
            "questions": [
                {"q": "Wie viele Zimmer hat die Wohnung?", "options": ["Zwei", "Drei", "Vier", "FÃ¼nf"], "answer": "Drei"},
                {"q": "Was gibt es im Bad?", "options": ["Nur eine Badewanne", "Eine Dusche", "Eine Waschmaschine", "Nichts"], "answer": "Eine Dusche"}
            ]
        },
        "vocab": [
            {"id": 301, "german": "Haus", "gender": "das", "english": "house", "type": "noun", "level": "A1", "example": "Das Haus hat einen Balkon.", "example_en": "The house has a balcony.", "tip": "Vowel Shift: ou -> au (house -> Haus). Neuter base."},
            {"id": 302, "german": "Wohnung", "gender": "die", "english": "apartment", "type": "noun", "level": "A1", "example": "Die Wohnung liegt im dritten Stock.", "example_en": "The apartment is on the third floor.", "tip": "Suffix Rule: -ung is 100% feminine ('die')."},
            {"id": 303, "german": "Zimmer", "gender": "das", "english": "room", "type": "noun", "level": "A1", "example": "Das Zimmer ist ruhig.", "example_en": "The room is quiet.", "tip": "Cognate: Related to English 'timber'. Structural sections take 'das'."},
            {"id": 304, "german": "KÃ¼che", "gender": "die", "english": "kitchen", "type": "noun", "level": "A1", "example": "In der KÃ¼che kochen wir.", "example_en": "We cook in the kitchen.", "tip": "Shift: k -> ch (kitchen -> KÃ¼che). Ends in -e -> 'die'."},
            {"id": 305, "german": "Tisch", "gender": "der", "english": "table", "type": "noun", "level": "A1", "example": "Der Tisch steht in der Mitte.", "example_en": "The table is in the middle.", "tip": "Raised surface furniture takes masculine ('der')."},
            {"id": 306, "german": "TÃ¼r", "gender": "die", "english": "door", "type": "noun", "level": "A1", "example": "Bitte machen Sie die TÃ¼r zu.", "example_en": "Please close the door.", "tip": "Shift: d -> t (door -> TÃ¼r). Openings take 'die'."}
        ]
    },
    {
        "id": "transit",
        "name": "4. Stadt & Verkehr (City & Transit)",
        "level": "A1",
        "description": "Directions, stations, trains, tickets, and city landmarks.",
        "reading": {
            "title": "Orientierung in Frankfurt",
            "text": "Entschuldigung, wie komme ich zum Bahnhof? Nehmen Sie die U-Bahn Linie 4 bis zum Hauptbahnhof. Dort kÃ¶nnen Sie umsteigen. Sie brauchen eine Fahrkarte fÃ¼r die Zone 1. Der Bus fÃ¤hrt alle zehn Minuten.",
            "english": "Excuse me, how do I get to the train station? Take subway line 4 to the main station. There you can transfer. You need a ticket for zone 1. The bus runs every ten minutes.",
            "questions": [
                {"q": "Welche U-Bahn soll man nehmen?", "options": ["Linie 1", "Linie 2", "Linie 4", "Linie 8"], "answer": "Linie 4"},
                {"q": "Wie oft fÃ¤hrt der Bus?", "options": ["Jede Stunde", "Alle zehn Minuten", "Alle dreiÃŸig Minuten", "Gar nicht"], "answer": "Alle zehn Minuten"}
            ]
        },
        "vocab": [
            {"id": 401, "german": "Bahnhof", "gender": "der", "english": "train station", "type": "noun", "level": "A1", "example": "Der Zug hÃ¤lt am Bahnhof.", "example_en": "The train stops at the station.", "tip": "Compound: der Hof governs gender -> der Bahnhof."},
            {"id": 402, "german": "Zug", "gender": "der", "english": "train", "type": "noun", "level": "A1", "example": "Der Zug hat keine VerspÃ¤tung.", "example_en": "The train has no delay.", "tip": "Mass transit units default to 'der'."},
            {"id": 403, "german": "Bus", "gender": "der", "english": "bus", "type": "noun", "level": "A1", "example": "Der Bus fÃ¤hrt pÃ¼nktlich.", "example_en": "The bus drives on time.", "tip": "Automotive transport vehicles default to 'der'."},
            {"id": 404, "german": "StraÃŸe", "gender": "die", "english": "street", "type": "noun", "level": "A1", "example": "Ãœberqueren Sie die StraÃŸe.", "example_en": "Cross the street.", "tip": "Shift: t -> ÃŸ (street -> StraÃŸe). Ends in -e -> 'die'."},
            {"id": 405, "german": "Fahrkarte", "gender": "die", "english": "transit ticket", "type": "noun", "level": "A1", "example": "Zeigen Sie bitte Ihre Fahrkarte.", "example_en": "Please show your ticket.", "tip": "Compound: die Karte governs gender -> die Fahrkarte."}
        ]
    },
    {
        "id": "health",
        "name": "5. KÃ¶rper & Gesundheit (Body & Health)",
        "level": "A1",
        "description": "Doctor visits, symptoms, sickness, and human anatomy.",
        "reading": {
            "title": "Beim Arzt in der Praxis",
            "text": "Guten Morgen, Herr Doktor. Ich fÃ¼hle mich nicht gut. Mein Kopf und mein Hals tun sehr weh. Haben Sie auch Fieber? Ja, 38,5 Grad. Ich verschreibe Ihnen ein Medikament. Bleiben Sie drei Tage im Bett und trinken Sie viel Tee.",
            "english": "Good morning, doctor. I do not feel well. My head and my throat hurt a lot. Do you also have a fever? Yes, 38.5 degrees. I will prescribe you a medication. Stay in bed for three days and drink plenty of tea.",
            "questions": [
                {"q": "Was tut dem Patienten weh?", "options": ["Der FuÃŸ", "Der Kopf und der Hals", "Der RÃ¼cken", "Der Bauch"], "answer": "Der Kopf und der Hals"},
                {"q": "Was soll der Patient tun?", "options": ["Sport treiben", "Drei Tage im Bett bleiben", "Ins BÃ¼ro gehen", "Sofort reisen"], "answer": "Drei Tage im Bett bleiben"}
            ]
        },
        "vocab": [
            {"id": 501, "german": "Arzt", "gender": "der", "english": "doctor", "type": "noun", "level": "A1", "example": "Der Arzt untersucht den Patienten.", "example_en": "The doctor examines the patient.", "tip": "Vocations default to masculine ('der'). Female form: die Ã„rztin."},
            {"id": 502, "german": "Krankenhaus", "gender": "das", "english": "hospital", "type": "noun", "level": "A1", "example": "Er liegt im Krankenhaus.", "example_en": "He is in the hospital.", "tip": "Compound: Kranken + das Haus = das Krankenhaus."},
            {"id": 503, "german": "Kopf", "gender": "der", "english": "head", "type": "noun", "level": "A1", "example": "Mein Kopf tut weh.", "example_en": "My head hurts.", "tip": "Major upper body anatomical parts take 'der'."},
            {"id": 504, "german": "Hand", "gender": "die", "english": "hand", "type": "noun", "level": "A1", "example": "Geben Sie mir die Hand.", "example_en": "Give me your hand.", "tip": "Direct Cognate. Extremity takes feminine ('die')."},
            {"id": 505, "german": "FuÃŸ", "gender": "der", "english": "foot", "type": "noun", "level": "A1", "example": "Mein FuÃŸ ist verletzt.", "example_en": "My foot is injured.", "tip": "Shift: t -> ÃŸ (foot -> FuÃŸ). Major ambulatory extremity takes 'der'."}
        ]
    },
    {
        "id": "work",
        "name": "6. Beruf & Arbeit (Work & Professions)",
        "level": "A1",
        "description": "Jobs, office routines, colleague interactions, and workplace.",
        "reading": {
            "title": "Mein Arbeitstag im BÃ¼ro",
            "text": "Ich arbeite als Ingenieur bei einer Firma in MÃ¼nchen. Jeden Morgen fange ich um acht Uhr an. Ich lese E-Mails, telefoniere mit Kunden und habe Besprechungen mit Kollegen. Um zwÃ¶lf Uhr mache ich eine Stunde Mittagspause in der Kantine.",
            "english": "I work as an engineer at a company in Munich. Every morning I start at eight o'clock. I read emails, phone clients and have meetings with colleagues. At twelve o'clock I take a one-hour lunch break in the canteen.",
            "questions": [
                {"q": "Als was arbeitet die Person?", "options": ["Lehrer", "Ingenieur", "Kellner", "Arzt"], "answer": "Ingenieur"},
                {"q": "Wann beginnt der Arbeitstag?", "options": ["Um 7 Uhr", "Um 8 Uhr", "Um 9 Uhr", "Um 10 Uhr"], "answer": "Um 8 Uhr"}
            ]
        },
        "vocab": [
            {"id": 601, "german": "Beruf", "gender": "der", "english": "profession / occupation", "type": "noun", "level": "A1", "example": "Was sind Sie von Beruf?", "example_en": "What is your profession?", "tip": "Vocations take masculine ('der')."},
            {"id": 602, "german": "Arbeit", "gender": "die", "english": "work / job", "type": "noun", "level": "A1", "example": "Die Arbeit beginnt frÃ¼h.", "example_en": "Work begins early.", "tip": "Abstract labour action takes feminine ('die')."},
            {"id": 603, "german": "BÃ¼ro", "gender": "das", "english": "office", "type": "noun", "level": "A1", "example": "Ich gehe jetzt ins BÃ¼ro.", "example_en": "I am going to the office now.", "tip": "French loan in -o takes neuter ('das')."},
            {"id": 604, "german": "Chef", "gender": "der", "english": "boss / supervisor", "type": "noun", "level": "A1", "example": "Der Chef leitet das Meeting.", "example_en": "The boss leads the meeting.", "tip": "Authority figure takes masculine ('der')."},
            {"id": 605, "german": "Computer", "gender": "der", "english": "computer", "type": "noun", "level": "A1", "example": "Der Computer startet neu.", "example_en": "The computer restarts.", "tip": "Electronic devices ending in -er take 'der'."}
        ]
    },
    {
        "id": "leisure",
        "name": "7. Freizeit & Hobbys (Leisure & Hobbies)",
        "level": "A1",
        "description": "Sports, reading, music, film, and weekend activities.",
        "reading": {
            "title": "Das Wochenende genieÃŸen",
            "text": "Am Wochenende habe ich viel Freizeit. Samstags spiele ich FuÃŸball mit meinen Freunden im Park oder fahre mit dem Rad. Abends hÃ¶re ich gerne klassische Musik oder lese ein Buch. Sonntags gehe ich oft ins Kino oder treffe Familie.",
            "english": "On the weekend I have a lot of free time. On Saturdays I play soccer with my friends in the park or ride the bike. In the evenings I like listening to classical music or reading a book. On Sundays I often go to the cinema or meet family.",
            "questions": [
                {"q": "Was macht die Person am Samstag?", "options": ["Arbeiten im BÃ¼ro", "FuÃŸball spielen oder Rad fahren", "Ein Auto kaufen", "Nur schlafen"], "answer": "FuÃŸball spielen oder Rad fahren"},
                {"q": "Wohin geht die Person am Sonntag oft?", "options": ["Ins Museum", "Ins Kino", "In die Schule", "Zum Arzt"], "answer": "Ins Kino"}
            ]
        },
        "vocab": [
            {"id": 701, "german": "Freizeit", "gender": "die", "english": "free time / leisure", "type": "noun", "level": "A1", "example": "In meiner Freizeit mache ich Sport.", "example_en": "In my free time I do sports.", "tip": "Compound: die Zeit governs gender -> die Freizeit."},
            {"id": 702, "german": "Buch", "gender": "das", "english": "book", "type": "noun", "level": "A1", "example": "Das Buch ist sehr spannend.", "example_en": "The book is very exciting.", "tip": "Shift: k -> ch (book -> Buch). Neuter medium."},
            {"id": 703, "german": "Musik", "gender": "die", "english": "music", "type": "noun", "level": "A1", "example": "Ich hÃ¶re gerne Musik.", "example_en": "I like listening to music.", "tip": "Suffix Rule: -ik is 100% feminine ('die')."},
            {"id": 704, "german": "Film", "gender": "der", "english": "movie / film", "type": "noun", "level": "A1", "example": "Der Film beginnt um 20 Uhr.", "example_en": "The movie starts at 8 PM.", "tip": "Cinematic media take masculine ('der')."},
            {"id": 705, "german": "Kino", "gender": "das", "english": "cinema / movie theater", "type": "noun", "level": "A1", "example": "Wir gehen heute ins Kino.", "example_en": "We are going to the cinema today.", "tip": "Abbreviated entertainment venue takes neuter ('das')."}
        ]
    },
    {
        "id": "clothing",
        "name": "8. Kleidung & Wetter (Clothing & Weather)",
        "level": "A1",
        "description": "Garments, seasonal wear, rain, snow, sun, and temperatures.",
        "reading": {
            "title": "Wetterbericht und Garderobe",
            "text": "Heute regnet es und der Wind ist kalt. Zieh bitte eine warme Jacke und feste Schuhe an. Nimm auch einen Regenschirm mit! Morgen scheint wieder die Sonne und die Temperatur steigt auf zwanzig Grad. Dann brauche ich nur ein T-Shirt.",
            "english": "Today it is raining and the wind is cold. Please put on a warm jacket and sturdy shoes. Also take an umbrella with you! Tomorrow the sun shines again and the temperature rises to twenty degrees. Then I only need a T-shirt.",
            "questions": [
                {"q": "Wie ist das Wetter heute?", "options": ["HeiÃŸ und sonnig", "Es regnet und ist kalt", "Es schneit", "Sehr trocken"], "answer": "Es regnet und ist kalt"},
                {"q": "Was soll man heute mitnehmen?", "options": ["Eine Sonnenbrille", "Einen Regenschirm", "Badesachen", "Ein Buch"], "answer": "Einen Regenschirm"}
            ]
        },
        "vocab": [
            {"id": 801, "german": "Wetter", "gender": "das", "english": "weather", "type": "noun", "level": "A1", "example": "Das Wetter ist heute herrlich.", "example_en": "The weather is lovely today.", "tip": "Shift: t -> tt (weather -> Wetter). Ambient states take 'das'."},
            {"id": 802, "german": "Sonne", "gender": "die", "english": "sun", "type": "noun", "level": "A1", "example": "Die Sonne scheint warm.", "example_en": "The sun shines warmly.", "tip": "Celestial bodies take feminine: die Sonne."},
            {"id": 803, "german": "Regen", "gender": "der", "english": "rain", "type": "noun", "level": "A1", "example": "Der Regen hÃ¶rt gleich auf.", "example_en": "The rain is stopping soon.", "tip": "Precipitation types (der Regen, der Schnee) take 'der'."},
            {"id": 804, "german": "Jacke", "gender": "die", "english": "jacket", "type": "noun", "level": "A1", "example": "Zieh deine Jacke an.", "example_en": "Put on your jacket.", "tip": "Ends in -e -> ~90% feminine ('die')."},
            {"id": 805, "german": "Schuh", "gender": "der", "english": "shoe", "type": "noun", "level": "A1", "example": "Der rechte Schuh drÃ¼ckt.", "example_en": "The right shoe pinches.", "tip": "Individual footwear takes masculine ('der')."}
        ]
    },
    {
        "id": "family",
        "name": "9. Familie & Bekannte (Family & Relationships)",
        "level": "A1",
        "description": "Kinship, marital status, children, and introductions.",
        "reading": {
            "title": "Unsere GroÃŸfamilie",
            "text": "Das ist meine Familie auf dem Foto. Mein Vater heiÃŸt Peter und meine Mutter heiÃŸt Anna. Ich habe einen Bruder und zwei Schwestern. Meine GroÃŸeltern leben in Hamburg. Wir feiern Weihnachten immer alle zusammen.",
            "english": "That is my family on the photo. My father is called Peter and my mother is called Anna. I have one brother and two sisters. My grandparents live in Hamburg. We always celebrate Christmas all together.",
            "questions": [
                {"q": "Wie viele Schwestern hat die Person?", "options": ["Eine", "Zwei", "Drei", "Keine"], "answer": "Zwei"},
                {"q": "Wo leben die GroÃŸeltern?", "options": ["In MÃ¼nchen", "In Hamburg", "In Berlin", "In Wien"], "answer": "In Hamburg"}
            ]
        },
        "vocab": [
            {"id": 901, "german": "Familie", "gender": "die", "english": "family", "type": "noun", "level": "A1", "example": "Meine Familie ist sehr groÃŸ.", "example_en": "My family is very large.", "tip": "Latinate collective in -ie is 100% feminine ('die')."},
            {"id": 902, "german": "Vater", "gender": "der", "english": "father", "type": "noun", "level": "A1", "example": "Mein Vater arbeitet als Arzt.", "example_en": "My father works as a doctor.", "tip": "Shift: f/v (father -> Vater). Male relative -> 'der'."},
            {"id": 903, "german": "Mutter", "gender": "die", "english": "mother", "type": "noun", "level": "A1", "example": "Meine Mutter kocht gerne.", "example_en": "My mother likes cooking.", "tip": "Shift: th -> tt (mother -> Mutter). Female relative -> 'die'."},
            {"id": 904, "german": "Bruder", "gender": "der", "english": "brother", "type": "noun", "level": "A1", "example": "Mein Bruder ist Ã¤lter als ich.", "example_en": "My brother is older than me.", "tip": "Shift: th -> d (brother -> Bruder). Male sibling -> 'der'."},
            {"id": 905, "german": "Kind", "gender": "das", "english": "child", "type": "noun", "level": "A1", "example": "Das Kind spielt im Garten.", "example_en": "The child plays in the garden.", "tip": "Youth offspring takes neuter ('das')."}
        ]
    },
    {
        "id": "time",
        "name": "10. Zeit, Tage & Kalender (Time & Calendar)",
        "level": "A1",
        "description": "Clock time, days of the week, months, and temporal prepositions.",
        "reading": {
            "title": "Mein Wochenplan",
            "text": "Heute ist Montag, der Beginn der Arbeitswoche. Ich stehe jeden Tag um sieben Uhr auf. Am Mittwoch habe ich um fÃ¼nfzehn Uhr einen Deutschkurs. Am Freitagabend treffe ich Freunde. Das Wochenende beginnt am Samstagmittag.",
            "english": "Today is Monday, the beginning of the work week. I get up every day at seven o'clock. On Wednesday I have a German course at 3 PM. On Friday evening I meet friends. The weekend begins on Saturday noon.",
            "questions": [
                {"q": "Wann ist der Deutschkurs?", "options": ["Am Montag um 7 Uhr", "Am Mittwoch um 15 Uhr", "Am Freitagabend", "Am Sonntag"], "answer": "Am Mittwoch um 15 Uhr"},
                {"q": "Wann beginnt das Wochenende?", "options": ["Am Donnerstag", "Am Samstagmittag", "Am Montagmorgen", "Gar nicht"], "answer": "Am Samstagmittag"}
            ]
        },
        "vocab": [
            {"id": 1001, "german": "Uhr", "gender": "die", "english": "clock / o'clock", "type": "noun", "level": "A1", "example": "Es ist genau drei Uhr.", "example_en": "It is exactly three o'clock.", "tip": "Timepieces and clock hours take feminine ('die')."},
            {"id": 1002, "german": "Tag", "gender": "der", "english": "day", "type": "noun", "level": "A1", "example": "Guten Tag!", "example_en": "Good day!", "tip": "Shift: d -> t (day -> Tag). Calendar intervals default to 'der'."},
            {"id": 1003, "german": "Woche", "gender": "die", "english": "week", "type": "noun", "level": "A1", "example": "Die Woche hat sieben Tage.", "example_en": "The week has seven days.", "tip": "Shift: k -> ch (week -> Woche). Ends in -e -> 'die'."},
            {"id": 1004, "german": "Monat", "gender": "der", "english": "month", "type": "noun", "level": "A1", "example": "Der Monat Mai ist wunderschÃ¶n.", "example_en": "The month of May is wonderful.", "tip": "All months take masculine ('der')."},
            {"id": 1005, "german": "Jahr", "gender": "das", "english": "year", "type": "noun", "level": "A1", "example": "Ein neues Jahr beginnt.", "example_en": "A new year begins.", "tip": "Direct Cognate. Full solar cycle takes neuter ('das')."}
        ]
    },
    {
        "id": "bureaucracy",
        "name": "11. Post, Bank & BehÃ¶rden (Post, Bank & Official Forms)",
        "level": "A1",
        "description": "Forms, signatures, letters, bank accounts, and cards.",
        "reading": {
            "title": "Auf dem BÃ¼rgeramt",
            "text": "Guten Tag, ich mÃ¶chte mich anmelden. Hier ist mein Reisepass und das Formular fÃ¼r die WohnungsgeberbestÃ¤tigung. Bitte unterschreiben Sie hier unten rechts. Zahlen Sie die GebÃ¼hr bitte am Kassenautomaten mit Ihrer EC-Karte.",
            "english": "Good day, I would like to register. Here is my passport and the form for the landlord confirmation. Please sign down here on the right. Please pay the fee at the payment machine with your debit card.",
            "questions": [
                {"q": "Was mÃ¶chte die Person tun?", "options": ["Ein Auto mieten", "Sich anmelden", "Einen Brief abschicken", "Geld leihen"], "answer": "Sich anmelden"},
                {"q": "Wo soll man unterschreiben?", "options": ["Oben links", "Unten rechts", "Auf der RÃ¼ckseite", "Gar nicht"], "answer": "Unten rechts"}
            ]
        },
        "vocab": [
            {"id": 1101, "german": "Formular", "gender": "das", "english": "form / official paper", "type": "noun", "level": "A1", "example": "FÃ¼llen Sie bitte dieses Formular aus.", "example_en": "Please fill out this form.", "tip": "Official documentary instruments take neuter ('das')."},
            {"id": 1102, "german": "Pass", "gender": "der", "english": "passport", "type": "noun", "level": "A1", "example": "Zeigen Sie Ihren Pass vor.", "example_en": "Show your passport.", "tip": "Travel identification documents take masculine ('der')."},
            {"id": 1103, "german": "Brief", "gender": "der", "english": "letter", "type": "noun", "level": "A1", "example": "Ich werfe den Brief in den Kasten.", "example_en": "I drop the letter in the mailbox.", "tip": "Epistolary dispatches take masculine ('der')."},
            {"id": 1104, "german": "Konto", "gender": "das", "english": "bank account", "type": "noun", "level": "A1", "example": "Ich mÃ¶chte ein Girokonto erÃ¶ffnen.", "example_en": "I would like to open a checking account.", "tip": "Italian financial loan in -o takes neuter ('das')."},
            {"id": 1105, "german": "Karte", "gender": "die", "english": "card", "type": "noun", "level": "A1", "example": "Kann ich mit Karte zahlen?", "example_en": "Can I pay by card?", "tip": "Ends in -e -> ~90% feminine ('die')."}
        ]
    },
    {
        "id": "education",
        "name": "12. Lernen & Sprache (Education & Learning)",
        "level": "A1",
        "description": "Courses, language levels, exercises, words, and meaning.",
        "reading": {
            "title": "Im Deutschkurs",
            "text": "Heute lernen wir im Deutschkurs neue WÃ¶rter und Grammatik. Die Lehrerin schreibt einen Beispielsatz an die Tafel. Wir Ã¼ben Dialoge zu zweit und hÃ¶ren einen Audio-Text. Die Hausaufgabe fÃ¼r morgen steht im Kursbuch auf Seite zwanzig.",
            "english": "Today in the German course we learn new words and grammar. The teacher writes an example sentence on the board. We practice dialogues in pairs and listen to an audio text. The homework for tomorrow is in the course book on page twenty.",
            "questions": [
                {"q": "Was schreibt die Lehrerin an die Tafel?", "options": ["Ihre Telefonnummer", "Einen Beispielsatz", "Eine Rechnung", "Gar nichts"], "answer": "Einen Beispielsatz"},
                {"q": "Wo steht die Hausaufgabe fÃ¼r morgen?", "options": ["Im Kursbuch auf Seite 20", "Im WÃ¶rterbuch", "An der Wand", "Im Internet"], "answer": "Im Kursbuch auf Seite 20"}
            ]
        },
        "vocab": [
            {"id": 1201, "german": "Sprache", "gender": "die", "english": "language", "type": "noun", "level": "A1", "example": "Deutsch ist eine logische Sprache.", "example_en": "German is a logical language.", "tip": "Ends in -e -> ~90% feminine ('die')."},
            {"id": 1202, "german": "Wort", "gender": "das", "english": "word", "type": "noun", "level": "A1", "example": "Was bedeutet dieses Wort?", "example_en": "What does this word mean?", "tip": "Direct Cognate. Lexical units take neuter ('das')."},
            {"id": 1203, "german": "Satz", "gender": "der", "english": "sentence", "type": "noun", "level": "A1", "example": "Bilden Sie bitte einen vollstÃ¤ndigen Satz.", "example_en": "Please form a complete sentence.", "tip": "From 'setzen'. Syntactic clauses take masculine ('der')."},
            {"id": 1204, "german": "Schule", "gender": "die", "english": "school", "type": "noun", "level": "A1", "example": "Die Kinder gehen zur Schule.", "example_en": "The children go to school.", "tip": "Shift: sk -> sch (school -> Schule). Ends in -e -> 'die'."},
            {"id": 1205, "german": "WÃ¶rterbuch", "gender": "das", "english": "dictionary", "type": "noun", "level": "A1", "example": "Schlagen Sie das im WÃ¶rterbuch nach.", "example_en": "Look that up in the dictionary.", "tip": "Compound: das Buch governs gender -> das WÃ¶rterbuch."}
        ]
    },
    {
        "id": "travel",
        "name": "13. Reisen & Hotel (Travel & Hotel)",
        "level": "A1",
        "description": "Hotel check-in, vacations, luggage, keys, and destinations.",
        "reading": {
            "title": "Ankunft im Hotel Alpenblick",
            "text": "Guten Tag! Ich habe ein Doppelzimmer fÃ¼r drei NÃ¤chte reserviert. Mein Name ist Kertcher. Haben Sie FrÃ¼hstÃ¼ck inklusive? Ja, das FrÃ¼hstÃ¼cksbÃ¼ffet ist von sieben bis zehn Uhr. Hier ist Ihre Zimmerkarte fÃ¼r Zimmer 304 im dritten Stock. Einen angenehmen Aufenthalt!",
            "english": "Good day! I reserved a double room for three nights. My name is Kertcher. Do you have breakfast included? Yes, the breakfast buffet is from seven to ten o'clock. Here is your room key card for room 304 on the third floor. Have a pleasant stay!",
            "questions": [
                {"q": "FÃ¼r wie viele NÃ¤chte ist das Zimmer reserviert?", "options": ["Eine Nacht", "Zwei NÃ¤chte", "Drei NÃ¤chte", "Eine Woche"], "answer": "Drei NÃ¤chte"},
                {"q": "In welchem Stock liegt das Zimmer?", "options": ["Im ersten Stock", "Im zweiten Stock", "Im dritten Stock", "Im Erdgeschoss"], "answer": "Im dritten Stock"}
            ]
        },
        "vocab": [
            {"id": 1301, "german": "Hotel", "gender": "das", "english": "hotel", "type": "noun", "level": "A1", "example": "Das Hotel liegt zentral.", "example_en": "The hotel is centrally located.", "tip": "International hospitality lodging takes neuter ('das')."},
            {"id": 1302, "german": "Koffer", "gender": "der", "english": "suitcase", "type": "noun", "level": "A1", "example": "Mein Koffer ist sehr schwer.", "example_en": "My suitcase is very heavy.", "tip": "Containers ending in -er take masculine ('der')."},
            {"id": 1303, "german": "GepÃ¤ck", "gender": "das", "english": "luggage / baggage", "type": "noun", "level": "A1", "example": "Geben Sie Ihr GepÃ¤ck am Schalter auf.", "example_en": "Check in your luggage at the counter.", "tip": "Prefix Ge- collective nouns take neuter ('das')."},
            {"id": 1304, "german": "Urlaub", "gender": "der", "english": "vacation / holiday", "type": "noun", "level": "A1", "example": "Wir fahren im August in den Urlaub.", "example_en": "We are going on vacation in August.", "tip": "Period of leave takes masculine ('der')."},
            {"id": 1305, "german": "Ticket", "gender": "das", "english": "ticket", "type": "noun", "level": "A1", "example": "Das Ticket ist digital auf dem Handy.", "example_en": "The ticket is digital on the phone.", "tip": "English loan document takes neuter ('das')."}
        ]
    },
    {
        "id": "emergency",
        "name": "14. Notfall & HÃ¶flichkeit (Emergency & Polite Interactions)",
        "level": "A1",
        "description": "Help requests, emergencies, apologies, police, and daily courtesies.",
        "reading": {
            "title": "Schnelle Hilfe in der Stadt",
            "text": "Hilfe! Jemand hat meine Tasche gestohlen. Rufen Sie bitte sofort die Polizei! Keine Panik, die Polizeistation ist gleich hier um die Ecke. Bleiben Sie hier stehen und beschreiben Sie den TÃ¤ter. Es tut mir leid, dass das passiert ist.",
            "english": "Help! Someone stole my bag. Please call the police immediately! Do not panic, the police station is right around the corner. Stay here and describe the perpetrator. I am sorry that this happened.",
            "questions": [
                {"q": "Was ist passiert?", "options": ["Ein Unfall", "Jemand hat eine Tasche gestohlen", "Ein Feuer", "Nichts"], "answer": "Jemand hat eine Tasche gestohlen"},
                {"q": "Wen soll man rufen?", "options": ["Einen Arzt", "Die Polizei", "Die Feuerwehr", "Ein Taxi"], "answer": "Die Polizei"}
            ]
        },
        "vocab": [
            {"id": 1401, "german": "Hilfe", "gender": "die", "english": "help", "type": "noun", "level": "A1", "example": "Ich brauche dringend Hilfe.", "example_en": "I urgently need help.", "tip": "From 'helfen'. Ends in -e -> ~90% feminine ('die')."},
            {"id": 1402, "german": "Polizei", "gender": "die", "english": "police", "type": "noun", "level": "A1", "example": "Rufen Sie die Polizei!", "example_en": "Call the police!", "tip": "Suffix Rule: -ei (institutions) is 100% feminine ('die')."},
            {"id": 1403, "german": "Unfall", "gender": "der", "english": "accident", "type": "noun", "level": "A1", "example": "Es gab einen Unfall auf der Kreuzung.", "example_en": "There was an accident at the intersection.", "tip": "Events in -fall take masculine ('der')."},
            {"id": 1404, "german": "Problem", "gender": "das", "english": "problem", "type": "noun", "level": "A1", "example": "Das ist kein Problem.", "example_en": "That is no problem.", "tip": "Greek loan in -em takes neuter ('das')."},
            {"id": 1405, "german": "Es tut mir leid", "gender": None, "english": "i am sorry", "type": "phrase", "level": "A1", "example": "Es tut mir leid, das wusste ich nicht.", "example_en": "I am sorry, I did not know that.", "tip": "Literally: 'It does sorrow to me'."}
        ]
    }
]

with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    json.dump({"modules": MODULES}, f, ensure_ascii=False, indent=2)

print(f"Generated 14 Goethe A1 modules in {OUTPUT_PATH}")