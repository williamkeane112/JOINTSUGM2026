
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
};

export type Topic = {
  id: number;
  category_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  difficulty_level: string;
  subject: string;
};

export type ExistingGoal = {
  id: string;
  topic_id: number | null;
  status: string;
  created_at: string;
};

const PAGE_SIZE = 9;

export function useExploreTopics() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [existingGoals, setExistingGoals] = useState<ExistingGoal[]>([]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTopics, setTotalTopics] = useState(0);

  const [initialLoading, setInitialLoading] = useState(true);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [selectingTopicId, setSelectingTopicId] =
    useState<number | null>(null);

  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalTopics / PAGE_SIZE));

  // Inisialisasi pengguna, kategori, dan tujuan belajar.
  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      setInitialLoading(true);
      setError("");

      try {
        const { data, error: authError } =
          await supabase.auth.getUser();

        if (authError) throw authError;

        if (!data.user) {
          navigate("/login");
          return;
        }

        const [categoryResult, goalResult] = await Promise.all([
          supabase
            .from("categories")
            .select("id, name, slug, description")
            .eq("is_published", true)
            .order("name"),

          supabase
            .from("learning_goals")
            .select("id, topic_id, status, created_at")
            .eq("user_id", data.user.id)
            .not("topic_id", "is", null)
            .order("created_at", { ascending: false }),
        ]);

        if (categoryResult.error) throw categoryResult.error;
        if (goalResult.error) throw goalResult.error;

        if (cancelled) return;

        setUserId(data.user.id);
        setCategories((categoryResult.data ?? []) as Category[]);
        setExistingGoals((goalResult.data ?? []) as ExistingGoal[]);
      } catch (err) {
        if (cancelled) return;

        console.error("Gagal memuat data katalog:", err);
        setError(
          err instanceof Error ? err.message : "Gagal memuat data."
        );
      } finally {
        if (!cancelled) setInitialLoading(false);
      }
    }

    initialize();

    return () => {
      cancelled = true;
    };
  }, [navigate, reloadKey]);

  // Debounce pencarian.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Ambil hanya satu halaman topik dari Supabase.
  useEffect(() => {
    if (!userId || initialLoading) return;

    let cancelled = false;

    async function loadTopics() {
      setTopicsLoading(true);
      setError("");

      const from = (currentPage - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      try {
        let query = supabase
          .from("topics")
          .select(
            "id, category_id, name, slug, description, difficulty_level, subject",
            { count: "exact" }
          )
          .eq("is_published", true);

        if (selectedCategory !== "all") {
          query = query.eq("category_id", Number(selectedCategory));
        }

        if (debouncedSearch) {
          // Escape karakter khusus filter PostgREST.
          const term = debouncedSearch.replace(/[(),]/g, " ").trim();

          if (term) {
            query = query.or(
              `name.ilike.%${term}%,subject.ilike.%${term}%,description.ilike.%${term}%`
            );
          }
        }

        const { data, count, error: queryError } = await query
          .order("order_sequence", { ascending: true })
          .order("id", { ascending: true })
          .range(from, to);

        if (queryError) throw queryError;
        if (cancelled) return;

        const total = count ?? 0;
        const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

        setTotalTopics(total);

        if (currentPage > pages) {
          setCurrentPage(pages);
          return;
        }

        setTopics((data ?? []) as Topic[]);
      } catch (err) {
        if (cancelled) return;

        console.error("Gagal memuat topik:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Gagal mengambil katalog topik."
        );
        setTopics([]);
        setTotalTopics(0);
      } finally {
        if (!cancelled) setTopicsLoading(false);
      }
    }

    loadTopics();

    return () => {
      cancelled = true;
    };
  }, [
    userId,
    initialLoading,
    currentPage,
    selectedCategory,
    debouncedSearch,
    reloadKey,
  ]);

  // Ambil tujuan belajar terbaru untuk setiap topik.
  const latestGoalByTopic = useMemo(() => {
    const map = new Map<number, ExistingGoal>();

    for (const goal of existingGoals) {
      if (goal.topic_id !== null && !map.has(goal.topic_id)) {
        map.set(goal.topic_id, goal);
      }
    }

    return map;
  }, [existingGoals]);

  const changeSearch = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const changeCategory = useCallback((value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  }, []);

  const changePage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const retry = useCallback(() => {
    setError("");
    setReloadKey((key) => key + 1);
  }, []);

  const selectTopic = useCallback(
    async (topic: Topic) => {
      if (selectingTopicId !== null) return;

      setSelectingTopicId(topic.id);
      setError("");

      try {
        const { data: authData, error: authError } =
          await supabase.auth.getUser();

        if (authError) throw authError;

        if (!authData.user) {
          navigate("/login");
          return;
        }

        const existingGoal = latestGoalByTopic.get(topic.id);

        if (existingGoal) {
          navigate(`/learning-goals/${existingGoal.id}`);
          return;
        }

        const { data: goal, error: insertError } = await supabase
          .from("learning_goals")
          .insert({
            user_id: authData.user.id,
            topic_id: topic.id,
            requested_topic: topic.name,
            description: topic.description,
            target_level: "beginner",
            status: "pending",
          })
          .select("id, topic_id, status, created_at")
          .single();

        if (insertError) {
          if (insertError.code === "23505") {
            const { data: duplicate, error: duplicateError } =
              await supabase
                .from("learning_goals")
                .select("id")
                .eq("user_id", authData.user.id)
                .eq("topic_id", topic.id)
                .maybeSingle();

            if (duplicateError) throw duplicateError;

            if (duplicate) {
              navigate(`/learning-goals/${duplicate.id}`);
              return;
            }
          }

          throw insertError;
        }

        setExistingGoals((previous) => [
          goal as ExistingGoal,
          ...previous,
        ]);

        navigate(`/learning-goals/${goal.id}`);
      } catch (err) {
        console.error("Gagal memilih topik:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Gagal memproses pilihan topik."
        );
      } finally {
        setSelectingTopicId(null);
      }
    },
    [latestGoalByTopic, navigate, selectingTopicId]
  );

  return {
    categories,
    topics,
    latestGoalByTopic,
    search,
    selectedCategory,
    currentPage,
    totalTopics,
    totalPages,
    initialLoading,
    topicsLoading,
    selectingTopicId,
    error,
    changeSearch,
    changeCategory,
    changePage,
    retry,
    selectTopic,
  };
}
