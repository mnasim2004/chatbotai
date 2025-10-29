import Groq from 'groq-sdk';
import Chatbot from '../models/Chatbot.js';

export const chat = async (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: 'Chat temporarily unavailable: GROQ_API_KEY not configured' });
    }
    const groq = new Groq({ apiKey });
    const { botId, message, history = [] } = req.body;
    
    // Support either Mongo _id or custom botId
    let chatbot = null;
    if (botId?.length === 24) {
      chatbot = await Chatbot.findById(botId).catch(() => null);
    }
    if (!chatbot) {
      chatbot = await Chatbot.findOne({ botId }).catch(() => null);
    }
    if (!chatbot) {
      return res.status(404).json({ error: 'Chatbot not found' });
    }

    // Trim context to reduce tokens
    const truncate = (str = '', max = 600) => (str.length > max ? str.slice(0, max) + '…' : str);
    const limitedImages = Array.isArray(chatbot.images) ? chatbot.images.slice(0, 4) : [];
    const limitedLinks = Array.isArray(chatbot.links) ? chatbot.links.slice(0, 5) : [];
    const limitedFaqs = Array.isArray(chatbot.faqs) ? chatbot.faqs.slice(0, 3) : [];
    const limitedSocial = chatbot.contact?.socialMedia ? chatbot.contact.socialMedia.slice(0, 3) : [];

    // Concise system prompt with structured-output rules
    const systemPrompt = `You are ${chatbot.name}. ${truncate(chatbot.description || '', 300)}
Behavior: ${truncate(chatbot.behavior || 'Be helpful and friendly.', 160)}
Knowledge: ${truncate(chatbot.knowledge || '', 600)}
Details: ${truncate(chatbot.details || '', 400)}

Images (use only if relevant):
${limitedImages.map((img, i) => `- ${i + 1}. ${truncate(img.description || '', 80)} | ${img.url}`).join('\n')}

Links (use only if relevant):
${limitedLinks.map((lnk, i) => `- ${i + 1}. ${truncate(lnk.description || '', 60)} | ${lnk.url}`).join('\n')}

Contacts (available if relevant):
${chatbot.contact?.email ? `Email: ${chatbot.contact.email}` : ''}
${chatbot.contact?.phone ? `Phone: ${chatbot.contact.phone}` : ''}
${chatbot.contact?.website ? `Website: ${chatbot.contact.website}` : ''}
${limitedSocial.length ? `Social: ${limitedSocial.map(s => `${s.platform}: ${s.url}`).join(', ')}` : ''}

Return ONLY JSON (no markdown). Schema:
{"text": string, "images": [{"url": string, "alt": string}] , "links": [{"url": string, "label": string}], "contacts": {"email": string|null, "phone": string|null, "website": string|null, "socialMedia": [{"platform": string, "url": string}]}, "suggestions": string[]}

Rules: include only info relevant to the user's last question; images in images[], links in links[] with short label; contacts only when asked/needed; add one natural CTA sentence in text if you include contacts; JSON only.`;

    // Format conversation history (keep last 6 turns, truncate content)
    const trimmedHistory = (history || []).slice(-6).map((msg) => ({
      role: msg.role,
      content: truncate(msg.content || '', 700)
    }));
    const messages = [
      { role: 'system', content: systemPrompt },
      ...trimmedHistory,
      { role: 'user', content: truncate(message || '', 700) }
    ];

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.6,
      max_tokens: 350
    });

    const rawContent = completion.choices[0]?.message?.content || '';

    // Try to parse structured JSON per the schema; if parsing fails, fall back to plain text
    let parsed = null;
    try {
      parsed = JSON.parse(rawContent);
    } catch (_) {
      // ignore
    }

    // If model already returned suggestions in JSON, use them; else compute lightweight suggestions
    let suggestions = Array.isArray(parsed?.suggestions) ? parsed.suggestions.slice(0, 3) : [];
    if (!suggestions.length) {
      const suggestionsPrompt = `Based on this conversation, suggest 3 short follow-up questions (max 8 words each). Return only the questions, one per line.`;
      const suggestionsCompletion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          ...messages,
          { role: 'assistant', content: rawContent },
          { role: 'user', content: suggestionsPrompt }
        ],
        temperature: 0.8,
        max_tokens: 120
      });
      suggestions = (suggestionsCompletion.choices[0]?.message?.content || '')
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean)
        .slice(0, 3);
    }

    if (parsed) {
      return res.json({ response: parsed, suggestions });
    }

    // Fallback: wrap plain text into the structured format so the UI can render consistently
    const fallbackStructured = {
      text: rawContent || 'Sorry, I could not process that.',
      images: [],
      links: [],
      contacts: { email: null, phone: null, website: null, socialMedia: [] },
      suggestions
    };

    res.json({ response: fallbackStructured, suggestions });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Chat failed', details: error.message });
  }
};


