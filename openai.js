import OpenAIApi from 'openai';
import Configuration from 'openai';
import config from 'config';
import { createReadStream } from 'fs';
import { message } from 'telegraf/filters';

class OpenAI {
    roles = {
        ASSISTANT: 'assistant',
        USER: 'user',
        SYSTEM: 'system',
    }
    constructor(apiKey) {
        const configuration = new Configuration({
            apiKey: apiKey,
        });
        this.openai = new OpenAIApi(configuration);
    }

    async chat(messages) {
        try {
            const response = await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages,
          })
            return response.choices[0].message
        } catch (e) {
            console.log('Error while GPT chat', e.message)
        }
    }

    async transcription(filepath) {
        try {
            const response = await this.openai.audio.transcriptions.create({
                file: createReadStream(filepath),
                model: 'whisper-1'
            });
            return response.text;
        } catch (e) {
            console.error('Error while transcription', e.message);
        }
    }
}

export const openai = new OpenAI(config.get('OPENAI_KEY'));
