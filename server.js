"use strict";

import express from "express";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const app = express();

app.use(express.json());

const filePath = path.join(__dirname, "data", "quiz.json");

function readData() {
    return JSON.parse(readFileSync(filePath, "utf-8"));
}

function writeData(data) {
    return writeFileSync(filePath, JSON.stringify(data, null, 4));
}

function getNextId(data) {
    return arr.length === 0 ? 1 : arr.at(-1).id + 1;
}

app.get("/quiz", (req, res) => {
    const data = readData();
    res.status(200).json(data);
});

app.get("/quiz/:id", (req, res) => {
    const id = Number(req.params.id);
    const data = readData();

    const quiz = data.find((e) => e.id == id);

    if (!quiz) {
        res.status(404).json({ message: "quiz not found" });
        return;
    }

    res.status(200).json(quiz);
    return;
});

app.post("/quiz", (req, res) => {
    const { title, imagePath } = req.body;

    if (!title) {
        res.status(400).json({ message: "title required" });
        return;
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
    res.status(201).json({ message: "quiz created", quiz: newQuiz });
});

app.put("/quiz/:id", (req, res) => {
    const id = Number(req.params.id);
    const { title, imagePath } = req.body;

    const data = readData();
    const index = data.find((e) => e.id == id);

    if (index === -1) {
        res.status(404).json({ message: "quiz not found" });
        return;
    }

    data[index].title = title ?? data[index].title;
    data[index].imagePath = imagePath ?? data[index].imagePath;

    writeData(data);

    res.status(200).json({ message: "succefully updated", quiz: data[index] });
});

app.delete("/quiz/:id", (req, res) => {
    const id = Number(req.params.id);
    const data = readData();

    const filteredData = data.filter((e) => e.id !== id);
    writeData(filteredData);
    res.status(200).json({ message: `${id} deleted` });
});

app.post("/quiz/:id/answer", (req, res) => {
    const qId = Number(req.params.id);
    const { answer_title, is_correct } = req.body;

    const data = readData();
    const quiz = data.find((e) => e.id === qId);

    if (!quiz) {
        res.status(404).json({ message: "quiz not found" });
        return;
    }

    const nextAnswerId =
        quiz.answers.length === 0 ? 1 : quiz.answers.at(-1).answer_id + 1;

    const newAsnwer = {
        answer_id: nextAnswerId(),
        answer_title,
        is_correct: Boolean(is_correct),
    };

    quiz.answers.push(newAsnwer);
    writeData(data);
    res.status(201).json({ message: "answer created", answer: newAsnwer });
});
