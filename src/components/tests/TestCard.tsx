import { type Attempt, type TestItem. type TestMeta } from "../../types/testing"; // <-- новый импорт
type Props = {
  test: TestItem;
  lastAttempt?: Attempt | null;
};
