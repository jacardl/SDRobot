import { Configuration, OpenAIApi } from 'openai'
import type { ChatCompletionRequestMessage } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

export async function callAIService(messages: ChatCompletionRequestMessage[]) {
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    })

    return completion.data.choices[0].message?.content || ''
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw error
  }
} 