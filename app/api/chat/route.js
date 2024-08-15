import { NextResponse } from 'next/server';
import axios from 'axios';

// Ensure you replace this with your actual Hugging Face API key
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const MODEL_ENDPOINT = 'https://api-inference.huggingface.co/models/gpt2'; // Replace with your chosen model endpoint

export async function POST(req) {
  const data = await req.json();
  const messages = data.messages || [];
  
  const prompt = `You are an intelligent assistant capable of writing both official and humorous letters or emails. Your responses should adapt to the tone required by the context provided. Follow these guidelines:

1. **Official Tone**:
   - Use a professional, formal tone.
   - Include appropriate greetings, body text, and closings.
   - Ensure that the language is respectful and clear.
   - Example: "Dear [Name], I hope this message finds you well..."

2. **Humorous Tone**:
   - Use a light-hearted, funny tone with playful language.
   - Include jokes, puns, and friendly comments.
   - Ensure the humor is appropriate for the context.
   - Example: "Hey [Name], I thought I'd drop you a line before the coffee kicks in and I forget everything! 😂..."

3. **Contextual Adaptation**:
   - If the message is for a formal setting, use the official tone.
   - If the message is for a casual or informal setting, use the humorous tone.

Here is the current message context:

${messages.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n')}

Assistant:`;





  try {
    const response = await axios.post(
      MODEL_ENDPOINT,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract the chatbot's response from the API response
    const result = response.data;
    const content = result?.generated_text || 'No response from model';

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error communicating with model' }, { status: 500 });
  }
}
