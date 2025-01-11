"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { toast } from "@/hooks/use-toast"
import { Input } from "../ui/input"
import { AiHelperDialog } from "./ai-helper-dialog"
import { useEffect } from "react"

const profileFormSchema = z.object({
  username: z
    .string()
    .min(4, {
      message: "Título deve ter no mínimo 4 caracteres.",
    })
    .max(40, {
      message: "Título deve ter no máximo 40 caracteres.",
    }),
  email: z
    .string({
      required_error: "Selecione um destinatário.",
    })
    .email(),
  bio: z.string().optional(),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
      })
    )
    .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  bio: ".",
}

export function NewPostForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: "Valores enviados:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  useEffect(() => {
    toast({
      title: "Bem-vindo!",
      description: "Preencha o formulário para criar um novo comunicado.",
    })
  
    return () => {
      
    }
  }, [])
  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <legend>Novo comunicado</legend>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Informe o título" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email do Destinatário</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o destinatário" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="m@example.com">professores@escola.com</SelectItem>
                  <SelectItem value="m@google.com">alunos@escola.com</SelectItem>
                  <SelectItem value="m@support.com">responsaveis@escola.com</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Mensagem</FormLabel>
                <AiHelperDialog
                  onGenerate={(value) => form.setValue("bio", value)}
                />
              </div>
              <FormControl>
                <div className="h-32 scrollbar-thin scrollbar-thumb-slate-950 scrollbar-track-slate-900 overflow-y-auto">
                <Textarea {...field} placeholder="Seu conteúdo irá aparecer aqui..." />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Salvar comunicado</Button>
      </form>
    </Form>
  )
}