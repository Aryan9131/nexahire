"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { formSchema } from "@/schemas/interviewFormValidation"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import { InterviewFormInputs } from "@/app/(main)/dashboard/create-interview/page"


interface InterviewFormProps {
    onSubmit: (values: InterviewFormInputs) => void;
}

export function InterviewForm({ onSubmit }: InterviewFormProps) {
    const interviewTypes = [{ type: "Technical", icon: "🛠️" }, { type: "HR", icon: "👥" }, { type: "Managerial", icon: "👔" }, { type: "Cultural", icon: "🌍" }, { type: "Other", icon: "❓" }];
    // 1. Define your form.
    const form = useForm<InterviewFormInputs>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            position: "",
            description: "",
            duration: 0,
            types: [],
        },
    })

    return (
        <div id="form" className='w-full my-5 bg-white rounded-lg p-5'>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Job Position</FormLabel>
                                <FormControl>
                                    <Input placeholder="This is the position you are hiring for." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Job Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Provide a brief description of the job role." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Interview Duration (minutes)</FormLabel>
                                <FormControl>
                                    {/* parse the input value to integer */}
                                    <Input type="number" placeholder="Specify the duration of the interview in minutes." {...field} value={field.value} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="types"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Interview Question Types</FormLabel>
                                <FormControl>
                                    {/* show the input values  in captalize form  and intead of input show them in clip form*/}
                                    <div className="flex flex-wrap gap-2">
                                        {interviewTypes.map(({ type, icon }) => (
                                            <div key={type} className={`px-4 py-1 rounded-full border cursor-pointer ${field.value.includes(type) ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-200'}`} onClick={() => {
                                                if (field.value.includes(type)) {
                                                    field.onChange(field.value.filter((t) => t !== type))
                                                } else {
                                                    field.onChange([...field.value, type])
                                                    console.log("Form Values : ", [...field.value, type])
                                                }
                                            }}>
                                                <span className="mr-1">{icon}</span>
                                                {type}
                                            </div>
                                        ))}

                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end items-center cursor-pointer">
                        <Button type="submit" >Generate questions</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}