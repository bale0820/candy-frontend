// "use client";

// import { useState } from "react";
// import { useCategoryList } from "@/features/category/hooks/useCategoryList";
// import { useSelectSubStore } from "@/store/selectSubStore";
// import { useRouter } from "next/navigation";
// import './Sidebar.scss';
// export default function Sidebar() {
//   const { setSelectSub } = useSelectSubStore();
//   const { data: categoryList } = useCategoryList();
//    const router = useRouter();
//   const [openMain, setOpenMain] = useState(null);
//   const [selectedSub, setSelectedSub] = useState(null);

//   return (
//     <div className="recipe-sidebar">
//   <h3 className="sidebar-title">카테고리</h3>

//   {categoryList?.map((main) => (
//     <div key={main?.id} className="sidebar-main">
//       <div
//         className={`main-title ${openMain === main?.id ? "active" : ""}`}
//         onClick={() =>
//           setOpenMain(openMain === main?.id ? null : main?.id)
//         }
//       >
//         {main.name}
//       </div>

//       {openMain === main?.id && (
//         <div className="sub-list">
//           {main.subCategories.map((sub) => (
//             <div
//               key={sub?.id}
//               className={`sub-item ${
//                 selectedSub === sub?.id ? "selected" : ""
//               }`}
//               onClick={() => {
//                 setSelectedSub(sub?.id);
//                 setSelectSub(sub?.id);
//                 router.push("/recipe");
//               }}
//             >
//               {sub.name}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   ))}
// </div>

//   );
// }


"use client";

import { useState } from "react";
import { useCategoryList } from "@/features/category/hooks/useCategoryList";
import { useSelectSubStore } from "@/store/selectSubStore";
import { useRouter } from "next/navigation";
import "./Sidebar.scss";

export default function Sidebar({ onClose }) {
  const { setSelectSub } = useSelectSubStore();
  const { data: categoryList } = useCategoryList();
  const router = useRouter();

  const [openMain, setOpenMain] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);

  return (
    <div className="sidebar-inner">
      <h3 className="sidebar-title">카테고리</h3>

      {categoryList?.map((main) => (
        <div key={main.id} className="sidebar-main">
          <div
            className={`main-title ${openMain === main.id ? "active" : ""}`}
            onClick={() =>
              setOpenMain(openMain === main.id ? null : main.id)
            }
          >
            {main.name}
          </div>

          {openMain === main.id && (
            <div className="sub-list">
              {main.subCategories.map((sub) => (
                <div
                  key={sub.id}
                  className={`sub-item ${
                    selectedSub === sub.id ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedSub(sub.id);
                    setSelectSub(sub.id);
                    router.push("/recipe");
                    onClose?.(); // 모바일에서 자동 닫힘
                  }}
                >
                  {sub.name}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
