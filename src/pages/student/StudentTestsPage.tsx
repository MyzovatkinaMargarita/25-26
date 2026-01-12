/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { useEffect, useMemo, useState } from "react";
import StudentHeader from "../../components/student/StudentHeader";
import TestCard from "../../components/tests/TestCard";
import { type Attempt, type TestItem } from "../../types/testing";

const Grid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr 1fr;
  padding: 20px;
`;

type FiltersState = any;

export default function StudentTestsPage() {
  const [tests, setTests] = useState<TestItem[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleFilters = (f: FiltersState) => {
    console.log(f);
  };

  useEffect(() => {
    Promise.all([
      fetch("/data/tests.json"),
      fetch("/data/attempts.json")
    ])
      .then(async ([r1, r2]) => {
        if (!r1.ok) throw new Error("Не удалось загрузить tests.json");
        if (!r2.ok) throw new Error("Не удалось загрузить attempts.json");

        const t = (await r1.json()) as TestItem[];
        const a = (await r2.json()) as Attempt[];

        if (!Array.isArray(t) || !Array.isArray(a)) {
          throw new Error("Неверный формат данных");
        }

        setTests(t);
        setAttempts(a);
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Ошибка загрузки")
      )
      .finally(() => setLoading(false));
  }, []);

  const lastAttemptByTest = useMemo(() => {
    const byTest = new Map<number, Attempt>();
    const mine = attempts.filter((a) => a.userId === 1);
    
    for (const a of mine) {
      byTest.set(a.testId, a);
    }
    return byTest;
  }, [attempts]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <StudentHeader title="Мои тесты" />
      <Grid>
        {tests.map((test) => (
          <TestCard 
            key={test.id} 
            test={test} 
            lastAttempt={lastAttemptByTest.get(test.id)} 
          />
        ))}
      </Grid>
    </>
  );
}
