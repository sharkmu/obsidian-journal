import { CalendarConfig } from "../contracts/config.types";

export const DEFAULT_CONFIG_CALENDAR: Omit<CalendarConfig, "id"> = {
  type: "calendar",
  name: "MyJournal",
  isDefault: true,
  rootFolder: "",
  openOnStartup: false,
  startupSection: "daily",

  daily: {
    enabled: true,
    titleTemplate: "{{date}}",
    dateFormat: "YYYY-MM-DD",
    folder: "",
    template: "",
    ribbon: {
      show: true,
      icon: "",
      tooltip: "",
    },
  },
  weekly: {
    enabled: false,
    firstDayOfWeek: -1,
    firstWeekOfYear: 1,
    titleTemplate: "{{date}}",
    dateFormat: "YYYY-[W]ww",
    folder: "",
    template: "",
    ribbon: {
      show: false,
      icon: "",
      tooltip: "",
    },
  },
  monthly: {
    enabled: false,
    titleTemplate: "{{date}}",
    dateFormat: "YYYY-MM",
    folder: "",
    template: "",
    ribbon: {
      show: false,
      icon: "",
      tooltip: "",
    },
  },
  quarterly: {
    enabled: false,
    titleTemplate: "{{date}}",
    dateFormat: "YYYY-[Q]Q",
    folder: "",
    template: "",
    ribbon: {
      show: false,
      icon: "",
      tooltip: "",
    },
  },
  yearly: {
    enabled: false,
    titleTemplate: "{{date}}",
    dateFormat: "YYYY",
    folder: "",
    template: "",
    ribbon: {
      show: false,
      icon: "",
      tooltip: "",
    },
  },
};
