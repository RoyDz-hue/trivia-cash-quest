
import { toast } from "sonner";

const DEEPINFRA_API_ENDPOINT = "https://api.deepinfra.com/v1/openai";

type ChatCompletionMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export interface GenerateQuestionParams {
  category: string;
  difficulty?: "easy" | "medium" | "hard";
  model?: string;
  count?: number;
}

export interface GeneratedQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

export class DeepInfraService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateTrivaQuestion(params: GenerateQuestionParams): Promise<GeneratedQuestion | null> {
    try {
      const { category, difficulty = "medium", model = "meta-llama/Meta-Llama-3-8B-Instruct" } = params;
      
      const systemPrompt = `You are an expert trivia question creator. Generate one multiple-choice trivia question about ${category} with exactly 4 answer options. The question should be ${difficulty} difficulty.
      
Format your response exactly like this, with no additional text:
Question: [THE QUESTION]
A) [OPTION A]
B) [OPTION B]
C) [OPTION C]
D) [OPTION D]
Correct Answer: [A, B, C, or D]`;

      const messages: ChatCompletionMessage[] = [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate a ${difficulty} difficulty ${category} trivia question.` }
      ];

      const response = await fetch(`${DEEPINFRA_API_ENDPOINT}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("DeepInfra API error:", errorData);
        throw new Error(errorData.error?.message || "Failed to generate question");
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Parse the response to extract question, options, and correct answer
      const questionMatch = content.match(/Question: (.*?)(?=\nA\))/s);
      const optionsMatch = content.match(/A\) (.*?)(?=\nB\))/s);
      const optionBMatch = content.match(/B\) (.*?)(?=\nC\))/s);
      const optionCMatch = content.match(/C\) (.*?)(?=\nD\))/s);
      const optionDMatch = content.match(/D\) (.*?)(?=\nCorrect Answer:)/s);
      const correctAnswerMatch = content.match(/Correct Answer: ([ABCD])/);

      if (!questionMatch || !optionsMatch || !optionBMatch || !optionCMatch || !optionDMatch || !correctAnswerMatch) {
        console.error("Failed to parse question format:", content);
        return null;
      }

      const question = questionMatch[1].trim();
      const options = [
        optionsMatch[1].trim(),
        optionBMatch[1].trim(),
        optionCMatch[1].trim(),
        optionDMatch[1].trim()
      ];

      // Convert letter answer to index
      const correctAnswerLetter = correctAnswerMatch[1];
      const correctAnswerMap: Record<string, number> = { "A": 0, "B": 1, "C": 2, "D": 3 };
      const correctAnswer = correctAnswerMap[correctAnswerLetter];

      return {
        question,
        options,
        correctAnswer,
        category
      };
    } catch (error) {
      console.error("Error generating question:", error);
      toast.error("Failed to generate question. Please try again.");
      return null;
    }
  }

  async generateMultipleQuestions(params: GenerateQuestionParams): Promise<GeneratedQuestion[]> {
    try {
      const { category, difficulty = "medium", model = "meta-llama/Meta-Llama-3-8B-Instruct", count = 10 } = params;
      
      const systemPrompt = `You are an expert trivia question creator. Generate ${count} unique multiple-choice trivia questions about ${category} with exactly 4 answer options each. The questions should be ${difficulty} difficulty.
      
Format your response exactly like this, with each question separated by three dashes (---):

Question: [THE QUESTION 1]
A) [OPTION A]
B) [OPTION B]
C) [OPTION C]
D) [OPTION D]
Correct Answer: [A, B, C, or D]

---

Question: [THE QUESTION 2]
A) [OPTION A]
B) [OPTION B]
C) [OPTION C]
D) [OPTION D]
Correct Answer: [A, B, C, or D]

And so on for all ${count} questions.`;

      const messages: ChatCompletionMessage[] = [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate ${count} ${difficulty} difficulty ${category} trivia questions.` }
      ];

      const response = await fetch(`${DEEPINFRA_API_ENDPOINT}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.8,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("DeepInfra API error:", errorData);
        throw new Error(errorData.error?.message || "Failed to generate questions");
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Split content by separator
      const questionBlocks = content.split(/\s*---\s*/);
      const questions: GeneratedQuestion[] = [];
      
      for (const block of questionBlocks) {
        // Skip empty blocks
        if (!block.trim()) continue;
        
        const questionMatch = block.match(/Question: (.*?)(?=\nA\))/s);
        const optionsMatch = block.match(/A\) (.*?)(?=\nB\))/s);
        const optionBMatch = block.match(/B\) (.*?)(?=\nC\))/s);
        const optionCMatch = block.match(/C\) (.*?)(?=\nD\))/s);
        const optionDMatch = block.match(/D\) (.*?)(?=\nCorrect Answer:)/s);
        const correctAnswerMatch = block.match(/Correct Answer: ([ABCD])/);

        if (!questionMatch || !optionsMatch || !optionBMatch || !optionCMatch || !optionDMatch || !correctAnswerMatch) {
          console.warn("Failed to parse question format in block:", block);
          continue;
        }

        const question = questionMatch[1].trim();
        const options = [
          optionsMatch[1].trim(),
          optionBMatch[1].trim(),
          optionCMatch[1].trim(),
          optionDMatch[1].trim()
        ];

        // Convert letter answer to index
        const correctAnswerLetter = correctAnswerMatch[1];
        const correctAnswerMap: Record<string, number> = { "A": 0, "B": 1, "C": 2, "D": 3 };
        const correctAnswer = correctAnswerMap[correctAnswerLetter];

        questions.push({
          question,
          options,
          correctAnswer,
          category
        });
      }

      return questions;
    } catch (error) {
      console.error("Error generating multiple questions:", error);
      toast.error("Failed to generate questions. Please try again.");
      return [];
    }
  }
}

export const createDeepInfraService = (apiKey: string) => {
  return new DeepInfraService(apiKey);
};
