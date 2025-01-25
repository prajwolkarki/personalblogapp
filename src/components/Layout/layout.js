import Header from "./header";
import {cookies} from "next/headers"
import { verifyAuth } from "@/lib/auth";
import AuthenticatedHeader from "./authenticatedheader";
export default async function CommonLayout({ children }) {
    const token = (await cookies()).get('token')?.value;
    const user= await verifyAuth(token);
  
    return (
      <div className="min-h-screen bg-white">
       {user ? <AuthenticatedHeader/> : <Header/>}
      
        {children}
      </div>
    );
  }