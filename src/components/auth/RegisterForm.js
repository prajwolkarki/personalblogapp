"use client";

import { Key, Mail, User } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { registerUserAction } from "@/actions/register";
import { useRouter } from "next/navigation";
import { emailDomainMap } from "@/lib/emailDomainMap";

function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    setIsLoading(true);

    try {
      const result = await registerUserAction(formData);
     // console.log(result);
     const emailDomain = result.emailDomain;
     const emailServiceUrl = emailDomainMap[emailDomain] || `https://www.${emailDomain}`;
     console.log(emailServiceUrl);

      if (result?.success) {
        toast({
          title: "Registration successful",
          description: result.success,
        });
        
        router.push(emailServiceUrl);
      } else {
        throw new Error(result?.error || "Something went wrong!");
      }
    } catch (e) {
      toast({
        title: "Registration failed",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <User className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
        <Input
          name="name"
          placeholder="Name"
          disabled={isLoading}
          className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="relative">
        <Mail className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          disabled={isLoading}
          className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="relative">
        <Key className="absolute left-2 top-3 h-5 w-5 text-gray-400" />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          disabled={isLoading}
          className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full mt-3 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
      >
        {isLoading ? "Loading..." : "Register"}
      </Button>
    </form>
  );
}

export default RegisterForm;
