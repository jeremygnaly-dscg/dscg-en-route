"use client";
import { useState } from "react";
import type { FlashQuestion } from "@/content/types";
import styles from "./player.module.css";

export function Quiz({ questions, onFinish }: { questions: FlashQuestion[]; onFinish: (score: number) => void }) {
  const [picked, setPicked] = useState<(number | null)[]>(() => questions.map(() => null));
  const answered = picked.filter((p) => p !== null).length;
  const score = picked.filter((p, i) => p === questions[i].answer).length;

  const choose = (qi: number, ci: number) => {
    if (picked[qi] !== null) return;
    const next = picked.map((p, i) => (i === qi ? ci : p));
    setPicked(next);
    if (next.every((p) => p !== null)) onFinish(next.filter((p, i) => p === questions[i].answer).length);
  };

  return (
    <div className={styles.quiz}>
      {questions.map((q, qi) => (
        <div key={qi} className={styles.question}>
          <h3>{qi + 1}. {q.q}</h3>
          <div className={styles.choices}>
            {q.choices.map((c, ci) => {
              const state =
                picked[qi] === null ? "" : ci === q.answer ? styles.right : ci === picked[qi] ? styles.wrong : "";
              return (
                <button key={ci} className={`${styles.choice} ${state}`} onClick={() => choose(qi, ci)}>
                  {c}
                </button>
              );
            })}
          </div>
          {picked[qi] !== null && <p className={styles.why}>{q.why}</p>}
        </div>
      ))}
      {answered === questions.length && (
        <p className={styles.score}>
          {score}/{questions.length} · {score === questions.length ? "Notion maîtrisée" : "Réécoute le cours"}
        </p>
      )}
    </div>
  );
}
