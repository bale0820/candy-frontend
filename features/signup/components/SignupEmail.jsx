export function SignupEmail({ form, refs, handleChangeForm }) {
   const r = refs.current;
  return (
    <li>
      <ul className="part email">
        <li className="left">
          <span>이메일</span>
          <span className="red-star">* </span>
        </li>
        <li className="email-middle">
          <input
            className="input-field"
            type="text"
            placeholder="예: marketcandy"
            name="emailName"
            value={form.emailName}
            ref={r?.emailNameRef}
            onChange={handleChangeForm}
          />
          {form.emailDomain === "" && (
            <input
              className="input-field domain-input"
              type="text"
              placeholder="@직접 입력"
              name="emailDomainInput"
              value={form.emailDomainInput}
              ref={r?.emailDomainInputRef}
              onChange={handleChangeForm}
            />
          )}
          <select
            className="input-field domain"
            name="emailDomain"
            value={form.emailDomain}
            ref={r?.emailDomainRef}
            onChange={handleChangeForm}
          >
            <option value="선택하기">선택하기</option>
            <option value="@naver.com">@naver.com</option>
            <option value="@gmail.com">@gmail.com</option>
            <option value="@hanmail.net">@hanmail.net</option>
            <option value="@kakao.com">@kakao.com</option>
            <option value="@daum.net">@daum.net</option>
            <option value="@hotmail.com">@hotmail.com</option>
            <option value="@yahoo.co.kr">@yahoo.co.kr</option>
            <option value="">직접 입력</option>
          </select>
        </li>
      </ul>
    </li>
  );
}
