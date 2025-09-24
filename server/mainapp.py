import base64
import json
import re
import tempfile
from typing import List
import requests
from fastapi import FastAPI, File, Form, Request, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from openai import OpenAI
from bson import ObjectId
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import openai
import pandas as pd
from pymongo.mongo_client import MongoClient
import os
from datetime import datetime



load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

MONGODB_URI = os.getenv("MONGODB_URI")
IMGBB_API_KEY = os.getenv("IMGBB_API_KEY")
openai.api_key = OPENAI_API_KEY
mclient = MongoClient(MONGODB_URI)
db = mclient["chatbot-manager"]

client = OpenAI()

assistants = client.beta.assistants.list()
print(assistants)
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




@app.post("/create-chatbot")
async def create_chatbot(
    avatarurl: str = Form(None),
    send: str = Form(None),
    placeholder: str = Form(None),
    headercolor: str = Form(...),
    headersize: int = Form(...),
    chatbotsize_x: int = Form(...),
    chatbotsize_y: int = Form(...),
    avatar: UploadFile = File(None),
    iconsize: int = Form(...),
    faqs: str = Form(None),
    audioinput: bool = Form(...),
    apikey: str = Form(...),
    model: str = Form(...),
    name: str = Form(...),
    desktop: bool = Form(...),
    mobile: bool = Form(...),
    autoopen: str = Form(...),
    welcome: str = Form(...),
    prompt: str = Form(...),
    icon: UploadFile = File(None),
    iconlabel: str = Form(...),
    foregroundcolor: str = Form(...),
    backgroundcolor: str = Form(...),
    userchatcolor: str = Form(...),
    botchatcolor: str = Form(...),
    usertextcolor: str = Form(...),
    bottextcolor: str = Form(...),
    iconurl: str = Form(...),
    files: List[UploadFile] = File(...),
    description: str = Form(...)
):

    client = openai.OpenAI(api_key=apikey)
    file_ids = []
    file_list = []
    vs = ""
    assistant = ""
    
    for file in files:
        
        if file.filename.endswith('.csv'):
            with tempfile.NamedTemporaryFile(delete=False, suffix=".json") as tmp:
                # Read CSV file into pandas DataFrame
                df = pd.read_csv(file.file)               
                # Write DataFrame to JSON file
                df.to_json(tmp.name, orient='records', lines=True)
                
                # Get the path of the temporary file
                temp_file_path = tmp.name
        else:
            with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file.filename.split('.')[-1]}") as temp_file:
                    # Write the content of the uploaded file to the temporary file
                    temp_file.write(await file.read())
                    temp_file_path = temp_file.name

        xfile = client.files.create(file=open(temp_file_path, "rb"), purpose='assistants')
        file_ids.append(xfile.id)
        file_list.append({"name":file.filename, "file_id":xfile.id})

    if faqs:
        
        faqs = [{"question":faq.split("??")[0], "answer":faq.split("??")[1]} for faq in faqs.split("##") if faq!=""]
        with tempfile.NamedTemporaryFile(mode='w+', suffix='.json', delete=False) as temp_file:
            json.dump(faqs, temp_file, indent=4)
            temp_file_path = temp_file.name
        xfile = client.files.create(file=open(temp_file_path, "rb"), purpose='assistants')
        file_ids.append(xfile.id)
        file_list.append({"name":"faqs", "file_id":xfile.id})
        
    vs = client.beta.vector_stores.create(name=name, file_ids=file_ids)
    assistant = client.beta.assistants.create(
        instructions="You are a bot named " + name + ". Answer the questions based on the files uploaded. If the question is provided in the json, answer appropriately and exactly as given. Do not mention the existence of the files. Pretend it is part of your knowledge as the bot. "+ prompt,
        name=name,
        model=model,
        tools=[{"type": "file_search"}],  
        tool_resources={
                "file_search": {
                "vector_store_ids": [vs.id]
                }
        }  
    )
    
    if icon and not iconurl:
        image_data_bytes = await icon.read()
        image_base64 = base64.b64encode(image_data_bytes).decode('utf-8')
        url = "https://api.imgbb.com/1/upload"
        payload = {
            "key": IMGBB_API_KEY,
            "image": image_base64
        }
        response = requests.post(url, payload)
        result = json.loads(response.text)
        LogoURL = result["data"]["url"]
    else:
        LogoURL = iconurl

    if avatar and not avatarurl:
        image_data_bytes = await avatar.read()
        image_base64 = base64.b64encode(image_data_bytes).decode('utf-8')
        url = "https://api.imgbb.com/1/upload"
        payload = {
            "key": IMGBB_API_KEY,
            "image": image_base64
        }
        response = requests.post(url, payload)
        result = json.loads(response.text)
        avatarURL = result["data"]["url"]
    else:
        avatarURL = avatarurl

    obj = {
        "iconlabel":iconlabel,
        "apikey":apikey,
        "prompt":prompt,
        "welcome":welcome,
        "autoopen":autoopen=="true",
        "model":model,
        "name":name,
        "assistant_id":assistant.id,
        "vector_store_id":vs.id,
        "mobile":mobile,
        "desktop":desktop,
        "files":file_list,
        "created":str(datetime.now()),
        "description":description,
        "logo":LogoURL,
        "foregroundcolor":foregroundcolor,
        "backgroundcolor":backgroundcolor,
        "usertextcolor":usertextcolor,
        "userchatcolor":userchatcolor,
        "botchatcolor":botchatcolor,
        "bottextcolor":bottextcolor,
        "conversations":[],
        "faq_file_id":xfile.id,
        "avatar": avatarURL,
        "send": send,
        "placeholder": placeholder,
        "headercolor": headercolor,
        "headersize": headersize,
        "chatbotsize_x": chatbotsize_x,
        "chatbotsize_y": chatbotsize_y,
        "iconsize": iconsize,
        "faqs": faqs,
        "audioinput": audioinput,
    }
    result = db.chatbots.insert_one(obj)
    obj["_id"] = str(result.inserted_id)

    return JSONResponse(content={"message":"Successfully created chatbot", "data":obj}, status_code=200)


@app.get("/get-chatbot/{BotUniqueID}")
async def get_chatbot(BotUniqueID: str):
    chatbot = db.chatbots.find_one({"_id":ObjectId(BotUniqueID)})
    
    if not chatbot:
         return JSONResponse(content={"error":"A chatbot with this unique id does not exist"}, status_code=400)

    chatbot["_id"] = str(chatbot["_id"])

    return JSONResponse(content={"message":"Successfully retrieved chatbot", "data":chatbot}, status_code=200)


@app.post("/edit-chatbot/{BotUniqueID}")
async def edit_chatbot(
    BotUniqueID: str,
    avatarurl: str = Form(None),
    send: str = Form(None),
    placeholder: str = Form(None),
    headercolor: str = Form(...),
    headersize: int = Form(...),
    chatbotsize_x: int = Form(...),
    chatbotsize_y: int = Form(...),
    avatar: UploadFile = File(None),
    iconsize: int = Form(...),
    faqs: str = Form(None),
    audioinput: bool = Form(...),
    apikey: str = Form(...),
    model: str = Form(...),
    name: str = Form(...),
    autoopen: str = Form(...),
    welcome: str = Form(...),
    desktop: bool = Form(...),
    mobile: bool = Form(...),
    prompt: str = Form(...),
    icon: UploadFile = File(None),
    iconlabel: str = Form(...),
    foregroundcolor: str = Form(...),
    backgroundcolor: str = Form(...),
    userchatcolor: str = Form(...),
    botchatcolor: str = Form(...),
    usertextcolor: str = Form(...),
    bottextcolor: str = Form(...),
    iconurl: str = Form(...),
    files: List[UploadFile] = File(None),
    description: str = Form(...)
):
    
    exists = db.chatbots.find_one({"_id":ObjectId(BotUniqueID)})
    if not exists:
         return JSONResponse(content={"error":"A chatbot with this unique id does not exist"}, status_code=400)
    

    client = openai.OpenAI(api_key=apikey)
    file_ids = []
    file_list = []
    vs = ""
    assistant = ""

    if faqs:
        
        faqs = [{"question":faq.split("??")[0], "answer":faq.split("??")[1]} for faq in faqs.split("##") if faq!=""]
        with tempfile.NamedTemporaryFile(mode='w+', suffix='.json', delete=False) as temp_file:
            json.dump(faqs, temp_file, indent=4)
            temp_file_path = temp_file.name
        xfile = client.files.create(file=open(temp_file_path, "rb"), purpose='assistants')
        file_ids.append(xfile.id)
        file_list.append({"name":"faqs", "file_id":xfile.id})
        
    client.beta.vector_stores.files.create(vector_store_id=exists["vector_store_id"], file_id=xfile.id)
    
    if icon and not iconurl:
        image_data_bytes = await icon.read()
        image_base64 = base64.b64encode(image_data_bytes).decode('utf-8')
        url = "https://api.imgbb.com/1/upload"
        payload = {
            "key": IMGBB_API_KEY,
            "image": image_base64
        }
        response = requests.post(url, payload)
        result = json.loads(response.text)
        LogoURL = result["data"]["url"]
    else:
        LogoURL = iconurl

    if avatar and not avatarurl:
        image_data_bytes = await avatar.read()
        image_base64 = base64.b64encode(image_data_bytes).decode('utf-8')
        url = "https://api.imgbb.com/1/upload"
        payload = {
            "key": IMGBB_API_KEY,
            "image": image_base64
        }
        response = requests.post(url, payload)
        result = json.loads(response.text)
        avatarURL = result["data"]["url"]
    else:
        avatarURL = avatarurl

    obj = {
        "iconlabel":iconlabel,
        "apikey":apikey,
        "prompt":prompt,
        "welcome":welcome,
        "autoopen":autoopen=="true",
        "model":model,
        "name":name,
        "created":str(datetime.now()),
        "description":description,
        "iconurl":LogoURL,
        "foregroundcolor":foregroundcolor,
        "backgroundcolor":backgroundcolor,
        "usertextcolor":usertextcolor,
        "userchatcolor":userchatcolor,
        "botchatcolor":botchatcolor,
        "mobile":mobile,
        "desktop":desktop,
        "bottextcolor":bottextcolor,
        "conversations":[],
        "avatarurl": avatarURL,
        "send": send,
        "placeholder": placeholder,
        "headercolor": headercolor,
        "headersize": headersize,
        "chatbotsize_x": chatbotsize_x,
        "chatbotsize_y": chatbotsize_y,
        "iconsize": iconsize,
        "faqs": faqs,
        "audioinput": audioinput,
    }

    db.chatbots.update_one({"_id":ObjectId(BotUniqueID)}, {"$set":obj})

    return JSONResponse(content={"message":"Successfully edited chatbot"}, status_code=200)


@app.delete("/remove-file/{BotUniqueID}/{File_id}")
def remove_files(BotUniqueID: str, File_id:str):

    current = db.chatbots.find_one({"_id":ObjectId(BotUniqueID)})
    if not current:
         return JSONResponse(content={"error":"A chatbot with this unique id does not exist"}, status_code=400)
    
    files = client.beta.vector_stores.files.list(vector_store_id=current["vector_store_id"])
    print(files)

    updated_files = [file for file in current['files'] if file['file_id'] != File_id]
    
    client.beta.vector_stores.files.delete(vector_store_id=current["vector_store_id"], file_id=File_id)
    client.files.delete(file_id=File_id)

        
    db.chatbots.update_one(
        {"_id": ObjectId(BotUniqueID)},
        {"$set": {"files": updated_files}}
    )

    return JSONResponse(content={"message":"Successfully removed files from chatbot"}, status_code=200)

@app.post("/add-files/{BotUniqueID}")
async def add_files(BotUniqueID: str, Files: List[UploadFile] = File(...)):
     
    current = db.chatbots.find_one({"_id":ObjectId(BotUniqueID)})
    if not current:
         return JSONResponse(content={"error":"A chatbot with this unique id does not exist"}, status_code=400)

    file_list = []

    for file in Files:
        
        if file.filename.endswith('.csv'):
            with tempfile.NamedTemporaryFile(delete=False, suffix=".json") as tmp:
                # Read CSV file into pandas DataFrame
                df = pd.read_csv(file.file)               
                # Write DataFrame to JSON file
                df.to_json(tmp.name, orient='records', lines=True)
                
                # Get the path of the temporary file
                temp_file_path = tmp.name
        else:
            with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file.filename.split('.')[-1]}") as temp_file:
                    # Write the content of the uploaded file to the temporary file
                    temp_file.write(await file.read())
                    temp_file_path = temp_file.name
        xfile = client.files.create(file=open(temp_file_path, "rb"), purpose='assistants')
         
        client.beta.vector_stores.files.create(vector_store_id=current["vector_store_id"], file_id=xfile.id)
        file_list.append({"name":file.filename, "file_id":xfile.id})
    
    newfiles = current["files"] + file_list 
        
    result = db.chatbots.update_one(
        {"_id": ObjectId(BotUniqueID)},
        {"$set": {"files": newfiles}}
    )

    current["files"] = newfiles
    current["_id"] = str(current["_id"])
    

    return JSONResponse(content={"message":"Successfully added files from chatbot", "data":current}, status_code=200)  
    

@app.get("/get-all-models")
def get_models():
    k = client.models.list()
    print(k)
    modelids = [x.id for x in k.data]

    return JSONResponse(content={"data":modelids}, status_code=200)



@app.get("/get-all-bots")
def get_all_bots():
    bots = db.chatbots.find({})
    bots = list(bots)
    for i,bot in enumerate(bots):
        bots[i]["_id"] = str(bot["_id"])

    return JSONResponse(content={"data":list(bots)}, status_code=200)


@app.delete("/delete-bot/{BotUniqueID}")
def delete_bots(BotUniqueID: str):
    todelete = db.chatbots.find_one({"_id":ObjectId(BotUniqueID)})
    if not todelete:
         return JSONResponse(content={"error":"A chatbot with this unique id does not exist"}, status_code=400)


    client.beta.assistants.delete(todelete["assistant_id"])
    client.beta.vector_stores.delete(todelete["vector_store_id"])
    for file in todelete["files"]:
        client.files.delete(file["file_id"])    
    
    result = db.chatbots.delete_one({"_id":ObjectId(BotUniqueID)})

    return JSONResponse(content={"message":"Bot deleted successfully"}, status_code=200)


@app.post("/get-response/{BotUniqueID}")
async def delete_bots(BotUniqueID: str, request: Request):
    chatbot = db.chatbots.find_one({"_id":ObjectId(BotUniqueID)})
    if not chatbot:
         return JSONResponse(content={"error":"A chatbot with this unique id does not exist"}, status_code=400)
    
    body = await request.json()
    thread = client.beta.threads.create()
    run = client.beta.threads.runs.create_and_poll(
                thread_id=thread.id,
                assistant_id=chatbot["assistant_id"],
                instructions= "Based on the files provided, answer the following question: " + body["Question"]
    )
    print(run)
    if run.status == "failed":
        return JSONResponse(content={"error": "run failed"}, status_code=400)
    
    messages = client.beta.threads.messages.list(
            thread_id=thread.id,
            run_id=run.id
            )
    client.beta.threads.delete(thread_id=thread.id)
    message = messages.data[0].content[0].text.value

    cleaned_message = re.sub(r'【.*?】', '', message)
    db.chatbots.update_one({"_id":ObjectId(BotUniqueID)}, {"$push":{"conversations":{"question":body["Question"], "response":cleaned_message, "time":str(datetime.now())}}})
    return JSONResponse(content={"data":cleaned_message}, status_code=200)

    
    







@app.get("/chatbot/{BotUniqueID}")
def read_item(BotUniqueID: str):
    chatbot = db.chatbots.find_one({"_id":ObjectId(BotUniqueID)})
    if not chatbot:
         return JSONResponse(content={"error":"A chatbot with this unique id does not exist"}, status_code=400)
    chatbot["_id"] = str(chatbot["_id"])
    chatbot["thread_id"] = client.beta.threads.create().id


    return JSONResponse(content={"data":chatbot}, status_code=200)


    
