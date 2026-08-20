import React, { useState, useEffect } from "react";
import { Globe, Lock, Users, EyeOff, Shield, Check, Plus, Trash2, X } from "lucide-react";
import { showToast } from "@/components/Toast";
import { useFriendStore } from "@/stores/useFriendStore";

export default function AudienceSelector({
  audience = "all", // 'all' | 'only_me' | 'group'
  onChangeAudience,
  selectedRecipients = [],
  onChangeRecipients,
  isIncognito = false,
  onToggleIncognito,
}) {
  const { friendDetails } = useFriendStore();
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [customGroups, setCustomGroups] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("locket_custom_groups")) || [
        { id: "besties", name: "Hội Bạn Thân ❤️", members: [] },
        { id: "family", name: "Gia Đình 🏠", members: [] },
      ];
    } catch {
      return [];
    }
  });
  const [newGroupName, setNewGroupName] = useState("");

  const friendsList = Object.values(friendDetails || {});

  const saveGroups = (groups) => {
    setCustomGroups(groups);
    localStorage.setItem("locket_custom_groups", JSON.stringify(groups));
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    const newGroup = {
      id: "group_" + Date.now(),
      name: newGroupName.trim(),
      members: [],
    };
    const updated = [...customGroups, newGroup];
    saveGroups(updated);
    setNewGroupName("");
    showToast("success", `Đã tạo nhóm "${newGroup.name}"!`);
  };

  const handleDeleteGroup = (groupId) => {
    const updated = customGroups.filter((g) => g.id !== groupId);
    saveGroups(updated);
    showToast("info", "Đã xóa nhóm bạn bè");
  };

  const handleToggleMember = (groupId, friendUid) => {
    const updated = customGroups.map((g) => {
      if (g.id !== groupId) return g;
      const exists = g.members.includes(friendUid);
      return {
        ...g,
        members: exists ? g.members.filter((id) => id !== friendUid) : [...g.members, friendUid],
      };
    });
    saveGroups(updated);
  };

  return (
    <div className="bg-base-200/90 backdrop-blur-md rounded-2xl p-3 border border-base-300 space-y-3">
      {/* Audience Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-1">
          <button
            type="button"
            onClick={() => onChangeAudience("all")}
            className={`btn btn-xs sm:btn-sm rounded-xl flex-1 ${
              audience === "all" ? "btn-primary shadow-md font-bold" : "btn-ghost"
            }`}
          >
            <Globe className="w-3.5 h-3.5 mr-1" /> Tất cả
          </button>

          <button
            type="button"
            onClick={() => onChangeAudience("only_me")}
            className={`btn btn-xs sm:btn-sm rounded-xl flex-1 ${
              audience === "only_me" ? "btn-primary shadow-md font-bold" : "btn-ghost"
            }`}
            title="Chỉ một mình bạn xem và lưu vào nhật ký"
          >
            <Lock className="w-3.5 h-3.5 mr-1" /> Chỉ mình tôi
          </button>

          <button
            type="button"
            onClick={() => {
              onChangeAudience("group");
              setShowGroupModal(true);
            }}
            className={`btn btn-xs sm:btn-sm rounded-xl flex-1 ${
              audience === "group" ? "btn-primary shadow-md font-bold" : "btn-ghost"
            }`}
          >
            <Users className="w-3.5 h-3.5 mr-1" /> Nhóm bạn ({selectedRecipients.length})
          </button>
        </div>

        {/* Incognito View Toggle */}
        <button
          type="button"
          onClick={() => {
            if (onToggleIncognito) onToggleIncognito(!isIncognito);
            showToast(
              !isIncognito ? "info" : "success",
              !isIncognito ? "👻 Đã bật Chế độ xem Ẩn danh (Không lưu lịch sử xem)" : "Đã tắt Chế độ xem Ẩn danh"
            );
          }}
          className={`btn btn-xs sm:btn-sm rounded-xl ${
            isIncognito ? "btn-secondary shadow-md font-bold text-white" : "btn-ghost"
          }`}
          title="Xem khoảnh khắc ẩn danh không lưu dấu vết"
        >
          <EyeOff className="w-3.5 h-3.5 mr-1" /> {isIncognito ? "Ẩn danh: BẬT 👻" : "Xem ẩn danh"}
        </button>
      </div>

      {/* Modal Quản lý Nhóm Bạn Bè */}
      {showGroupModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowGroupModal(false)}
        >
          <div
            className="bg-base-100 rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-base-300 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-4 border-b border-base-300">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Chọn & Tạo Nhóm Bạn Bè
              </h3>
              <button onClick={() => setShowGroupModal(false)} className="btn btn-circle btn-sm btn-ghost">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content List of Groups */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {/* Create new group */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tên nhóm mới (ví dụ: Bạn thân, Crush...)"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="input input-bordered input-sm flex-1 rounded-xl"
                />
                <button onClick={handleCreateGroup} className="btn btn-sm btn-primary rounded-xl">
                  <Plus className="w-4 h-4 mr-1" /> Tạo nhóm
                </button>
              </div>

              {/* Group Items */}
              {customGroups.map((group) => {
                const isCurrentActive =
                  audience === "group" &&
                  selectedRecipients.length === group.members.length &&
                  group.members.every((id) => selectedRecipients.includes(id));

                return (
                  <div key={group.id} className="bg-base-200 p-4 rounded-2xl border border-base-300 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-base">{group.name}</h4>
                        <span className="badge badge-sm badge-neutral">{group.members.length} bạn bè</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            if (onChangeRecipients) onChangeRecipients(group.members);
                            onChangeAudience("group");
                            setShowGroupModal(false);
                            showToast("success", `Đã chọn gửi tới nhóm "${group.name}"!`);
                          }}
                          className="btn btn-xs btn-primary rounded-lg"
                        >
                          Chọn nhóm này
                        </button>
                        <button
                          onClick={() => handleDeleteGroup(group.id)}
                          className="btn btn-xs btn-ghost btn-circle text-error"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Member Avatars Checkbox */}
                    <div className="flex flex-wrap gap-2 pt-1 max-h-32 overflow-y-auto">
                      {friendsList.map((friend) => {
                        const uid = friend.uid || friend.id;
                        const isMember = group.members.includes(uid);
                        return (
                          <div
                            key={uid}
                            onClick={() => handleToggleMember(group.id, uid)}
                            className={`badge badge-sm cursor-pointer p-2.5 transition-all ${
                              isMember ? "badge-primary font-bold shadow-xs" : "badge-outline opacity-60"
                            }`}
                          >
                            {isMember && <Check className="w-3 h-3 mr-1" />}
                            {friend.displayName || friend.username}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-base-300 flex justify-end">
              <button onClick={() => setShowGroupModal(false)} className="btn btn-sm btn-ghost rounded-xl">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
