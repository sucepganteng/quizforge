'use client';

import { useState } from "react";

type Question = {
  id: number;
  question: string;
  options: string[];
  answer: number;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [score, setScore] = useState<number | null>(null);

  const generateQuiz = () => {
    const lines = input.split("\n").map(l => l.trim()).filter(Boolean);

    const result: Question[] = [];

    let question = "";
    let options: string[] = [];
    let answer = 0;

    for (let line of lines) {
      if (line.startsWith("Q:")) {
        question = line.replace("Q:", "").trim();
        options = [];
      }

      else if (/^[A-D]:/.test(line)) {
        options.push(line.slice(2).trim());
      }

      else if (line.toLowerCase().startsWith("answer")) {
        const ans = line.split(":")[1]?.trim()?.toUpperCase();
        if (!ans) continue;

        answer = ans.charCodeAt(0) - 65;

        if (question && options.length > 0) {
          result.push({
            id: result.length,
            question,
            options,
            answer
          });
        }
      }
    }

    setQuestions(result);
    setSelected({});
    setScore(null);
  };

  const handleSelect = (qid: number, optIndex: number) => {
    setSelected(prev => ({
      ...prev,
      [qid]: optIndex
    }));
  };

  const checkScore = () => {
    let correct = 0;

    questions.forEach(q => {
      if (selected[q.id] === q.answer) {
        correct++;
      }
    });

    setScore(correct);
  };

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold mb-4">
        QuizForge AI
      </h1>

      {/* INPUT */}
      <textarea
        className="w-full h-60 border p-3 rounded"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={`Q: Ibu kota Jepang?
A: Seoul
B: Tokyo
C: Beijing
D: Bangkok
Answer: B`}
      />

      <button
        onClick={generateQuiz}
        className="mt-3 px-5 py-2 bg-black text-white rounded"
      >
        Generate Quiz
      </button>

      {/* QUIZ */}
      <div className="mt-6 space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="border p-4 rounded">

            <p className="font-semibold mb-2">
              {q.question}
            </p>

            {q.options.map((opt, i) => {
              const isSelected = selected[q.id] === i;
              const isCorrect = q.answer === i;

              return (
                <label
                  key={i}
                  className={`text-white flex gap-2 items-center p-3 rounded ${
                    score !== null
                      ? isCorrect
                        ? "bg-green-900/40 border border-green-500"
                        : isSelected
                        ? "bg-red-900/40 border border-red-500"
                        : ""
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    checked={isSelected}
                    onChange={() =>
                      handleSelect(q.id, i)
                    }
                  />
                  {opt}
                </label>
              );
            })}

          </div>
        ))}
      </div>

      {/* SCORE BUTTON */}
      {questions.length > 0 && (
        <button
          onClick={checkScore}
          className="mt-6 px-5 py-2 bg-green-600 text-white rounded"
        >
          Check Score
        </button>
      )}

      {/* SCORE RESULT */}
      {score !== null && (
        <p className="mt-4 text-xl font-bold">
          Score: {score} / {questions.length}
        </p>
      )}

    </main>
  );
}
