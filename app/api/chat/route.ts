import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

type Message = { role: "user" | "assistant"; content: string };

type MenuItem = {
  name: string;
  description?: string;
  price: number;
  allergens?: string[];
  category?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { messages, menu, restaurantName } = await req.json() as {
      messages: Message[];
      menu: MenuItem[];
      restaurantName: string;
    };

    // Compress menu into minimal tokens
    const menuText = menu
      .map((item) => {
        let line = `${item.name} ${item.price}`;
        if (item.description) line += ` - ${item.description}`;
        if (item.allergens?.length) line += ` [${item.allergens.join(",")}]`;
        return line;
      })
      .join("\n");

    const systemPrompt = `Tu es l'assistant de ${restaurantName}. Réponds en moins de 60 mots. Aide les clients sur le menu, allergènes, recommandations. Menu:\n${menuText}`;

    // Keep only last 4 messages to save tokens
    const trimmedMessages = messages.slice(-4);

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        ...trimmedMessages,
      ],
      max_tokens: 120,
      temperature: 0.5,
    });

    const reply = completion.choices[0]?.message?.content ?? "Désolé, je n'ai pas compris.";
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: "Service indisponible." }, { status: 500 });
  }
}
