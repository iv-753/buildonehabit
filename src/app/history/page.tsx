"use client"
import React, { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";

interface HabitGoal {
  id: string;
  target: string;
  deadline: string;
  action: string;
  actionDetail: string;
  specific: string;
  progress: number;
  total: number;
  createdAt: string;
  unit: string;
  finishedAt?: string;
}

const dict = {
  en: {
    goalHistory: "Goal History",
    noHistory: "No history yet",
    deadline: "Deadline",
    action: "Action",
    details: "Details",
    progress: "Progress",
    completedAt: "Completed at"
  },
  zh: {
    goalHistory: "历史目标记录",
    noHistory: "暂无历史记录",
    deadline: "截止时间",
    action: "行动",
    details: "具体细节",
    progress: "进度",
    completedAt: "完成时间"
  }
};

function HistoryContent() {
  const { lang } = useLanguage();
  const [historyList, setHistoryList] = useState<HabitGoal[]>([]);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("habit_goal_history_list") || "[]");
    setHistoryList(list.reverse()); // Latest first
  }, []);

  const handleDelete = (id: string) => {
    const list = JSON.parse(localStorage.getItem("habit_goal_history_list") || "[]");
    const newList = list.filter((item: HabitGoal) => item.id !== id);
    localStorage.setItem("habit_goal_history_list", JSON.stringify(newList));
    setHistoryList(newList.reverse());
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold mb-6">{dict[lang].goalHistory}</h1>
      {historyList.length === 0 ? (
        <div className="text-gray-500">{dict[lang].noHistory}</div>
      ) : (
        <div className="w-full max-w-2xl space-y-4">
          {historyList.map((goal) => (
            <div key={goal.id} className="bg-white rounded shadow p-4 relative">
              <button
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs border border-red-200 rounded px-2 py-0.5"
                onClick={() => handleDelete(goal.id)}
                title={lang === 'en' ? 'Delete this record' : '删除此记录'}
              >
                {lang === 'en' ? 'Delete' : '删除'}
              </button>
              <div className="font-semibold text-lg mb-1">{goal.target}</div>
              <div className="text-sm text-gray-600 mb-1">{dict[lang].deadline}: {goal.deadline}</div>
              <div className="text-sm text-gray-600 mb-1">{dict[lang].action}: {goal.action} {goal.actionDetail}</div>
              <div className="text-sm text-gray-600 mb-1">{dict[lang].details}: {goal.specific}</div>
              <div className="text-sm text-gray-600 mb-1">{dict[lang].progress}: {goal.progress}/{goal.total} {goal.unit}</div>
              <div className="text-xs text-gray-400">{dict[lang].completedAt}: {goal.finishedAt ? new Date(goal.finishedAt).toLocaleString() : "-"}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default HistoryContent; 