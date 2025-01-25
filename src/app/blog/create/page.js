
import CreateBlogForm from "@/components/blog/CreateBlog";
import { verifyAuth } from "@/lib/auth";
import {cookies} from "next/headers";
export default async function createBlog(){
    const token = (await cookies()).get("token")?.value;
    const user = await verifyAuth(token);
    return (
        <CreateBlogForm/>
    )
}