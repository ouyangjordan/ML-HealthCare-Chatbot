import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

class NNCF:
    """
    Nearest Neighbor Collaborative Filtering
    Uses a nearest neighbor approach using a given dataset's rows to determine most similar symptoms
    to a given list of symptoms
    k determines the top closest neighbors
    """
    def __init__(self, train_dataset_name, k):

        self.k = k

        # Possible set of symptoms in formatted order
        self.symptom_set = pd.read_csv(train_dataset_name).columns[:-1].values.tolist()

        # Save data for nearest neighbor matching
        self.dataset_rows = pd.read_csv(train_dataset_name).iloc[:, :-1].values.tolist()

    """
    Main entrypoint function, gets an ordered list of symptoms that are most "similar" to a set of given symptoms
    Also note that if not enough symptoms are above the threshold, then the number of returned symptoms could be smaller than n
    @arg symptoms: list of symptoms in any order, must match those found in the header file of the data
    @arg n: integer value for how many similar symptoms that should be returned
    @arg threshold: float value for the minimum average similarity needed for a symptom to be returned (default 0.5)
    """
    def get_nearest_symptoms(self, symptoms, n, threshold=0.5):
        X = self.format_symptoms(symptoms)

        row_sim_tuples = [] #List of tuples of (row_index, similarity_score)
        for i in range(len(self.dataset_rows)):
            row = self.dataset_rows[i]
            sim = self.get_cosine_sim(X, row) #sim measure between row i and X
            row_sim_tuples.append((i, sim))

        #Sorts row indices in terms of highest similarities
        sorted_row_sim_tuples = sorted(row_sim_tuples, key=lambda x: x[1], reverse=True) 
        
        #Average of top k similar rows
        avg_top_k_row = np.zeros(len(self.symptom_set))
        for i in range(self.k):
            row_ind = sorted_row_sim_tuples[i][0]
            row = self.dataset_rows[row_ind]
            avg_top_k_row = np.add(avg_top_k_row, row)
        avg_top_k_row = np.divide(avg_top_k_row, self.k)

        #List of tuples for (symptom, score), where score was determined from average of top k similar rows
        symptom_score_tuples = []
        for i in range(len(avg_top_k_row)):
            symptom_score_tuples.append((self.symptom_set[i], avg_top_k_row[i]))

        #Highest similarity symptoms for the average of top k nearest rows (sorted in high to low sim)
        sorted_symptom_score_tuples = sorted(symptom_score_tuples, key=lambda x: x[1], reverse = True)

        given_symptom_set = set(symptoms)
        n_similar_symptoms = []
        for i in range(len(sorted_symptom_score_tuples)):
            symptom = sorted_symptom_score_tuples[i][0]
            score = sorted_symptom_score_tuples[i][1]
            if score >= threshold and symptom not in given_symptom_set: #Remove duplicates
                n_similar_symptoms.append(symptom)
            if n == len(n_similar_symptoms):
                break
        return n_similar_symptoms

    """
    HELPER function to convert a list of symptoms (any order) to properly formed input vector X (containing one hot encoding of symptoms)
    """
    def format_symptoms(self, symptoms):
        symptom_index = dict(zip(self.symptom_set, range(len(self.symptom_set)))) #Convert list to (word -> index) dict

        X = np.zeros(len(self.symptom_set)) 
        for symptom in symptoms:
            if symptom in symptom_index:
                X[symptom_index[symptom]] = 1
        return X

    """
    HELPER function for getting cosine similarity between two vectors (or arrays) or equal length
    Returns a float between 0 and 1
    """
    def get_cosine_sim(self, A, B):
        sim = cosine_similarity([A], [B])[0][0]
        if (sim > 1): # Account for weird float math
            return 1
        return sim


#Testing
#nncf = NNCF('Training.csv', 10)
#symptoms = ['shivering' ,'stomach_pain', 'acidity', 'vomiting']
#print(nncf.get_nearest_symptoms(symptoms, 5, 0.00000001))