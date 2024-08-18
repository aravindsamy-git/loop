import sys
import json
import asyncio
from annoy import AnnoyIndex
import os
from filelock import FileLock
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s', filename='app.log', filemode='a')

INDEX_FILE = 'user_profiles.ann'
TEMP_VECTOR_FILE = 'temp_vectors.json'
TEMP_ID_FILE = 'temp_ids.json'
BUFFER_VECTOR_FILE = 'buffer_vectors.json'
BUFFER_ID_FILE = 'buffer_ids.json'
LOCK_FILE = 'lockfile.lock'
DIMENSIONS = 5

def load_data(filename):
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            data = f.read().strip()
            if data:
                return json.loads(data)
    return []

def save_data(data, filename):
    with open(filename, 'w') as f:
        json.dump(data, f)

async def load_temp_vectors():
    return load_data(TEMP_VECTOR_FILE)

async def save_temp_vectors(vectors):
    save_data(vectors, TEMP_VECTOR_FILE)

async def load_user_ids():
    return load_data(TEMP_ID_FILE)

async def save_user_ids(user_ids):
    save_data(user_ids, TEMP_ID_FILE)

async def load_buffer_vectors():
    return load_data(BUFFER_VECTOR_FILE)

async def save_buffer_vectors(vectors):
    save_data(vectors, BUFFER_VECTOR_FILE)

async def load_buffer_ids():
    return load_data(BUFFER_ID_FILE)

async def save_buffer_ids(user_ids):
    save_data(user_ids, BUFFER_ID_FILE)

async def add_vector_to_buffer_storage(vector_data, user_id, user_gender):
    try:
        buffer_vectors = await load_buffer_vectors()
        buffer_ids = await load_buffer_ids()
        buffer_vectors.append([vector_data, user_id])
        buffer_ids.append([user_id, user_gender])
        await save_buffer_vectors(buffer_vectors)
        await save_buffer_ids(buffer_ids)
    except Exception as e:
        logging.error(f"Error adding vector to buffer storage: {e}")

async def query_index(vector_data, n):
    try:
        index = AnnoyIndex(DIMENSIONS, 'angular')
        index.load(INDEX_FILE)
        nearest_neighbors = index.get_nns_by_vector(vector_data, n, include_distances=False)
        return nearest_neighbors
    except Exception as e:
        logging.error(f"Error querying index: {e}")

async def build_index_from_temp_storage():
    try:
        data = await load_temp_vectors()
        t = AnnoyIndex(5, 'angular')
        for i, vector in enumerate(data):
            t.add_item(i, vector[0])
        t.build(10)
        t.save(INDEX_FILE)
    except Exception as e:
        logging.error(f"Error building index: {e}")

async def filter_recommendations(neighbors, swiper_interested_in):
    try:
        filtered_recommendations = []
        user_ids = await load_user_ids()
        user_ids_dict = {user[0]: user[1] for user in user_ids}
        user_vectors = await load_temp_vectors()  

        swiper_interested_in = swiper_interested_in.strip()

        for neighbor_index in neighbors:
            neighbor = user_vectors[neighbor_index]
            neighbor_id = neighbor[1]
            neighbor_gender = user_ids_dict[neighbor_id]

            if(swiper_interested_in == '"Male"') :
                if(neighbor_gender == "Male") :
                    filtered_recommendations.append(neighbor_id)
            elif (swiper_interested_in == '"Female"'):
                if(neighbor_gender == "Female"):
                    filtered_recommendations.append(neighbor_id)
            elif swiper_interested_in == "Everyone":
                filtered_recommendations.append(neighbor_id)
            elif neighbor_gender == "Not to mention":
                filtered_recommendations.append(neighbor_id)   

        return filtered_recommendations
    except Exception as e:
        logging.error(f"Error filtering recommendations: {e}")

async def merge_buffers_and_build_index():
    lock = FileLock(LOCK_FILE)
    try:
        with lock:
            temp_vectors = await load_temp_vectors()
            temp_ids = await load_user_ids()
            buffer_vectors = await load_buffer_vectors()
            buffer_ids = await load_buffer_ids()

            temp_vectors.extend(buffer_vectors)
            temp_ids.extend(buffer_ids)

            await save_temp_vectors(temp_vectors)
            await save_user_ids(temp_ids)

            await save_buffer_vectors([])
            await save_buffer_ids([])

            if os.path.exists(INDEX_FILE):
                os.remove(INDEX_FILE)

            index = AnnoyIndex(DIMENSIONS, 'angular')
            for i, vector in enumerate(temp_vectors):
                index.add_item(i, vector[0])
            index.build(10)
            index.save(INDEX_FILE)
    except Exception as e:
        logging.error(f"Error merging buffers and building index: {e}")

async def main():
    try:
        command = sys.argv[1]

        if command == "add":
            vector_data = json.loads(sys.argv[2])
            user_id = sys.argv[3]
            user_gender = json.loads(sys.argv[4])
            await add_vector_to_buffer_storage(vector_data, user_id, user_gender)

        elif command == "query":
            vector_data = json.loads(sys.argv[2])
            recommendation_batch_size = int(sys.argv[3])
            swiper_interested_in = sys.argv[4]

            filtered_recommendations = []
            n = recommendation_batch_size

            index = AnnoyIndex(DIMENSIONS, 'angular')
            index.load(INDEX_FILE)
            total_items = index.get_n_items()

            while True:
                if len(filtered_recommendations) >= recommendation_batch_size:
                    break

                if n == total_items:
                    break

                neighbors = await query_index(vector_data, n)
                filtered_recommendations = await filter_recommendations(neighbors, swiper_interested_in)

                if n * 2 >= total_items:
                    n = total_items
                else:
                    n *= 2

            if len(filtered_recommendations) < recommendation_batch_size:
                print(json.dumps(filtered_recommendations))
            else:
                print(json.dumps(filtered_recommendations))

        elif command == "build":
            await build_index_from_temp_storage()

        elif command == "update":
            await merge_buffers_and_build_index()
        else:
            logging.error(f"Unknown command: {command}")
            print("Error: Unknown command", command)
            sys.exit(1)
    except Exception as e:
        logging.error(f"Unhandled exception: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
