import { useEffect, useState, type ReactNode } from "react";

// Replacement for the abandoned `react-responsive-navbar` package.
// Renders a large menu above `changeMenuOn`, and a hamburger-toggled
// small menu below it, using the same class hooks the SCSS expects
// (largeMenuClassName / smallMenuClassName, default "nav-large"/"nav-small").

interface ResponsiveMenuProps {
  menu: ReactNode;
  menuOpenButton: ReactNode;
  menuCloseButton: ReactNode;
  changeMenuOn: string; // e.g. "992px"
  largeMenuClassName?: string;
  smallMenuClassName?: string;
}

export default function ResponsiveMenu({
  menu,
  menuOpenButton,
  menuCloseButton,
  changeMenuOn,
  largeMenuClassName = "nav-large",
  smallMenuClassName = "nav-small",
}: ResponsiveMenuProps) {
  const [isSmall, setIsSmall] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${changeMenuOn})`);
    const update = () => setIsSmall(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [changeMenuOn]);

  if (!isSmall) {
    return <div className={largeMenuClassName}>{menu}</div>;
  }

  return (
    <div className={smallMenuClassName}>
      <div
        className="menu-trigger"
        role="button"
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setOpen((o) => !o);
        }}
      >
        {open ? menuCloseButton : menuOpenButton}
      </div>
      {open && <div onClick={() => setOpen(false)}>{menu}</div>}
    </div>
  );
}
