import axiosClient from "@/config/axiosConfig";
import { IUser } from "@/lib/types";
import { showError } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

export const useSearchUsers = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const timerId = useRef<NodeJS.Timeout | null>(null);

  const fetchUsersBySearch = useCallback(async (searchText: string) => {
    if (timerId.current) clearTimeout(timerId.current);
    setIsLoading(true);

    if (searchText.trim() === "") {
      setUsers([]);
      setIsLoading(false);

      return;
    }

    timerId.current = setTimeout(async () => {
      try {
        const res = await axiosClient.get<IUser[]>("/api/users", {
          params: {
            search: searchText,
          },
        });

        setUsers(res?.data || []);
      } catch (error) {
        showError(error);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, []);

  useEffect(() => {
    return () => {
      if (timerId.current) clearTimeout(timerId.current);
    };
  }, []);

  return { users, fetchUsersBySearch, isLoading };
};
