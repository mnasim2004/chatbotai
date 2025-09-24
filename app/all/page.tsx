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
import { Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import ChatBot from "@/components/botembed";
const Home= ()=> {

    const [chatbots, setChatbots] = useState<Bot[]>([])
    const [isOpen, setIsOpen] = useState(false);
    const handleDialogClose = () => setIsOpen(false);
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<FieldValues>({
        defaultValues: {
          Color1: '#ffffff',
          Color2: '#ffffff', 
          Color3: '#ffffff', 
          Text1Color: '#ffffff', 
          Text2Color: '#ffffff', 
        },
    });

    useEffect(()=>{
        getData()
    },[])

    const getData = () => {
        axios.get("http://127.0.0.1:8000/get-all-bots")
        .then((response)=>{
            console.log(response.data["data"])
            setChatbots(response.data["data"])
        })
    }
    
    return (
        <>
        {isLoading && <LoadingSpinner />}
        <main className={`flex min-h-screen gap-10 p-10 bg-black ${isLoading ? 'pointer-none' : ''}`}>

            <div className="w-1/5 bg-inherit h-auto text-white rounded flex flex-col gap-10">

                <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col gap-10">
                        <div className="flex flex-row gap-5">
                            <h1 className="text-4xl  content-center bold">InstantBot.AI</h1>
                            <img src="image.png" className="pb-3" height={35} width={35}></img>
                        </div>

                        <ul className="flex flex-col">
                            <li>
                                <button onClick={()=>router.push("/all")} className="flex flex-row gap-3 w-full py-4 px-4 rounded-lg hoverbutton" style={{ backgroundColor:"hsl(var(--greyish))"}}>
                                    <img src="image.png" width={30} height={30}></img>
                                    <div className="content-center text-lg self-end">Chatbot.AI</div>
                                </button>
                            </li>
                            <li>
                                <button onClick={()=>router.push("/dashboard")} className="flex flex-row gap-3 w-full py-4 px-4 rounded-lg hoverbutton" >
                                    <img src="dashboard.png" width={30} height={30}></img>
                                    <div className="content-center text-lg self-end">Dashboard</div>
                                </button>
                            </li>
                            <li>
                                <button onClick={()=>router.push("/billings")} className="flex flex-row gap-3 w-full py-4 px-4 rounded-lg hoverbutton" >
                                    <img src="billing.png" width={30} height={30}></img>
                                    <div className="content-center text-lg self-end">Billings</div>
                                </button>
                            </li>
                            <li>
                                <button onClick={()=>router.push("/support")} className="flex flex-row gap-3 w-full py-4 px-4 rounded-lg hoverbutton" >
                                    <img src="support.png" width={30} height={30}></img>
                                    <div className="content-center text-lg self-end">Support</div>
                                </button>
                            </li>
                        </ul>
                </div>

                <div className="w-full h-[80px] rounded-xl" style={{backgroundColor:"hsl(var(--greyish)"}}>
                    <div className="flex flex-row h-full p-auto px-5 gap-5  ">
                        <div className="h-full p-auto content-center">
                            <img src="profile.png" className="rounded-full" width={60} height={60}></img>
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
            <div className="w-4/5 h-auto rounded-lg p-5 flex flex-col" style={{backgroundColor:"hsl(var(--greyish)"}}>
                <h1 className="text-2xl bold">Chatbot</h1>
                <h1 className="text-sm">Create and manage your chatbots</h1>
                <div className="flex flex-wrap justify-start gap-10 w-full mt-8">
                    {chatbots.map((bot, index)=>(
                        <button key={index} onClick={()=>router.push(`/edit/${bot._id}`)} className="h-[150px]  border-2 w-[250px] rounded-lg p-5 gap-1 flex flex-col overflow-hidden hover:!border-white" style={{backgroundColor:"hsl(var(--greyish))", borderColor:"hsl(var(--greyish-border))"}}>
                                <div className="bold">{bot._id}</div>
                                <div className="bold">{bot.name}</div>
                                <div 
                                    className="break-words text-left" 
                                    style={{ width: "-webkit-fill-available" }}
                                >
                                    {bot.description.length > 35 
                                        ? `${bot.description.substring(0, 35)}...` 
                                        : bot.description}
                                </div>
                        </button>
                    ))}
                    <button onClick={()=>router.push("/create")} className="h-[150px] border-2 w-[250px] justify-center items-center gap-1 flex flex-col gradientborder rounded-lg" style={{backgroundColor:"hsl(var(--greyish))", borderColor:"hsl(var(--greyish-border))"}}>
                            <div className="gradientborder-content h-full w-full flex flex-col items-center justify-center text-4xl">+</div>
                    </button>
                </div>
            </div>
        
             < ChatBot botId="67e24d1505c763c3db4fe5f9"></ChatBot> 
        </main>
        </>
  );
}

export default Home
