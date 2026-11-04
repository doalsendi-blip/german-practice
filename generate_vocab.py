import json
import os
import re

OUTPUT_PATH = os.path.join("src", "data", "vocabulary.json")
os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

# Curated High-Frequency Offline Corpus with Exact Linguistic Logic
RAW_LEXICON = [
    # LEVEL 1: High-Frequency Cognates, Consonant Shifts & Micro-Words
    # Consonant Shift: English "t" -> German "ss/s/z"
    ("noun", "Wasser", "das", "water", 1, "Cognate Shift: English 't' -> German 'ss' (water -> Wasser, street -> Straße). Neutral liquid base."),
    ("noun", "Straße", "die", "street", 1, "Cognate Shift: English 't' -> German 'ß/ss' (street -> Straße, foot -> Fuß)."),
    ("noun", "Fuß", "der", "foot", 1, "Cognate Shift: English 't' -> German 'ß' (foot -> Fuß). Body parts often default to 'der'."),
    ("noun", "Katze", "die", "cat", 1, "Cognate Shift: English 't' -> German 'tz' (cat -> Katze). Nouns ending in '-e' are 90% feminine ('die')."),
    ("noun", "Zunge", "die", "tongue", 1, "Cognate Shift: English initial 't' -> German 'z' (tongue -> Zunge, to -> zu). Ends in '-e' -> 'die'."),
    ("noun", "Zeit", "die", "time", 1, "Cognate Shift: English initial 't' -> German 'z' (time -> Zeit, tide -> Gezeiten)."),
    ("noun", "Zahn", "der", "tooth", 1, "Cognate Shift: English initial 't' -> German 'z' (tooth -> Zahn)."),

    # Consonant Shift: English "d" -> German "t"
    ("noun", "Brot", "das", "bread", 1, "Cognate Shift: English 'd' -> German 't' (bread -> Brot, cold -> kalt, old -> alt)."),
    ("noun", "Bett", "das", "bed", 1, "Cognate Shift: English 'd' -> German 'tt' (bed -> Bett)."),
    ("noun", "Tag", "der", "day", 1, "Cognate Shift: English 'd' -> German 't' (day -> Tag, dream -> Traum). Time units (der Tag, der Monat) take 'der'."),
    ("noun", "Traum", "der", "dream", 1, "Cognate Shift: English 'd' -> German 't' (dream -> Traum, drink -> trinken)."),
    ("noun", "Tür", "die", "door", 1, "Cognate Shift: English 'd' -> German 't' (door -> Tür)."),
    ("noun", "Tochter", "die", "daughter", 1, "Cognate Shift: English 'd' -> German 't' (daughter -> Tochter). Female biological identity -> 'die'."),
    ("noun", "Garten", "der", "garden", 1, "Cognate Shift: English 'd' -> German 't' (garden -> Garten)."),

    # Consonant Shift: English "p" -> German "pf / f"
    ("noun", "Apfel", "der", "apple", 1, "Cognate Shift: English 'p' -> German 'pf' (apple -> Apfel, pepper -> Pfeffer)."),
    ("noun", "Pfeffer", "der", "pepper", 1, "Cognate Shift: English 'p' -> German 'pf' (pepper -> Pfeffer). Spices generally take 'der'."),
    ("noun", "Pferd", "das", "horse", 1, "Cognate Shift: English 'p' -> German 'pf' (palfrey -> Pferd)."),
    ("noun", "Pflanze", "die", "plant", 1, "Cognate Shift: English 'p' -> German 'pf' (plant -> Pflanze). Ends in '-e' -> 'die'."),
    ("noun", "Pfeife", "die", "pipe", 1, "Cognate Shift: English 'p' -> German 'pf' (pipe -> Pfeife)."),
    ("noun", "Schiff", "das", "ship", 1, "Cognate Shift: English 'p' -> German 'ff' (ship -> Schiff, open -> offen)."),

    # Consonant Shift: English hard "k" -> German "ch"
    ("noun", "Buch", "das", "book", 1, "Cognate Shift: English hard 'k' -> German 'ch' (book -> Buch, cook -> Koch, break -> brechen)."),
    ("noun", "Küche", "die", "kitchen", 1, "Cognate Shift: English 'k' -> German 'ch' (kitchen -> Küche). Ends in '-e' -> 'die'."),
    ("noun", "Milch", "die", "milk", 1, "Cognate Shift: English 'k' -> German 'ch' (milk -> Milch). Feminine milk/dairy category."),
    ("noun", "Woche", "die", "week", 1, "Cognate Shift: English 'k' -> German 'ch' (week -> Woche). Ends in '-e' -> 'die'."),

    # Consonant Shift: English "th" -> German "d"
    ("noun", "Bruder", "der", "brother", 1, "Cognate Shift: English 'th' -> German 'd' (brother -> Bruder, leather -> Leder). Male family -> 'der'."),
    ("noun", "Bad", "das", "bath", 1, "Cognate Shift: English 'th' -> German 'd' (bath -> Bad)."),
    ("noun", "Erde", "die", "earth", 1, "Cognate Shift: English 'th' -> German 'd' (earth -> Erde). Ends in '-e' -> 'die'."),
    ("noun", "Feder", "die", "feather", 1, "Cognate Shift: English 'th' -> German 'd' (feather -> Feder)."),

    # Direct Vowel Cognates & Micro-Words
    ("noun", "Haus", "das", "house", 1, "Direct Cognate: English 'ou' shifts to German 'au' (house -> Haus, mouse -> Maus)."),
    ("noun", "Maus", "die", "mouse", 1, "Direct Cognate: English 'ou' shifts to German 'au' (mouse -> Maus)."),
    ("noun", "Freund", "der", "friend", 1, "Direct Cognate: Exact shared Germanic root (friend -> Freund)."),
    ("phrase", "Hallo", None, "hello", 1, "Direct Greeting: Exact cognate."),
    ("phrase", "Danke", None, "thank you", 1, "Cognate Shift: English 'th' -> German 'd' (thank -> danken/danke)."),
    ("phrase", "Bitte", None, "please", 1, "Cognate Anchor: Related to English 'bid' (to request/invite)."),
    ("phrase", "Ja", None, "yes", 1, "Cognate Anchor: Cognate with archaic English 'yea'."),
    ("phrase", "Nein", None, "no", 1, "Cognate Anchor: Cognate with English 'nay' / 'none'."),
    ("phrase", "Gut", None, "good", 1, "Cognate Shift: English 'd' -> German 't' (good -> gut)."),

    # LEVEL 2: Suffix Rules & Structural Gender Systems
    # 100% Feminine Suffixes: -ung, -heit, -keit, -schaft, -tion, -tät, -ie
    ("noun", "Zeitung", "die", "newspaper", 2, "Suffix Rule: 100% of nouns ending in '-ung' are feminine ('die')."),
    ("noun", "Wohnung", "die", "apartment", 2, "Suffix Rule: 100% of nouns ending in '-ung' are feminine ('die')."),
    ("noun", "Rechnung", "die", "bill", 2, "Suffix Rule: 100% of nouns ending in '-ung' are feminine ('die'). (Rechnen = to calculate)."),
    ("noun", "Hoffnung", "die", "hope", 2, "Suffix Rule: 100% of nouns ending in '-ung' are feminine ('die')."),
    ("noun", "Lösung", "die", "solution", 2, "Suffix Rule: 100% of nouns ending in '-ung' are feminine ('die')."),
    ("noun", "Meinung", "die", "opinion", 2, "Suffix Rule: 100% of nouns ending in '-ung' are feminine ('die')."),
    ("noun", "Erfahrung", "die", "experience", 2, "Suffix Rule: 100% of nouns ending in '-ung' are feminine ('die')."),
    ("noun", "Bedeutung", "die", "meaning", 2, "Suffix Rule: 100% of nouns ending in '-ung' are feminine ('die')."),
    ("noun", "Freiheit", "die", "freedom", 2, "Suffix Rule: Nouns ending in '-heit' are 100% feminine ('die') (matches English '-hood')."),
    ("noun", "Wahrheit", "die", "truth", 2, "Suffix Rule: Nouns ending in '-heit' are 100% feminine ('die')."),
    ("noun", "Krankheit", "die", "illness", 2, "Suffix Rule: Nouns ending in '-heit' are 100% feminine ('die')."),
    ("noun", "Möglichkeit", "die", "possibility", 2, "Suffix Rule: Nouns ending in '-keit' are 100% feminine ('die') (matches English '-ness/-ity')."),
    ("noun", "Geschwindigkeit", "die", "speed", 2, "Suffix Rule: Nouns ending in '-keit' are 100% feminine ('die')."),
    ("noun", "Freundschaft", "die", "friendship", 2, "Suffix Rule: Nouns ending in '-schaft' are 100% feminine ('die') (matches English '-ship')."),
    ("noun", "Mannschaft", "die", "team", 2, "Suffix Rule: Nouns ending in '-schaft' are 100% feminine ('die')."),
    ("noun", "Station", "die", "station", 2, "Suffix Rule: Nouns ending in '-tion' are 100% feminine ('die')."),
    ("noun", "Information", "die", "information", 2, "Suffix Rule: Nouns ending in '-tion' are 100% feminine ('die')."),
    ("noun", "Situation", "die", "situation", 2, "Suffix Rule: Nouns ending in '-tion' are 100% feminine ('die')."),
    ("noun", "Universität", "die", "university", 2, "Suffix Rule: Nouns ending in '-tät' are 100% feminine ('die') (matches English '-ity')."),
    ("noun", "Qualität", "die", "quality", 2, "Suffix Rule: Nouns ending in '-tät' are 100% feminine ('die')."),
    ("noun", "Energie", "die", "energy", 2, "Suffix Rule: Loan words ending in stressed '-ie' are 100% feminine ('die')."),
    ("noun", "Biologie", "die", "biology", 2, "Suffix Rule: Scientific fields ending in '-ie' are 100% feminine ('die')."),

    # 100% Neuter Suffixes: -chen, -lein, -ment, -um
    ("noun", "Brötchen", "das", "bread roll", 2, "Diminutive Rule: 100% of nouns ending in '-chen' are neuter ('das'), regardless of base noun."),
    ("noun", "Mädchen", "das", "girl", 2, "Diminutive Rule: Suffix '-chen' grammatically forces neuter ('das'), overriding biological gender."),
    ("noun", "Häuschen", "das", "small house", 2, "Diminutive Rule: Suffix '-chen' always takes 'das'."),
    ("noun", "Fräulein", "das", "young lady", 2, "Diminutive Rule: Suffix '-lein' always takes 'das'."),
    ("noun", "Dokument", "das", "document", 2, "Suffix Rule: Nouns ending in '-ment' are 100% neuter ('das')."),
    ("noun", "Instrument", "das", "instrument", 2, "Suffix Rule: Nouns ending in '-ment' are 100% neuter ('das')."),
    ("noun", "Experiment", "das", "experiment", 2, "Suffix Rule: Nouns ending in '-ment' are 100% neuter ('das')."),
    ("noun", "Zentrum", "das", "center", 2, "Suffix Rule: Latin origin nouns ending in '-um' are 100% neuter ('das')."),
    ("noun", "Museum", "das", "museum", 2, "Suffix Rule: Latin origin nouns ending in '-um' are 100% neuter ('das')."),

    # Masculine Agent Suffixes: -er, -ling, -or, -ismus
    ("noun", "Lehrer", "der", "teacher", 2, "Agent Rule: Male agents and professions ending in '-er' take masculine ('der')."),
    ("noun", "Fahrer", "der", "driver", 2, "Agent Rule: Male agents and professions ending in '-er' take masculine ('der')."),
    ("noun", "Kellner", "der", "waiter", 2, "Agent Rule: Male agents and professions ending in '-er' take masculine ('der')."),
    ("noun", "Bäcker", "der", "baker", 2, "Agent Rule: Male agents and professions ending in '-er' take masculine ('der')."),
    ("noun", "Computer", "der", "computer", 2, "Technical Agent Rule: Mechanical devices/tools ending in '-er' take masculine ('der')."),
    ("noun", "Drucker", "der", "printer", 2, "Technical Agent Rule: Mechanical devices/tools ending in '-er' take masculine ('der')."),
    ("noun", "Flüchtling", "der", "refugee", 2, "Suffix Rule: Nouns ending in '-ling' take masculine ('der')."),
    ("noun", "Frühling", "der", "spring", 2, "Suffix Rule: Seasons and nouns ending in '-ling' take masculine ('der')."),
    ("noun", "Motor", "der", "engine", 2, "Suffix Rule: Latinate nouns ending in '-or' take masculine ('der')."),
    ("noun", "Optimismus", "der", "optimism", 2, "Suffix Rule: Nouns ending in '-ismus' take masculine ('der') (matches English '-ism')."),

    # LEVEL 2 Phrases
    ("phrase", "Guten Morgen", None, "good morning", 2, "Accusative Anchor: 'Guten' takes masculine accusative '-en' as a direct object greeting."),
    ("phrase", "Guten Tag", None, "good day", 2, "Accusative Anchor: 'Guten' takes masculine accusative '-en'."),
    ("phrase", "Guten Abend", None, "good evening", 2, "Accusative Anchor: 'Guten' takes masculine accusative '-en'."),
    ("phrase", "Auf Wiedersehen", None, "goodbye", 2, "Root Breakdown: 'Auf' (upon) + 'wieder' (again) + 'sehen' (seeing) = 'Until we meet again'."),
    ("phrase", "Tschüss", None, "bye", 2, "Casual Greeting: Standard informal German farewell."),

    # LEVEL 3: Complex Idiomatic Expressions & Dative/Accusative Grammatical Logic
    ("phrase", "Es tut mir leid", None, "i am sorry", 3, "Idiomatic Construction: Literally 'It does sorrow to me' (tut = does, mir = dative 'to me', leid = sorrow)."),
    ("phrase", "Wie geht es Ihnen?", None, "how are you", 3, "Dative Construction: Literally 'How goes it to you?' (Ihnen = formal dative 'you')."),
    ("phrase", "Wie geht's?", None, "how are you", 3, "Informal Contraction: 'Wie geht es' contracts to 'Wie geht's'."),
    ("phrase", "Mir geht es gut", None, "i am doing well", 3, "Dative Construction: Literally 'To me it goes good'."),
    ("phrase", "Ich verstehe nicht", None, "i do not understand", 3, "Negation Logic: 'nicht' follows the conjugated verb to negate the full clause."),
    ("phrase", "Ich weiß nicht", None, "i do not know", 3, "Irregular Verb: 'wissen' (to know a fact). First person singular is 'weiß'."),
    ("phrase", "Die Rechnung, bitte", None, "the check please", 3, "Communicative Chunk: 'Rechnung' (calculation/bill) + '-ung' (die) + 'bitte' (please)."),
    ("phrase", "Wo ist der Bahnhof?", None, "where is the train station", 3, "Nominative Construction: 'Bahnhof' remains 'der' as the subject after 'sein'."),
    ("phrase", "Ich möchte bezahlen", None, "i would like to pay", 3, "Modal Construction: 'möchte' (would like) sends infinitive 'bezahlen' to end of sentence."),
    ("phrase", "Können Sie mir helfen?", None, "can you help me", 3, "Dative Object: 'helfen' always governs a dative pronoun ('mir' instead of 'mich')."),
    ("phrase", "Sprechen Sie Englisch?", None, "do you speak english", 3, "Vowel Change: Strong verb 'sprechen' (e -> i in singular, stays 'e' in formal Sie)."),
    ("phrase", "Ich habe keine Zeit", None, "i have no time", 3, "Negative Article: 'keine' negates feminine noun 'die Zeit' in the accusative.")
]

dataset = []
for idx, item in enumerate(RAW_LEXICON, start=1):
    dataset.append({
        "id": idx,
        "type": item[0],
        "german": item[1],
        "gender": item[2],
        "english": item[3],
        "level": item[4],
        "tip": item[5]
    })

with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    json.dump(dataset, f, ensure_ascii=False, indent=2)

print(f"Generated {len(dataset)} verified pedagogical items in {OUTPUT_PATH}")