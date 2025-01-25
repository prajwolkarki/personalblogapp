"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { BLOG_CATEGORIES } from "@/lib/config";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { UploadButton } from "@/utils/uploadthing";
import { toast } from "react-hot-toast";
import { Loader2, ImagePlus, PenSquare, ArrowLeft } from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: () => <div className="h-64 bg-muted/50 animate-pulse rounded-lg" />
});

const formSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters." })
    .max(100, { message: "Title must not exceed 100 characters." }),
  content: z.string().min(10, { message: "Content must be at least 10 characters." }),
  category: z.string({ required_error: "Please select a category." }),
  image: z.string().url().optional(),
});

export default function CreateBlogForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      image: "",
    },
  });

  async function onSubmit(values) {
    try {
      setIsLoading(true);
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create blog post");
      }

      toast.success("Blog post created successfully!");
      router.push("/blog");
    } catch (error) {
      toast.error(error.message || "Error creating blog post");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 md:p-8">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 gap-2 text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Button>

      <Card className="w-full max-w-3xl mx-auto shadow-xl border-0 bg-gradient-to-br from-card to-card/80">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            <PenSquare className="inline-block h-8 w-8 mr-3 -mt-1" />
            Create New Post
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Craft your perfect title..."
                        {...field}
                        className="h-12 text-lg border-2 border-muted/50 hover:border-primary/30 focus:border-primary"
                      />
                    </FormControl>
                    <FormDescription className="text-muted-foreground/80">
                      Make it catchy and descriptive!
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Content Editor */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Content</FormLabel>
                    <FormControl>
                      <Controller
                        name="content"
                        control={form.control}
                        render={({ field }) => (
                          <div className="rounded-lg border-2 border-muted/50 hover:border-primary/30 overflow-hidden">
                            <ReactQuill
                              theme="snow"
                              value={field.value}
                              onChange={field.onChange}
                              className="h-96 bg-background"
                              modules={{
                                toolbar: [
                                  [{ header: [1, 2, 3, false] }],
                                  ["bold", "italic", "underline", "blockquote"],
                                  [{ list: "ordered" }, { list: "bullet" }],
                                  ["link", "image"],
                                  ["clean"]
                                ]
                              }}
                            />
                          </div>
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category Selector */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 text-lg border-2 border-muted/50 hover:border-primary/30">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-2 border-muted/50">
                        {BLOG_CATEGORIES.map((category) => (
                          <SelectItem
                            key={category.key}
                            value={category.key}
                            className="text-lg hover:bg-muted/30"
                          >
                            {category.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Upload */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Featured Image</FormLabel>
                    <FormControl>
                      <div className="flex flex-col items-center justify-center w-full gap-4">
                        <div className="w-full border-2 border-dashed border-muted/50 hover:border-primary/30 rounded-xl p-6 transition-colors">
                          <UploadButton
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                              if (res?.[0]) {
                                field.onChange(res[0].url);
                                toast.success("Image uploaded successfully!");
                              }
                            }}
                            onUploadError={(error) => {
                              toast.error(`Upload failed: ${error.message}`);
                            }}
                            appearance={{
                              button: {
                                width: "100%",
                                backgroundColor: "hsl(var(--primary))",
                                color: "hsl(var(--primary-foreground))",
                                borderRadius: "0.5rem",
                                padding: "1rem",
                                fontWeight: 600,
                                transition: "all 0.2s",
                                _hover: {
                                  backgroundColor: "hsl(var(--primary)/0.9)"
                                }
                              },
                              allowedContent: {
                                color: "hsl(var(--muted-foreground))"
                              }
                            }}
                          />
                        </div>
                        
                        {field.value && (
                          <div className="relative w-full max-w-2xl mt-4 group">
                            <img
                              src={field.value}
                              alt="Preview"
                              className="w-full h-64 object-cover rounded-xl shadow-lg border-2 border-muted/50 group-hover:border-primary/30 transition-all"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl" />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all"
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  "Publish Post 🚀"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}