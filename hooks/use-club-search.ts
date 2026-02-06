"use client";

import { useEffect, useState } from "react";
import { getClubs } from "@/app/actions/clubs";
import { useComboboxAnchor } from "@/components/ui/combobox";
import { tryCatch } from "@/lib/tryCatch";

type ClubOption = { id: string; name: string };

export function useClubSearch() {
  const [clubQuery, setClubQuery] = useState("");
  const [clubOptions, setClubOptions] = useState<ClubOption[]>([]);
  const [selectedClub, setSelectedClub] = useState<ClubOption | null>(null);
  const [clubLoading, setClubLoading] = useState(false);
  const clubAnchor = useComboboxAnchor();

  useEffect(() => {
    const trimmed = clubQuery.trim();
    if (!trimmed) {
      setClubOptions([]);
      setClubLoading(false);
      return;
    }

    setClubLoading(true);
    const timer = setTimeout(async () => {
      const [results, error] = await tryCatch(getClubs(trimmed));
      if (!error) {
        setClubOptions(results);
      }
      setClubLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [clubQuery]);

  const resetClubSearch = () => {
    setClubQuery("");
    setClubOptions([]);
    setSelectedClub(null);
  };

  return {
    clubQuery,
    setClubQuery,
    clubOptions,
    selectedClub,
    setSelectedClub,
    clubLoading,
    clubAnchor,
    resetClubSearch,
  };
}
