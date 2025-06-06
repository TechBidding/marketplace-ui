import { LuSettings2 } from "react-icons/lu";
import { HiOutlineHome, HiOutlineBriefcase, HiOutlineUserGroup, HiOutlineCog, HiOutlineUser, HiOutlinePlus } from "react-icons/hi";

// Common navigation items for all users
export const CommonNavItems = [
    {
        name: "Dashboard",
        icon: HiOutlineHome,
        link: "/dashboard"
    },
    {
        name: "Browse Talent",
        icon: HiOutlineUserGroup,
        link: "/browse"
    },
    {
        name: "Settings",
        icon: HiOutlineCog,
        link: "/settings"
    }
];

// Developer-specific navigation items
export const DeveloperNavItems = [
    {
        name: "Services",
        icon: LuSettings2,
        link: "/services"
    }
];

// Client-specific navigation items  
export const ClientNavItems = [
    {
        name: "Projects",
        icon: HiOutlineBriefcase,
        link: "/projects"
    },
    {
        name: "Create Project",
        icon: HiOutlinePlus,
        link: "/projects/create"
    }
];

// Legacy NavBarList for backward compatibility (defaults to developer view)
export const NavBarList = [
    ...CommonNavItems,
    ...DeveloperNavItems
];

export const ServiceEnum = {
    WEB_DEVELOPMENT: "Web Development",
    MOBILE_DEVELOPMENT: "Mobile Development",
    DATA_SCIENCE: "Data Science",
    DEVOPS: "DevOps",
} as const;
export type Service = (typeof ServiceEnum)[keyof typeof ServiceEnum];

export const SkillEnum = {
    REACT: "React",
    NODE_JS: "Node.js",
    PYTHON: "Python",
    JAVA: "Java",
} as const;
export type Skill = (typeof SkillEnum)[keyof typeof SkillEnum];

/* ------------------------------------------------------------------
 * 2. UI option arrays (icons, links, labels)
 * -----------------------------------------------------------------*/
export const ServiceOptions: { name: Service; icon: typeof LuSettings2; link: string }[] = [
    { name: ServiceEnum.WEB_DEVELOPMENT, icon: LuSettings2, link: "web-development" },
    { name: ServiceEnum.MOBILE_DEVELOPMENT, icon: LuSettings2, link: "mobile-development" },
    { name: ServiceEnum.DATA_SCIENCE, icon: LuSettings2, link: "data-science" },
    { name: ServiceEnum.DEVOPS, icon: LuSettings2, link: "devops" },
];

export const SkillOptions: { name: Skill; icon: typeof LuSettings2; link: string }[] = [
    { name: SkillEnum.REACT, icon: LuSettings2, link: "react" },
    { name: SkillEnum.NODE_JS, icon: LuSettings2, link: "nodejs" },
    { name: SkillEnum.PYTHON, icon: LuSettings2, link: "python" },
    { name: SkillEnum.JAVA, icon: LuSettings2, link: "java" },
];
