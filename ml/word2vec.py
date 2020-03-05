from gensim.models import KeyedVectors
import csv

# Get list of symptoms used by ML model
symptoms_dataset = None
with open('Training.csv', newline='') as f:
  csv_reader = csv.reader(f)
  symptoms_dataset = next(csv_reader)

# Load google's pretrained model with size limit
# Entire model too large for memory
print('loading')
model = KeyedVectors.load_word2vec_format('GoogleNews-vectors-negative300.bin', binary=True, limit=300000)
print('done')

# Check if the symptom entered is:
# 1: already in ml dataset
# 2: matched to symptom in dataset
# 3: not matched to one in the dataset
def check_symptom(symptom):
    res = {
        "symptom_in_dataset": None,
        "symptom_similar": None,
        "symptom_not_in_dataset": None
    }

    if symptom in symptoms_dataset:
        res["symptom_in_dataset"] = symptom 
        return res

    # Get list of words that are similar to the symptom entered 
    try:
        similar_words = model.most_similar(positive=[symptom], negative=None, topn = 100)
    except:
        similar_words = []

    # Check if similar words appear in ML symptom set
    for symptom_data in similar_words:
        if symptom_data[0] in symptoms_dataset:
            res["symptom_similar"] = symptom_data[0]
            return res

    # no matches to dataset
    res["symptom_not_in_dataset"] = symptom 
    return res

#test
entered_symptom = 'vomit'
print(check_symptom(entered_symptom))

# test words
# itchy, nauseous, shaking, stomache_ache, heartburn, depressed