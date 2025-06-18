"use client";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLanguage } from "./LanguageContext";

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
}

// 英文数字单词与数字映射
const numberWords: { [key: string]: number } = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
  thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100
};

// 解析目标描述，提取总数和单位，支持英文数字单词
function parseTarget(target: string): { total: number; unit: string } {
  // 匹配如"read 10 books"中的数字和单位
  const numMatch = target.match(/(\d+)\s*(\w+)?$/);
  if (numMatch) {
    return {
      total: Number(numMatch[1]),
      unit: numMatch[2] || '',
    };
  }
  // 匹配英文数字单词
  const wordMatch = target.match(/(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred)\s*(\w+)?$/i);
  if (wordMatch) {
    const word = wordMatch[1].toLowerCase();
    return {
      total: numberWords[word] || 1,
      unit: wordMatch[2] || '',
    };
  }
  return { total: 1, unit: '' };
}

const dict = {
  en: {
    buildOneHabit: "build one habit",
    clickToSet: "Click the text above to set your goal",
    currentGoal: "Current Goal",
    goal: "Goal",
    deadline: "Deadline",
    action: "Action",
    details: "Details",
    progress: "Progress",
    add: "+",
    undo: "Undo",
    completed: "Goal completed!",
    setNew: "Set a new goal",
    broaden: "Broaden this goal",
    delete: "Delete goal",
    save: "Save",
    beMoreSpecific: "Be more specific",
    example: "For example: I will start reading at 9 a.m., read for 1 hour.",
    enterDetails: "Enter your specific details...",
    confirm: "Confirm",
    cancel: "Cancel",
    enterValue: "Enter progress value",
    pleaseFill: "Please fill in all goal information",
    pleasePositive: "Please enter a positive number",
    pleaseGreater: "Please enter a number greater than the current total",
    pleaseCompleteOrDelete: "Please complete or delete the current goal before setting a new one",
    close: "Close"
  },
  zh: {
    buildOneHabit: "养成一个习惯",
    clickToSet: "点击上方文字设定你的目标",
    currentGoal: "当前目标",
    goal: "目标",
    deadline: "截止时间",
    action: "行动",
    details: "具体细节",
    progress: "进度",
    add: "+",
    undo: "撤销",
    completed: "目标已完成！",
    setNew: "设定新目标",
    broaden: "扩大目标",
    delete: "删除目标",
    save: "保存",
    beMoreSpecific: "让目标更具体",
    example: "比如：我会在早上9点开始阅读，阅读1小时。",
    enterDetails: "请输入你的具体细节...",
    confirm: "确认",
    cancel: "取消",
    enterValue: "输入本次完成数值",
    pleaseFill: "请完整填写所有目标信息",
    pleasePositive: "请输入正数",
    pleaseGreater: "请输入大于当前总数的数字",
    pleaseCompleteOrDelete: "请先完成或删除当前目标，再设定新目标",
    close: "关闭"
  }
};

function HomeContent() {
  const { lang } = useLanguage();
  const [showModal, setShowModal] = useState(true);
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [action, setAction] = useState("");
  const [actionDetail, setActionDetail] = useState("");
  const [specific, setSpecific] = useState("");
  const [savedGoal, setSavedGoal] = useState<HabitGoal | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState<number[]>(() => {
    // 初始化时尝试从 localStorage 读取历史记录
    if (typeof window !== 'undefined') {
      const h = localStorage.getItem('habit_goal_history');
      if (h) return JSON.parse(h);
    }
    return [];
  });
  const [showBroaden, setShowBroaden] = useState(false);
  const [broadenTotal, setBroadenTotal] = useState("");
  const [broadenDetail, setBroadenDetail] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [editTarget, setEditTarget] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [editAction, setEditAction] = useState("");
  const [editActionDetail, setEditActionDetail] = useState("");
  const [editSpecific, setEditSpecific] = useState("");
  const [editTotal, setEditTotal] = useState("");
  const [editUnit, setEditUnit] = useState("");

  useEffect(() => {
    const savedGoalData = localStorage.getItem("habit_goal");
    if (savedGoalData) {
      setSavedGoal(JSON.parse(savedGoalData));
    }
  }, []);

  // 保存已完成目标到历史
  const saveGoalToHistory = (goal: HabitGoal) => {
    if (!goal) return;
    const historyList = JSON.parse(localStorage.getItem('habit_goal_history_list') || '[]');
    const finishedGoal = { ...goal, finishedAt: new Date().toISOString() };
    historyList.push(finishedGoal);
    localStorage.setItem('habit_goal_history_list', JSON.stringify(historyList));
  };

  // 保存目标到localStorage
  const handleSave = () => {
    if (!target || !deadline || !action || !actionDetail) {
      alert("Please fill in all goal information");
      return;
    }
    const { total, unit } = parseTarget(target);
    const goal: HabitGoal = {
      id: uuidv4(),
      target,
      deadline,
      action,
      actionDetail,
      specific,
      progress: 0,
      total: total,
      createdAt: new Date().toISOString(),
      unit: unit,
    } as any;
    localStorage.setItem("habit_goal", JSON.stringify(goal));
    setSavedGoal(goal);
    setShowModal(false);
  };

  // 删除目标时清空历史并保存到历史列表
  const handleDeleteGoal = () => {
    if (savedGoal && savedGoal.progress >= savedGoal.total) {
      saveGoalToHistory(savedGoal);
    }
    localStorage.removeItem("habit_goal");
    localStorage.removeItem("habit_goal_history");
    setSavedGoal(null);
    setHistory([]);
  };

  const handleOpenModal = () => {
    const savedGoalData = localStorage.getItem("habit_goal");
    if (savedGoalData) {
      alert("Please complete or delete the current goal before setting a new one");
      return;
    }
    setShowModal(true);
  };

  // 进度递增（弹窗输入）
  const handleIncrement = () => {
    setShowInput(true);
    setInputValue("");
  };

  // 确认输入进度
  const handleConfirmInput = () => {
    if (!savedGoal) return;
    const value = parseFloat(inputValue);
    if (isNaN(value) || value <= 0) {
      alert("Please enter a positive number");
      return;
    }
    const remain = savedGoal.total - savedGoal.progress;
    const addValue = value > remain ? remain : value;
    const updatedGoal = { ...savedGoal, progress: parseFloat((savedGoal.progress + addValue).toFixed(2)) };
    setSavedGoal(updatedGoal);
    localStorage.setItem("habit_goal", JSON.stringify(updatedGoal));
    const newHistory = [...history, addValue];
    setHistory(newHistory);
    localStorage.setItem('habit_goal_history', JSON.stringify(newHistory));
    setShowInput(false);
  };

  // 撤销上一次进度
  const handleUndo = () => {
    if (!savedGoal || history.length === 0) return;
    const last = history[history.length - 1];
    const newProgress = Math.max(0, parseFloat((savedGoal.progress - last).toFixed(2)));
    const updatedGoal = { ...savedGoal, progress: newProgress };
    setSavedGoal(updatedGoal);
    localStorage.setItem("habit_goal", JSON.stringify(updatedGoal));
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
    localStorage.setItem('habit_goal_history', JSON.stringify(newHistory));
  };

  // 取消输入
  const handleCancelInput = () => {
    setShowInput(false);
    setInputValue("");
  };

  // 设定新目标
  const handleSetNewGoal = () => {
    if (savedGoal && savedGoal.progress >= savedGoal.total) {
      saveGoalToHistory(savedGoal);
    }
    localStorage.removeItem("habit_goal");
    localStorage.removeItem("habit_goal_history");
    setSavedGoal(null);
    setHistory([]);
    setShowModal(true);
    setTarget("");
    setDeadline("");
    setAction("");
    setActionDetail("");
    setSpecific("");
  };

  // 扩大目标
  const handleBroaden = () => {
    setShowBroaden(true);
    setBroadenTotal(savedGoal ? String(savedGoal.total) : "");
    setBroadenDetail(savedGoal ? savedGoal.specific : "");
  };

  // 确认扩大目标
  const handleConfirmBroaden = () => {
    if (!savedGoal) return;
    const newTotal = parseFloat(broadenTotal);
    if (isNaN(newTotal) || newTotal <= savedGoal.total) {
      alert("Please enter a number greater than the current total");
      return;
    }
    const updatedGoal = {
      ...savedGoal,
      total: newTotal,
      specific: broadenDetail,
    };
    setSavedGoal(updatedGoal);
    localStorage.setItem("habit_goal", JSON.stringify(updatedGoal));
    setShowBroaden(false);
  };

  // 取消扩大目标
  const handleCancelBroaden = () => {
    setShowBroaden(false);
  };

  // 打开编辑弹窗并填充当前目标
  const handleEditGoal = () => {
    if (!savedGoal) return;
    setEditTarget(savedGoal.target);
    setEditDeadline(savedGoal.deadline);
    setEditAction(savedGoal.action);
    setEditActionDetail(savedGoal.actionDetail);
    setEditSpecific(savedGoal.specific);
    setEditTotal(String(savedGoal.total));
    setEditUnit(savedGoal.unit);
    setShowEdit(true);
  };

  // 确认编辑保存
  const handleConfirmEdit = () => {
    if (!editTarget || !editDeadline || !editAction || !editActionDetail || !editTotal) {
      alert(dict[lang].pleaseFill);
      return;
    }
    const newTotal = parseFloat(editTotal);
    if (isNaN(newTotal) || newTotal < (savedGoal?.progress || 0)) {
      alert(lang === 'zh' ? `总数不能小于已完成进度（${savedGoal?.progress}）` : `Total cannot be less than current progress (${savedGoal?.progress})`);
      return;
    }
    const updatedGoal = {
      ...savedGoal!,
      target: editTarget,
      deadline: editDeadline,
      action: editAction,
      actionDetail: editActionDetail,
      specific: editSpecific,
      total: newTotal,
      unit: editUnit,
    };
    setSavedGoal(updatedGoal);
    localStorage.setItem("habit_goal", JSON.stringify(updatedGoal));
    setShowEdit(false);
  };

  const handleCancelEdit = () => {
    setShowEdit(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <h1
        className="text-4xl font-bold cursor-pointer hover:text-blue-600 transition"
        onClick={handleOpenModal}
      >
        {dict[lang].buildOneHabit}
      </h1>
      {savedGoal ? (
        <div className="mt-8 p-4 bg-white rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-semibold mb-2">{dict[lang].currentGoal}</h2>
          <p>{dict[lang].goal}: {savedGoal.target}</p>
          <p>{dict[lang].deadline}: {savedGoal.deadline}</p>
          <p>{dict[lang].action}: {savedGoal.action} {savedGoal.actionDetail}</p>
          <p>{dict[lang].details}: {savedGoal.specific}</p>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(savedGoal.progress / savedGoal.total) * 100}%` }}></div>
            </div>
            <div className="flex items-center mt-1 gap-2">
              <p className="text-sm text-gray-500">{dict[lang].progress}: {savedGoal.progress}/{savedGoal.total} {savedGoal.unit}</p>
              <button
                className="ml-2 px-2 py-0.5 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                onClick={handleIncrement}
                disabled={savedGoal.progress >= savedGoal.total}
                title={dict[lang].add}
              >
                {dict[lang].add}
              </button>
              <button
                className="ml-2 px-2 py-0.5 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                onClick={handleUndo}
                disabled={history.length === 0}
                title={dict[lang].undo}
              >
                {dict[lang].undo}
              </button>
              <button
                className="ml-2 px-2 py-0.5 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleEditGoal}
                title={lang === 'zh' ? '编辑' : 'Edit'}
              >
                {lang === 'zh' ? '编辑' : 'Edit'}
              </button>
            </div>
            {showInput && (
              <div className="mt-2 flex flex-col items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={savedGoal.total - savedGoal.progress}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  className="border rounded px-2 py-1 w-32 text-center"
                  placeholder={dict[lang].enterValue}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    onClick={handleConfirmInput}
                  >
                    {dict[lang].confirm}
                  </button>
                  <button
                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                    onClick={handleCancelInput}
                  >
                    {dict[lang].cancel}
                  </button>
                </div>
              </div>
            )}
            {savedGoal.progress >= savedGoal.total && (
              <div className="mt-2 text-green-600 font-semibold flex flex-col gap-2 items-center">
                {dict[lang].completed}
                <div className="flex gap-2 mt-2">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    onClick={handleSetNewGoal}
                  >
                    {dict[lang].setNew}
                  </button>
                  <button
                    className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                    onClick={handleBroaden}
                  >
                    {dict[lang].broaden}
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            className="mt-4 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
            onClick={handleDeleteGoal}
          >
            {dict[lang].delete}
          </button>
        </div>
      ) : (
        <p className="mt-4 text-gray-500">{dict[lang].clickToSet}</p>
      )}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xl md:max-w-2xl relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowModal(false)}
              aria-label={dict[lang].close}
            >
              ×
            </button>
            <div className="mb-4 text-lg font-medium text-gray-800">
              I will <input className="border-b border-gray-400 outline-none px-1 w-32 md:w-56" placeholder="..." value={target} onChange={e => setTarget(e.target.value)} /> before <input className="border-b border-gray-400 outline-none px-1 w-32 md:w-56" placeholder="..." value={deadline} onChange={e => setDeadline(e.target.value)} />.<br />
              For this purpose, I will <input className="border-b border-gray-400 outline-none px-1 w-32 md:w-56" placeholder="..." value={action} onChange={e => setAction(e.target.value)} /> <input className="border-b border-gray-400 outline-none px-1 w-32 md:w-56" placeholder="..." value={actionDetail} onChange={e => setActionDetail(e.target.value)} />.
            </div>
            <div className="text-sm text-gray-500 mb-2">{dict[lang].beMoreSpecific}</div>
            <div className="text-xs text-gray-400 flex items-center gap-2">
              {dict[lang].example}
              <input
                className="border-b border-gray-300 outline-none px-1 w-56 md:w-80 text-gray-700 ml-2"
                placeholder={dict[lang].enterDetails}
                type="text"
                value={specific}
                onChange={e => setSpecific(e.target.value)}
              />
            </div>
            <button
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              onClick={handleSave}
            >
              {dict[lang].save}
            </button>
          </div>
        </div>
      )}
      {showBroaden && (
        <div className="mt-4 p-4 bg-gray-100 rounded shadow flex flex-col items-center gap-2">
          <div>Please enter a new total (must be greater than the current total):</div>
          <input
            type="number"
            min={savedGoal?.total || 1}
            value={broadenTotal}
            onChange={e => setBroadenTotal(e.target.value)}
            className="border rounded px-2 py-1 w-32 text-center"
            placeholder="New total"
            autoFocus
          />
          <div>Can modify goal details:</div>
          <input
            type="text"
            value={broadenDetail}
            onChange={e => setBroadenDetail(e.target.value)}
            className="border rounded px-2 py-1 w-64 text-center"
            placeholder="Goal details"
          />
          <div className="flex gap-2 mt-2">
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              onClick={handleConfirmBroaden}
            >
              {dict[lang].confirm}
            </button>
            <button
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
              onClick={handleCancelBroaden}
            >
              {dict[lang].cancel}
            </button>
          </div>
        </div>
      )}
      {showEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xl md:max-w-2xl relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={handleCancelEdit}
              aria-label={dict[lang].close}
            >
              ×
            </button>
            <div className="mb-4 text-lg font-medium text-gray-800">
              I will <input className="border-b border-gray-400 outline-none px-1 w-32 md:w-56" placeholder="..." value={editTarget} onChange={e => setEditTarget(e.target.value)} /> before <input className="border-b border-gray-400 outline-none px-1 w-32 md:w-56" placeholder="..." value={editDeadline} onChange={e => setEditDeadline(e.target.value)} />.<br />
              For this purpose, I will <input className="border-b border-gray-400 outline-none px-1 w-32 md:w-56" placeholder="..." value={editAction} onChange={e => setEditAction(e.target.value)} /> <input className="border-b border-gray-400 outline-none px-1 w-32 md:w-56" placeholder="..." value={editActionDetail} onChange={e => setEditActionDetail(e.target.value)} />.
            </div>
            <div className="text-sm text-gray-500 mb-2">{dict[lang].beMoreSpecific}</div>
            <div className="text-xs text-gray-400 flex items-center gap-2">
              {dict[lang].example}
              <input
                className="border-b border-gray-300 outline-none px-1 w-56 md:w-80 text-gray-700 ml-2"
                placeholder={dict[lang].enterDetails}
                type="text"
                value={editSpecific}
                onChange={e => setEditSpecific(e.target.value)}
              />
            </div>
            <div className="mt-4 flex gap-4 items-center">
              <span>{lang === 'zh' ? '总数' : 'Total'}:</span>
              <input
                type="number"
                min={savedGoal?.progress || 0}
                className="border-b border-gray-400 outline-none px-1 w-24 text-center"
                value={editTotal}
                onChange={e => setEditTotal(e.target.value)}
              />
              <span>{lang === 'zh' ? '单位' : 'Unit'}:</span>
              <input
                type="text"
                className="border-b border-gray-400 outline-none px-1 w-24 text-center"
                value={editUnit}
                onChange={e => setEditUnit(e.target.value)}
              />
            </div>
            <button
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              onClick={handleConfirmEdit}
            >
              {dict[lang].save}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default HomeContent;
