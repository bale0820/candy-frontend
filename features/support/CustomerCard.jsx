// "use client";

// // src/features/customer/components/CustomerCard.jsx
// import React from "react";

// export function CustomerCard({ icon, title, children }) {
//   const Icon = icon;

//   return (
//     <div className="service-card">
//       <Icon className="icon" />
//       <h3>{title}</h3>
//       {children}
//     </div>
//   );
// }
"use client";

export function CustomerCard({ icon, title, children }) {
  return (
    <div className="service-card">
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      {children}
    </div>
  );
}
