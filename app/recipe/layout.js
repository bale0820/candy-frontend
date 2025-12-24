// import "./RecipePage.scss";
// import Sidebar from "features/recipe/recipePage/components/Sidebar";

// export default function RecipeLayout({ children }) {
//   return (
//     <div style={{ display: "flex" }}>
//       <Sidebar />

//       <div style={{ flex: 1, padding: "20px" }}>
//         <h2>레시피</h2>
//         {children}
//       </div>
//     </div>
//   );
// }

// RecipeLayout.tsx (Server Component)
import RecipeLayoutShell from "./RecipeLayoutShell";

export default function RecipeLayout({ children }) {
  return <RecipeLayoutShell>{children}</RecipeLayoutShell>;
}
