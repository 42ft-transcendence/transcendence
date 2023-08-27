export type SidebarComponentType = React.ComponentType<any>;

export type SidebarConfigType = {
  [key: string]: {
    component: SidebarComponentType;
    matcher?: RegExp;
  };
};
