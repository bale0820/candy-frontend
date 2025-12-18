import LoginClient from "./LoginClient";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
