const API_KEY="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"

const HF_TOKEN="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"



// export async function generateSummary(categoryArr) {
//     const prompt = `
// You are an expert news summarizer.

// I will provide a JSON array of news articles.

// Task:
// - Generate one summary for EACH news article.
// - Each summary must be 150-200 words.
// - The number of summaries must exactly match the number of articles.
// - Use the article's title, description, and content.
// - If content is null, use description.
// - Do not combine multiple articles into one summary.

// Return ONLY a valid JSON array in this exact format:

// [
//   {
//     "summary": "50-80 word summary..."
//   },
//   {
//     "summary": "50-80 word summary..."
//   }
// ]

// Do NOT return:
// - Markdown
// - Explanations
// - Code blocks
// - Titles
// - Numbering
// - Any extra text

// Here are the articles:

// ${JSON.stringify(categoryArr)}
// `;

//     try {
//         const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${API_KEY}`
//             },
//             body: JSON.stringify({
//                 model: "llama-3.3-70b-versatile",
//                 messages: [
//                     {
//                         role: "user",
//                         content: prompt
//                     }
//                 ]
//             })
//         });

//         const data = await response.json();

//         return  JSON.parse(data.choices[0].message.content)

//     } catch (error) {
//         console.error(error);
//         return null;
//     }
// }




export async function generateSummary(categoryArr) {
     const prompt = `
You are an expert news summarizer.

I will provide a JSON array of news articles.

Task:
- Generate one summary for EACH news article.
- Each summary must be 150-200 words.
- The number of summaries must exactly match the number of articles.
- Use the article's title, description, and content.
- If content is null, use description.
- Do not combine multiple articles into one summary.

Return ONLY a valid JSON array in this exact format:

[
  {
    "summary": "140-200 word summary..."
  },
  {
    "summary": "140-200 word summary..."
  }
]

Do NOT return:
- Markdown
- Explanations
- Code blocks
- Titles
- Numbering
- Any extra text

Here are the articles:

${JSON.stringify(categoryArr)}
`;
    try {
        const response = await fetch(
            "https://router.huggingface.co/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${HF_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "Qwen/Qwen2.5-7B-Instruct",
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    stream: false
                })
            }
        );

        const data = await response.json();

        console.log(data);

        if (!response.ok) {
            return null;
        }
   console.log(JSON.parse(data.choices[0].message.content));
   
        return JSON.parse(data.choices[0].message.content);

    } catch(error) {
        console.log(error);
        return null;
    }
}
