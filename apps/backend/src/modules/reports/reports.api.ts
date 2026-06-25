import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import Groq from 'groq-sdk';
import path from 'path';
import ejs from 'ejs';
import puppeteer from 'puppeteer';

const prisma = new PrismaClient();
const router = Router();
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

router.post('/generate', async (req, res) => {
    try {
        const { categoryId, startDate, endDate } = req.body;

        const transactions = await prisma.transaction.findMany({
            where: {
                categoryId: Number(categoryId),
                transactionDate: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            },
            include: {
                category: true,
                subcategory: true,
            },
            orderBy: {
                transactionDate: 'desc',
            },
        });

        const total = transactions.reduce((sum, t) => {
            return sum + Number(t.amount);
        }, 0);

        const prompt = `
You are a financial analyst.

Analyze the following transaction data and return STRICT JSON ONLY.

DATA:
- Total spending: ${total}
- Number of transactions: ${transactions.length}

Transactions:
${JSON.stringify(transactions.slice(0, 30))}

OUTPUT FORMAT (STRICT):
  {
  "summary": "string",
  "insights": [
    "string",
    "string"
  ],
  "highlights": [
    "string",
    "string"
  ],
  "total": ${total}
}

RULES:
- Return ONLY JSON
- No markdown
- No explanation
- No extra keys
`;

        const completion = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            response_format: { type: 'json_object' },
        });

        const aiReport = completion.choices[0]?.message?.content;

        let parsed;
        try {
            parsed = typeof aiReport === 'string'
                ? JSON.parse(aiReport)
                : aiReport;
        } catch {
            parsed = {
                summary: 'Failed to parse AI response',
                insights: [],
                highlights: [],
                total,
            };
        }
        res.json(parsed);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to generate report',
        });
    }
});

router.post('/export/pdf', async (req, res) => {
    try {
        console.log(req.body);
        const {
            report,
            total
        } = req.body;

        const templatePath = path.join(
            __dirname,
            'report.ejs'
        );

        const html = await ejs.renderFile(
            templatePath,
            {
                report,
                total,
            }
        );

        const browser = await puppeteer.launch({
            headless: true,
        });

        const page = await browser.newPage();
        await page.setContent(html, {
            waitUntil: 'load',
        });

        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
        });
        await browser.close();

        res.setHeader(
            'Content-Type',
            'application/pdf'
        );

        res.setHeader(
            'Content-Disposition',
            'attachment; filename=financial-report.pdf'
        );

        res.send(pdf);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to export PDF',
        });
    }
});

export default router;