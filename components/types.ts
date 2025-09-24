// types.ts
export interface Bot {
    description: string;
    _id: string;
    name: string;
    assistant_id: string;
    vector_store_id: string;
    files: {
      name: string;
      file_id: string;
    }[];
    created: string;
    logo: string;
    
    foregroundcolor: string,
    backgroundcolor: string,
    usertextcolor: string,
    userchatcolor:string,
    botchatcolor: string,
    bottextcolor: string,

    iconlabel:string,
    apikey:string,
    prompt:string,
    welcome:string,
    autoopen:string,
    model:string,
  }
  