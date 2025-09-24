"use client";
import { Key, useEffect, useState } from "react";
import LoadingSpinner from "@/components/ui/loadingspinner";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import axios from "axios";
import FileUpload from "@/components/ui/fileuploadfield";
import FAQForm from "@/components/ui/faqform";
import LogoDropdown from "@/components/ui/logoselect";
import SendDropdown from "@/components/ui/sendbutton";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ChatBot from "@/components/botembed";

interface Message {
    sender: 'user' | 'bot';
    text: string;
  }

  interface FAQ {
    question: string;
    answer: string;
  }

const Home= ({ params }: { params: { botId: string } })=> {

    const router = useRouter()
    const [chatbot, setChatbot] = useState<any>()
    const [isLoading, setIsLoading] = useState(false)
    const [section, setSection] = useState("create") 
    const [messages, setMessages] = useState<Message[]>([]);
    const [preview, setPreview] = useState<string | null>(null);
    const [avatarpreview, setAvatarPreview] = useState<string | null>(null);
    const [openChat, setOpenChat] = useState(false)
    const [chatmsg, setChatmsg] = useState("")
    const [sendpreview, setSendPreview] = useState<string | null>(null);
    const [weburl, setWeburl] = useState("")
    const [options, setOptions] = useState([])
    const [addForm, setAddForm] = useState<{ files: File[] }>({
        files: []
    });
    

    const [isOpen, setIsOpen] = useState(false);
    const handleDialogClose = () => setIsOpen(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const getoptions = async () =>{
    const response = await axios.get("http://127.0.0.1:8000/get-all-models", {
        headers: {
            "Content-Type":"multipart/form-data"
        }
    })
    setOptions(response.data.data)
  }

  useEffect(()=>{
    getoptions()
  }, [])

  
    const [form, setForm] = useState<{
        desktop: boolean;
        mobile: boolean;
        avatarurl: string;
        send: string | null;
        placeholder: string;
        headercolor: string;
        headersize: number;
        chatbotsize_x: number;
        chatbotsize_y: number;
        avatar: File | null;
        iconsize: number;
        faqs: FAQ[];
        audioinput: boolean;
        apikey: string;
        model: string;
        name: string;
        autoopen: boolean;
        welcome: string;
        prompt: string;
        icon: File | null;
        iconlabel: string;
        foregroundcolor: string;
        files: File[];
        description: string;
        backgroundcolor: string;
        userchatcolor: string;
        botchatcolor: string;
        usertextcolor: string;
        bottextcolor: string;
        iconurl: string;
      }>({
        desktop:true,
        mobile:true,
        avatarurl:"",
        iconurl: "",
        send: "",
        placeholder:"",
        headercolor:"#ffffff",
        headersize: 40,
        chatbotsize_x:  400,
        chatbotsize_y:  300,
        avatar: null,
        audioinput: false,
        faqs:[],
        apikey:"",
        iconsize: 50,
        model:"",
        name:"", 
        autoopen:false,
        welcome:"", 
        prompt:"", 
        icon:null,
        iconlabel:"",
        foregroundcolor:"#ff0000",
        files: [],
        description:"",
        backgroundcolor:"#00ff00",
        userchatcolor:"#0000ff",
        botchatcolor:"#00ffff",
        usertextcolor:"#ffff00",
        bottextcolor:"#ff00ff",
    })

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
            response.data["data"]["icon"] = null
            response.data["data"]["avatar"] = null
            
            console.log(response.data["data"])
            setForm(response.data["data"])
            setChatbot(response.data["data"])
            setPreview(response.data["data"]["iconurl"])
            setAvatarPreview(response.data["data"]["avatarurl"])
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
        //setIsLoading(true)
        const formData = new FormData();
        console.log(form)

        for (const [key, value] of Object.entries(form)) {
            console.log(key, value)
            if (value==undefined || value==null ) {
                if ((key=="avatar" || key=="avatarurl" || key=="icon" || key=="iconurl")) {continue}
                toast({
                    title: "Empty Fields",
                    description: "Field is not defined: " + key,
                    action: (
                        <ToastAction altText="OK">OK</ToastAction>
                      ),
                })
                setIsLoading(false)
                return
            }
            else if (key=="files" || key=="faqs"){}

            else if (typeof value === "boolean") {
                formData.append(key, value ? "true" : "false");
            } else {
                formData.append(key, value as string);
            }
        }
        let faqstring = "##"
        for (let faq of form.faqs){

            if (faq.answer && faq.question){
                faqstring += faq.question.replace("#","") + "??" + faq.answer.replace("#","") +  "##"
            }
        }
        formData.append("faqs", faqstring)
        
        const response = await axios.post(`http://127.0.0.1:8000/edit-chatbot/${params.botId}`, formData, {
            headers: {
                "Content-Type":"multipart/form-data"
            }
        })
        
        setIsLoading(false)
        router.push("/all")
        toast({
            title: "Successfully edited Bot",
            description: `Bot ID: ${params.botId}`,
            action: (
                <ToastAction altText="OK">OK</ToastAction>
              ),
        })
            
        
    }

    
    

    return (
        <>
        {isLoading && <LoadingSpinner />}
        <main className={`flex min-h-screen max-h-screen gap-10 p-10 bg-black overflow-y-hidden ${isLoading ? 'pointer-none' : ''}`}>

            <div className="w-1/5 bg-inherit h-auto text-white rounded flex gap-10 flex-col">

                <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col gap-10">
                        <div className="flex flex-row gap-5">
                            <h1 className="text-4xl  content-center bold">InstantBot.AI</h1>
                            <img src="../image.png" className="pb-3" height={35} width={35}></img>
                        </div>  

                        <ul className="flex flex-col">
                            <li>
                                <button onClick={()=>router.push("/all")} className="flex flex-row gap-3 w-full py-4 px-4 rounded-lg hoverbutton" style={{ backgroundColor:"hsl(var(--greyish))"}}>
                                    <img src="../image.png" width={30} height={30}></img>
                                    <div className="content-center text-lg self-end">Chatbot.AI</div>
                                </button>
                            </li>
                            <li>
                                <button onClick={()=>router.push("/dashboard")} className="flex flex-row gap-3 w-full py-4 px-4 rounded-lg hoverbutton" >
                                    <img src="../dashboard.png" width={30} height={30}></img>
                                    <div className="content-center text-lg self-end">Dashboard</div>
                                </button>
                            </li>
                            <li>
                                <button onClick={()=>router.push("/billings")} className="flex flex-row gap-3 w-full py-4 px-4 rounded-lg hoverbutton" >
                                    <img src="../billing.png" width={30} height={30}></img>
                                    <div className="content-center text-lg self-end">Billings</div>
                                </button>
                            </li>
                            <li>
                                <button onClick={()=>router.push("/support")} className="flex flex-row gap-3 w-full py-4 px-4 rounded-lg hoverbutton" >
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
                    <div className="p-3 rounded-t-lg" style={section=="create" ? { backgroundColor:"hsl(var(--greyish))"} : {}}> Create </div>
                    <div  className="p-3 rounded-t-lg" style={section=="customize" ? { backgroundColor:"hsl(var(--greyish))"} : {}}> Customize </div>
                    <div  className="p-3 rounded-t-lg" style={section=="preview" ? { backgroundColor:"hsl(var(--greyish))"} : {}}> Preview </div>
                </div>
                <div className="h-[10px] w-full" style={{backgroundColor:"hsl(var(--greyish)"}}></div>
                <div className="h-full  w-full p-5 overflow-y-auto rounded-lg">
                <h1 className="text-xl bold rounded-lg mb-5">Config OpenAI</h1>
                <form className="flex flex-col gap-3 h-full" onSubmit={submitform}>
                    {section=="create" && 
                        <>
                        <div className="flex flex-col gap-1">
                            <label>OpenAI API Key</label>
                            <input value={form.apikey} onChange={e=>setForm({...form, [e.target.name]:e.target.value})} name="apikey" className="h-10 rounded-lg border-2 px-2" style={{backgroundColor:"hsl(var(--greyish))", borderColor:"hsl(var(--greyish-border))"}} type="text"></input>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label>
                                OpenAI Model Selection
                            </label>
                            <select 
                                value={form.model} 
                                onChange={e => setForm({ ...form, model: e.target.value })} 
                                name="model" 
                                className="h-10 rounded-lg border-2 px-2" 
                                style={{ backgroundColor: "hsl(var(--greyish))", borderColor: "hsl(var(--greyish-border))" }}
                            >
                                {options.map((option, index) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <h1 className="text-xl bold rounded-lg mb-5">Setup Bot</h1>
                        <div className="flex flex-col gap-1">
                            <label>Setup Name</label>
                            <input value={form.name} onChange={e=>setForm({...form, [e.target.name]:e.target.value})} name="name" className="h-10 rounded-lg border-2 px-2" style={{backgroundColor:"hsl(var(--greyish))", borderColor:"hsl(var(--greyish-border))"}} type="text"></input>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label>
                            Audio Input Option
                            </label>
                            <p style={{color:"gray", fontSize:14}}>
                            Enable or disable the ability for users to provide audio inputs.                            </p>
                            <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="audioinput"
                                checked={form.audioinput}
                                onChange={e=>setForm({...form, [e.target.name]:!form.audioinput})}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                {form.autoopen ? 'On' : 'Off'}
                            </span>
                            </label>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label>Description</label>
                            <p style={{color:"gray", fontSize:14}}>
                            A brief description about the bot                            
                            </p> 
                            <input value={form.description} onChange={e=>setForm({...form, [e.target.name]:e.target.value})} name="description" className="h-10 rounded-lg border-2 px-2" style={{backgroundColor:"hsl(var(--greyish))", borderColor:"hsl(var(--greyish-border))"}} type="text"></input>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label>Custom Prompt</label>
                            <p style={{color:"gray", fontSize:14}}>
                            Enter a text prompt that instructs the chatbot on how to respond or behave during interactions.                            
                            </p>  
                            <textarea value={form.prompt} onChange={e=>setForm({...form, [e.target.name]:e.target.value})} name="prompt" className="h-20 rounded-lg border-2 px-2" style={{backgroundColor:"hsl(var(--greyish))", borderColor:"hsl(var(--greyish-border))"}} ></textarea>
                        </div>
                        <div className="image-upload flex flex-row content-space-evenly flex flex-col gap-1" >
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
                                    {chatbot?.files.map((file: { file_id: string; name: string; }) => (
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


                        <FileUpload  label="Upload Files" isMultiple onChange={(files) => setAddForm({...addForm, ["files"]:files})} />
                        
                                    
                        
                        <button onClick={(e)=>{e.preventDefault();setAddForm({files:[]});addFiles()}} className="p-2 rounded-lg" style={{backgroundColor:"hsl(var(--greyish-border))"}}>Submit</button>
                                
                        </div>

                        <div className="flex flex-col gap-1">
                            <label>Add FAQs</label>
                            <p style={{color:"gray", fontSize:14}}>
                            Upload specific questions and answers that the chatbot should use to assist users effectively.                            
                            </p> 
                            <FAQForm onFaqHandle={(faq)=>{setForm({...form, faqs: faq});}}></FAQForm>
                        </div>

                            

                        <div className="flex w-full pb-5 justify-end"><button onClick={()=>setSection("customize")} className="p-2 rounded-lg" style={{backgroundColor:"hsl(var(--greyish-border))"}}>Next</button></div>

                        </>
                    }
                    {section=="customize" && 
                        <div className="flex flex-row gap-2">
                        <div className="flex flex-col gap-3 w-2/3">
                        <div className="flex flex-col gap-1">
                            <div className="flex flex-row gap-2 mb-2">
                                <button style={form.desktop ? {backgroundColor:"hsl(var(--greyish))", borderColor:"hsl(var(--greyish-border))"} : {backgroundColor:"hsl(var(--greyish))", borderColor:"white"}} 
                                className="border-2 rounded-lg p-2 w-1/2" 
                                onClick={(e)=>{e.preventDefault();setForm({...form, desktop:!form.desktop})}}>
                                Desktop
                                </button>
                                <button style={form.mobile ? {backgroundColor:"hsl(var(--greyish))", borderColor:"hsl(var(--greyish-border))"} : {backgroundColor:"hsl(var(--greyish))", borderColor:"white"}} 
                                className="border-2 rounded-lg p-2 w-1/2" 
                                onClick={(e)=>{e.preventDefault();setForm({...form, mobile:!form.mobile})}}>
                                Mobile
                                </button>
                            </div>
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
                            <p style={{color:"gray", fontSize:14}}>
                            Select from a gallery of icons or upload your own to represent the chatbot on your website. 
                            </p>
                            <LogoDropdown 
                            onImageSelect={(e)=>{
                                setForm({...form, icon:e.target.files?.[0]!=undefined ? e.target.files?.[0]: null, iconurl:""})
                                setPreview(e.target.value)
                            }} 
                            onLogoChange={(e)=>{setForm({...form, iconurl:e, icon:null}); setPreview(e)}}
                            preview={preview}
                            setPreview={setPreview}
                            >

                            </LogoDropdown>
                            
                        </div>

                        <div className="flex flex-col gap-1">
                            <label>Chatbot Icon Size</label>
                            <p style={{color:"gray", fontSize:14}}>
                            Select Size of icons 
                            </p>
                            <select
                                id="iconsize-select"
                                name="iconsize"
                                value={form.iconsize}
                                onChange={e=>setForm({...form, iconsize:parseInt(e.target.value)})}
                                style={{backgroundColor:"hsl(var(--greyish))", borderColor:"hsl(var(--greyish-border))"}}
                                className="block w-full mt-1 mb-3 h-[40px] bg-inherit rounded-lg sm:text-sm px-2 border-2"
                            >
                                {[{"name":"S", "value":20},{"name":"M", "value":30},{"name":"L", "value":40}].map((logo, index) => (
                                <option key={index} value={logo.value}>

                                    {logo.name}
                                </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label>Icon Label Customisation</label>
                            <p style={{color:"gray", fontSize:14}}>
                            Toggle the visibility and edit the text label displayed near the chatbot Icon
                            </p>
                            <input value={form.iconlabel} onChange={e=>setForm({...form, [e.target.name]:e.target.value})} name="iconlabel" className="h-10 rounded-lg border-2 px-2" style={{backgroundColor:"hsl(var(--greyish))", borderColor:"hsl(var(--greyish-border))"}} type="text"></input>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label>
                            Chatbot Avatar
                            </label>
                            <p style={{color:"gray", fontSize:14}}>
                            Select or upload an image to serve as the chatbot's avatar                            </p>
                            <LogoDropdown 
                            onImageSelect={(e)=>{
                                setForm({...form, avatar:e.target.files?.[0]!=undefined ? e.target.files?.[0]: null, avatarurl:""})
                                const file = e.target.files?.[0];
                                    if (file) {
                                        setAvatarPreview(URL.createObjectURL(file));
                                    }
                            }} 
                            onLogoChange={(e)=>{setForm({...form, avatarurl:e, avatar:null}); setAvatarPreview(e)}}
                            preview={avatarpreview}
                            setPreview={setAvatarPreview}
                            >

                            </LogoDropdown>
                            
                        </div>

                        <div className="flex flex-col gap-1">
                            <label>Chatbot Size</label> 
                            <p style={{color:"gray", fontSize:14}}>
                            Set the dimensions of the chatbox in width (X) and height (Y) units.            </p>
                            <div className="flex flex-row gap-2">
                            <input value={form.chatbotsize_x} onChange={e=>setForm({...form, chatbotsize_x:parseInt(e.target.value)})} placeholder="X" name="chatbotsize" className="h-10 rounded-lg border-2 w-1/2 px-2" style={{backgroundColor:"hsl(var(--greyish))", borderColor:"hsl(var(--greyish-border))"}} type="number"></input>
                            <input value={form.chatbotsize_y} onChange={e=>setForm({...form, chatbotsize_y:parseInt(e.target.value)})} placeholder="Y" name="chatbotsize" className="h-10 rounded-lg border-2 w-1/2 px-2" style={{backgroundColor:"hsl(var(--greyish))", borderColor:"hsl(var(--greyish-border))"}} type="number"></input>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label>Chatbot Header Size</label>
                            <p style={{color:"gray", fontSize:14}}>
                            Define the size of the chatbox header
                            </p>
                            <select
                                id="iconsize-select"
                                name="iconsize"
                                value={form.headersize}
                                onChange={e=>setForm({...form, headersize:parseInt(e.target.value)})}
                                style={{backgroundColor:"hsl(var(--greyish))", borderColor:"hsl(var(--greyish-border))"}}
                                className="block w-full mt-1 mb-3 h-[40px] bg-inherit rounded-lg sm:text-sm px-2 border-2"
                            >
                                {[{"name":"S", "value":20},{"name":"M", "value":30},{"name":"L", "value":40}].map((logo, index) => (
                                <option key={index} value={logo.value}>

                                    {logo.name}
                                </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label>Welcome Message</label>
                            <p style={{color:"gray", fontSize:14}}>
                            Enter the message that pops up on top of your chatbot icon                          
                            </p> 
                            <input value={form.welcome} onChange={e=>setForm({...form, [e.target.name]:e.target.value})} name="welcome" className="h-10 rounded-lg border-2 px-2" style={{backgroundColor:"hsl(var(--greyish))", borderColor:"hsl(var(--greyish-border))"}} type="text"></input>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label>Placeholder Text Customisation</label>
                            <p style={{color:"gray", fontSize:14}}>
                            Edit the placeholder text in the message input field.                            </p> 
                            <input value={form.placeholder} onChange={e=>setForm({...form, placeholder:e.target.value})} name="placeholder" className="h-10 rounded-lg border-2 px-2" style={{backgroundColor:"hsl(var(--greyish))", borderColor:"hsl(var(--greyish-border))"}} type="text"></input>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label>
                                Send Button Icon Selection
                            </label>
                            <p style={{color:"gray", fontSize:14}}>
                            Select an icon for the send message button.                            </p>
                            <SendDropdown 
                            onLogoChange={(e)=>{setForm({...form, send:e}); setSendPreview(e)}}
                            preview={sendpreview}
                            setPreview={setSendPreview}
                            >

                            </SendDropdown>
                            
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="backgroundcolor">Pick a Chatbot Header Color:</label>
                            <p style={{color:"gray", fontSize:14}}>
                            Choose a color for the chatbox header.                            </p>
                            <input
                            type="color"
                            id="color"
                            name="headercolor"
                            className="p-0 border-0"
                            style={{backgroundColor:"black", width:50, height:50}}
                            value={form.headercolor}
                            onChange={(e)=>setForm({...form, headercolor:e.target.value})}
                            ></input>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="backgroundcolor">Pick a Background Color:</label>
                            <p style={{color:"gray", fontSize:14}}>
                            Choose the background color for the chatbot.                            </p>
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
                            <p style={{color:"gray", fontSize:14}}>
                            Choose the foreground color for the chatbot.                            </p>
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
                            <p style={{color:"gray", fontSize:14}}>
                            Choose the background color for the user's messages.                            </p>
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
                            <p style={{color:"gray", fontSize:14}}>
                            Choose the background color for the bot's messages.
                                                                                </p>
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
                            <p style={{color:"gray", fontSize:14}}>
                            Choose the text color for the bot's messages.                                                      </p>
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
                            <p style={{color:"gray", fontSize:14}}>
                            Choose the text color for the user's messages.                               </p>
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
                        <div className="flex w-full pb-5 justify-between"><button onClick={()=>setSection("create")} className="p-2 rounded-lg" style={{backgroundColor:"hsl(var(--greyish-border))"}}>Back</button><button onClick={()=>setSection("preview")} className="p-2 rounded-lg" style={{backgroundColor:"hsl(var(--greyish-border))"}}>Next</button></div>
                        </div>
                        <div></div>
                        <div className="w-1/3 flex justify-center">
                        <div
                            className="min-h-[400px] w-[300px] flex flex-col self-center  justify-between  rounded-lg shadow-lg absolute top-[200px] max-h-[300px]"
                            style={{ backgroundColor: form.backgroundcolor }}
                            >
                            <div className={`h-[${form.headersize}px] w-full flex flex-row justify-end p-2 rounded-tr-lg rounded-tl-lg`}
                            style={{ backgroundColor: form.headercolor }}
                            >
                            <button
                                className="bold mr-1"
                                style={{color:form.backgroundcolor}}
                            >
                                X 
                            </button>
                            </div>
                            <div className="overflow-y-auto flex-1 mb-4 p-4">
                                
                                <div className="flex flex-row gap-2 my-2 items-center">
                                <img
                                    className="rounded-full h-[30px] w-[30px]"
                                    src={form.avatarurl ? form.avatarurl : avatarpreview ? avatarpreview : ""}
                                    alt="form Logo"
                                />
                                <div key={99}>
                                    <div
                                    style={{
                                        backgroundColor: form.botchatcolor,
                                        color: form.bottextcolor,
                                    }}
                                    className="inline-block p-2 rounded-lg"
                                    >
                                    {"hello user"}
                                    </div>
                                </div>
                                </div>
                                <div className="flex flex-row gap-2 my-2 items-center justify-end">
                                <div key={98}>
                                    <div
                                    style={{
                                        backgroundColor: form.userchatcolor,
                                        color: form.usertextcolor,
                                    }}
                                    className="inline-block p-2 rounded-lg"
                                    >
                                    {"hello"}
                                </div>
                                </div>
                                </div>
                                {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex flex-row gap-2 my-2 items-center ${
                                    message.sender === 'user' ? 'justify-end' : ''
                                    } `}
                                >
                                    {message.sender === 'bot' && (
                                    <img
                                        className="rounded-full h-[30px] w-[30px]"
                                        src={form.iconurl ? form.iconurl : preview ? preview : ""}
                                        alt="bot Logo"
                                    />
                                    )}
                                    <div
                                    className={`content-center ${
                                        message.sender === 'user' ? 'text-right' : ''
                                    }`}
                                    >
                                    <div
                                        style={{
                                        backgroundColor:
                                            message.sender === 'user'
                                            ? form.userchatcolor
                                            : form.botchatcolor,
                                        color:
                                            message.sender === 'user'
                                            ? form.usertextcolor
                                            : form.bottextcolor,
                                        }}
                                        className="inline-block p-2 rounded-lg"
                                    >
                                        {message.text}
                                    </div>
                                    </div>
                                </div>
                                ))}
                            </div>
                            {form.audioinput ? <div className="flex p-2 align-center">
            <input
              disabled={true}
              value={"hello"}
              placeholder={form.placeholder}
              className="flex-1 h-[35px] p-1 rounded-tl-lg rounded-bl-lg"
              style={{
                backgroundColor: form.foregroundcolor,
                color: form.bottextcolor,
              }}
            />
            <button
              className={`p-0 m-0 w-[30px] rounded-tr-lg rounded-br-lg`}
              style={{
                backgroundColor: form.foregroundcolor,
              }}
            >
              {'🎤'}
            </button>
            <button
            className='p-1 rounded-lg w-[30px]'
              disabled={true}              
            >
              <img className='rounded-lg' width={30} height={30} src={form.send ? form.send : ""}></img>
            </button>
          </div>
          :
          <div className="flex p-4 align-center">
            <input
              disabled={true}
              value={"hello"}
              placeholder={form.placeholder}
              className="flex-1 mr-4 h-[35px] p-1 rounded-lg"
              style={{
                backgroundColor: form.foregroundcolor,
                color: form.bottextcolor,
              }}
            />
            <button
            className='p-1 rounded-lg'
              disabled={true}
            >
              <img className='rounded-lg' width={30} height={30} src={form.send ? form.send : ""}></img>
            </button>
        </div>}
                            </div>
                        </div>
                        </div>
                    }
                    {section=="preview" && <>
                        <div  className="h-full rounded-lg relative mb-2">
                        <div className="flex flex-col gap-1 bg-inherit mb-4">
                            <label>Website URL</label>
                            <input value={weburl} onChange={e=>setWeburl(e.target.value)} name="description" className="h-10 rounded-lg border-2 px-2" style={{backgroundColor:"hsl(var(--greyish))", borderColor:"hsl(var(--greyish-border))"}} type="text"></input>
                        </div>
                        <div className="flex flex-row gap-5 mb-2">
                        <input value={"Desktop"} disabled name="description" className="h-10 rounded-lg border-2 px-2 mb-2 w-2/3" style={{backgroundColor:"hsl(var(--greyish))", borderColor:"hsl(var(--greyish-border))"}} type="text"></input>
                        <input value={"Mobile"} disabled name="description" className="h-10 rounded-lg border-2 px-2 mb-2 w-1/3" style={{backgroundColor:"hsl(var(--greyish))", borderColor:"hsl(var(--greyish-border))"}} type="text"></input>
                        </div>
                        <div className="flex flex-row gap-5 h-[55vh]  w-full">
                            <div className="relative w-2/3 h-full">
                            
                            <iframe className="w-full h-full rounded-lg" src={weburl ? weburl : "https://www.example.com"}></iframe>
                            {form.desktop && <ChatBot botId={"67e1bfe465e423aaeef3ac69"} className="absolute bottom-2 right-2" position={false}></ChatBot>}
                            </div>
                            <div className="relative w-1/3 h-full">
                            
                            <iframe className="w-full h-full rounded-lg" src={weburl ? weburl : "https://www.example.com"}></iframe>
                            {form.mobile && <ChatBot botId={"67e1bfe465e423aaeef3ac69"} className="absolute bottom-2 right-2" position={false}></ChatBot>}
                            </div>
                        
                        </div>
                        
                        
                        
                        
                        </div>

                        <div className="flex w-full pb-5 justify-between"><button onClick={()=>setSection("customize")} className="p-2 rounded-lg" style={{backgroundColor:"hsl(var(--greyish-border))"}}>Back</button><button onClick={(e)=>{e.preventDefault();submitform();}} type="submit" className="p-2 rounded-lg" style={{backgroundColor:"hsl(var(--greyish-border))"}}>Submit</button></div>
                    
                    </>}
                </form>
                </div>
                
                
            </div>
        </main>
        </>
  );
}

export default Home
