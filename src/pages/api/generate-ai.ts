import { NextApiRequest, NextApiResponse } from "next";

interface FetchOptions extends RequestInit {
  headers: {
    Authorization: string;
    "Content-Type": string;
  };
}

interface ErrorResponse {
  error: string;
  estimated_time?: number;
}

interface AIResponse {
  generated_text?: string;
}

async function fetchWithRetry(
  url: string,
  options: FetchOptions,
  retries: number = 3,
  backoff: number = 1000
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        return response;
      }

      const error: ErrorResponse = await response.json();
      if (error?.error?.includes("currently loading")) {
        console.log(`Model is loading, retrying in ${Math.ceil(error.estimated_time || 0)} seconds...`);
        await new Promise((resolve) =>
          setTimeout(resolve, Math.ceil(error.estimated_time || 0) * 1000)
        );
        continue;
      }

      throw new Error(`API Error: ${JSON.stringify(error)}`);
    } catch (err: any) {
      console.error(`Attempt ${i + 1} failed: ${err.message}`);
      if (i < retries - 1) {
        const delay = backoff * Math.pow(2, i);
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error("Failed to fetch after retries");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { input } = req.body as { input: string };

  const generatePrompt = (userPrompt: string): string => `
Input-Escreva um comunicado escolar objetivo e claro, com até 100 palavras. 
Input-Solicitante: secretário escolar.
Input-Público-alvo: turmas do curso do ensino médio.
Input-Data de envio: 01/04/2025.
Input-Detalhes: "${userPrompt}".
Input-Apenas retorne o comunicado final. Não inclua instruções ou informações de entrada.
 " 
`.trim();

  const cleanComunicado = (text: string): string => {
    return text.replace(/Input-.+\n?/g, "").trim();
  };

  try {
    const finalPrompt = generatePrompt(input);

    const response = await fetchWithRetry(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-Nemo-Instruct-2407",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: finalPrompt }),
      } as FetchOptions
    );

    const data: AIResponse[] = await response.json();

    if (!data[0]?.generated_text) {
      throw new Error("No response text generated.");
    }

    let generatedText = data[0].generated_text;
    console.log("Generated AI response:", generatedText);

    generatedText = cleanComunicado(generatedText);
    console.log("Cleaned AI response:", generatedText);

    res.status(200).json({ result: generatedText });
  } catch (error: any) {
    console.error("Error generating AI response:", error.message);
    res.status(500).json({
      error: "Failed to generate AI response",
      details: error.message,
    });
  }
}
