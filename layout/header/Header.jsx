
import CategoryNav from "../categoryNav/CategoryNav";
import LogoSearch from "../logoSearch/LogoSearch";
import TopBar from "../topBar/TopBar";
import "./Header.scss";

export default function Header() {
  return (
    <header className="header">
      <TopBar />
      <LogoSearch />
      <CategoryNav />
    </header>
  );
}