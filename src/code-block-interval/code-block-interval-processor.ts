import { MarkdownPostProcessorContext, MarkdownRenderChild } from "obsidian";
import { JournalManager } from "../journal-manager";
import { JournalFrontMatter } from "../contracts/config.types";
import { IntervalJournal } from "../interval-journal/interval-journal";
import { CodeBlockIntervalNav } from "./code-block-interval";

export class CodeBlockIntervalProcessor extends MarkdownRenderChild {
  private data: JournalFrontMatter | null = null;
  constructor(
    private manager: JournalManager,
    private readonly source: string,
    private readonly el: HTMLElement,
    private readonly ctx: MarkdownPostProcessorContext,
  ) {
    super(el);

    this.init();
  }

  async init() {
    await this.readData();
    if (!this.data) {
      setTimeout(async () => {
        await this.readData();
        this.display();
      }, 150);
      return;
    } else {
      this.display();
    }
  }

  async readData(): Promise<void> {
    this.data = await this.manager.getJournalData(this.ctx.sourcePath);
  }

  async display() {
    this.containerEl.empty();

    if (!this.data) {
      this.containerEl.appendText("Note is not connected to a journal.");
      return;
    }
    const journal = this.manager.get(this.data.id);
    if (!journal) {
      this.containerEl.appendText("Note is connected to a deleted journal.");
      return;
    }
    if (!(journal instanceof IntervalJournal)) {
      this.containerEl.appendText("Note is connected to a non-interval journal.");
      return;
    }
    const nav = new CodeBlockIntervalNav(this.containerEl, journal, this.data.start_date);
    this.ctx.addChild(nav);
    nav.display();
  }
}
