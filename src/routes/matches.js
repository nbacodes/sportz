import { Router } from "express";
import { createMatchSchema } from "../validation/matches.js";
import { db } from "../db/db.js";
import { getMatchStatus } from "../utils/match-status.js";
import { matches } from "../db/schema.js";

export const matchRouter = Router();

matchRouter.get('/', (req, res) => {
    res.status(200).json({
        message: 'Matches list'
    })
})

matchRouter.post('/', async (req, res) => {
    const parsed = createMatchSchema.safeParse(req.body);
    console.log(parsed);
    const { data: { startTime, endTime, homeScore, awayScore } } = parsed;
    console.log(startTime)
    console.log(endTime)
    console.log(homeScore)
    console.log(awayScore)

    if (!parsed.success) {
        return res.status(400).json({ error: 'Invalid payload.', details: JSON.stringify(parsed.error) });
    }

    try {
        const [event] = await db.insert(matches).values({
            ...parsed.data,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            homeScore: homeScore ?? 0,
            awayScore: awayScore ?? 0,
            status: getMatchStatus(startTime, endTime),
        }).returning();

        res.status(201).json({ data: event });
    } catch (e) {
        res.status(500).json({ error: 'Failed to create match.', details: JSON.stringify(e) });
    }
})
