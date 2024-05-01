import { Injectable } from '@angular/core';
import OpenAI from 'openai';
import { environment } from 'environments/environment';

const openai = new OpenAI({
    apiKey: environment.openaiKey,
    dangerouslyAllowBrowser: true,
});

@Injectable({
    providedIn: 'root',
})
export class OpenaiService {
    async generateText(prompt: string) {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
        });
        return response.choices[0].message.content;
    }
}
