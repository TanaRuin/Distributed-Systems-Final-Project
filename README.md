# Distributed-Systems-Final-Project 

**Topic:** LLM-In-The-Chat: A Distributed Group Chat System for Human-AI Collaboration

**Members:**
- Ella Raputri (2702298154) 
- Ellis Raputri (2702298116)
- Vammy Johannis Jiang (2702368122)

**Class:** L5AC

<br>

## Project Description
This project is a chat system that incorporates many AI models in a group chat. This research project explores a combination of a variety of distributed system architectures, such as caching, web-socket, context-synchronization protocol (message queue), and LLM message router. The project also implemented a leader election system that utilizes the LLM-judge-based approach to evaluate each in-chat LLM response. This study uses foundation models (llama3, qwen2, and mistral) as in-chat models, while Gemini serves as the judge. To benchmark the architecture in stress conditions, we provided 8 scenarios, which are the combination of situations when the server crashes, message storm, and in-chat model crashes. In each scenario, we evaluated the latency for the messages, AI response, queue time, recovery time, and leader election time. 

<br>

## Setup Process

- Download the zip file or clone the repository.

- Change directory to the respective directory.
    ```text
    cd Distributed-Systems-Final-Project 
    ```

- Copying and completing the .env files. In the frontend and backend folder, each has a env.dist file. Copy that file and change its name to .env. Then, complete the .env file with the information needed.

- Setup docker. Run your Docker Desktop, then setup the container by typing the following commands.
    ```text
    cd backend
    docker-compose up -d
    ```

- Installing all dependencies. Run the below command in both frontend and backend folder.
    ```text
    npm install
    ```

- Running frontend.
    ```text
    npm run dev
    ```

- Running backend. There are 2 servers for backend, thus you can choose either one of them or both of them.
    ```text
    npm run dev
    npm run dev2
    ```

<br>

## Benchmark Results
The complete benchmark result can be accessed in [here](https://docs.google.com/spreadsheets/d/1Mn7eMSDqh69Tk2baSawtFYaUFQCOAJDQ8ODJajgUyX4/edit?usp=sharing)

<br>

## Demo Video
To access the demo video, please refer to this [link]()