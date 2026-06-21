import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import { getAdminPanelHtml } from "./admin_template";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  const LOCAL_DB_PATH = path.join(process.cwd(), "data_db_backup.json");

  // Helper to save local JSON backup
  function saveLocalBackup(data: any) {
    try {
      const parentDir = path.dirname(LOCAL_DB_PATH);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
      console.log(`[LOCAL DB LOGS] Local backup written successfully to ${LOCAL_DB_PATH}`);
    } catch (e) {
      console.error("[LOCAL DB LOGS] Failed to save local backup:", e);
    }
  }

  // Helper to read local JSON backup
  function readLocalBackup() {
    try {
      if (fs.existsSync(LOCAL_DB_PATH)) {
        const content = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
        return JSON.parse(content);
      }
    } catch (e) {
      console.error("[LOCAL DB LOGS] Failed to read local backup:", e);
    }
    return null;
  }

  let supabaseClient: any = null;

  function getSupabase() {
    if (supabaseClient) return supabaseClient;
    
    const url = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    
    if (!url || !serviceKey || url.includes("MY_") || serviceKey.includes("KEY") || serviceKey.length < 10) {
      return null;
    }
    
    try {
      supabaseClient = createClient(url.trim(), serviceKey.trim(), {
        auth: {
          persistSession: false
        }
      });
      return supabaseClient;
    } catch (e) {
      console.error("[SUPABASE LOGS] Failed to initialize client:", e);
      return null;
    }
  }

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // API Route: AI Wellness Chat Companion
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.includes("KEY")) {
        return res.json({ text: getSimulatedResponse(message) });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = 
        "You are Bloomie, a compassionate, soft-spoken, and wise AI Mentor for MindBloom - an emotional growth, LMS, and parent-child wellness platform. " +
        "Your tone is deeply calm, validating, and positive (reminiscent of Headspace or Calm). " +
        "Acknowledge and validate the user's emotions or situations immediately. " +
        "Whenever appropriate, recommend they practice one of our core stretching poses: " +
        "- Tree Pose (The Solid Forest Giant) to bring focus and balance. " +
        "- Lotus Pose (The Magic Flying Carpet) to ground the breathing. " +
        "- Cat-Cow Stretch to release desk/homework back tension. " +
        "- Child Pose (The Safe Tiny Snail) to co-regulate anger, disappointment, or irritation. " +
        "Or suggest a 4-second balloon breath or writing in their Gratitude Journal. " +
        "Always keep answers warm, incredibly comforting, and highly concise (under 3 sentences max) so they are easy for students and parents to read.";

      // Map dialogue history to GoogleGenAI standard structure
      const contents = [
        { role: 'user', parts: [{ text: `System instruction for this session: ${systemInstruction}` }] },
        ...(history || []).map((h: any) => ({
          role: h.role,
          parts: [{ text: h.text }]
        })),
        { role: 'user', parts: [{ text: message }] }
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error("Gemini Server Error:", err);
      res.json({ 
        text: "I am right here with you, breathing calmly. Let's take a deep breath in... and let it out. (My virtual thinking bubble is taking other deep breaths, but let's practice a relaxing Child Pose stretch together!)",
        error: err.message 
      });
    }
  });

  // API Route: AI Parent Co-Regulation Coach (Gemini Powered)
  app.post("/api/parent-coach", async (req, res) => {
    try {
      const { scenario, childName, childGrade } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.includes("KEY")) {
        return res.json({ text: getSimulatedParentCoachResponse(scenario, childName, childGrade) });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = 
        `You are Dr. Alicia Vance, an empathetic Child Psychologist, Co-regulation Specialist, and Senior AI Parenting Coach at Parent Guidance. ` +
        `Your mission is to provide customized, highly compassionate, and actionable co-regulation plans for parents based on real-world behavioral challenges.` +
        `The child's details: Name: ${childName || 'my child'}, Grade: ${childGrade || 'elementary school'}. ` +
        `Always structures your response with 3 friendly, highly practical sections: ` +
        `1. 🌱 Validate Parent's Calmness first: Empathize with the parent and help them ground their own nervous system. ` +
        `2. 🎯 Actionable Kid Co-Regulation: State exactly what words to say, and a recommended physical or breathing gesture (e.g., Cat-Cow, Flying Carpet, Balloon Breath, safe tiny snail). ` +
        `3. 📈 Future Pivot: Suggest a small routine change or replacement positive habit to implement tomorrow. ` +
        `Tone must be professional, warm, non-judgmental, and reassuring. Keep responses focused and readable (under 4 short paragraphs total).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Challenge scenario: ${scenario}`,
        config: {
          systemInstruction: systemInstruction,
          temperature: 1,
        }
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error("Parent Coach Error:", err);
      res.json({ 
        text: getSimulatedParentCoachResponse(req.body.scenario, req.body.childName, req.body.childGrade),
        error: err.message 
      });
    }
  });

  // API Route: AI-Driven Parent Emotional Check-In Prompt Generator (Gemini Powered)
  app.post("/api/emotional-prompt", async (req, res) => {
    try {
      const { emotion, intensity, parentName, childName } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.includes("KEY")) {
        return res.json({ prompt: getSimulatedEmotionalPrompt(emotion, intensity, parentName, childName) });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = 
        `You are Dr. Alicia Vance, an empathetic parenting psychologist and mindfulness expert at MindBloom. ` +
        `Your mission is to generate a gentle, validating, and deeply authentic daily journaling prompt for a parent who has completed their emotional check-in. ` +
        `The parent's details: Name: ${parentName || 'Parent'}, child's name: ${childName || 'Child'}. ` +
        `Their logged emotion right now: "${emotion}" (scaled level ${intensity}/5 on intensity). ` +
        `Always respond with a single paragraph under 3 sentences: ` +
        `- First sentence: Gently validate their emotional state with profound, non-judgmental empathy, mentioning the emotion they are feeling. ` +
        `- Second/Third sentence: Ask a compassionate, targeted reflective question about their parenting day, inviting them to write down what happened or trace their internal feelings. ` +
        `Keep the language exceptionally warm, calm, comforting, and concise (under 60 words total). Do not use placeholders, generic intros, or markdown headers.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Generate a daily reflection prompt for a parent feeling ${emotion} with intensity ${intensity}/5.`,
        config: {
          systemInstruction: systemInstruction,
          temperature: 1,
        }
      });

      res.json({ prompt: response.text });
    } catch (err: any) {
      console.error("Emotional Prompt Generator Error:", err);
      res.json({ 
        prompt: getSimulatedEmotionalPrompt(req.body.emotion, req.body.intensity, req.body.parentName, req.body.childName),
        error: err.message 
      });
    }
  });

  // API Route: AI Clinical Somatic Assignment Generator (Gemini Powered)
  app.post("/api/optimize-assignment", async (req, res) => {
    try {
      const { title, category } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.includes("KEY")) {
        return res.json(getSimulatedOptimizedAssignment(title, category));
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = 
        `You are a Senior Clinical Child Psychologist and Co-regulation expert at MindBloom. ` +
        `Your task is to take a simple parenting task/assignment title and clinical category, and optimize it into an exceptionally good, somatic, interactive experience. ` +
        `The output must be a JSON object containing: \n` +
        `1. "title": A warm, encouraging, specific title (e.g., "Peaceful Bedtime Resets"). \n` +
        `2. "instructions": A step-by-step guidance list explaining exactly what to do in real life with the child. It must have 3 clear sections: \n` +
        `   - 🌱 SENSORY PREPARATION (Grounding the parent's energy first). \n` +
        `   - 🎯 REAL-LIFE somatic co-regulation interaction (e.g. eye contact, synchronous breathing, specific validations) - keep it highly tactical and active so parents do it. \n` +
        `   - 💬 CLINICAL REFLECTION (Instructing the parent to observe child body language and type notes/journals as confirmation instead of just clicking "Done"). \n` +
        `3. "estimatedTime": Recommended session duration (e.g. "8-10 mins"). \n` +
        `Keep wording soft, crystal clear, professional, and action-oriented. Return raw JSON matching fields: "title" (string), "instructions" (string), "estimatedTime" (string).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Create an optimized parenting assignment based on the reference: Title: "${title || 'Co-regulation breathing'}", Category: "${category || 'Emotional Stability'}".`,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.9,
        }
      });

      let data = { title: `Practice: ${title}`, instructions: "", estimatedTime: "10 mins" };
      try {
        if (response.text) {
          data = JSON.parse(response.text.trim());
        }
      } catch (e) {
        console.error("JSON parsing of AI optimized assignment failed, using fallback:", e);
      }
      res.json(data);
    } catch (err: any) {
      console.error("Optimize Assignment Generator Error:", err);
      res.json(getSimulatedOptimizedAssignment(req.body.title, req.body.category));
    }
  });

  // API Route: AI Kid Developmental Milestones Insight Generator
  app.post("/api/milestones-insight", async (req, res) => {
    try {
      const { childName, childAge, checkedMilestones, pendingMilestones, parentingGoal } = req.body;
      const checkedList = Array.isArray(checkedMilestones) ? checkedMilestones : [];
      const pendingList = Array.isArray(pendingMilestones) ? pendingMilestones : [];

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.includes("KEY")) {
        return res.json(getSimulatedMilestonesResponse(childName, childAge, checkedList, pendingList, parentingGoal));
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = 
        `You are Dr. Alicia Vance, an expert pediatric development specialist and clinical co-regulation coach at MindBloom. ` +
        `Your task is to review a child's developmental milestones check-off progress and provide an advanced, extremely warm, positive, child-affirming somatic co-regulation advisory report. ` +
        `The child's details: Name: "${childName || 'my child'}", Age: ${childAge || 7}, Parenting Goal: "${parentingGoal || 'Nervous System Integration'}". \n` +
        `The parent checked off these milestones: ${checkedList.join(', ') || 'No milestones checked yet'}. \n` +
        `The child still has these age-appropriate milestones pending: ${pendingList.join(', ') || 'General developmental advancement'}. \n\n` +
        `You must return a raw JSON object matching this schema EXACTLY:\n` +
        `{\n` +
        `  "summary": "Compassionate, scientifically structured overview validating the parent and detailing where the child is on their sensory development journey.",\n` +
        `  "strategies": [\n` +
        `    "Somatic co-regulation strategy 1: specifically tailored with physical cues",\n` +
        `    "Somatic co-regulation strategy 2: customized phrase or ritual",\n` +
        `    "Somatic co-regulation strategy 3: screen-free calming transitions"\n` +
        `  ],\n` +
        `  "recommendedCoRegulationActivity": {\n` +
        `    "title": "A fun, highly imaginative co-regulation activity title (e.g. Snail Nest breathing)",\n` +
        `    "steps": "Step-by-step description of how the kid and parent practice this co-regulation routine in real life. Keep it highly physical, sensory, and detailed so they actually do it.",\n` +
        `    "clinicalBenefit": "Short clinical summary of why this supports a calm nervous system, specifying muscles or sensory systems targeted."\n` +
        `  }\n` +
        `}\n` +
        `Tone must be professional, supportive, warm, and structured. Return ONLY raw JSON without markdown format blocks.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Analyze developmental co-regulation for ${childName || 'child'} (Age ${childAge}) with parenting goals focused on ${parentingGoal || 'Emotional Wellness'}.`,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.85,
        }
      });

      let data = getSimulatedMilestonesResponse(childName, childAge, checkedList, pendingList, parentingGoal);
      try {
        if (response.text) {
          data = JSON.parse(response.text.trim());
        }
      } catch (e) {
        console.error("JSON parsing of milestones insight failed, using fallback:", e);
      }
      res.json(data);
    } catch (err: any) {
      console.error("Milestones Insight Error:", err);
      res.json(getSimulatedMilestonesResponse(req.body.childName, req.body.childAge, req.body.checkedMilestones || [], req.body.pendingMilestones || [], req.body.parentingGoal));
    }
  });

  // API Route: Send Real/Simulated WhatsApp Notifications
  app.post("/api/send-whatsapp", async (req, res) => {
    try {
      const { to, text, provider, apiKey } = req.body;
      
      // Normalize number
      let formattedPhone = to ? to.trim() : "";
      if (formattedPhone && !formattedPhone.startsWith("+")) {
        const digits = formattedPhone.replace(/\D/g, "");
        if (digits.length === 10) {
          formattedPhone = "+91" + digits; // Default to India (+91) for standard 10 digit Indian number
        } else {
          formattedPhone = "+" + digits;
        }
      }

      console.log(`[WHATSAPP SERVICE] Dispatched requested message to: ${formattedPhone} using gateway: ${provider || "Default"}`);

      // 1. twilio automated gateway
      const twilioSid = process.env.TWILIO_ACCOUNT_SID;
      const twilioToken = process.env.TWILIO_AUTH_TOKEN;
      let twilioFrom = process.env.TWILIO_WHATSAPP_FROM ? process.env.TWILIO_WHATSAPP_FROM.trim() : "";

      // Normalize twilioFrom sender number
      if (!twilioFrom) {
        twilioFrom = "+14155238886";
      } else if (!twilioFrom.startsWith("+")) {
        const digits = twilioFrom.replace(/\D/g, "");
        if (digits.length === 10) {
          twilioFrom = "+1" + digits;
        } else {
          twilioFrom = "+" + digits;
        }
      }

      if (twilioSid && twilioToken) {
        console.log(`[WHATSAPP SERVICE] Attempting robotized dispatch via Twilio SID: ${twilioSid} using sender: ${twilioFrom}`);
        const authHeader = "Basic " + Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64");
        
        const params = new URLSearchParams();
        params.append("From", `whatsapp:${twilioFrom}`);
        params.append("To", `whatsapp:${formattedPhone}`);
        params.append("Body", text);

        let response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
          method: "POST",
          headers: {
            "Authorization": authHeader,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: params
        });

        let resData = await response.json();

        // Detect if Twilio rejects this sender channel with 63007 or similar channel errors
        const isChannelError = !response.ok && (
          resData.code === 63007 || 
          (resData.message && resData.message.toLowerCase().includes("from address")) ||
          (resData.message && resData.message.toLowerCase().includes("channel with the specified from"))
        );

        if (isChannelError && twilioFrom !== "+14155238886") {
          console.warn(`[WHATSAPP SERVICE] Specified sender phone number (${twilioFrom}) is not a registered Twilio WhatsApp channel on this account. Applying automatic fallback to the authorized standard Twilio Sandbox number (+14155238886) to rescue transit.`);
          
          const fallbackParams = new URLSearchParams();
          fallbackParams.append("From", "whatsapp:+14155238886");
          fallbackParams.append("To", `whatsapp:${formattedPhone}`);
          fallbackParams.append("Body", text);

          const fallbackResponse = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
            method: "POST",
            headers: {
              "Authorization": authHeader,
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: fallbackParams
          });

          const fallbackResData = await fallbackResponse.json();

          if (fallbackResponse.ok) {
            return res.json({
              success: true,
              method: "Twilio API Server (Sandbox Fallback)",
              to: formattedPhone,
              sid: fallbackResData.sid,
              text: text,
              fallbackApplied: true,
              warning: `The custom From number ${twilioFrom} is not a verified WhatsApp Sender Channel. We successfully rescued and delivered this alert via the official Twilio Sandbox number (+14155238886).`,
              waLink: `https://wa.me/${formattedPhone.replace("+", "")}?text=${encodeURIComponent(text)}`
            });
          } else {
            console.error("[WHATSAPP SERVICE] Twilio Sandbox Fallback also failed:", fallbackResData);
            throw new Error(fallbackResData.message || `Twilio Sandbox Fallback HTTP ${fallbackResponse.status}`);
          }
        }

        if (response.ok) {
          return res.json({
            success: true,
            method: "Twilio API Server",
            to: formattedPhone,
            sid: resData.sid,
            text: text,
            waLink: `https://wa.me/${formattedPhone.replace("+", "")}?text=${encodeURIComponent(text)}`
          });
        } else {
          console.error("[WHATSAPP SERVICE] Twilio responded with failure:", resData);
          throw new Error(resData.message || `Twilio HTTP ${response.status}`);
        }
      }

      // 2. CallMeBot Gateway falls back if an API key is specified 
      if (apiKey && apiKey.trim() && apiKey !== "api_live_51M4p_secret_whatsapp_key" && apiKey.length > 5) {
        console.log("[WHATSAPP SERVICE] Attempting callmebot dispatch...");
        // CallMeBot takes raw phone without '+'
        const rawPhone = formattedPhone.replace("+", "");
        const callmebotUrl = `https://api.callmebot.com/whatsapp.php?phone=${rawPhone}&text=${encodeURIComponent(text)}&apikey=${apiKey}`;
        
        const cbResp = await fetch(callmebotUrl);
        const textResult = await cbResp.text();
        
        if (cbResp.ok) {
          return res.json({
            success: true,
            method: "CallMeBot Gateway",
            to: formattedPhone,
            response: textResult,
            text: text,
            waLink: `https://wa.me/${rawPhone}?text=${encodeURIComponent(text)}`
          });
        } else {
          console.error("[WHATSAPP SERVICE] CallMeBot error:", textResult);
          throw new Error(textResult || "CallMeBot failed");
        }
      }

      // Fallback
      console.log("[WHATSAPP SERVICE] No active cellular gateway credentials located (Twilio or CallMeBot). Handing down metadata...");
      const waLink = `https://wa.me/${formattedPhone.replace("+", "")}?text=${encodeURIComponent(text)}`;
      return res.json({
        success: false,
        reason: "GATEWAY_UNCONFIGURED",
        message: "Your cell API keys are offline. Use the one-click real WhatsApp redirection option!",
        waLink: waLink,
        to: formattedPhone,
        text: text
      });

    } catch (err: any) {
      console.error("[WHATSAPP SERVICE] Error:", err);
      const waLink = `https://wa.me/${req.body.to ? req.body.to.trim().replace("+", "") : ""}?text=${encodeURIComponent(req.body.text || "")}`;
      return res.json({
        success: false,
        error: err.message,
        waLink: waLink
      });
    }
  });

  // API Route: Send Real/Simulated Telegram Notifications
  app.post("/api/send-telegram", async (req, res) => {
    try {
      const { chatId, text } = req.body;
      const botToken = process.env.TELEGRAM_BOT_TOKEN;

      console.log(`[TELEGRAM SERVICE] Dispatched requested message to chatId: ${chatId}`);

      if (!botToken) {
        console.warn("[TELEGRAM SERVICE] TELEGRAM_BOT_TOKEN is not configured in environment.");
        return res.json({
          success: false,
          reason: "BOT_TOKEN_MISSING",
          message: "Telegram Bot API Token is offline. Please configure TELEGRAM_BOT_TOKEN in .env file."
        });
      }

      if (!chatId || !chatId.trim()) {
        return res.json({
          success: false,
          reason: "CHAT_ID_MISSING",
          message: "Telegram Chat ID is required. Search for your bot on Telegram, press Start, and provide your Chat ID."
        });
      }

      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await fetch(telegramUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId.trim(),
          text: text,
          parse_mode: "HTML"
        })
      });

      const resData = await response.json();

      if (response.ok && resData.ok) {
        return res.json({
          success: true,
          method: "Telegram Bot API",
          chatId: chatId,
          text: text,
          messageId: resData.result.message_id
        });
      } else {
        console.error("[TELEGRAM SERVICE] Telegram responded with failure:", resData);
        throw new Error(resData.description || `Telegram HTTP ${response.status}`);
      }
    } catch (err: any) {
      console.error("[TELEGRAM SERVICE] Error during dispatch:", err);
      return res.json({
        success: false,
        error: err.message
      });
    }
  });

  // API Route: Send Email Notifications (Direct delivery to khwahishseth@gmail.com and parents)
  app.post("/api/send-email", async (req, res) => {
    try {
      const { to, subject, text } = req.body;
      
      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = process.env.SMTP_PORT;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const smtpFrom = process.env.SMTP_FROM || '"MindBloom Safety Admin" <security@mindbloom.dev>';

      // Primary target list (always includes the user's specific audit address)
      const recipients = ["khwahishseth@gmail.com"];
      if (to && to.trim() && to.trim().toLowerCase() !== "khwahishseth@gmail.com") {
        recipients.push(to.trim());
      }
      
      const recipientString = recipients.join(", ");
      console.log(`[EMAIL SERVICE] Initializing secure email transactivity to: ${recipientString}`);

      let transporter;
      let isTest = false;

      if (smtpHost && smtpUser && smtpPass) {
        // Real SMTP details
        transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(smtpPort || "587"),
          secure: smtpPort === "465",
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });
      } else {
        // Smart automated sandbox fallback using Ethereal account
        console.log("[EMAIL SERVICE] No custom SMTP credentials recognized. Generating local testing mailbox...");
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: testAccount.smtp.host,
          port: testAccount.smtp.port,
          secure: testAccount.smtp.secure,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        isTest = true;
      }

      const info = await transporter.sendMail({
        from: smtpFrom,
        to: recipientString,
        subject: subject,
        text: text,
        html: text.replace(/\n/g, "<br>"),
      });

      let previewUrl = "";
      if (isTest) {
        previewUrl = nodemailer.getTestMessageUrl(info) || "";
        console.log(`[EMAIL SERVICE] Message dispatched successfully under ID: ${info.messageId}`);
        console.log(`[EMAIL SERVICE] Review sent content here: ${previewUrl}`);
      } else {
        console.log(`[EMAIL SERVICE] Securely transmitted message to ${recipientString}`);
      }

      // Record logs directly to the persistent JSON database
      try {
        const currentData = readLocalBackup() || {};
        if (!currentData.emailLogs) {
          currentData.emailLogs = [];
        }
        currentData.emailLogs.unshift({
          id: `mail-${Date.now()}-${Math.floor(Math.random()*1000)}`,
          recipient: recipientString,
          subject: subject,
          body: text,
          previewUrl: previewUrl,
          timestamp: new Date().toLocaleString(),
          status: isTest ? 'delivered (Ethereal Sandbox)' : 'delivered (Real SMTP Direct)'
        });
        saveLocalBackup(currentData);
      } catch (logErr) {
        console.error("[EMAIL SERVICE LOG] Failed writing email logs to local DB:", logErr);
      }

      res.json({
        success: true,
        messageId: info.messageId,
        previewUrl: previewUrl,
        recipients: recipientString,
      });
    } catch (err: any) {
      console.error("[EMAIL SERVICE] Failed dispatching transaction email:", err);
      res.json({
        success: false,
        error: err.message,
      });
    }
  });

  // API Route: GET Outbound SMTP Email History logs
  app.get("/api/email-logs", async (req, res) => {
    try {
      const currentData = readLocalBackup() || {};
      res.json({
        success: true,
        logs: currentData.emailLogs || [
          {
            id: "mail-seed-1",
            recipient: "khwahishseth@gmail.com, parent.test@example.com",
            subject: "[Clinical Access Check] Portal Authorization Code",
            body: "Hello Parent,\n\nWe successfully authorized your student credentials.\nTemporary clinical passcode: mindbloom2026!",
            previewUrl: "https://ethereal.email/message/sample",
            timestamp: new Date().toLocaleString(),
            status: "delivered (Sample System Seed)"
          }
        ]
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: POST Clear Outbound SMTP Email History logs
  app.post("/api/email-logs/clear", async (req, res) => {
    try {
      const currentData = readLocalBackup() || {};
      currentData.emailLogs = [];
      saveLocalBackup(currentData);
      res.json({ success: true, message: "Outbound SMTP transaction log cleared successfully." });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Check Supabase Status and Connection
  app.get("/api/supabase/status", async (req, res) => {
    try {
      const client = getSupabase();
      const localExists = fs.existsSync(LOCAL_DB_PATH);
      if (!client) {
        return res.json({
          configured: false,
          supabase_url: process.env.SUPABASE_URL || "",
          local_fallback: true,
          local_data_exists: localExists,
          message: "Supabase connection is not active yet. MindBloom is running on a fail-safe local JSON database backend! All progress will persist inside data_db_backup.json on your computer."
        });
      }

      // Check table connectivity
      let connectionSuccess = false;
      let tablesMessage = "Testing table connectivity...";
      let tablesDetected: string[] = [];

      try {
        const { error } = await client.from("parents").select("count", { count: "exact", head: true });
        if (error) {
          if (error.code === "PGRST116" || error.code === "42P01") {
            tablesMessage = "Connected to Supabase successfully, but database tables (e.g. 'parents') are missing! Please run the SQL schema initialization script.";
          } else {
            console.error("[SUPABASE LOGS] Table fetch failed with error:", error);
            tablesMessage = `Connection established but query returned code ${error.code}: ${error.message}`;
          }
        } else {
          connectionSuccess = true;
          tablesMessage = "All connected! Database is ready to synchronize.";
          tablesDetected.push("parents");
        }
      } catch (e: any) {
        console.error("[SUPABASE LOGS] Test Query exception:", e);
        tablesMessage = `Connection active but test query threw error: ${e.message}`;
      }

      // Return status along with schema file to render in frontend for 1-click SQL copy-paste!
      const schemaSql = `-- MindBloom & Parents Guidance App - Complete Supabase Setup Script
-- Paste this script directly into your Supabase SQL Editor and click 'Run'.

-- =========================================================================
-- 1. SETUP PUBLIC PROFILE TABLES (AUTHENTICATION SYNC)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  role VARCHAR DEFAULT 'parent' CHECK (role IN ('parent', 'student', 'admin', 'mentor')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 2. APP SPECIFIC DATA TABLES
-- =========================================================================

-- Create Parents Table
CREATE TABLE IF NOT EXISTS public.parents (
  phone TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  telegram_chat_id TEXT,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  class_grade TEXT,
  batch_cohort TEXT,
  start_date TEXT,
  password TEXT,
  unlocked_weeks_list INT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  last_login TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Students Table (used by frontend sync context)
CREATE TABLE IF NOT EXISTS public.students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  grade TEXT,
  assigned_parent_phone TEXT REFERENCES public.parents(phone) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Children Table (synonymous with students table)
CREATE TABLE IF NOT EXISTS public.children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_student_id TEXT UNIQUE REFERENCES public.students(id) ON DELETE CASCADE,
  parent_phone TEXT REFERENCES public.parents(phone) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  grade VARCHAR,
  date_of_birth DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Attendance Table
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE,
  status VARCHAR DEFAULT 'present' CHECK (status IN ('present', 'absent', 'tardy', 'excused')),
  marked_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  session_id VARCHAR,
  class_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Reflections Table (for parent core reflections)
CREATE TABLE IF NOT EXISTS public.reflections (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  week INT,
  prompt TEXT,
  entry TEXT,
  notes TEXT,
  created_at TEXT,
  server_created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Daily Habit Tasks Table
CREATE TABLE IF NOT EXISTS public.daily_tasks (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL,
  day INT,
  title TEXT NOT NULL,
  instructions TEXT,
  estimated_time TEXT,
  completed BOOLEAN DEFAULT FALSE,
  reflection TEXT,
  note TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Live Sessions Table
CREATE TABLE IF NOT EXISTS public.live_sessions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  mentor_name TEXT,
  description TEXT,
  stream_url TEXT,
  status TEXT,
  scheduled_time TEXT,
  target_group TEXT,
  points_reward INT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Modules Table CO-REGULATION
CREATE TABLE IF NOT EXISTS public.modules (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  week INT,
  unlocked BOOLEAN DEFAULT FALSE,
  progress INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Lessons Table CO-REGULATION
CREATE TABLE IF NOT EXISTS public.lessons (
  id TEXT PRIMARY KEY,
  module_id TEXT REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration TEXT,
  wistia_id TEXT DEFAULT 'eabjoioutk',
  completed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Feedback Table
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_phone TEXT REFERENCES public.parents(phone) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  module_id TEXT,
  lesson_id TEXT,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receiver_phone TEXT REFERENCES public.parents(phone) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  message TEXT NOT NULL,
  channel VARCHAR DEFAULT 'whatsapp' CHECK (channel IN ('whatsapp', 'email', 'telegram', 'sms')),
  status VARCHAR DEFAULT 'sent' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action VARCHAR NOT NULL,
  entity_type VARCHAR,
  entity_id VARCHAR,
  ip_address VARCHAR,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 3. INDEXES FOR RAPID SEARCH AND RETRIEVAL
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_parents_user ON public.parents(user_id);
CREATE INDEX IF NOT EXISTS idx_children_parent ON public.children(parent_phone);
CREATE INDEX IF NOT EXISTS idx_attendance_child ON public.attendance(child_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(class_date);
CREATE INDEX IF NOT EXISTS idx_feedback_parent ON public.feedback(parent_phone);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON public.activity_logs(user_id);

-- =========================================================================
-- 4. DATABASE TRIGGERS AND SYNC FUNCTIONS
-- =========================================================================

-- Trigger function for auth.users -> public.users sync
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', 'Parent User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'parent')
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      name = COALESCE(EXCLUDED.name, public.users.name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Bidirectional trigger to keep 'students' table and 'children' table fully synchronized
CREATE OR REPLACE FUNCTION public.sync_students_to_children()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.children (app_student_id, parent_phone, name, grade, created_at)
  VALUES (NEW.id, NEW.assigned_parent_phone, NEW.name, NEW.grade, NEW.created_at)
  ON CONFLICT (app_student_id) DO UPDATE
  SET parent_phone = EXCLUDED.parent_phone,
      name = EXCLUDED.name,
      grade = EXCLUDED.grade,
      updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trigger_sync_students_to_children
  AFTER INSERT OR UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.sync_students_to_children();

-- Handle students deletions
CREATE OR REPLACE FUNCTION public.sync_students_deletions()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.children WHERE app_student_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trigger_sync_students_deletions
  AFTER DELETE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.sync_students_deletions();

-- Automatically update timestamps
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_users_modtime BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();
CREATE OR REPLACE TRIGGER update_parents_modtime BEFORE UPDATE ON public.parents FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();
CREATE OR REPLACE TRIGGER update_children_modtime BEFORE UPDATE ON public.children FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

-- =========================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Setup RLS Policies

-- Public Users Policies
CREATE POLICY "Allow public read access to users profiles" ON public.users
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Allow user to update own profile" ON public.users
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Parents Table Policies
CREATE POLICY "Allow public selective access to parents" ON public.parents
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Allow insert/upsert of parent profiles" ON public.parents
  FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- Students Table Policies
CREATE POLICY "Allow read access to students" ON public.students
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Allow write access to students" ON public.students
  FOR ALL TO authenticated, anon USING (true);

-- Children Table Policies
CREATE POLICY "Allow read/write access to children" ON public.children
  FOR ALL TO authenticated, anon USING (true);

-- Attendance Table Policies
CREATE POLICY "Allow read/write access to attendance" ON public.attendance
  FOR ALL TO authenticated USING (true);

-- Reflections Table Policies
CREATE POLICY "Allow read/write access to reflections" ON public.reflections
  FOR ALL TO authenticated, anon USING (true);

-- Daily Tasks Table Policies
CREATE POLICY "Allow read/write access to daily_tasks" ON public.daily_tasks
  FOR ALL TO authenticated, anon USING (true);

-- Live Sessions Table Policies
CREATE POLICY "Allow read/write access to live_sessions" ON public.live_sessions
  FOR ALL TO authenticated, anon USING (true);

-- Modules Table Policies
CREATE POLICY "Allow read/write access to modules" ON public.modules
  FOR ALL TO authenticated, anon USING (true);

-- Lessons Table Policies
CREATE POLICY "Allow read/write access to lessons" ON public.lessons
  FOR ALL TO authenticated, anon USING (true);

-- Feedback Table Policies
CREATE POLICY "Allow read/write access to feedback" ON public.feedback
  FOR ALL TO authenticated, anon USING (true);

-- Notifications Table Policies
CREATE POLICY "Allow read/write access to notifications" ON public.notifications
  FOR ALL TO authenticated, anon USING (true);

-- Activity Logs Table Policies
CREATE POLICY "Allow admins to read activity_logs" ON public.activity_logs
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Allow insertion of activity_logs" ON public.activity_logs
  FOR INSERT TO authenticated, anon WITH CHECK (true);


-- =========================================================================
-- 6. STORAGE BUCKET CONFIGURATION (SUPABASE REALM)
-- =========================================================================

-- Create buckets 'documents' and 'images' if not present under storage database schema
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true), ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage object security policies
CREATE POLICY "Allow public read access to images" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Allow public read access to documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Allow authenticated users to upload to images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images');

CREATE POLICY "Allow authenticated users to upload to documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents');


-- =========================================================================
-- 7. GENERATE HIGH-QUALITY SAMPLE SEED DATA
-- =========================================================================

-- Seed Core Parents
INSERT INTO public.parents (phone, name, email, student_id, student_name, class_grade, batch_cohort, start_date, password, unlocked_weeks_list, status)
VALUES 
  ('+15550199', 'Sarah Jenkins', 'sarah.j@example.com', 'std_sarah_1', 'Tommy Jenkins', 'Grade 3', 'Cohort-A', '2026-05-10', 'parent123', '{1,2,3}', 'active'),
  ('+15550299', 'David Miller', 'david.m@example.com', 'std_david_1', 'Lily Miller', 'Grade 1', 'Cohort-A', '2026-05-15', 'parent456', '{1,2}', 'active'),
  ('+15550399', 'Amanda Ross', 'amanda.r@example.com', 'std_amanda_1', 'Emma Ross', 'Grade 5', 'Cohort-B', '2026-05-20', 'parent789', '{1}', 'active')
ON CONFLICT (phone) DO NOTHING;

-- Seed Students
INSERT INTO public.students (id, name, grade, assigned_parent_phone)
VALUES
  ('std_sarah_1', 'Tommy Jenkins', 'Grade 3', '+15550199'),
  ('std_david_1', 'Lily Miller', 'Grade 1', '+15550299'),
  ('std_amanda_1', 'Emma Ross', 'Grade 5', '+15550399')
ON CONFLICT (id) DO NOTHING;

-- Trigger automatically populates 'children', update metadata fields
UPDATE public.children SET date_of_birth = '2016-04-12' WHERE name = 'Tommy Jenkins';
UPDATE public.children SET date_of_birth = '2018-09-24' WHERE name = 'Lily Miller';
UPDATE public.children SET date_of_birth = '2014-11-05' WHERE name = 'Emma Ross';

-- Seed Attendance Records
INSERT INTO public.attendance (child_id, status, class_date)
VALUES
  ((SELECT id FROM public.children WHERE name='Tommy Jenkins' LIMIT 1), 'present', '2026-06-10'),
  ((SELECT id FROM public.children WHERE name='Tommy Jenkins' LIMIT 1), 'present', '2026-06-11'),
  ((SELECT id FROM public.children WHERE name='Lily Miller' LIMIT 1), 'present', '2026-06-11'),
  ((SELECT id FROM public.children WHERE name='Emma Ross' LIMIT 1), 'absent', '2026-06-11')
ON CONFLICT DO NOTHING;

-- Seed Reflections Table
INSERT INTO public.reflections (id, module_id, lesson_id, week, prompt, entry, notes, created_at)
VALUES
  ('refl_seed_1', 'm1', 'l1-3', 1, 'What did you observe when playing without offering suggestions?', 'Tommy was extremely creative with building blocks when I refrained from micro-managing his actions.', 'Tommy was joyful.', '2026-06-10T12:00:00Z'),
  ('refl_seed_2', 'm2', 'l2-3', 2, 'How did your child respond when you validated their disappointment?', 'Lily settled down her emotional state in less than 2 minutes when I mirrored her frustration.', 'Needs weekly practice.', '2026-06-11T14:30:00Z')
ON CONFLICT (id) DO NOTHING;

-- Seed Daily Habit Tasks Table
INSERT INTO public.daily_tasks (id, module_id, day, title, instructions, estimated_time, completed)
VALUES
  ('task_seed_1', 'm1', 1, 'Conflict Observer Blueprint', 'Observe siblings bicker for at least 30 seconds before stepping in.', '5 mins', true),
  ('task_seed_2', 'm1', 2, 'Special Uninterrupted Minutes', 'Spend 10 minutes of device-free quality play with child.', '10 mins', false)
ON CONFLICT (id) DO NOTHING;

-- Seed Live Webinars
INSERT INTO public.live_sessions (id, title, mentor_name, description, stream_url, status, scheduled_time, target_group, points_reward)
VALUES
  ('session_seed_1', 'Overcoming Digital Sensory Overload', 'Dr. Laura Vance', 'Clinical methods to sunset screens smoothly.', 'https://khwahishseth.wistia.com/folders/wx9zawl1d9', 'upcoming', '2026-06-18T18:00:00Z', 'All Grades', 150)
ON CONFLICT (id) DO NOTHING;

-- Seed Feedback Table
INSERT INTO public.feedback (parent_phone, rating, module_id, lesson_id, comment)
VALUES
  ('+15550199', 5, 'm1', 'l1-3', 'Wonderful material, extremely practical!'),
  ('+15550299', 4, 'm1', 'l1-1', 'Videos are highly useful.')
ON CONFLICT DO NOTHING;

-- Seed Notifications Table
INSERT INTO public.notifications (receiver_phone, title, message, channel, status)
VALUES
  ('+15550199', 'Daily Habit Reminder', 'Sarah, don-t forget Tommy-s special minutes!', 'whatsapp', 'sent'),
  ('+15550299', 'Somatic Clinic Live Alert', 'David, live webinar is starting in 15 mins!', 'whatsapp', 'delivered')
ON CONFLICT DO NOTHING;

-- Seed Modules
INSERT INTO public.modules (id, title, description, week, unlocked, progress)
VALUES
  ('m1', 'Understanding Your Child', 'Learn the fundamentals of child psychology and temperament.', 1, true, 100),
  ('m2', 'Building Communication', 'Strategies for effective listening and speaking with your child.', 2, true, 40),
  ('m3', 'Anger Management', 'Tools for staying calm when things get heated.', 3, false, 0),
  ('m4', 'Confidence Building', 'Nurturing self-esteem and resilience.', 4, false, 0),
  ('m5', 'Discipline Without Fear', 'How to set boundaries with love and consistency.', 5, false, 0),
  ('m6', 'Managing Screen Addiction', 'Practical steps for healthy tech habits.', 6, false, 0),
  ('m7', 'Emotional Intelligence', 'Identifying and naming emotions for better self-regulation.', 7, false, 0),
  ('m8', 'Healthy Routine Building', 'Creating structures that reduce daily friction.', 8, false, 0)
ON CONFLICT (id) DO NOTHING;

-- Seed Lessons
INSERT INTO public.lessons (id, module_id, title, duration, wistia_id, completed, notes)
VALUES
  ('l1-1', 'm1', 'The Developing Brain', '12:45', 'eabjoioutk', true, 'Child brain development fundamentals.'),
  ('l1-2', 'm1', 'Temperament vs Behavior', '08:20', 'eabjoioutk', true, 'Navigating sensory vs behavioral reactivity.'),
  ('l1-3', 'm1', 'Observation Exercise', '15:00', 'eabjoioutk', true, 'Face-to-face eye contact praise practice.'),
  ('l2-1', 'm2', 'Active Listening', '10:15', 'eabjoioutk', true, 'Listening without judgment or disruption.'),
  ('l2-2', 'm2', 'The Power of Validation', '09:40', 'eabjoioutk', false, 'Validating tantrums before setting boundaries.'),
  ('l2-3', 'm2', 'Communication Styles Quiz', '05:00', 'eabjoioutk', false, 'Discovering trigger styles.'),
  ('l3-1', 'm3', 'Trigger Awareness', '11:20', 'eabjoioutk', false, 'Parent de-escalation breathing techniques.')
ON CONFLICT (id) DO NOTHING;
`;

      res.json({
        configured: true,
        connected: connectionSuccess || tablesDetected.length > 0 || !tablesMessage.includes("missing"),
        tables_exist: connectionSuccess,
        supabase_url: process.env.SUPABASE_URL,
        tables_message: tablesMessage,
        sql_schema: schemaSql
      });

    } catch (err: any) {
      console.error("[SUPABASE LOGS] Status Route crash:", err);
      res.json({
        configured: false,
        error: err.message
      });
    }
  });

  // API Route: Push Local Client-state to Supabase
  app.post("/api/supabase/push", async (req, res) => {
    try {
      const client = getSupabase();
      
      // Always save a local copy so it works out-of-the-box locally!
      saveLocalBackup(req.body);

      if (!client) {
        return res.json({
          success: true,
          local_fallback: true,
          message: "Successfully synchronized details to your local file database! Configure SUPABASE_URL in .env to replicate to Supabase cloud.",
          results: {
            parents: { success: true, count: req.body.parents?.length || 0 },
            students: { success: true, count: req.body.students?.length || 0 },
            reflections: { success: true, count: req.body.reflections?.length || 0 },
            daily_tasks: { success: true, count: req.body.daily_tasks?.length || 0 },
            live_sessions: { success: true, count: req.body.live_sessions?.length || 0 },
            modules: { success: true, count: req.body.modules?.length || 0 }
          }
        });
      }

      const { parents, students, reflections, daily_tasks, live_sessions, modules } = req.body;
      const results: Record<string, any> = {};

      // 1. Core Parents Sync
      if (parents && Array.isArray(parents)) {
        const parentsData = parents.map(p => ({
          phone: p.phone,
          name: p.name,
          email: p.email || null,
          telegram_chat_id: p.telegramChatId || null,
          student_id: p.studentId,
          student_name: p.studentName,
          class_grade: p.classGrade,
          batch_cohort: p.batchCohort,
          start_date: p.startDate,
          password: p.password,
          unlocked_weeks_list: p.unlockedWeeksList || [],
          status: p.status || 'active',
          last_login: p.lastLogin || null,
          photo_url: p.photoUrl || null
        }));

        const { error } = await client.from("parents").upsert(parentsData);
        results.parents = error ? { success: false, error } : { success: true, count: parentsData.length };
      }

      // 2. Core Students Sync
      if (students && Array.isArray(students)) {
        const studentsData = students.map(s => ({
          id: s.id,
          name: s.name,
          grade: s.grade,
          assigned_parent_phone: s.assignedParentPhone
        }));

        const { error } = await client.from("students").upsert(studentsData);
        results.students = error ? { success: false, error } : { success: true, count: studentsData.length };
      }

      // 3. Core Reflections Sync
      if (reflections && Array.isArray(reflections)) {
        const reflectionsData = reflections.map(r => ({
          id: r.id,
          module_id: r.moduleId,
          lesson_id: r.lessonId,
          week: r.week,
          prompt: r.prompt,
          entry: r.entry,
          notes: r.notes || null,
          created_at: r.createdAt
        }));

        const { error } = await client.from("reflections").upsert(reflectionsData);
        results.reflections = error ? { success: false, error } : { success: true, count: reflectionsData.length };
      }

      // 4. Core Daily Tasks Sync
      if (daily_tasks && Array.isArray(daily_tasks)) {
        const tasksData = daily_tasks.map(t => ({
          id: t.id,
          module_id: t.moduleId,
          day: t.day,
          title: t.title,
          instructions: t.instructions,
          estimated_time: t.estimatedTime,
          completed: !!t.completed,
          reflection: t.reflection || null,
          note: t.note || null
        }));

        const { error } = await client.from("daily_tasks").upsert(tasksData);
        results.daily_tasks = error ? { success: false, error } : { success: true, count: tasksData.length };
      }

      // 5. Core Live Sessions Sync
      if (live_sessions && Array.isArray(live_sessions)) {
        const liveSessionsData = live_sessions.map(ls => ({
          id: ls.id,
          title: ls.title,
          mentor_name: ls.mentorName,
          description: ls.description,
          stream_url: ls.streamUrl,
          status: ls.status,
          scheduled_time: ls.scheduledTime,
          target_group: ls.targetGroup,
          points_reward: ls.pointsReward
        }));

        const { error } = await client.from("live_sessions").upsert(liveSessionsData);
        results.live_sessions = error ? { success: false, error } : { success: true, count: liveSessionsData.length };
      }

      // 6. Core Modules and Lessons Sync
      if (modules && Array.isArray(modules)) {
        try {
          const modulesData = modules.map(m => ({
            id: m.id,
            title: m.title,
            description: m.description,
            week: m.week,
            unlocked: !!m.unlocked,
            progress: m.progress || 0
          }));

          const { error: modErr } = await client.from("modules").upsert(modulesData);
          results.modules = modErr ? { success: false, error: modErr } : { success: true, count: modulesData.length };

          // Gather lessons
          const lessonsData: any[] = [];
          modules.forEach(m => {
            if (m.lessons && Array.isArray(m.lessons)) {
              m.lessons.forEach(l => {
                lessonsData.push({
                  id: l.id,
                  module_id: m.id,
                  title: l.title,
                  duration: l.duration || "5:00",
                  wistia_id: l.wistiaId || "eabjoioutk",
                  completed: !!l.completed,
                  notes: l.notes || ""
                });
              });
            }
          });

          if (lessonsData.length > 0) {
            const { error: lesErr } = await client.from("lessons").upsert(lessonsData);
            results.lessons = lesErr ? { success: false, error: lesErr } : { success: true, count: lessonsData.length };
          } else {
            results.lessons = { success: true, count: 0 };
          }
        } catch (e: any) {
          results.modules = { success: false, error: e.message };
        }
      }

      console.log("[SUPABASE LOGS] Cloud Push complete. Results summary:", results);
      res.json({
        success: true,
        message: "Data synced up to Supabase successfully!",
        results
      });

    } catch (err: any) {
      console.error("[SUPABASE LOGS] Cloud Push crashed:", err);
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  });

  // API Route: Pull DB State from Supabase to Client
  app.get("/api/supabase/pull", async (req, res) => {
    try {
      const client = getSupabase();
      if (!client) {
        const localData = readLocalBackup();
        if (localData) {
          return res.json({
            success: true,
            local_fallback: true,
            message: "Successfully retrieved data from your local file database fallback!",
            data: localData
          });
        }
        return res.json({
          success: false,
          local_fallback: true,
          message: "No local JSON database file (data_db_backup.json) found yet. Please hit 'Push to Cloud' first to initialize a local backup file!"
        });
      }

      // Fetch all tables
      const [
        parentsRes,
        studentsRes,
        reflectionsRes,
        tasksRes,
        liveRes,
        modulesRes,
        lessonsRes
      ] = await Promise.all([
        client.from("parents").select("*"),
        client.from("students").select("*"),
        client.from("reflections").select("*"),
        client.from("daily_tasks").select("*"),
        client.from("live_sessions").select("*"),
        client.from("modules").select("*").order("week", { ascending: true }),
        client.from("lessons").select("*")
      ]);

      const errors: Record<string, any> = {};
      if (parentsRes.error) errors.parents = parentsRes.error;
      if (studentsRes.error) errors.students = studentsRes.error;
      if (reflectionsRes.error) errors.reflections = reflectionsRes.error;
      if (tasksRes.error) errors.daily_tasks = tasksRes.error;
      if (liveRes.error) errors.live_sessions = liveRes.error;
      if (modulesRes.error) errors.modules = modulesRes.error;
      if (lessonsRes.error) errors.lessons = lessonsRes.error;

      // If parents table doesn't exist yet, we fail nicely
      if (parentsRes.error && (parentsRes.error.code === "PGRST116" || parentsRes.error.code === "42P01")) {
        return res.json({
          success: false,
          tables_missing: true,
          message: "Could not pull because Supabase database tables do not exist yet. Please run the SQL schema initialization."
        });
      }

      // Transform back to Client Key formats
      const parents = (parentsRes.data || []).map(p => ({
        phone: p.phone,
        name: p.name,
        email: p.email,
        telegramChatId: p.telegram_chat_id,
        studentId: p.student_id,
        studentName: p.student_name,
        classGrade: p.class_grade,
        batchCohort: p.batch_cohort,
        startDate: p.start_date,
        password: p.password,
        unlockedWeeksList: p.unlocked_weeks_list || [],
        status: p.status,
        lastLogin: p.last_login,
        photoUrl: p.photo_url
      }));

      const students = (studentsRes.data || []).map(s => ({
        id: s.id,
        name: s.name,
        grade: s.grade,
        assignedParentPhone: s.assigned_parent_phone
      }));

      const reflections = (reflectionsRes.data || []).map(r => ({
        id: r.id,
        moduleId: r.module_id,
        lessonId: r.lesson_id,
        week: r.week,
        prompt: r.prompt,
        entry: r.entry,
        notes: r.notes,
        createdAt: r.created_at
      }));

      const daily_tasks = (tasksRes.data || []).map(t => ({
        id: t.id,
        moduleId: t.module_id,
        day: t.day,
        title: t.title,
        instructions: t.instructions,
        estimatedTime: t.estimated_time,
        completed: !!t.completed,
        reflection: t.reflection,
        note: t.note
      }));

      const live_sessions = (liveRes.data || []).map(ls => ({
        id: ls.id,
        title: ls.title,
        mentorName: ls.mentor_name,
        description: ls.description,
        streamUrl: ls.stream_url,
        status: ls.status,
        scheduledTime: ls.scheduled_time,
        targetGroup: ls.target_group,
        pointsReward: ls.points_reward
      }));

      // Reconstruct nested modules
      let modules: any[] = [];
      if (!modulesRes.error && modulesRes.data) {
        const lessonsList = lessonsRes.data || [];
        modules = modulesRes.data.map((m: any) => {
          const moduleLessons = lessonsList
            .filter((l: any) => l.module_id === m.id)
            .map((l: any) => ({
              id: l.id,
              title: l.title,
              duration: l.duration,
              wistiaId: l.wistia_id,
              completed: !!l.completed,
              notes: l.notes
            }));
          return {
            id: m.id,
            title: m.title,
            description: m.description,
            week: m.week,
            unlocked: !!m.unlocked,
            progress: m.progress,
            lessons: moduleLessons
          };
        });
      }

      console.log(`[SUPABASE LOGS] Cloud Pull Success: Loaded ${parents.length} parents, ${students.length} students, ${modules.length} modules.`);

      res.json({
        success: true,
        data: {
          parents,
          students,
          reflections,
          daily_tasks: daily_tasks,
          live_sessions,
          modules
        },
        errors: Object.keys(errors).length > 0 ? errors : undefined
      });

    } catch (err: any) {
      console.error("[SUPABASE LOGS] Cloud Pull crash:", err);
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  });

  // API Route: GET Express host database detail status
  app.get("/api/backend-data/status", async (req, res) => {
    try {
      const pCount = readLocalBackup() || {};
      const stats = fs.existsSync(LOCAL_DB_PATH) ? fs.statSync(LOCAL_DB_PATH) : null;
      const uptimeSec = process.uptime();
      
      const serverStats = {
        uptime: `${Math.floor(uptimeSec / 3600)}h ${Math.floor((uptimeSec % 3600) / 60)}m ${Math.floor(uptimeSec % 60)}s`,
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        memoryUsage: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
        backupFileSize: stats ? `${(stats.size / 1024).toFixed(2)} KB` : "0 KB",
        backupLastModified: stats ? stats.mtime.toLocaleString() : "Never",
        counts: {
          parents: pCount.parents?.length || 0,
          students: pCount.students?.length || 0,
          reflections: pCount.reflections?.length || 0,
          dailyTasks: pCount.daily_tasks?.length || 0,
          liveSessions: pCount.live_sessions?.length || 0,
          modules: pCount.modules?.length || 0,
          passwordResetRequests: pCount.passwordResetRequests?.length || 0,
        },
        supabase: {
          configured: !!process.env.SUPABASE_URL,
          url: process.env.SUPABASE_URL || "",
          connected: !!getSupabase()
        }
      };
      res.json(serverStats);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: POST reset sandbox databases (local + Supabase)
  app.post("/api/backend-data/reset", async (req, res) => {
    try {
      const emptyDb = {
        parents: [],
        students: [],
        reflections: [],
        daily_tasks: [],
        live_sessions: [],
        modules: [],
        passwordResetRequests: [],
        strictnessLevel: 'medium',
        tagDatabase: [],
        childProfiles: [],
        learningPaths: [],
        scoringRules: [],
        unlockDependencies: []
      };
      
      saveLocalBackup(emptyDb);
      
      const client = getSupabase();
      if (client) {
        try {
          await Promise.all([
            client.from("attendance").delete().neq("id", "00000000_plh"),
            client.from("feedback").delete().neq("id", "00000000_plh"),
            client.from("notifications").delete().neq("id", "00000000_plh"),
            client.from("reflections").delete().neq("id", "00000000_plh"),
            client.from("daily_tasks").delete().neq("id", "00000000_plh"),
            client.from("lessons").delete().neq("id", "placeholder_plh"),
            client.from("modules").delete().neq("id", "placeholder_plh"),
            client.from("students").delete().neq("id", "placeholder_plh"),
            client.from("parents").delete().neq("phone", "placeholder_plh")
          ]);
        } catch (subErr) {
          console.error("[RESET WARNING] Supabase purge warning:", subErr);
        }
      }
      
      res.json({ success: true, message: "Sandbox database format reset completed." });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: POST restore baseline seeds (local + Supabase)
  app.post("/api/backend-data/reseed", async (req, res) => {
    try {
      const seedDb = {
        parents: [
          { phone: "+15550199", name: "Sarah Jenkins", email: "sarah.j@example.com", studentId: "std_sarah_1", studentName: "Tommy Jenkins", classGrade: "Grade 3", batchCohort: "Cohort-A", startDate: "2026-05-10", password: "parent123", unlockedWeeksList: [1, 2, 3], status: "active" },
          { phone: "+15550299", name: "David Miller", email: "david.m@example.com", studentId: "std_david_1", studentName: "Lily Miller", classGrade: "Grade 1", batchCohort: "Cohort-A", startDate: "2026-05-15", password: "parent456", unlockedWeeksList: [1, 2], status: "active" }
        ],
        students: [
          { id: "std_sarah_1", name: "Tommy Jenkins", grade: "Grade 3", assignedParentPhone: "+15550199" },
          { id: "std_david_1", name: "Lily Miller", grade: "Grade 1", assignedParentPhone: "+15550299" }
        ],
        reflections: [
          { id: "refl_seed_1", moduleId: "m1", lessonId: "l1-3", week: 1, prompt: "What did you observe when playing without offering suggestions?", entry: "Tommy was extremely creative with building blocks when I refrained from micro-managing his actions.", notes: "Tommy was joyful.", createdAt: "2026-06-10T12:00:00Z" }
        ],
        daily_tasks: [
          { id: "task_seed_1", moduleId: "m1", day: 1, title: "Conflict Observer Blueprint", instructions: "Observe siblings bicker for at least 30 seconds before stepping in.", estimatedTime: "5 mins", completed: true },
          { id: "task_seed_2", moduleId: "m1", day: 2, title: "Special Uninterrupted Minutes", instructions: "Spend 10 minutes of device-free quality play with child.", estimatedTime: "10 mins", completed: false }
        ],
        live_sessions: [
          { id: "session_seed_1", title: "Overcoming Digital Sensory Overload", mentorName: "Dr. Laura Vance", description: "Clinical methods to sunset screens smoothly.", streamUrl: "i0iwga8cbj", status: "live", scheduledTime: "Today at 7:00 PM (IST)", targetGroup: "both", pointsReward: 150 }
        ],
        modules: [
          { id: "m1", title: "Understanding Your Child", description: "Learn the fundamentals of child psychology and temperament.", week: 1, unlocked: true, progress: 100, lessons: [
            { id: "l1-1", title: "The Developing Brain", duration: "12:45", wistiaId: "eabjoioutk", completed: true, notes: "Child brain development fundamentals." },
            { id: "l1-2", title: "Temperament vs Behavior", duration: "08:20", wistiaId: "eabjoioutk", completed: true, notes: "Navigating sensory vs behavioral reactivity." },
            { id: "l1-3", title: "Observation Exercise", duration: "15:00", wistiaId: "eabjoioutk", completed: true, notes: "Face-to-face eye contact praise practice." }
          ]},
          { id: "m2", title: "Building Communication", description: "Strategies for effective listening and speaking with your child.", week: 2, unlocked: true, progress: 40, lessons: [
            { id: "l2-1", title: "Active Listening", duration: "10:15", wistiaId: "eabjoioutk", completed: true, notes: "Listening without judgment or disruption." },
            { id: "l2-2", title: "The Power of Validation", duration: "09:40", wistiaId: "eabjoioutk", completed: false, notes: "Validating tantrums before setting boundaries." }
          ]}
        ],
        passwordResetRequests: [
          { id: "req-seed-01", phone: "+15550299", email: "david.m@example.com", resolved: false, createdAt: new Date().toISOString() }
        ],
        strictnessLevel: "medium"
      };

      saveLocalBackup(seedDb);

      const client = getSupabase();
      if (client) {
        try {
          await client.from("parents").upsert(seedDb.parents.map(p => ({
            phone: p.phone, name: p.name, email: p.email, student_id: p.studentId, student_name: p.studentName, class_grade: p.classGrade, password: p.password, unlocked_weeks_list: p.unlockedWeeksList, status: p.status
          })));

          await client.from("students").upsert(seedDb.students.map(s => ({
            id: s.id, name: s.name, grade: s.grade, assigned_parent_phone: s.assignedParentPhone
          })));

          await client.from("modules").upsert(seedDb.modules.map(m => ({
            id: m.id, title: m.title, description: m.description, week: m.week, unlocked: m.unlocked, progress: m.progress
          })));

          for (const m of seedDb.modules) {
            await client.from("lessons").upsert(m.lessons.map(l => ({
              id: l.id, module_id: m.id, title: l.title, duration: l.duration, wistia_id: l.wistiaId, completed: l.completed, notes: l.notes
            })));
          }

          await client.from("daily_tasks").upsert(seedDb.daily_tasks.map(t => ({
            id: t.id, module_id: t.moduleId || "m1", day: t.day, title: t.title, instructions: t.instructions, estimated_time: t.estimatedTime, completed: t.completed
          })));
        } catch (subErr) {
          console.error("[SEED ERROR] Supabase seeding warning:", subErr);
        }
      }

      res.json({ success: true, message: "Standard clinical parent consultation seed database restored successfully." });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: GET unified backend data configuration (absolute control of local file DB)
  // API Route: GET unified backend data configuration (absolute control of local file DB)
  app.get("/api/backend-data", async (req, res) => {
    try {
      const localData = readLocalBackup() || {};
      const supabase = getSupabase();
      
      if (supabase) {
        console.log("[BACKEND] Supabase dynamic mode active. Pulling fresh collections on initial landing...");
        try {
          const [
            parentsRes,
            studentsRes,
            reflectionsRes,
            tasksRes,
            liveRes,
            modulesRes,
            lessonsRes
          ] = await Promise.all([
            supabase.from("parents").select("*"),
            supabase.from("students").select("*"),
            supabase.from("reflections").select("*"),
            supabase.from("daily_tasks").select("*"),
            supabase.from("live_sessions").select("*"),
            supabase.from("modules").select("*").order("week", { ascending: true }),
            supabase.from("lessons").select("*")
          ]);

          // Verify tables did not fail
          if (!parentsRes.error && !studentsRes.error) {
            const parents = (parentsRes.data || []).map(p => ({
              phone: p.phone,
              name: p.name,
              email: p.email,
              telegramChatId: p.telegram_chat_id,
              studentId: p.student_id,
              studentName: p.student_name,
              classGrade: p.class_grade,
              batchCohort: p.batch_cohort,
              startDate: p.start_date,
              password: p.password,
              unlockedWeeksList: p.unlocked_weeks_list || [],
              status: p.status,
              lastLogin: p.last_login,
              photoUrl: p.photo_url
            }));

            const students = (studentsRes.data || []).map(s => ({
              id: s.id,
              name: s.name,
              grade: s.grade,
              assignedParentPhone: s.assigned_parent_phone
            }));

            const reflections = (reflectionsRes.data || []).map(r => ({
              id: r.id,
              moduleId: r.module_id,
              lessonId: r.lesson_id,
              week: r.week,
              prompt: r.prompt,
              entry: r.entry,
              notes: r.notes,
              createdAt: r.created_at
            }));

            const daily_tasks = (tasksRes.data || []).map(t => ({
              id: t.id,
              moduleId: t.module_id,
              day: t.day,
              title: t.title,
              instructions: t.instructions,
              estimatedTime: t.estimated_time,
              completed: !!t.completed,
              reflection: t.reflection,
              note: t.note
            }));

            const live_sessions = (liveRes.data || []).map(ls => ({
              id: ls.id,
              title: ls.title,
              mentorName: ls.mentor_name,
              description: ls.description,
              streamUrl: ls.stream_url,
              status: ls.status,
              scheduledTime: ls.scheduled_time,
              targetGroup: ls.target_group,
              pointsReward: ls.points_reward
            }));

            let modules: any[] = [];
            if (!modulesRes.error && modulesRes.data) {
              const lessonsList = lessonsRes.data || [];
              modules = modulesRes.data.map((m: any) => {
                const moduleLessons = lessonsList
                  .filter((l: any) => l.module_id === m.id)
                  .map((l: any) => ({
                    id: l.id,
                    title: l.title,
                    duration: l.duration,
                    wistiaId: l.wistia_id,
                    completed: !!l.completed,
                    notes: l.notes
                  }));
                return {
                  id: m.id,
                  title: m.title,
                  description: m.description,
                  week: m.week,
                  unlocked: !!m.unlocked,
                  progress: m.progress,
                  lessons: moduleLessons
                };
              });
            }

            // Construct fully merged up-to-date data with fallback keys
            const mergedData = {
              ...localData,
              parents: parents.length > 0 ? parents : localData.parents,
              students: students.length > 0 ? students : localData.students,
              reflections: reflections.length > 0 ? reflections : localData.reflections,
              daily_tasks: daily_tasks.length > 0 ? daily_tasks : localData.daily_tasks,
              live_sessions: live_sessions.length > 0 ? live_sessions : localData.live_sessions,
              modules: modules.length > 0 ? modules : localData.modules
            };

            return res.json({
              success: true,
              empty: false,
              data: mergedData,
              live_source: "supabase"
            });
          }
        } catch (dbErr) {
          console.error("[BACKEND DATA ERROR] Failed fetching from Supabase, serving local file instead:", dbErr);
        }
      }

      if (!localData || Object.keys(localData).length === 0) {
        return res.json({
          success: true,
          empty: true,
          message: "No current central database backup located in the server."
        });
      }

      return res.json({
        success: true,
        empty: false,
        data: localData,
        live_source: "local_file"
      });
    } catch (err: any) {
      console.error("[BACKEND DATA ERROR] Failed to fetch server configurations:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: POST save server-side configuration data with high redundancy
  app.post("/api/backend-data/save", async (req, res) => {
    try {
      const payload = req.body;
      const current = readLocalBackup() || {};
      
      // Deep merge payload properties safely
      const updated = {
        parents: payload.parents !== undefined ? payload.parents : current.parents,
        students: payload.students !== undefined ? payload.students : current.students,
        reflections: payload.reflections !== undefined ? payload.reflections : current.reflections,
        daily_tasks: payload.daily_tasks !== undefined ? payload.daily_tasks : current.daily_tasks,
        live_sessions: payload.live_sessions !== undefined ? payload.live_sessions : current.live_sessions,
        modules: payload.modules !== undefined ? payload.modules : current.modules,
        passwordResetRequests: payload.passwordResetRequests !== undefined ? payload.passwordResetRequests : current.passwordResetRequests,
        strictnessLevel: payload.strictnessLevel !== undefined ? payload.strictnessLevel : current.strictnessLevel,
        tagDatabase: payload.tagDatabase !== undefined ? payload.tagDatabase : current.tagDatabase,
        childProfiles: payload.childProfiles !== undefined ? payload.childProfiles : current.childProfiles,
        learningPaths: payload.learningPaths !== undefined ? payload.learningPaths : current.learningPaths,
        scoringRules: payload.scoringRules !== undefined ? payload.scoringRules : current.scoringRules,
        unlockDependencies: payload.unlockDependencies !== undefined ? payload.unlockDependencies : current.unlockDependencies
      };

      saveLocalBackup(updated);
      
      // If Supabase is connected, attempt sync-push too for high redundancy
      const supabase = getSupabase();
      if (supabase) {
        console.log("[BACKEND SYNC] Replicating updated models securely offsite to Supabase...");
        try {
          if (updated.parents) {
            await supabase.from("parents").upsert(updated.parents.map((p: any) => ({
              phone: p.phone,
              name: p.name,
              email: p.email || null,
              student_id: p.studentId,
              student_name: p.studentName,
              class_grade: p.classGrade,
              password: p.password,
              unlocked_weeks_list: p.unlockedWeeksList || [],
              status: p.status || 'active'
            })));
          }
          if (updated.students) {
            await supabase.from("students").upsert(updated.students.map((s: any) => ({
              id: s.id,
              name: s.name,
              grade: s.grade,
              assigned_parent_phone: s.assignedParentPhone
            })));
          }
          if (updated.daily_tasks) {
            await supabase.from("daily_tasks").upsert(updated.daily_tasks.map((t: any) => ({
              id: t.id,
              module_id: t.moduleId || null,
              day: t.day || 1,
              title: t.title,
              instructions: t.instructions,
              estimated_time: t.estimatedTime || "10 mins",
              completed: !!t.completed,
              reflection: t.reflection || null,
              note: t.note || null
            })));
          }
          if (updated.live_sessions) {
            await supabase.from("live_sessions").upsert(updated.live_sessions.map((ls: any) => ({
              id: ls.id,
              title: ls.title,
              mentor_name: ls.mentorName,
              description: ls.description,
              stream_url: ls.streamUrl,
              status: ls.status,
              scheduled_time: ls.scheduledTime,
              target_group: ls.targetGroup,
              points_reward: ls.pointsReward
            })));
          }
          if (updated.modules) {
            const modulesData = updated.modules.map((m: any) => ({
              id: m.id,
              title: m.title,
              description: m.description,
              week: m.week,
              unlocked: !!m.unlocked,
              progress: m.progress || 0
            }));
            await supabase.from("modules").upsert(modulesData);

            const lessonsData: any[] = [];
            updated.modules.forEach((m: any) => {
              if (m.lessons && Array.isArray(m.lessons)) {
                m.lessons.forEach((l: any) => {
                  lessonsData.push({
                    id: l.id,
                    module_id: m.id,
                    title: l.title,
                    duration: l.duration || "5:00",
                    wistia_id: l.wistiaId || "eabjoioutk",
                    completed: !!l.completed,
                    notes: l.notes || ""
                  });
                });
              }
            });
            if (lessonsData.length > 0) {
              await supabase.from("lessons").upsert(lessonsData);
            }
          }
        } catch (subErr) {
          console.error("[BACKEND SYNC] Sub-replication warning:", subErr);
        }
      }

      res.json({ success: true, message: "Server-side state written successfully!" });
    } catch (err: any) {
      console.error("[BACKEND DATA ERROR] Failed to save server configurations:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: GET Download JSON backup database directly from container
  app.get("/api/backend-data/download", async (req, res) => {
    try {
      if (fs.existsSync(LOCAL_DB_PATH)) {
        res.setHeader('Content-disposition', 'attachment; filename=data_db_backup.json');
        res.setHeader('Content-type', 'application/json');
        res.sendFile(LOCAL_DB_PATH);
      } else {
        // If file not created yet, build a dynamic seed back-up on the fly to satisfy download
        res.status(404).json({ 
          success: false, 
          message: "No central database file found yet on the server. Please trigger a save or push to initiate records first." 
        });
      }
    } catch (err: any) {
      console.error("[BACKEND DATA ERROR] Failed to download server database:", err);
      res.status(500).send(`Server Database Download Failed: ${err.message}`);
    }
  });

  // Serve backend HTML administration console
  app.get("/admin-backend", (req, res) => {
    res.send(getAdminPanelHtml());
  });

  app.get("/backend-admin", (req, res) => {
    res.send(getAdminPanelHtml());
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      configFile: path.resolve(process.cwd(), "vite.config.ts"),
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

function getSimulatedResponse(msg: string): string {
  const content = msg.toLowerCase();
  
  if (content.includes("sad") || content.includes("depressed") || content.includes("cry") || content.includes("lonely")) {
    return "I hear you, and it is completely natural to feel sad sometimes. Emotions are like soft clouds float across a massive open sky. Take a slow, warm balloon breath with me, and let's try a comforting Lotus Pose stretch.";
  }
  if (content.includes("mad") || content.includes("angry") || content.includes("shout") || content.includes("fight")) {
    return "When big feelings spike like lightning, our muscles get tight and clenched. Let's release that heavy static together. Let's fold into a quiet Child's Pose (The Safe Snail) and take three deep, heavy sighs.";
  }
  if (content.includes("stress") || content.includes("anxious") || content.includes("scared") || content.includes("worry") || content.includes("exam")) {
    return "I can feel the busy thoughts whirling in your mind. Let's slow down time together. Stand tall like an ancient Forest Tree Pose, focusing on a quiet dot on the wall. You are absolutely capable and safe here.";
  }
  if (content.includes("habit") || content.includes("streak") || content.includes("points")) {
    return "Consistent small habits build beautiful minds! Every morning stretch, hydration check-off, or breathing pause awards you points and grows your MindBloom garden. Which habit are you working on today?";
  }
  if (content.includes("yoga") || content.includes("pose") || content.includes("stretch")) {
    return "I love yoga! Stretching is like giving your nervous system a gentle, reassuring hug. Try out the Forest Tree Pose for balance, or Cat-Cow to release static study pressure from your back.";
  }
  if (content.includes("hello") || content.includes("hi") || content.includes("hey") || content.includes("anyone there")) {
    return "Hello there, beautiful soul! 🌸 I am Bloomie, your supportive AI Mentor here at MindBloom. How is your body and mind feeling in this present moment?";
  }
  return "That is a beautiful reflection. Sharing your heavy feelings with another is an act of real courage. Let's breathe in... hold it... and let it drift away. Would you like to practice a calming stretch or do a hydration check today?";
}

function getSimulatedParentCoachResponse(scenario: string, childName: string, childGrade: string): string {
  const name = childName || "your child";
  const grade = childGrade || "school";
  const text = scenario.toLowerCase();

  if (text.includes("screen") || text.includes("phone") || text.includes("game") || text.includes("tablet")) {
    return `🌱 **Validate Your Calmness**: It is completely understandable to feel exhausted by screen-time negotiations. When screen time ends, our child's nervous system often spikes in resistance. Take a deep, 4-second breath first.

🎯 **Actionable Co-Regulation**: Sit near ${name} at eye-level, put down all devices, and say softly: *"I know ending your game is super hard, and you were having so much fun. Let's take a 3-breath co-regulation pause. Let's puff up our tummies like balloons!"* Encourage ${name} to blow away the screen frustration, then transition into a joyful kitten stretch (Cat-Cow Pose).

📈 **Future Pivot**: Establish a visual tracker on our Assignments page and implement a 1-hour pre-bedtime power-down. Offer a high-connection replacement pause like drawing or reading together.`;
  }
  if (text.includes("tantrum") || text.includes("cry") || text.includes("scream") || text.includes("angry") || text.includes("fight") || text.includes("rebel")) {
    return `🌱 **Validate Your Calmness**: Tantrums are not a failure of your boundary—they are a sign of intense emotional overwhelm. Ground yourself by feeling your feet solid on the floor. Take a long, slow sigh before reacting.

🎯 **Actionable Co-Regulation**: Lower your voice to a whisper. Kneel at eye-level with ${name} and say: *"It is safe to feel angry. Your mind is like a busy storm right now. I am right here with you."* Encourage folding together into a 'safe tiny snail' (Child's Pose), resting your heads down, letting gravity absorb the heavy energy.

📈 **Future Pivot**: Use our Weekly Module 2 "Active Listening and Emotional Validation" exercises. Create a "Calm Corner" at home with comfortable pillows where ${name} can retreat when they feel themselves heating up.`;
  }
  if (text.includes("homework") || text.includes("study") || text.includes("school") || text.includes("class")) {
    return `🌱 **Validate Your Calmness**: Academic resistance is rarely about laziness—it is usually driven by fear of failure or mental fatigue. Breathe deep and remind yourself: connection is more important than perfection.

🎯 **Actionable Co-Regulation**: Break the mounting pressure. Tell ${name}: *"Let's pause this heavy homework puzzle for just 2 minutes. Let's stand up and do a Forest Tree Pose 🌲 balance contest!"* Actively wobble together. Laughter releases cortisol, resetting focus. Say: *"We can take this task piece-by-piece, together."*

📈 **Future Pivot**: Integrate a 12-minute Pomodoro focus timer with built-in hydration milestones from the Student Space before sitting down for assignments. Praise their persistent effort, not just grades!`;
  }
  return `🌱 **Validate Your Calmness**: Facing unique behavioral challenges is a normal, healthy part of parent-child growth. Remind yourself that you are both learning. Take a calm breath to anchor your presence.

🎯 **Actionable Co-Regulation**: Use active physical co-regulation. Tell ${name}: *"My chest has some tight feelings too. Let's sit together on our flying carpet (Lotus Pose) and breathe in slow strawberry breaths."* Acknowledge their perspective by validating their experience with gentle words: *"I hear you, and we can solve this together."*

📈 **Future Pivot**: Check in with Dr. Vance or Master Chen under our Mentor Guidance desk! Consistent daily reflections and logging reflections on your dashboard will build immense tracking insight.`;
}

function getSimulatedEmotionalPrompt(emotion: string, intensity: number, parentName: string, childName: string): string {
  const parent = parentName ? parentName.split(' ')[0] : 'Parent';
  const child = childName ? childName.split(' ')[0] : 'your child';
  const moodName = emotion ? emotion.toLowerCase() : 'present-moment';
  
  switch (moodName) {
    case 'exhausted':
      return `Dear ${parent}, carrying the weight of parenting with ${moodName} energy is deeply taxing. Think of a tiny moment of unexpected quiet with ${child} today. What did that stillness feel like, even if it lasted just ten seconds?`;
    case 'peaceful':
      return `It is wonderful to hear that you are feeling a sense of ${moodName} calm today. When your energy is clear and grounded, ${child} feels that safe anchorage instantly. What is one positive emotion or connection you want to carry forward from today?`;
    case 'overwhelmed':
      return `Dear ${parent}, feeling ${moodName} is your nervous system's sign that too much is hitting you at once. Let's take a single, soft breath. What is one tiny physical task you can gently drop or say 'no' to tonight to ease the weight?`;
    case 'joyful':
      return `What a beautiful gift to feel ${moodName} in your parenting journey today! Happiness is contagious, and ${child} is likely reflecting your light. Write down one funny or bright interaction you shared with them today so you can cherish it later.`;
    case 'anxious':
      return `Feeling ${moodName} means your mind is racing forward trying to solve things before they arrive. Let's bring attention back to right here, right now with ${child}. What is one sensory comfort—a warm cup of tea, a soft blanket, or deep touch—that could help ground both of you?`;
    case 'discouraged':
      return `Dear ${parent}, some days are incredibly hard, and feeling ${moodName} is a natural human response to feeling unseen or stuck. Remember that your love for ${child} is not defined by perfection. What is one small way you showed gentle patience today, even if it felt minor?`;
    default:
      return `Every day of parenting brings unique emotional weather. Reflecting on your ${moodName} energy helps build supreme emotional intelligence. What did today teach you about your own limits and your capacity for gentle patience?`;
  }
}

function getSimulatedOptimizedAssignment(title: string, category: string): any {
  return {
    title: `Real Life somatic practice: ${title || 'Breath Synchrony'}`,
    instructions: `🌱 SENSORY PREPARATION:\n- Spend 1 minute breathing quietly to ground yourself before initiating with your child.\n\n🎯 REAL-LIFE INTERACTION:\n- Sit physical face-to-face and practice "${title || 'synchronous core-breathing'}" scaled with category focus context: ${category || 'Nervous Co-regulation'}.\n\n💬 CLINICAL REFLECTION:\n- Please type real feedback notes on changes in child chest/shoulder tension in the box below instead of raw checkbox speed-marking!`,
    estimatedTime: "8 mins"
  };
}

function getSimulatedMilestonesResponse(childName: string, childAge: number, checkedList: string[], pendingList: string[], parentingGoal: string): any {
  return {
    summary: `Based on ${childName}'s developmental milestones progress at age ${childAge || 7}, they are showing beautiful somatic and behavior maturity in co-regulation tasks. Your active parenting style effectively grounds their nervous system, establishing deep security.`,
    strategies: [
      `Practice "Grounding Anchors" during sensory transitions—have ${childName || 'your child'} feel the physical temperature of water or wrap up in a weighted blanket before screen shutdowns.`,
      `Implement positive validation loops: Praise specific bodily calm instead of generic behaviors (e.g., "I notice your shoulders are so relaxed and soft right now, thank you for checking in with me").`,
      `Integrate structured evening co-presence. Replace digital play with co-regulation scripts, focusing on the goal of "${parentingGoal || 'Nervous System Integration'}".`
    ],
    recommendedCoRegulationActivity: {
      title: "The Snail Nest Co-Breathing Adventure",
      steps: `1. Anchor yourself first: Sit back-to-back on a soft carpet with ${childName || 'your child'}, nesting like safe little snails in a shell.\n2. Synchronize: Ask ${childName || 'them'} to close their eyes and feel your warm breathing expand against their back.\n3. Clinical Focus: Practice 3 breaths together. As you exhale, both of you let out a slow hum sound. If they start fidgeting, gently squeeze their hands with deep sensory touch to help them ground.`,
      clinicalBenefit: "This targets the child's sensory proprioceptive and vestibular systems, sending immediate co-regulatory safety signals directly to the brainstem."
    }
  };
}

startServer();
