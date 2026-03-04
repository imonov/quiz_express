"use strict";

import express from "express";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = 3000;

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "data", "quiz.json");

function readData() {
    try {
        return JSON.parse(readFileSync(filePath, "utf-8"));
    } catch {
        return [];
    }
}

function writeData(data) {
    writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getNextId(arr) {
    return arr.length === 0 ? 1 : arr.at(-1).id + 1;
}

app.get("/quiz", (req, res) => {
    const data = readData();
    res.status(200).json(data);
});

app.get("/quiz/:id", (req, res) => {
    const id = Number(req.params.id);
    const data = readData();

    const quiz = data.find((q) => q.id === id);

    if (!quiz) {
        return res.status(404).json({ message: "quiz not found" });
    }

    res.status(200).json(quiz);
});

app.post("/quiz", (req, res) => {
    const { title, imagePath } = req.body;

    if (!title) {
        return res.status(400).json({ message: "title required" });
    }

    const data = readData();

    const newQuiz = {
        id: getNextId(data),
        title,
        imagePath: imagePath || "",
        answers: [],
    };

    data.push(newQuiz);
    writeData(data);

    res.status(201).json(newQuiz);
});

app.put("/quiz/:id", (req, res) => {
    const id = Number(req.params.id);
    const { title, imagePath } = req.body;

    const data = readData();
    const index = data.findIndex((q) => q.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "quiz not found" });
    }

    data[index].title = title ?? data[index].title;
    data[index].imagePath = imagePath ?? data[index].imagePath;

    writeData(data);

    res.json(data[index]);
});

app.delete("/quiz/:id", (req, res) => {
    const id = Number(req.params.id);
    const data = readData();

    const filtered = data.filter((q) => q.id !== id);

    writeData(filtered);

    res.json({ message: "quiz deleted" });
});

app.post("/quiz/:id/answer", (req, res) => {
    const quizId = Number(req.params.id);
    const { answer_title, is_correct } = req.body;

    const data = readData();
    const quiz = data.find((q) => q.id === quizId);

    if (!quiz) {
        return res.status(404).json({ message: "quiz not found" });
    }

    const nextAnswerId =
        quiz.answers.length === 0 ? 1 : quiz.answers.at(-1).answer_id + 1;

    if (is_correct) {
        quiz.answers.forEach((a) => (a.is_correct = false));
    }

    const newAnswer = {
        answer_id: nextAnswerId,
        answer_title,
        is_correct: Boolean(is_correct),
    };

    quiz.answers.push(newAnswer);
    writeData(data);

    res.status(201).json(newAnswer);
});

app.put("/quiz/:id/answer/:answerId", (req, res) => {
    const quizId = Number(req.params.id);
    const answerId = Number(req.params.answerId);

    const data = readData();
    const quiz = data.find((q) => q.id === quizId);

    if (!quiz) {
        return res.status(404).json({ message: "quiz not found" });
    }

    const answer = quiz.answers.find((a) => a.answer_id === answerId);

    if (!answer) {
        return res.status(404).json({ message: "answer not found" });
    }

    if (req.body.is_correct) {
        quiz.answers.forEach((a) => (a.is_correct = false));
    }

    answer.answer_title = req.body.answer_title ?? answer.answer_title;

    answer.is_correct = req.body.is_correct ?? answer.is_correct;

    writeData(data);

    res.json(answer);
});

app.delete("/quiz/:id/answer/:answerId", (req, res) => {
    const quizId = Number(req.params.id);
    const answerId = Number(req.params.answerId);

    const data = readData();
    const quiz = data.find((q) => q.id === quizId);

    if (!quiz) {
        return res.status(404).json({ message: "quiz not found" });
    }

    quiz.answers = quiz.answers.filter((a) => a.answer_id !== answerId);

    writeData(data);

    res.json({ message: "answer deleted" });
});

app.listen(PORT, () => {
    console.log(`Server ${PORT} portda ishlayapdi`);
});
