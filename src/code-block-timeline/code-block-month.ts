import { MarkdownPostProcessorContext, MarkdownRenderChild } from "obsidian";
import { CalendarJournal } from "../calendar-journal/calendar-journal";

export class CodeBlockMonth extends MarkdownRenderChild {
  public showPrevMonthDays = true;
  constructor(
    containerEl: HTMLElement,
    protected journal: CalendarJournal,
    protected date: string,
    protected ctx: MarkdownPostProcessorContext,
  ) {
    super(containerEl);
  }

  display() {
    this.containerEl.empty();
    const today = this.journal.today;

    const start = this.journal.monthly.getRangeStart(this.date);
    const end = this.journal.monthly.getRangeEnd(this.date);
    const startWithWeek = start.clone().startOf("week");
    const endWithWeek = end.clone().endOf("week");

    const title = this.containerEl.createEl("h6", {
      cls: "journal-title",
      text: start.format("MMMM YYYY"),
    });
    if (this.journal.config.monthly.enabled) {
      title.classList.add("journal-clickable");
      title.on("click", ".journal-title", () => {
        this.journal.monthly.open(this.date);
      });
    }
    const view = this.containerEl.createDiv({
      cls: "journal-month-view journal-month-with-week",
    });
    if (this.journal.config.daily.enabled) {
      view.on("click", ".journal-day", (e) => {
        const date = (e.target as HTMLElement)?.dataset?.date;
        if (date) {
          this.journal.daily.open(date);
        }
      });
    }

    const week = start.clone().startOf("week");
    const weekEnd = week.clone().endOf("week");

    view.createDiv();
    while (week.isSameOrBefore(weekEnd)) {
      view.createDiv({
        cls: "journal-weekday",
        text: week.format("ddd"),
      });
      week.add(1, "day");
    }
    const curr = startWithWeek.clone();
    while (curr.isSameOrBefore(endWithWeek)) {
      if (curr.isSame(curr.clone().startOf("week"), "day")) {
        const weekNum = view.createDiv({
          cls: "journal-weeknumber",
          text: curr.format("[W]ww"),
        });
        if (this.journal.config.weekly.enabled) {
          weekNum.classList.add("journal-clickable");
          weekNum.dataset.date = curr.format("YYYY-MM-DD");
          weekNum.on("click", ".journal-weeknumber", (e) => {
            const date = (e.target as HTMLElement)?.dataset?.date;
            if (date) {
              this.journal.weekly.open(date);
            }
          });
        }
      }

      const cls = ["journal-day"];
      let text = curr.format("D");
      if (curr.isSame(today, "day")) {
        cls.push("journal-is-today");
      }
      if (!curr.isSame(start, "month")) {
        cls.push("journal-is-not-same-month");
        if (!this.showPrevMonthDays) {
          text = "";
        }
      }
      if (this.journal.config.daily.enabled) {
        cls.push("journal-clickable");
      }
      const day = view.createDiv({
        cls,
        text,
      });
      day.dataset.date = curr.format("YYYY-MM-DD");
      curr.add(1, "day");
    }
  }
}