/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { useEffect, useMemo, useState } from "react";
import StudentHeader from "../../components/student/StudentHeader";
import TestCard from "../../components/tests/TestCard";
import { type Attempt, type TestItem } from "../../types/testing";

/*============================================================================
   Страница "Тестирования"
   Линейный сценарий:
   1) загрузить tests.json и attempts.json;
   2) вычислить последние попытки текущего пользователя по testId;
   3) отобразить только опубликованные тесты;
   4) в карточку передать сам тест + последнюю попытку (если есть).
  ==========================================================================*/

const Grid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr 1fr;
  padding: 20px;
`;

// Заглушка для компонента фильтров (если он еще не создан в отдельном файле)
const FiltersBar = ({ onChange }: { onChange: (f: any) => void }) => (
  <div style={{ padding: "0 20px", marginBottom: "10px" }}>
    {/* Здесь будет логика фильтров */}
  </div>
);

type FiltersState = any;

export default function StudentTestsPage() {
  /*--------------------------- Состояния данных --------------------------- */
  const [tests, setTests] = useState<TestItem[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  /*--------------------------- Состояния UI ------------------------------- */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*------------------------ Обработчик панели фильтров -------------------- */
  const handleFilters = (f: FiltersState) => {
    console.log("Выбраны фильтры:", f);
  };

  /*------------------------------- Загрузка ------------------------------- */
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

  /*---------------------- Производные вычисления -------------------------- */
  // Индекс последней попытки по testId для пользователя с userId: 1
  const lastAttemptByTest = useMemo(() => {
    const byTest = new Map<number, Attempt>();
    const mine = attempts.filter((a) => a.userId === 1);
    
    for (const a of mine) {
      byTest.set(a.testId, a);
    }
    return byTest;
  }, [attempts]);

  /*-------------------------- Экраны состояний ---------------------------- */
  if (loading) return (
    <>
      <StudentHeader title="Тестирования" />
      <p style={{ padding: "20px" }}>Загрузка…</p>
    </>
  );

  if (error) return (
    <>
      <StudentHeader title="Тестирования" />
      <p style={{ color: "crimson", padding: "20px" }}>{error}</p>
    </>
  );

  /*------------------------------ Фильтрация ------------------------------ */
  // Показываем только тесты с флагом isPublished: true
  const visible = tests.filter((t) => t.isPublished);

  /*-------------------------------- Рендер -------------------------------- */
  return (
    <>
      <StudentHeader title="Тестирования" />
      <FiltersBar onChange={handleFilters} />
      
      <Grid>
        {visible.map((t) => (
          <TestCard 
            key={t.id} 
            test={t} 
            lastAttempt={lastAttemptByTest.get(t.id)} 
          />
        ))}
      </Grid>
    </>
  );
}
