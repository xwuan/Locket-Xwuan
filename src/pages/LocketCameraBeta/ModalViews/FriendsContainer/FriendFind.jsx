// components/FriendItem.jsx
import React from "react";
import { Plus } from "lucide-react";
import { SendRequestToFriend } from "@/services";
import { SonnerWarning } from "@/components/UI/SonnerToast";

export default function FriendFind({ friend }) {
  // 👉 Tách hàm xử lý ra ngoài
  const handleAddFriend = async (e) => {
    e.stopPropagation();
    if (friend.username) {
      console.log(friend);
      SonnerWarning("Chưa hỗ trợ tính năng này!")
      // await SendRequestToFriend(friend.uid);
    } else {
      console.warn("❌ Không có username để điều hướng");
    }
  };

  return (
    <div
      key={friend.uid}
      className="flex w-full items-center gap-3 space-y-2 rounded-md cursor-pointer justify-between"
    >
      <div className="flex items-center gap-3">
        <img
          src={friend.profile_picture_url || "./default-avatar.png"}
          alt={`${friend?.first_name} ${friend?.last_name}`}
          className="w-16 h-16 rounded-full border-[3.5px] p-0.5 border-amber-400 object-cover"
        />
        <div>
          <h2 className="font-medium">
            {friend?.first_name} {friend?.last_name}
          </h2>
          <p className="text-sm text-gray-500 underline">
            @{friend.username || "Không có username"}
          </p>
        </div>
      </div>

      <button
        className="btn flex flex-row justify-center bg-yellow-500 text-black p-1 px-3 rounded-full transition shrink-0"
        onClick={handleAddFriend}
      >
        <Plus className="w-5 h-5" strokeWidth={3} />
        <span className="text-base font-semibold">Thêm</span>
      </button>
    </div>
  );
}
