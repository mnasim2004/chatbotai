"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Bot } from "@/components/types";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast";
import LoadingSpinner from "@/components/ui/loadingspinner";
import { ChartBar, Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem } from "@/components/ui/form";
import FileUpload from "@/components/ui/fileuploadfield";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert } from "@/components/ui/alert";

interface Message {
    sender: 'user' | 'bot';
    text: string;
  }

const Home= ({ params }: { params: { botId: string } })=> {

    const [chatbot, setChatbot] = useState<Bot>()
    const [isOpen, setIsOpen] = useState(false);
    const handleDialogClose = () => setIsOpen(false);
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const [section, setSection] = useState("edit") 
    const [messages, setMessages] = useState<Message[]>([]);
    const [preview, setPreview] = useState<string | null>(null);
    const [openChat, setOpenChat] = useState(false)
    const [chatmsg, setChatmsg] = useState("")

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          setPreview(URL.createObjectURL(file));
        }
      };
      
    const [form, setForm] = useState({
        name:"", 
        autoopen:false,
        welcome:"", 
        prompt:"", 
        icon:null,
        iconlabel:"",
        foregroundcolor:"#ff0000",
        description:"",
        backgroundcolor:"#00ff00",
        userchatcolor:"#0000ff",
        botchatcolor:"#00ffff",
        usertextcolor:"#ffff00",
        bottextcolor:"#ff00ff",
    })

    const [addForm, setAddForm] = useState<{ files: File[] }>({
        files: []
    });

    const deleteFile = async (file_id: string)=>{
        setIsLoading(true)
        const response = await axios.delete(`http://127.0.0.1:8000/remove-file/${chatbot?._id}/${file_id}`)
        getData()
        toast({
          title: "File Deletion Successfull",
          description: `Bot ID: ${chatbot?._id}`,
          action: (
              <ToastAction altText="OK">OK</ToastAction>
            ),
        })
        setIsLoading(false)
      }

    useEffect(()=>{
        getData()
    },[])

    const onDelete = async () => {
        setIsLoading(true)
        const response = await axios.delete(`http://127.0.0.1:8000/delete-bot/${chatbot?._id}`)
        setIsLoading(false)
        router.push("/all")
        //getData()
        toast({
          title: "Bot Deletion Successfull",
          description: `Bot ID: ${chatbot?._id}`,
          action: (
              <ToastAction altText="OK">OK</ToastAction>
            ),
        })
      }

    const getData = () => {
        axios.get(`http://127.0.0.1:8000/get-chatbot/${params.botId}`)
        .then((response)=>{
            console.log(response.data["data"])
            setForm(response.data["data"])
            setChatbot(response.data["data"])
            setPreview(response.data["data"]["logo"])
        })
    }

    const addFiles = async ()=>{
        setIsLoading(true)
        const formData = new FormData()
        for (const file in addForm["files"]){
          console.log(file)
          formData.append("Files", addForm["files"][file])
        }
        const response = await axios.post(`http://127.0.0.1:8000/add-files/${chatbot?._id}`, formData)
    
        console.log(response.data)
        setIsLoading(false)
        toast({
          title: "File Addition Successfull",
          description: `Bot ID: ${chatbot?._id}`,
          action: (
              <ToastAction altText="OK">OK</ToastAction>
            ),
        })
        getData()
      }

    const submitform = async ()=>{
        setIsLoading(true)
        const formData = new FormData();
        console.log(form)

        for (const [key, value] of Object.entries(form)) {
            console.log(key, value)
            if (key=="logo"){}
            else if (value===""){
                //setIsLoading(false)
                toast({
                    title: "Empty Fields",
                    description: "One or more fields are not defined" + key + value,
                    action: (
                        <ToastAction altText="OK">OK</ToastAction>
                      ),
                })
                return
            }
            else if (typeof value === "boolean") {
                formData.append(key, value ? "true" : "false");
            } else {
                formData.append(key, value as string);
            }
        }
        
        const response = await axios.post(`http://127.0.0.1:8000/edit-chatbot/${params.botId}`, formData, {
            headers: {
                "Content-Type":"multipart/form-data"
            }
        })
        
        setIsLoading(false)
        router.push("/all")
        toast({
            title: "Successfully edited Bot",
            description: `Bot ID: ${response.data.data["_id"]}`,
            action: (
                <ToastAction altText="OK">OK</ToastAction>
              ),
        })
            
        
    }
    
    return (
        <>
        {isLoading && <LoadingSpinner />}
        <main className={`flex min-h-screen max-h-screen gap-10 p-10 bg-black ${isLoading ? 'pointer-none' : ''}`}>

            <div className="w-1/5 bg-inherit h-auto text-white rounded flex flex-col gap-10">

                <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col gap-10">
                        <div className="flex flex-row gap-5">
                            <h1 className="text-4xl  content-center bold">Eazybot.AI</h1>
                            <img src="../image.png" className="pb-3" height={35} width={35}></img>
                        </div>

                        <ul className="flex flex-col">
                            <li>
                                <button onClick={()=>router.push("/all")} className="flex flex-row gap-3 w-full py-4 px-4 rounded-lg hoverbutton">
                                    <img src="../image.png" width={30} height={30}></img>
                                    <div className="content-center text-lg self-end">Chatbot.AI</div>
                                </button>
                            </li>
                            <li>
                                <button onClick={()=>router.push("/dashboard")} className="flex flex-row gap-3 w-full py-4 px-4 rounded-lg hoverbutton">
                                    <img src="../dashboard.png" width={30} height={30}></img>
                                    <div className="content-center text-lg self-end">Dashboard</div>
                                </button>
                            </li>
                            <li>
                                <button onClick={()=>router.push("/billings")} className="flex flex-row gap-3 w-full py-4 px-4 rounded-lg hoverbutton">
                                    <img src="../billing.png" width={30} height={30}></img>
                                    <div className="content-center text-lg self-end">Billings</div>
                                </button>
                            </li>
                            <li>
                                <button onClick={()=>router.push("/support")} className="flex flex-row gap-3 w-full py-4 px-4 rounded-lg hoverbutton">
                                    <img src="../support.png" width={30} height={30}></img>
                                    <div className="content-center text-lg self-end">Support</div>
                                </button>
                            </li>
                        </ul>
                </div>

                <div className="w-full h-[80px] rounded-xl" style={{backgroundColor:"hsl(var(--greyish)"}}>
                    <div className="flex flex-row h-full p-auto px-5 gap-5  ">
                        <div className="h-full p-auto content-center">
                            <img src="../profile.png" className="rounded-full" width={60} height={60}></img>
                        </div>
                        
                        <div className="flex flex-col h-full p-auto w-full justify-center">
                            <div className="bold">
                                John Doe    
                            </div>
                            <div>
                                johndoe@gmail.com
                            </div>
                        </div>
                    </div>
                    
                </div>
                    
                </div>
                
                
            </div>
            <div className="w-4/5 h-auto rounded-lg flex flex-col " style={{backgroundColor:"hsl(var(--greyish)"}}>

                <div className="flex z-[0] flex-row" style={{backgroundColor:"black"}}>
                    <button onClick={()=>setSection("edit")} className="p-3 rounded-t-lg" style={section=="edit" ? { backgroundColor:"hsl(var(--greyish))"} : {}}> Edit </button>
                    <button onClick={()=>setSection("add")} className="p-3 rounded-t-lg" style={section=="add" ? { backgroundColor:"hsl(var(--greyish))"} : {}}> Add/Remove Files </button>
                    <button onClick={()=>setSection("delete")} className="p-3 rounded-t-lg" style={section=="delete" ? { backgroundColor:"hsl(var(--greyish))"} : {}}> Delete </button>
                </div>
                <div className="h-[10px] w-full" style={{backgroundColor:"hsl(var(--greyish)"}}></div>
                <div className="h-full  w-full p-5 overflow-y-auto rounded-lg">
                    {chatbot && section=="edit" && 

                    <form className="flex flex-col gap-3 h-full" onSubmit={submitform}>
                        <div className="flex flex-col gap-1">
                            <label>OpenAI API Key</label>
                            <input disabled value={chatbot.apikey} name="apikey" className="h-10 rounded-lg border-2 px-2" style={{backgroundColor:"hsl(var(--greyish))", borderColor:"hsl(var(--greyish-border))"}} type="text"></input>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label>
                                OpenAI Model Selection
                            </label>
                            <input disabled value={chatbot.model} name="model" className="h-10 rounded-lg border-2 px-2" style={{backgroundColor:"hsl(var(--greyish))", borderColor:"hsl(var(--greyish-border))"}} type="text">
                            </input>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label>Setup Name</label>
                            <input value={form.name} onChange={e=>setForm({...form, [e.target.name]:e.target.value})} name="name" className="h-10 rounded-lg border-2 px-2" style={{backgroundColor:"hsl(var(--greyish))", borderColor:"hsl(var(--greyish-border))"}} type="text"></input>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label>Description</label>
                            <input value={form.description} onChange={e=>setForm({...form, [e.target.name]:e.target.value})} name="description" className="h-10 rounded-lg border-2 px-2" style={{backgroundColor:"hsl(var(--greyish))", borderColor:"hsl(var(--greyish-border))"}} type="text"></input>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label>Welcome Message</label> 
                            <input value={form.welcome} onChange={e=>setForm({...form, [e.target.name]:e.target.value})} name="welcome" className="h-10 rounded-lg border-2 px-2" style={{backgroundColor:"hsl(var(--greyish))", borderColor:"hsl(var(--greyish-border))"}} type="text"></input>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label>Custom Prompt</label> 
                            <input value={form.prompt} onChange={e=>setForm({...form, [e.target.name]:e.target.value})} name="prompt" className="h-10 rounded-lg border-2 px-2" style={{backgroundColor:"hsl(var(--greyish))", borderColor:"hsl(var(--greyish-border))"}} type="text"></input>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label>
                            Chatbot Activation Mode
                            </label>
                            <p style={{color:"gray", fontSize:14}}>
                            Choose whether the chatbot opens automatically upon page load or remains minimized until user interaction.
                            </p>
                            <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="autoopen"
                                checked={form.autoopen}
                                onChange={e=>setForm({...form, [e.target.name]:!form.autoopen})}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                {form.autoopen ? 'On' : 'Off'}
                            </span>
                            </label>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label>
                                Chatbot Icon Selection
                            </label>
                            <div className="image-upload flex flex-row content-space-evenly" >
                                <input
                                    type="file"
                                    name="icon"
                                    accept="image/*"
                                    onChange={(e)=>{
                                        setForm({...form, [e.target.name]:e.target.files?.[0]})
                                        handleImageChange(e)
                                    }}
                                    className="mb-4" 
                                    
                                />
                                {preview && (
                                    <div>
                                    <img
                                        src={preview}
                                        alt="Selected"
                                        className="mb-4 max-w-full h-auto rounded-full"
                                        width={50}
                                        height={50}
                                    />
                                    </div>
                                )}
                                
                            </div>
                            <a onClick={()=>{setForm({...form, ["icon"]:null}); setPreview(chatbot.logo)}}>Reset</a>
                            
                        </div>

                        <div className="flex flex-col gap-1">
                            <label>Icon Label</label>
                            <input value={form.iconlabel} onChange={e=>setForm({...form, [e.target.name]:e.target.value})} name="iconlabel" className="h-10 rounded-lg border-2 px-2" style={{backgroundColor:"hsl(var(--greyish))", borderColor:"hsl(var(--greyish-border))"}} type="text"></input>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label>Welcome Message</label> 
                            <input value={form.welcome} onChange={e=>setForm({...form, [e.target.name]:e.target.value})} name="welcome" className="h-10 rounded-lg border-2 px-2" style={{backgroundColor:"hsl(var(--greyish))", borderColor:"hsl(var(--greyish-border))"}} type="text"></input>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="backgroundcolor">Pick a Background Color:</label>
                            <input
                            type="color"
                            id="color"
                            name="backgroundcolor"
                            className="p-0 border-0"
                            style={{backgroundColor:"black", width:50, height:50}}
                            value={form.backgroundcolor}
                            onChange={(e)=>setForm({...form, [e.target.name]:e.target.value})}
                            ></input>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="backgroundcolor">Pick a Foreground Color:</label>
                            <input
                            type="color"
                            id="color"
                            name="foregroundcolor"
                            className="p-0 border-0"
                            style={{backgroundColor:"black", width:50, height:50}}
                            value={form.foregroundcolor}
                            onChange={(e)=>setForm({...form, [e.target.name]:e.target.value})}
                            ></input>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="backgroundcolor">Pick a User Message Color:</label>
                            <input
                            type="color"
                            id="color"
                            name="userchatcolor"
                            className="p-0 border-0"
                            style={{backgroundColor:"black", width:50, height:50}}
                            value={form.userchatcolor}
                            onChange={(e)=>setForm({...form, [e.target.name]:e.target.value})}
                            ></input>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="backgroundcolor">Pick a Bot Message Color:</label>
                            <input
                            type="color"
                            id="color"
                            name="botchatcolor"
                            className="p-0 border-0"
                            style={{backgroundColor:"black", width:50, height:50}}
                            value={form.botchatcolor}
                            onChange={(e)=>setForm({...form, [e.target.name]:e.target.value})}
                            ></input>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="backgroundcolor">Pick a Bot Text Color:</label>
                            <input
                            type="color"
                            id="color"
                            name="bottextcolor"
                            className="p-0 border-0"
                            style={{backgroundColor:"black", width:50, height:50}}
                            value={form.bottextcolor}
                            onChange={(e)=>setForm({...form, [e.target.name]:e.target.value})}
                            ></input>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="backgroundcolor">Pick a User Text Color:</label>
                            <input
                            type="color"
                            id="color"
                            name="usertextcolor"
                            className="p-0 border-0"
                            style={{backgroundColor:"black", width:50, height:50}}
                            value={form.usertextcolor}
                            onChange={(e)=>setForm({...form, [e.target.name]:e.target.value})}
                            ></input>
                        </div>

                        <div className="flex w-full pb-5 justify-end"><button onClick={(e)=>{e.preventDefault();submitform()}} className="p-2 rounded-lg" style={{backgroundColor:"hsl(var(--greyish-border))"}}>Submit</button></div>

                        </form>
                    }
                    {section=="add" && 
                        <>
                        <div className="mb-4">
                            <Label className="ml-1">Files</Label>
                            <Alert style={{backgroundColor:"hsl(var(--greyish-border))"}}>
                                <Table>
                                <TableHeader>
                                    <TableRow>
                                    <TableHead>File ID</TableHead>
                                    <TableHead>Filename</TableHead>
                                    <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {chatbot?.files.map((file) => (
                                    <TableRow key={file.file_id}>
                                        <TableCell style={{wordWrap:"break-word",overflowWrap:"anywhere",whiteSpace:"normal", width:"50%", overflowX:"clip"}}>{file.file_id}</TableCell>
                                        <TableCell style={{wordWrap:"break-word",overflowWrap:"anywhere",whiteSpace:"normal", width:"50%", overflowX:"clip"}}>{file.name}</TableCell>
                                        <TableCell><Button variant={"ghost"} onClick={()=>deleteFile(file.file_id)}>X</Button></TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                                </Table>
                            </Alert>
                        </div>
                        
                        <form className="flex flex-col gap-3 h-full" onSubmit={submitform}>


                        <FileUpload  label="Upload Files" isMultiple onChange={(files) => setAddForm({...addForm, ["files"]:files})} />
                        
                                    
                        
                        <button onClick={(e)=>{e.preventDefault();addFiles()}} className="p-2 rounded-lg" style={{backgroundColor:"hsl(var(--greyish-border))"}}>Submit</button>
                        </form>
                        </>
                    }
                    {section=="delete" && <>
                        <h1 className="text-xl bold rounded-lg mb-5">Are you sure you want to delete this bot</h1>

                        <div className="flex w-full pb-5 justify-end"><button onClick={(e)=>{e.preventDefault();onDelete()}} className="p-2 rounded-lg" style={{backgroundColor:"hsl(var(--greyish-border))"}}>Delete</button></div>
                    </>    
                    }
                
                </div>
            </div>
        </main>
        </>
  );
}

export default Home
