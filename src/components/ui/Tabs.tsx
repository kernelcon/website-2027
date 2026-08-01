import {
  Children,
  isValidElement,
  useEffect,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

// Lightweight replacement for the abandoned `react-web-tabs` package.
// Emits the same DOM structure / classNames the existing SCSS targets:
//   .rwt__tabs[data-rwt-vertical]
//   .rwt__tablist[aria-orientation]
//   .rwt__tab[aria-selected]
//   .rwt__tabpanel

interface TabsProps {
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  vertical?: boolean;
  children?: ReactNode;
}

interface TabListProps {
  vertical?: boolean;
  children?: ReactNode;
}

interface TabProps {
  tabFor: string;
  children?: ReactNode;
}

interface TabPanelProps {
  tabId: string;
  children?: ReactNode;
}

// Marker components — real rendering happens in <Tabs> which walks children.
export function TabList(_props: TabListProps) {
  return null;
}
TabList.displayName = "TabList";

export function Tab(_props: TabProps) {
  return null;
}
Tab.displayName = "Tab";

export function TabPanel(_props: TabPanelProps) {
  return null;
}
TabPanel.displayName = "TabPanel";

function componentIs(node: ReactNode, comp: { displayName?: string }): boolean {
  return isValidElement(node) && (node.type as { displayName?: string })?.displayName === comp.displayName;
}

export function Tabs({ defaultTab, onChange, vertical = false, children }: TabsProps) {
  // Collect TabList + TabPanels from children (panels may be nested in a wrapper like <span>).
  const topChildren = Children.toArray(children);

  let tabListEl: ReactElement<TabListProps> | undefined;
  const panels: ReactElement<TabPanelProps>[] = [];

  const collectPanels = (nodes: ReactNode[]) => {
    for (const node of nodes) {
      if (componentIs(node, TabPanel)) {
        panels.push(node as ReactElement<TabPanelProps>);
      } else if (isValidElement(node) && (node.props as { children?: ReactNode }).children) {
        collectPanels(Children.toArray((node.props as { children?: ReactNode }).children));
      }
    }
  };

  for (const node of topChildren) {
    if (componentIs(node, TabList)) {
      tabListEl = node as ReactElement<TabListProps>;
    } else if (componentIs(node, TabPanel)) {
      panels.push(node as ReactElement<TabPanelProps>);
    } else if (isValidElement(node)) {
      collectPanels(Children.toArray((node.props as { children?: ReactNode }).children));
    }
  }

  const tabs = tabListEl
    ? (Children.toArray(tabListEl.props.children).filter((c) => componentIs(c, Tab)) as ReactElement<TabProps>[])
    : [];

  const firstId = tabs[0]?.props.tabFor;
  const [active, setActive] = useState<string>(defaultTab ?? firstId ?? "");

  useEffect(() => {
    if (defaultTab && defaultTab !== active) {
      setActive(defaultTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultTab]);

  const select = (id: string) => {
    setActive(id);
    onChange?.(id);
  };

  const orientation = vertical ? "vertical" : "horizontal";

  return (
    <div className="rwt__tabs" data-rwt-vertical={vertical ? "true" : "false"}>
      <div className="rwt__tablist" role="tablist" aria-orientation={orientation}>
        {tabs.map((t) => {
          const id = t.props.tabFor;
          const selected = id === active;
          return (
            <button
              key={id}
              type="button"
              className="rwt__tab"
              role="tab"
              aria-selected={selected ? "true" : "false"}
              id={`rwt-tab-${id}`}
              aria-controls={`rwt-panel-${id}`}
              onClick={() => select(id)}
            >
              {t.props.children}
            </button>
          );
        })}
      </div>
      {panels
        .filter((p) => p.props.tabId === active)
        .map((p) => (
          <div
            key={p.props.tabId}
            className="rwt__tabpanel"
            role="tabpanel"
            id={`rwt-panel-${p.props.tabId}`}
            aria-labelledby={`rwt-tab-${p.props.tabId}`}
          >
            {p.props.children}
          </div>
        ))}
    </div>
  );
}
