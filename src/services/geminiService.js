const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const analyzeCropImage = async (imageBuffer, mimeType) => {

    const prompt = `
You are an agricultural crop disease detection assistant.

Analyze the uploaded crop/plant leaf image.

Identify:
1. Crop name
2. Disease or pest, if visible
3. Confidence level
4. Severity
5. Visible symptoms
6. Recommended immediate action

If the image is not clear enough to identify a disease,
say that clearly instead of making up a disease.

Return ONLY valid JSON in this exact structure:

{
  "crop": "string",
  "disease": "string",
  "confidence": 0,
  "severity": "Low | Moderate | High | Unknown",
  "symptoms": ["string"],
  "recommendation": "string"
}
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
            {
                inlineData: {
                    mimeType: mimeType,
                    data: imageBuffer.toString("base64")
                }
            },
            {
                text: prompt
            }
        ]
    });

    return response.text;
};

module.exports = {
    analyzeCropImage
};