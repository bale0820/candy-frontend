export function SignupId({ form, refs, handleChangeForm, handleIdCheck }) {
  return (
    <li>
      <ul className="part id">
        <li className="left">
          <span>ID</span>
          <span className="red-star"> *</span>
        </li>

        <li>
          {/* 🔥 wrapper */}
          <div className="input-with-btn">
            <input
              className="input-field"
              type="text"
              placeholder="아이디를 입력해주세요"
              name="userId"
              value={form.userId}
              ref={refs.current?.userIdRef}
              onChange={handleChangeForm}
            />

            <button
              className="inside-btn"
              type="button"
              onClick={handleIdCheck}
            >
              중복확인
            </button>
          </div>
        </li>
      </ul>
    </li>
  );
}
