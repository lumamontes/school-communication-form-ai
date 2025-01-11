import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "../ui/textarea"
import { Bot, Sparkle, Sparkles } from "lucide-react"

export function AiHelperDialog({ onGenerate }: { onGenerate: (value: string) => void }) {
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState("")
  const [open, setOpen] = useState(false);

  const generateAIResponse = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/generate-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      })
      const data = await response.json()
      onGenerate(data.result)
      toast({
        title: "✅ Comunicado gerado",
        variant: "default",
      })
    } catch (error) {
      toast({ 
          title: "Erro", 
          description: "❌  Erro ao gerar comunicado",
          variant: "destructive"
       })
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  function toggleDialog() {
    setOpen(!open)
  }

  return (
    <Dialog open={open} onOpenChange={toggleDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={loading}>
          <Sparkles size={24} />
          {loading ? "Gerando..." : ""}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white color-slate-950">
        <DialogHeader>
          <DialogTitle>Assistente Inteligente</DialogTitle>
          <DialogDescription>
            Use o assistente de inteligência artificial para criar um comunicado personalizado.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-center gap-4">
            <Label htmlFor="input" className="text-center">
              O que você gostaria de incluir no comunicado?
            </Label>
            <Textarea
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={generateAIResponse} disabled={loading}>
            {loading ? "Gerando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
