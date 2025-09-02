import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-aitest',
  templateUrl: './aitest.component.html',
  styleUrls: ['./aitest.component.css']
})
export class AitestComponent {
  messages: { role: 'user' | 'ai', text: string }[] = [];
  userInput: string = '';
  loading: boolean = false;

  // 請將 YOUR_GEMINI_API_KEY 換成你的 API KEY
  private apiKey = 'AIzaSyBqsQg_scpAbqeO42koyk6gI6mHZBSI2sQ';
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + this.apiKey;

  constructor(private http: HttpClient) {}

  sendMessage() {
    if (!this.userInput.trim()) return;
    this.messages.push({ role: 'user', text: this.userInput });
    const prompt = this.userInput;
    this.userInput = '';
    this.loading = true;

    const body = {
      contents: [
        { parts: [{ text: prompt }] }
      ]
    };

    this.http.post<any>(this.apiUrl, body).subscribe({
      next: (res) => {
        const aiText = res?.candidates?.[0]?.content?.parts?.[0]?.text || 'AI 沒有回應';
        this.messages.push({ role: 'ai', text: aiText });
        this.loading = false;
      },
      error: () => {
        this.messages.push({ role: 'ai', text: 'AI 回應失敗，請稍後再試。' });
        this.loading = false;
      }
    });
  }
}
