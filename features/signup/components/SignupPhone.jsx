// export function SignupPhone({ form, refs, handleChangeForm }) {
//   const r = refs.current;
//   return (
//     <li>
//       <ul className="part phone">
//         <li className="left">
//           <span>휴대폰</span>
//         </li>
//         <li>
//           <input
//             className="input-field"
//             type="text"
//             maxLength={11}
//             placeholder="숫자만 입력해주세요"
//             name="phone"
//             value={form.phone}
//             ref={r?.phoneRef}
//             onChange={handleChangeForm}
//           />
//         </li>
//         <li className="phone-btn">
//           <button className="btn" type="button">
//             인증번호 받기
//           </button>
//         </li>
//       </ul>
//     </li>
//   );
// }
export function SignupPhone({ form, refs, handleChangeForm }) {
  const r = refs.current;

  return (
    <li>
      <ul className="part phone">
        <li className="left">
          <span>휴대폰</span>
        </li>

        <li>
          {/* 🔥 ID랑 동일한 구조 */}
          <div className="input-with-btn">
            <input
              className="input-field"
              type="text"
              maxLength={11}
              placeholder="숫자만 입력해주세요"
              name="phone"
              value={form.phone}
              ref={r?.phoneRef}
              onChange={handleChangeForm}
            />

            <button
              className="inside-btn"
              type="button"
            >
              인증번호 받기
            </button>
          </div>
        </li>
      </ul>
    </li>
  );
}
