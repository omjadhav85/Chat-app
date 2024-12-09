import { useDataStore } from "@/store";

export const ChatsPage = () => {
  const user = useDataStore((store) => store.user);

  return (
    <div>
      <h1>ChatsPage</h1>
      <pre>{JSON.stringify(user)}</pre>
    </div>
  );
};
